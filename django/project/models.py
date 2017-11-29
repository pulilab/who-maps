import uuid

from django.db import models
from django.db.models import Q
from django.contrib.postgres.fields import JSONField
from django.core.cache import cache

from core.models import ExtendedModel, ExtendedNameOrderedSoftDeletedModel
from country.models import Country, CountryField
from user.models import UserProfile, Organisation


class ProjectManager(models.Manager):
    use_in_migrations = True

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


class Project(ExtendedModel):
    FIELDS_FOR_MEMBERS_ONLY = ("strategy", "pipeline", "anticipated_time", "date", "last_version_date", "started",
                               "application", "last_version")
    FIELDS_FOR_LOGGED_IN = ("coverage",)

    name = models.CharField(max_length=255)
    data = JSONField(default=dict())
    draft = JSONField(default=dict())
    team = models.ManyToManyField(UserProfile, related_name="team", blank=True)
    viewers = models.ManyToManyField(UserProfile, related_name="viewers", blank=True)
    public_id = models.CharField(
        max_length=64, default="", help_text="<CountryCode>-<uuid>-x-<ProjectID> eg: HU9fa42491x1")

    projects = ProjectManager()

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
        return self.get_country().user == user if self.get_country() else False

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
            name=self.name,
            organisation_name=self.get_organisation(draft_mode).name if self.get_organisation(draft_mode) else '',
            country_name=self.get_country(draft_mode).name if self.get_country(draft_mode) else None,
            approved=self.approval.approved if hasattr(self, 'approval') else None,
            fields=[field.to_representation() for field in CountryField.get_for_project(self, draft_mode)],
        )

        data.update(extra_data)

        return data

    def to_response_dict(self, published, draft):
        return dict(id=self.pk, public_id=self.public_id, published=published, draft=draft)

    def make_public_id(self, country_id):
        if self.public_id:
            return

        project_country = Country.objects.filter(id=country_id).first()
        if project_country:
            self.public_id = project_country.code + str(uuid.uuid1()).split('-')[0]


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


class InvalidateCacheMixin(object):

    def save(self, *args, **kwargs):
        cache.delete('project-structure-data')
        return super().save(*args, **kwargs)


class InteroperabilityLink(ExtendedNameOrderedSoftDeletedModel, InvalidateCacheMixin):
    pre = models.CharField(max_length=255)


class TechnologyPlatform(ExtendedNameOrderedSoftDeletedModel, InvalidateCacheMixin):
    pass


class DigitalStrategy(ExtendedNameOrderedSoftDeletedModel, InvalidateCacheMixin):
    GROUP_CHOICES = (
        ('Client', 'Client'),
        ('Provider', 'Provider'),
        ('System', 'System'),
    )
    group = models.CharField(max_length=255, choices=GROUP_CHOICES)
    parent = models.ForeignKey('DigitalStrategy', related_name='strategies', blank=True, null=True)

    def __str__(self):
        parent = ' [{}]'.format(self.parent.name) if self.parent else ''
        return '[{}]{} {}'.format(self.group, parent, self.name)

    class Meta:
        verbose_name_plural = 'Digital Strategies'


class HealthCategory(ExtendedNameOrderedSoftDeletedModel, InvalidateCacheMixin):
    class Meta(ExtendedNameOrderedSoftDeletedModel.Meta):
        verbose_name_plural = 'Health Categories'


class HealthFocusArea(ExtendedNameOrderedSoftDeletedModel, InvalidateCacheMixin):
    health_category = models.ForeignKey(HealthCategory, related_name='health_focus_areas')

    def __str__(self):
        return '[{}] {}'.format(self.health_category.name, self.name)


class Licence(ExtendedNameOrderedSoftDeletedModel, InvalidateCacheMixin):
    pass


class Application(ExtendedNameOrderedSoftDeletedModel, InvalidateCacheMixin):
    pass


class InteroperabilityStandard(ExtendedNameOrderedSoftDeletedModel):
    pass


class HISBucket(ExtendedNameOrderedSoftDeletedModel, InvalidateCacheMixin):
    pass


class HSCChallenge(ExtendedNameOrderedSoftDeletedModel, InvalidateCacheMixin):
    challenge = models.CharField(max_length=512)

    def __str__(self):
        return '({}) {}'.format(self.name, self.challenge)

    class Meta:
        verbose_name_plural = 'Health Categories'
        ordering = ['name', 'challenge']
