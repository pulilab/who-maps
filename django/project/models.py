from collections import namedtuple
from copy import deepcopy
from typing import Optional

from django.contrib.contenttypes.fields import GenericRelation
from django.db.models.fields.json import KeyTextTransform
from django.db.models.functions import Cast
from hashids import Hashids
from ckeditor.fields import RichTextField

from django.db import models
from django.db.models import Q, IntegerField, QuerySet
from django.contrib.auth.models import User
from django.db.models.signals import post_save
from django.dispatch import receiver
from django.utils.translation import gettext_lazy as _
from simple_history.models import HistoricalRecords
from ckeditor.fields import RichTextField

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

    def by_country(self, country: Country):
        return self.annotate(country_id=Cast(KeyTextTransform('country', 'data'), output_field=IntegerField()),
                             country_draft_id=Cast(KeyTextTransform('country', 'draft'), output_field=IntegerField()))\
            .filter(Q(country_id=country.id) | Q(country_draft_id=country.id))

    # WARNING: this method is used in migration project.0016_auto_20160601_0928
    def by_organisation(self, organisation_id):  # pragma: no cover
        return self.filter(data__organisation=organisation_id)

    def published_only(self):
        return self.exclude(public_id='')

    def draft_only(self):
        return self.filter(public_id='')

    def coverage_empty(self):
        return self.filter(
            Q(data__coverage__isnull=True) | Q(data__coverage=[]) | Q(data__coverage={}) | Q(data__coverage=None)
        )

    def coverage_not_empty(self):
        return self.exclude(
            Q(data__coverage__isnull=True) | Q(data__coverage=[]) | Q(data__coverage={}) | Q(data__coverage=None)
        )

    def national_level_deployment_empty(self):
        return self.filter(
            Q(data__national_level_deployment__isnull=True) |
            Q(data__national_level_deployment=[]) |
            Q(data__national_level_deployment={}) |
            Q(data__national_level_deployment=None)
        )

    def national_level_deployment_not_empty(self):
        return self.exclude(
            Q(data__national_level_deployment__isnull=True) |
            Q(data__national_level_deployment=[]) |
            Q(data__national_level_deployment={}) |
            Q(data__national_level_deployment=None)
        )


class ProjectQuerySet(ActiveQuerySet, ProjectManager):
    def add_initial_q(self):
        self.query.add_q(Q(is_active=True))
        self.query.add_q(Q(archived=False))


class Project(SoftDeleteModel, ExtendedModel):
    FIELDS_FOR_MEMBERS_ONLY = ("country_custom_answers_private", "last_version", "last_version_date")
    FIELDS_FOR_LOGGED_IN = ("coverage", "contact_email", "contact_name")

    name = models.CharField(max_length=255)
    data = models.JSONField(default=dict)
    draft = models.JSONField(default=dict)
    team = models.ManyToManyField(UserProfile, related_name="team", blank=True)
    viewers = models.ManyToManyField(UserProfile, related_name="viewers", blank=True)
    public_id = models.CharField(
        max_length=64, default="", help_text="<CountryCode><HashID> eg: HU9fa42491")
    archived = models.BooleanField(default=False)

    # DEPRECATED ODK FIELDS
    odk_etag = models.CharField(null=True, blank=True, max_length=64)
    odk_id = models.CharField(null=True, blank=True, max_length=64)
    odk_extra_data = models.JSONField(default=dict)

    research = models.BooleanField(blank=True, null=True)
    metadata = models.JSONField(default=dict)

    projects = ProjectManager()  # deprecated, use objects instead
    objects = ProjectQuerySet.as_manager()

    def __str__(self):  # pragma: no cover
        return self.name

    @property
    def from_external(self):
        return self.metadata and 'from_external' in self.metadata

    @property
    def is_published(self):
        return self.public_id != ''

    def get_country_id(self, draft_mode=False):
        return self.draft.get('country') if draft_mode else self.data.get('country')

    def get_country(self) -> Country:
        country_id = self.get_country_id(draft_mode=False) if self.public_id else self.get_country_id(draft_mode=True)
        return Country.objects.get(id=int(country_id)) if country_id else None

    def get_country_admins(self) -> QuerySet:
        if country := self.get_country():
            admins = country.super_admins.all() | country.admins.all()
            return admins

    def is_member(self, user):
        return self.team.filter(id=user.userprofile.id).exists() or self.viewers.filter(id=user.userprofile.id).exists()

    def is_country_user_or_admin(self, user):
        return self.get_country().user_in_groups(user.userprofile) if self.get_country() else False

    def is_country_admin(self, user):
        return self.get_country().user_in_admin_groups(user.userprofile) if self.get_country() else False

    def get_member_data(self):
        return deepcopy(self.data)

    def get_member_draft(self):
        return deepcopy(self.draft)

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
        admins = self.get_country_admins()
        admins_list = list(admins.values('name', 'user__email')) if admins else None
        return dict(id=self.pk, public_id=self.public_id, archived=self.archived,
                    admins=admins_list,
                    published=published, draft=draft)

    def to_project_import_table_dict(self, published_data, draft_data):
        published = True if self.public_id != "" else False
        data = published_data if published else draft_data
        team = [{'name': u.name, 'email': u.user.email, 'id': u.id} for u in self.team.all()]
        return dict(id=self.pk, team=team, published=published, data=data)

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

    def archive(self, profile: Optional[UserProfile] = None):
        self.public_id = ''
        self.data = {}
        self.archived = True
        self.save()
        self.search.reset()
        ProjectVersion.objects.create(project=self, user=profile, name=self.name,
                                      data=self.draft, research=self.research,
                                      published=False, archived=True)


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
    approved = models.BooleanField(blank=True, null=True)
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
    data = models.JSONField()


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
    description = RichTextField(blank=True)

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


class ServicesAndApplicationsCategory(InvalidateCacheMixin, ExtendedNameOrderedSoftDeletedModel):
    description = RichTextField()

    class Meta(ExtendedNameOrderedSoftDeletedModel.Meta):
        verbose_name_plural = 'Services and Application Types - Representations within the Digital Health Architecture'


class ServicesAndApplications(ParentByIDMixin, InvalidateCacheMixin, ExtendedNameOrderedSoftDeletedModel):
    category = models.ForeignKey(ServicesAndApplicationsCategory, related_name='services_and_application_types',
                                 on_delete=models.CASCADE)
    description = RichTextField()

    def __str__(self):  # pragma: no cover
        return '[{}] {}'.format(self.category.name, self.name)

    class Meta:
        ordering = ['category__name', 'id']
        verbose_name_plural = 'Services and Application Types'


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
            # remove software from data software and from draft software
            projects = Project.objects.filter(
                Q(data__software__contains=[instance.id]) | Q(draft__software__contains=[instance.id])
            )
            for project in projects:
                if project.public_id and 'software' in project.data:
                    project.data['software'] = \
                        [software_id for software_id in project.data['software'] if software_id != instance.id]
                if 'software' in project.draft:
                    project.draft['software'] = \
                        [software_id for software_id in project.draft['software'] if software_id != instance.id]
                project.save(update_fields=['data', 'draft'])

            notify_user_about_software_approval.apply_async(args=('decline', instance.pk,))
        elif instance.state == TechnologyPlatform.APPROVED:
            notify_user_about_software_approval.apply_async(args=('approve', instance.pk,))


class Licence(InvalidateCacheMixin, ExtendedNameOrderedSoftDeletedModel):
    pass


class OSILicence(InvalidateCacheMixin, ExtendedNameOrderedSoftDeletedModel):
    class Categories(models.IntegerChoices):
        INT = 1, _("International")
        NONREUSE = 2, _("Non-Reusable")
        OTHER = 3, _("Other/Miscellaneous")
        POPULAR = 4, _("Popular / Strong Community")
        REDUNDANT = 5, _("Redundant with more popular")
        SPECIAL = 6, _("Special Purpose")
        SUPERSEDED = 7, _("Superseded")
        UNCATEGORIZED = 8, _("Uncategorized")
        RETIRED = 9, _("Voluntarily retired")
    spdx_id = models.CharField(max_length=64, blank=True)
    category = models.PositiveSmallIntegerField(choices=Categories.choices, blank=True, null=True)
    url = models.URLField(blank=True)


class InteroperabilityStandard(InvalidateCacheMixin, ExtendedNameOrderedSoftDeletedModel):
    class Categories(models.IntegerChoices):
        HDES = 1, _("Health Data Exchange Standards")
        HDS = 2, _("Health Data Standardization")
        DDS = 3, _("Demographic Data Standardization")
        SPS = 4, _("Security & Privacy Standards")
        TS = 5, _("Technical Standards")
    category = models.PositiveSmallIntegerField(choices=Categories.choices, blank=True, null=True)
    description = RichTextField(blank=True)


class HISBucket(InvalidateCacheMixin, ExtendedNameOrderedSoftDeletedModel):
    pass


class Collection(ExtendedNameOrderedSoftDeletedModel):
    user = models.ForeignKey(User, null=False, blank=False, on_delete=models.CASCADE)  # should be hidden on UI
    url = models.CharField(max_length=256, blank=True)
    add_me_as_editor = models.BooleanField(null=False, blank=False, default=False)

    def generate_hash_id(self):
        hash_id = Hashids(min_length=12)
        return hash_id.encode(self.pk)

    def make_url(self):
        if self.url:  # pragma: no cover
            return
        self.url = f"{self.user.pk}{self.generate_hash_id()}"

    class Meta:
        unique_together = ('user', 'name')


class ProjectImportV2(ExtendedModel):
    user = models.ForeignKey(User, null=True, on_delete=models.SET_NULL)
    status = models.BooleanField(null=True, blank=True)  # TODO: maybe remove this
    header_mapping = models.JSONField(default=dict, blank=True)
    country = models.ForeignKey(Country, null=True, blank=True, on_delete=models.SET_NULL)
    donor = models.ForeignKey(Donor, null=True, blank=True, on_delete=models.SET_NULL)
    filename = models.CharField(max_length=256, null=True, blank=True)
    sheet_name = models.CharField(max_length=256, null=True, blank=True)
    draft = models.BooleanField(default=True)
    collection = models.ForeignKey(Collection, null=True, blank=True, related_name="project_imports",
                                   on_delete=models.SET_NULL)

    class Meta:
        unique_together = ('user', 'filename', 'sheet_name')


class ImportRow(models.Model):
    data = models.JSONField(default=dict)
    original_data = models.JSONField(default=dict)
    project = models.ForeignKey(Project, null=True, blank=True, on_delete=models.SET_NULL, related_name='import_rows')
    parent = models.ForeignKey(ProjectImportV2, null=True, blank=True, related_name="rows", on_delete=models.SET_NULL)


class ProjectVersion(ExtendedModel):
    version = models.IntegerField(default=1)
    project = models.ForeignKey(Project, blank=False, null=True, on_delete=models.CASCADE, related_name='versions')
    name = models.CharField(max_length=255)
    data = models.JSONField(default=dict)
    research = models.BooleanField(blank=True, null=True)
    user = models.ForeignKey(UserProfile, on_delete=models.CASCADE, related_name='project_versions', blank=True,
                             null=True)
    published = models.BooleanField(default=False)
    archived = models.BooleanField(default=False)

    class Meta:
        unique_together = ('project', 'version')
        ordering = ['modified']

    def save(self, *args, **kwargs):
        """
        Custom save method to auto-increment the version field
        """
        if not self.id:
            qs = ProjectVersion.objects.filter(project=self.project)
            self.version = qs.count() + 1
        super().save(*args, **kwargs)
