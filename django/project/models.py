from collections import namedtuple

from django.contrib.contenttypes.fields import GenericRelation
from hashids import Hashids

from django.db import models
from django.db.models import Q
from django.contrib.auth.models import User
from django.contrib.postgres.fields import JSONField
from django.db.models.signals import post_save
from django.dispatch import receiver
from django.utils.translation import ugettext_lazy as _
from simple_history.models import HistoricalRecords

from core.models import ExtendedModel, ExtendedNameOrderedSoftDeletedModel, ActiveQuerySet, SoftDeleteModel, \
    ParentByIDMixin
from country.models import Country, Donor
from project.cache import InvalidateCacheMixin
from project.utils import remove_keys
from user.models import UserProfile
from toolkit.toolkit_data import toolkit_default


class ProjectManager(models.Manager):
    use_in_migrations = True

    def owner_of(self, user):
        return self.filter(team=user.userprofile)

    def viewer_of(self, user):
        return self.filter(viewers=user.userprofile)

    def member_of(self, user):
        return self.filter(Q(team=user.userprofile)
                           | Q(viewers=user.userprofile)).distinct().order_by('id')

    # WARNING: this method is used in migration project.0016_auto_20160601_0928
    def by_organisation(self, organisation_id):  # pragma: no cover
        return self.filter(data__organisation=organisation_id)

    def published_only(self):
        return self.exclude(public_id='')

    def draft_only(self):
        return self.filter(public_id='')


class ProjectQuerySet(ActiveQuerySet, ProjectManager):
    pass


class Project(SoftDeleteModel, ExtendedModel):
    FIELDS_FOR_MEMBERS_ONLY = ("country_custom_answers_private",
                               "last_version", "last_version_date", "start_date", "end_date")
    FIELDS_FOR_LOGGED_IN = ("coverage", "contact_email", "contact_name")

    name = models.CharField(max_length=255)
    data = JSONField(default=dict)
    draft = JSONField(default=dict)
    team = models.ManyToManyField(UserProfile, related_name="team", blank=True)
    viewers = models.ManyToManyField(UserProfile, related_name="viewers", blank=True)
    public_id = models.CharField(
        max_length=64, default="", help_text="<CountryCode><HashID> eg: HU9fa42491")
    odk_etag = models.CharField(null=True, blank=True, max_length=64)
    odk_id = models.CharField(null=True, blank=True, max_length=64)
    odk_extra_data = JSONField(default=dict)

    research = models.NullBooleanField(blank=True, null=True)

    projects = ProjectManager  # deprecated, use objects instead
    objects = ProjectQuerySet.as_manager()

    def __str__(self):  # pragma: no cover
        return self.name

    def get_country_id(self, draft_mode=False):
        return self.draft.get('country') if draft_mode else self.data.get('country')

    def get_country(self, draft_mode=False):
        country_id = self.get_country_id(draft_mode)
        return Country.objects.get(id=int(country_id)) if country_id else None

    def is_member(self, user):
        return self.team.filter(id=user.userprofile.id).exists() or self.viewers.filter(id=user.userprofile.id).exists()

    def is_country_user_or_admin(self, user):
        return self.get_country().user_in_groups(user.userprofile) if self.get_country() else False

    def get_member_data(self):
        return self.data

    def get_member_draft(self):
        return self.draft

    def get_non_member_data(self):
        return remove_keys(data_dict=self.data, keys=self.FIELDS_FOR_MEMBERS_ONLY)

    def get_anon_data(self):
        return remove_keys(data_dict=self.data, keys=self.FIELDS_FOR_MEMBERS_ONLY + self.FIELDS_FOR_LOGGED_IN)

    def to_representation(self, data=None, draft_mode=False):
        if data is None:
            data = self.get_member_draft() if draft_mode else self.get_member_data()

        if not data:
            return {}

        extra_data = dict(
            id=self.pk,
            name=self.draft.get('name', '') if draft_mode else self.name,
            approved=self.approval.approved if hasattr(self, 'approval') else None,
            modified=self.modified,
        )

        data.update(extra_data)

        if not draft_mode:
            last_version = CoverageVersion.objects.filter(project_id=self.pk).order_by("-version").first()
            if last_version:
                data.update(last_version=last_version.version, last_version_date=last_version.modified)

        return data

    def to_response_dict(self, published, draft):
        return dict(id=self.pk, public_id=self.public_id, published=published, draft=draft)

    def generate_hash_id(self):
        hash_id = Hashids(min_length=8)
        return hash_id.encode(self.pk)

    def make_public_id(self, country_id):
        if self.public_id:
            return

        project_country = Country.objects.filter(id=country_id).first()
        if project_country:
            self.public_id = f"{project_country.code}{self.generate_hash_id()}"

    def approve(self):
        self.approval.approved = True
        self.approval.save()

    def disapprove(self):
        self.approval.approved = False
        self.approval.save()

    def reset_approval(self):
        if self.approval.approved is not None:
            self.approval.user = None
            self.approval.approved = None
            self.approval.reason = "Project has been republished"
            self.approval.save()

    @classmethod
    def remove_stale_donors(cls):
        from country.models import Donor

        stale_ids = []
        donor_ids = set(Donor.objects.values_list('id', flat=True))

        for p in Project.objects.all():
            if p.data and 'donors' in p.data:
                published_donors = set(p.data.get('donors', []))
                stale_ids.extend(list(published_donors - donor_ids))
                p.data['donors'] = list(published_donors & donor_ids)
            if p.draft and 'donors' in p.draft:
                draft_donors = set(p.draft.get('donors', []))
                stale_ids.extend(list(draft_donors - donor_ids))
                p.draft['donors'] = list(draft_donors & donor_ids)
            p.save()
        return stale_ids

    def unpublish(self):
        self.public_id = ''
        self.data = {}
        self.save()
        self.search.reset()


@receiver(post_save, sender=Project)
def on_create_init(sender, instance, created, **kwargs):
    if created:
        from toolkit.models import Toolkit
        Toolkit.objects.get_or_create(project_id=instance.id, defaults=dict(data=toolkit_default))
        ProjectApproval.objects.get_or_create(project_id=instance.id)


class ProjectApproval(ExtendedModel):
    project = models.OneToOneField('Project', related_name='approval', on_delete=models.CASCADE)
    user = models.ForeignKey(UserProfile, blank=True, null=True,
                             help_text="Administrator who approved the project", on_delete=models.CASCADE)
    approved = models.NullBooleanField(blank=True, null=True)
    reason = models.TextField(blank=True, null=True)
    history = HistoricalRecords(excluded_fields=['project', 'created'])

    def __str__(self):
        return "Approval for {}".format(self.project.name)


class Stage(InvalidateCacheMixin, ExtendedNameOrderedSoftDeletedModel):
    name = models.CharField(max_length=128)
    order = models.PositiveSmallIntegerField(default=0, blank=True, null=True)
    tooltip = models.CharField(max_length=256, blank=True, null=True)

    class Meta:
        ordering = ['order', 'name']

    def __str__(self):  # pragma: no cover
        return self.name


class CoverageVersion(ExtendedModel):
    project = models.ForeignKey(Project, on_delete=models.CASCADE)
    version = models.IntegerField()
    data = JSONField()


class File(ExtendedModel):
    project = models.ForeignKey(Project, on_delete=models.CASCADE)
    type = models.CharField(max_length=255)
    filename = models.CharField(max_length=255)
    data = models.BinaryField()


class DigitalStrategy(ParentByIDMixin, InvalidateCacheMixin, ExtendedNameOrderedSoftDeletedModel):
    GROUP_CHOICES = (
        ('Client', _('Client')),
        ('Provider', _('Provider')),
        ('System', _('System')),
        ('Data service', _('Data service'))
    )
    group = models.CharField(max_length=255, choices=GROUP_CHOICES)
    parent = models.ForeignKey('DigitalStrategy', related_name='strategies',
                               blank=True, null=True, on_delete=models.SET_NULL)

    def __str__(self):
        parent = ' [{}]'.format(self.parent.name) if self.parent else ''
        return '[{}]{} {}'.format(self.group, parent, self.name)

    class Meta:
        verbose_name_plural = 'Digital Strategies'
        ordering = ['group', 'name']


class HSCGroup(InvalidateCacheMixin, ExtendedNameOrderedSoftDeletedModel):
    class Meta:
        verbose_name = 'Health System Challenge Group'
        ordering = ['name']


class HSCChallengeQuerySet(ActiveQuerySet):
    FakeChallenge = namedtuple('FakeChallenge', ['name', 'challenge'])


class HSCChallenge(ParentByIDMixin, InvalidateCacheMixin, ExtendedNameOrderedSoftDeletedModel):
    group = models.ForeignKey(HSCGroup, on_delete=models.CASCADE, related_name='challenges')

    def __str__(self):
        return '({}) {}'.format(self.group.name, self.name)

    class Meta:
        verbose_name = 'Health System Challenge'
        verbose_name_plural = 'Health System Challenges'
        ordering = ['group', 'name']

    objects = HSCChallengeQuerySet.as_manager()


class HealthCategory(InvalidateCacheMixin, ExtendedNameOrderedSoftDeletedModel):
    class Meta(ExtendedNameOrderedSoftDeletedModel.Meta):
        verbose_name_plural = 'Health Categories'


class HealthFocusArea(ParentByIDMixin, InvalidateCacheMixin, ExtendedNameOrderedSoftDeletedModel):
    health_category = models.ForeignKey(HealthCategory, related_name='health_focus_areas', on_delete=models.CASCADE)

    donors = GenericRelation(Donor)

    def __str__(self):
        return '[{}] {}'.format(self.health_category.name, self.name)

    class Meta:
        ordering = ['health_category__name', 'name']


class InteroperabilityLink(InvalidateCacheMixin, ExtendedNameOrderedSoftDeletedModel):
    pre = models.CharField(max_length=255)


class TechnologyPlatform(InvalidateCacheMixin, ExtendedNameOrderedSoftDeletedModel):
    APPROVED = 1
    PENDING = 2
    DECLINED = 3

    SOFTWARE_STATES = (
        (APPROVED, _("Approved")),
        (PENDING, _("Pending")),
        (DECLINED, _("Declined")),
    )

    state = models.IntegerField(choices=SOFTWARE_STATES, default=APPROVED)
    added_by = models.ForeignKey(UserProfile, blank=True, null=True, on_delete=models.SET_NULL)

    class Meta:
        verbose_name = 'Software'
        verbose_name_plural = 'Software'

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.__important_fields = ['state']
        for field in self.__important_fields:
            setattr(self, '__original_%s' % field, getattr(self, field))


@receiver(post_save, sender=TechnologyPlatform)
def remove_declined_software_from_projects(sender, instance, created, **kwargs):
    if not created and instance.__original_state != instance.state:
        from project.tasks import notify_user_about_software_approval

        if instance.state == TechnologyPlatform.DECLINED:
            # remove software from data platforms and from draft platforms
            projects = Project.objects.filter(
                Q(data__platforms__contains=[{'id': instance.id}]) | Q(draft__platforms__contains=[{'id': instance.id}])
            )
            for project in projects:
                if project.public_id and 'platforms' in project.data:
                    project.data['platforms'] = \
                        [item for item in project.data['platforms'] if item['id'] != instance.id]
                if 'platforms' in project.draft:
                    project.draft['platforms'] = \
                        [item for item in project.draft['platforms'] if item['id'] != instance.id]
                project.save()

            notify_user_about_software_approval.apply_async(args=('decline', instance.pk,))
        elif instance.state == TechnologyPlatform.APPROVED:
            notify_user_about_software_approval.apply_async(args=('approve', instance.pk,))


class Licence(InvalidateCacheMixin, ExtendedNameOrderedSoftDeletedModel):
    pass


class InteroperabilityStandard(InvalidateCacheMixin, ExtendedNameOrderedSoftDeletedModel):
    pass


class HISBucket(InvalidateCacheMixin, ExtendedNameOrderedSoftDeletedModel):
    pass


class ProjectImportV2(ExtendedModel):
    user = models.ForeignKey(User, null=True, on_delete=models.SET_NULL)
    status = models.NullBooleanField(null=True, blank=True)  # TODO: maybe remove this
    header_mapping = JSONField(default=dict, blank=True)
    country = models.ForeignKey(Country, null=True, blank=True, on_delete=models.SET_NULL)
    donor = models.ForeignKey(Donor, null=True, blank=True, on_delete=models.SET_NULL)
    filename = models.CharField(max_length=256, null=True, blank=True)
    sheet_name = models.CharField(max_length=256, null=True, blank=True)
    draft = models.BooleanField(default=True)

    class Meta:
        unique_together = ('user', 'filename', 'sheet_name')


class ImportRow(models.Model):
    data = JSONField(default=dict)
    original_data = JSONField(default=dict)
    project = models.ForeignKey(Project, null=True, on_delete=models.SET_NULL)
    parent = models.ForeignKey(ProjectImportV2, null=True, related_name="rows", on_delete=models.SET_NULL)
