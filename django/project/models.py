from django.db import models
from django.db.models import Q
from django.contrib.postgres.fields import JSONField

from core.models import ExtendedModel
from user.models import UserProfile, Organisation


class ProjectManager(models.Manager):
    use_in_migrations = True

    def owner_of(self, user):
        return self.get_queryset().filter(team=user.userprofile)

    def viewer_of(self, user):
        return self.get_queryset().filter(viewers=user.userprofile)

    def member_of(self, user):
        return self.get_queryset().filter(Q(team=user.userprofile) | Q(viewers=user.userprofile))

    # WARNING: this method is used in migration project.0016_auto_20160601_0928
    def by_organisation(self, organisation_id):
        return self.get_queryset().filter(data__organisation=organisation_id)


class Project(ExtendedModel):
    FIELDS_FOR_MEMBERS_ONLY = ("strategy", "pipeline", "anticipated_time", "date", "last_version_date",
                               "started", "application", "pipeline", "last_version")
    FIELDS_FOR_LOGGED_IN = ("coverage",)

    name = models.CharField(max_length=255, unique=True)
    data = JSONField()
    team = models.ManyToManyField(UserProfile, related_name="team", blank=True)
    viewers = models.ManyToManyField(UserProfile, related_name="viewers", blank=True)

    projects = ProjectManager()

    def is_member(self, user):
        return self.team.filter(id=user.userprofile.id).exists() or self.viewers.filter(id=user.userprofile.id).exists()

    def get_member_data(self):
        return self.data

    def get_non_member_data(self):
        return self.remove_keys(self.data, self.FIELDS_FOR_MEMBERS_ONLY)

    def get_anon_data(self):
        return self.remove_keys(self.data, self.FIELDS_FOR_MEMBERS_ONLY + self.FIELDS_FOR_LOGGED_IN)

    def get_organisation(self):
        return Organisation.objects.filter(id=self.data.get('organisation')).first()

    @staticmethod
    def remove_keys(dictionary, keys):
        d = dictionary
        for key in keys:
            if key in d:
                d.pop(key, None)
        return d


class CoverageVersion(ExtendedModel):
    project = models.ForeignKey(Project)
    version = models.IntegerField()
    data = JSONField()


class File(ExtendedModel):
    project = models.ForeignKey(Project)
    type = models.CharField(max_length=255)
    filename = models.CharField(max_length=255)
    data = models.BinaryField()


class PartnerLogo(ExtendedModel):
    project = models.ForeignKey(Project)
    type = models.CharField(max_length=255)
    data = models.ImageField()
