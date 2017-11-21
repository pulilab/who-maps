import uuid

from django.db import models
from django.db.models import Q
from django.contrib.postgres.fields import JSONField

from core.models import ExtendedModel, SoftDeleteMixin
from country.models import Country
from user.models import UserProfile, Organisation


class ProjectManager(models.Manager):
    use_in_migrations = True

    @staticmethod
    def make_public_id(country_id):
        project_country = Country.objects.filter(id=country_id).first()
        if project_country:
            return project_country.code + str(uuid.uuid1()).split('-')[0]

    def owner_of(self, user):
        return self.get_queryset().filter(team=user.userprofile)

    def viewer_of(self, user):
        return self.get_queryset().filter(viewers=user.userprofile)

    def member_of(self, user):
        return self.get_queryset().filter(Q(team=user.userprofile)
                                          | Q(viewers=user.userprofile)).distinct().order_by('id')

    # WARNING: this method is used in migration project.0016_auto_20160601_0928
    def by_organisation(self, organisation_id):  # pragma: no cover
        return self.get_queryset().filter(data__organisation=organisation_id)

    def create(self, **kwargs):
        if self.model == Project:
            kwargs['public_id'] = self.make_public_id(kwargs['data']['country'])
        return super(ProjectManager, self).create(**kwargs)


class ProjectBase(ExtendedModel):
    FIELDS_FOR_MEMBERS_ONLY = ("strategy", "pipeline", "anticipated_time", "date", "last_version_date", "started",
                               "application", "last_version")
    FIELDS_FOR_LOGGED_IN = ("coverage",)

    name = models.CharField(max_length=255, unique=True)
    data = JSONField()
    team = models.ManyToManyField(UserProfile, related_name="%(class)s_team", blank=True)
    viewers = models.ManyToManyField(UserProfile, related_name="%(class)s_viewers", blank=True)

    projects = ProjectManager()

    def __str__(self):  # pragma: no cover
        return self.name

    @property
    def country(self):
        try:
            country_id = int(self.data.get('country'))
        except TypeError:  # pragma: no cover
            return None
        return Country.objects.get(id=country_id)

    def is_member(self, user):
        return self.team.filter(id=user.userprofile.id).exists() or self.viewers.filter(id=user.userprofile.id).exists()

    def is_admin(self, user):
        return self.country.user == user

    def get_member_data(self):
        return self.data

    def get_non_member_data(self):
        return self.remove_keys(self.FIELDS_FOR_MEMBERS_ONLY)

    def get_anon_data(self):
        return self.remove_keys(self.FIELDS_FOR_MEMBERS_ONLY + self.FIELDS_FOR_LOGGED_IN)

    def get_organisation(self):
        return Organisation.objects.filter(id=self.data.get('organisation')).first()

    def remove_keys(self, keys):
        d = self.data
        for key in keys:
            if key in d:
                d.pop(key, None)
        return d

    class Meta:
        abstract = True


class Project(ProjectBase):
    public_id = models.CharField(
        max_length=64, default="", help_text="<CountryCode>-<uuid>-x-<ProjectID> eg: HU9fa42491x1")


class ProjectDraft(ProjectBase):
    name = models.CharField(max_length=255, unique=False)
    project = models.OneToOneField(
        'Project', on_delete=models.CASCADE, related_name='project_draft', blank=True, null=True)


class ProjectApproval(ExtendedModel):
    project = models.OneToOneField('Project', related_name='approval')
    user = models.ForeignKey(UserProfile)
    approved = models.NullBooleanField(blank=True, null=True)
    reason = models.TextField(blank=True, null=True)


class CoverageVersion(ExtendedModel):
    project = models.ForeignKey(Project)
    version = models.IntegerField()
    data = JSONField()


class File(ExtendedModel):
    project = models.ForeignKey(Project)
    type = models.CharField(max_length=255)
    filename = models.CharField(max_length=255)
    data = models.BinaryField()


class InteroperabilityLink(SoftDeleteMixin, ExtendedModel):
    pre = models.CharField(max_length=255)
    name = models.CharField(max_length=255)

    def __str__(self):
        return self.name


class TechnologyPlatform(SoftDeleteMixin, ExtendedModel):
    name = models.CharField(max_length=255)

    def __str__(self):
        return self.name


class DigitalStrategy(SoftDeleteMixin, ExtendedModel):
    GROUP_CHOICES = (
        ('Client', 'Client'),
        ('Provider', 'Provider'),
        ('System', 'System'),
    )
    group = models.CharField(max_length=255, choices=GROUP_CHOICES)
    parent = models.ForeignKey('DigitalStrategy', related_name='strategies', blank=True, null=True)
    name = models.CharField(max_length=255)

    def __str__(self):
        parent = ' [{}]'.format(self.parent.name) if self.parent else ''
        return '[{}]{} {}'.format(self.group, parent, self.name)

    class Meta:
        verbose_name_plural = 'Digital Strategies'


class HealthCategory(ExtendedModel):
    name = models.CharField(max_length=512)

    def __str__(self):
        return self.name


class HealthFocusArea(ExtendedModel):
    health_category = models.ForeignKey(HealthCategory, related_name='health_focus_areas')
    name = models.CharField(max_length=512)

    def __str__(self):
        return '[{}] {}'.format(self.health_category.name, self.name)
