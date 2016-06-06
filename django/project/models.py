from django.db import models
from django.db.models import Q
from django.contrib.postgres.fields import JSONField

from core.models import ExtendedModel
from user.models import UserProfile


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
    name = models.CharField(max_length=255, unique=True)
    data = JSONField()
    team = models.ManyToManyField(UserProfile, related_name="team", blank=True)
    viewers = models.ManyToManyField(UserProfile, related_name="viewers", blank=True)

    projects = ProjectManager()


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
