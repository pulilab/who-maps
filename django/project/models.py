from django.db import models
from django.contrib.postgres.fields import JSONField

from core.models import ExtendedModel
from user.models import UserProfile


class ProjectManager(models.Manager):
    use_in_migrations = True

    def by_user(self, user):
        return self.get_queryset().filter(team=user.userprofile)

    def by_organisation(self, organisation_id):
        return self.get_queryset().filter(data__organisation=organisation_id)


class Project(ExtendedModel):
    name = models.CharField(max_length=255, unique=True)
    data = JSONField()
    team = models.ManyToManyField(UserProfile, related_name="team")
    viewers = models.ManyToManyField(UserProfile, related_name="viewers")

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
