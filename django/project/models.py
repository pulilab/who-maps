import uuid

from django.db import models
from django.db.models import Q
from django.contrib.postgres.fields import JSONField
from django.db.models.signals import post_save
from django.dispatch import receiver

from core.models import ExtendedModel
from country.models import Country
from user.models import UserProfile, Organisation


class ProjectManager(models.Manager):
    use_in_migrations = True

    def owner_of(self, user):
        return self.get_queryset().filter(team=user.userprofile)

    def viewer_of(self, user):
        return self.get_queryset().filter(viewers=user.userprofile)

    def member_of(self, user):
        return self.get_queryset().filter(Q(team=user.userprofile) | Q(viewers=user.userprofile)).distinct()

    # WARNING: this method is used in migration project.0016_auto_20160601_0928
    def by_organisation(self, organisation_id):  # pragma: no cover
        return self.get_queryset().filter(data__organisation=organisation_id)


class Project(ExtendedModel):
    FIELDS_FOR_MEMBERS_ONLY = ("strategy", "pipeline", "anticipated_time", "date", "last_version_date",
                               "started", "application", "last_version")
    FIELDS_FOR_LOGGED_IN = ("coverage",)

    name = models.CharField(max_length=255, unique=True)
    data = JSONField()
    team = models.ManyToManyField(UserProfile, related_name="team", blank=True)
    viewers = models.ManyToManyField(UserProfile, related_name="viewers", blank=True)
    public_id = models.CharField(max_length=64, default="",
                                 help_text="<CountryCode>-<uuid>-x-<ProjectID> eg: HU9fa42491x1")

    projects = ProjectManager()

    def __str__(self):  # pragma: no cover
        return self.name

    @property
    def country_name(self):
        try:
            country_id = int(self.data.get('country'))
        except TypeError:
            return None
        return Country.objects.get(id=country_id).name

    def is_member(self, user):
        return self.team.filter(id=user.userprofile.id).exists() or self.viewers.filter(id=user.userprofile.id).exists()

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

    def make_public_id(self):
        if not self.public_id:
            if self.data.get('country'):
                project_country = Country.objects.filter(id=self.data['country']).first()
                if project_country:
                    self.public_id = project_country.code + str(uuid.uuid1()).split('-')[0] + 'x' + str(self.id)
                    return True
        return False


@receiver(post_save, sender=Project)
def update_with_public_id(sender, instance, **kwargs):
    if instance.make_public_id():
        instance.save()


class CoverageVersion(ExtendedModel):
    project = models.ForeignKey(Project)
    version = models.IntegerField()
    data = JSONField()


class File(ExtendedModel):
    project = models.ForeignKey(Project)
    type = models.CharField(max_length=255)
    filename = models.CharField(max_length=255)
    data = models.BinaryField()

