import uuid
from collections import namedtuple

from django.db import models
from django.db.models import Q
from django.contrib.auth.models import User
from django.contrib.postgres.fields import JSONField, ArrayField
from django.utils.translation import ugettext_lazy as _

from core.models import ExtendedModel, ExtendedNameOrderedSoftDeletedModel, ActiveQuerySet, SoftDeleteModel
from country.models import Country, CountryField
from project.cache import InvalidateCacheMixin
from user.models import UserProfile, Organisation
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


class ProjectQuerySet(ActiveQuerySet, ProjectManager):
    pass


class Project(SoftDeleteModel, ExtendedModel):
    FIELDS_FOR_MEMBERS_ONLY = ("last_version", "last_version_date", "start_date", "end_date")
    FIELDS_FOR_LOGGED_IN = ("coverage",)

    name = models.CharField(max_length=255)
    data = JSONField(default=dict())
    draft = JSONField(default=dict())
    team = models.ManyToManyField(UserProfile, related_name="team", blank=True)
    viewers = models.ManyToManyField(UserProfile, related_name="viewers", blank=True)
    public_id = models.CharField(
        max_length=64, default="", help_text="<CountryCode>-<uuid>-x-<ProjectID> eg: HU9fa42491x1")
    odk_etag = models.CharField(null=True, blank=True, max_length=64)
    odk_id = models.CharField(null=True, blank=True, max_length=64)
    odk_extra_data = JSONField(default=dict())

    projects = ProjectManager  # deprecated, use objects instead
    objects = ProjectQuerySet.as_manager()

    def __str__(self):  # pragma: no cover
        return self.name

    def get_country(self, draft_mode=False):
        try:
            country_id = self.draft.get('country') if draft_mode else self.data.get('country')
            country_id = int(country_id)
        except TypeError:  # pragma: no cover
            return None
        return Country.objects.get(id=country_id)

    def is_member(self, user):
        return self.team.filter(id=user.userprofile.id).exists() or self.viewers.filter(id=user.userprofile.id).exists()

    def is_country_admin(self, user):
        # Country admin has permissions only for the published project
        return user.userprofile in self.get_country().users.all() if self.get_country() else False

    def get_member_data(self):
        return self.data

    def get_member_draft(self):
        return self.draft

    def get_non_member_data(self):
        return self.remove_keys(self.FIELDS_FOR_MEMBERS_ONLY)

    def get_anon_data(self):
        return self.remove_keys(self.FIELDS_FOR_MEMBERS_ONLY + self.FIELDS_FOR_LOGGED_IN)

    def get_organisation(self, draft_mode=False):
        try:
            organisation_id = self.draft.get('organisation') if draft_mode else self.data.get('organisation')
            organisation_id = int(organisation_id)
        except TypeError:  # pragma: no cover
            return None
        return Organisation.objects.filter(id=organisation_id).first()

    def str_national_level_deployment(self):
        nld = self.data.get('national_level_deployment', {})
        if not nld:
            return ''
        return "National Level Deployment: " \
               "[Clients: {}, Health Workers: {}, Facilities: {}]".format(nld.get('clients'),
                                                                          nld.get('health_workers'),
                                                                          nld.get('facilities'))

    def str_coverage(self, second_level=False):
        coverage = self.data.get('coverage' if not second_level else 'coverage_second_level', [])
        if not coverage:
            return ''
        return ", ".join(["District: {} "
                          "[Clients: {}, Health Workers: {}, Facilities: {}]".format(c.get('district'),
                                                                                     c.get('clients'),
                                                                                     c.get('health_workers'),
                                                                                     c.get('facilities'))
                         for c in coverage])

    def remove_keys(self, keys):
        d = self.data
        for key in keys:
            if key in d:
                d.pop(key, None)
        return d

    def to_representation(self, data=None, draft_mode=False):
        if data is None:
            data = self.get_member_draft() if draft_mode else self.get_member_data()

        if not data:
            return {}

        extra_data = dict(
            id=self.pk,
            name=self.draft.get('name', '') if draft_mode else self.name,
            organisation_name=self.get_organisation(draft_mode).name if self.get_organisation(draft_mode) else '',
            country_name=self.get_country(draft_mode).name if self.get_country(draft_mode) else None,
            approved=self.approval.approved if hasattr(self, 'approval') else None,
            fields=[field.to_representation(draft_mode) for field in CountryField.get_for_project(self, draft_mode)],
        )

        data.update(extra_data)

        if not draft_mode:
            last_version = CoverageVersion.objects.filter(project_id=self.pk).order_by("-version").first()
            if last_version:
                data.update(last_version=last_version.version, last_version_date=last_version.modified)

        return data

    def to_response_dict(self, published, draft):
        return dict(id=self.pk, public_id=self.public_id, published=published, draft=draft)

    def make_public_id(self, country_id):
        if self.public_id:
            return

        project_country = Country.objects.filter(id=country_id).first()
        if project_country:
            self.public_id = project_country.code + str(uuid.uuid1()).split('-')[0]

    def post_save_initializations(self, Toolkit):
        # Add default Toolkit structure for the new project.
        Toolkit.objects.get_or_create(project_id=self.id, defaults=dict(data=toolkit_default))
        # Add approval
        ProjectApproval.objects.create(project=self)


class ProjectApproval(ExtendedModel):
    project = models.OneToOneField('Project', related_name='approval')
    user = models.ForeignKey(UserProfile, blank=True, null=True, help_text="Administrator who approved the project")
    approved = models.NullBooleanField(blank=True, null=True)
    reason = models.TextField(blank=True, null=True)

    def __str__(self):
        return "Approval for {}".format(self.project.name)


class CoverageVersion(ExtendedModel):
    project = models.ForeignKey(Project)
    version = models.IntegerField()
    data = JSONField()


class File(ExtendedModel):
    project = models.ForeignKey(Project)
    type = models.CharField(max_length=255)
    filename = models.CharField(max_length=255)
    data = models.BinaryField()


class DigitalStrategy(InvalidateCacheMixin, ExtendedNameOrderedSoftDeletedModel):
    GROUP_CHOICES = (
        ('Client', _('Client')),
        ('Provider', _('Provider')),
        ('System', _('System')),
        ('Data service', _('Data service'))
    )
    group = models.CharField(max_length=255, choices=GROUP_CHOICES)
    parent = models.ForeignKey('DigitalStrategy', related_name='strategies', blank=True, null=True)

    def __str__(self):
        parent = ' [{}]'.format(self.parent.name) if self.parent else ''
        return '[{}]{} {}'.format(self.group, parent, self.name)

    class Meta:
        verbose_name_plural = 'Digital Strategies'


class HSCGroup(InvalidateCacheMixin, ExtendedNameOrderedSoftDeletedModel):
    class Meta:
        verbose_name = 'Health System Challenge Group'


class HSCChallengeQuerySet(ActiveQuerySet):
    FakeChallenge = namedtuple('FakeChallenge', ['name', 'challenge'])

    def get_names_for_ids(self, ids):
        return [self.FakeChallenge(l.group.name, l.name)
                for l in self.filter(id__in=ids).select_related('group')]


class HSCChallenge(InvalidateCacheMixin, ExtendedNameOrderedSoftDeletedModel):
    group = models.ForeignKey(HSCGroup, on_delete=models.CASCADE, related_name='challenges')

    def __str__(self):
        return '({}) {}'.format(self.group.name, self.name)

    class Meta:
        verbose_name = 'Health System Challenge'
        verbose_name_plural = 'Health System Challenges'
        ordering = ('name',)

    objects = HSCChallengeQuerySet.as_manager()


class HealthCategory(InvalidateCacheMixin, ExtendedNameOrderedSoftDeletedModel):
    class Meta(ExtendedNameOrderedSoftDeletedModel.Meta):
        verbose_name_plural = 'Health Categories'


class HealthFocusArea(InvalidateCacheMixin, ExtendedNameOrderedSoftDeletedModel):
    health_category = models.ForeignKey(HealthCategory, related_name='health_focus_areas')

    def __str__(self):
        return '[{}] {}'.format(self.health_category.name, self.name)

    class Meta:
        ordering = ['health_category__name', 'name']


class InteroperabilityLink(InvalidateCacheMixin, ExtendedNameOrderedSoftDeletedModel):
    pre = models.CharField(max_length=255)


class TechnologyPlatform(InvalidateCacheMixin, ExtendedNameOrderedSoftDeletedModel):
    pass


class Licence(InvalidateCacheMixin, ExtendedNameOrderedSoftDeletedModel):
    pass


class InteroperabilityStandard(InvalidateCacheMixin, ExtendedNameOrderedSoftDeletedModel):
    pass


class HISBucket(InvalidateCacheMixin, ExtendedNameOrderedSoftDeletedModel):
    pass


class ProjectImport(ExtendedModel):
    user = models.ForeignKey(User)
    csv = models.FileField()
    headers = ArrayField(models.CharField(max_length=512), blank=True, null=True)
    mapping = JSONField(default=dict)
    imported = models.TextField(null=True, blank=True, default='')
    failed = models.TextField(null=True, blank=True, default='')
    status = models.NullBooleanField(null=True, blank=True)

    def __str__(self):
        return self.csv.name
