from django.db import models
from django.contrib.postgres.fields import JSONField

from core.models import ExtendedModel
from user.models import UserProfile


class ProjectManager(models.Manager):
    use_in_migrations = True

    def by_user(self, user):
        """
        Filters projects by `User`
        """
        # TODO: these UserProfile hacks should be removed by adding User FK to Project
        user_profile = UserProfile.objects.get(user_id=user.id)
        return self.get_queryset().filter(data__organisation=user_profile.organisation.id)

    def by_organisation(self, organisation):
        return self.get_queryset().filter(data__organisation=organisation)


class Project(ExtendedModel):
    name = models.CharField(max_length=255, unique=True)
    data = JSONField()
    team = models.ManyToManyField(UserProfile, related_name="team")
    viewers = models.ManyToManyField(UserProfile, related_name="viewers")

    projects = ProjectManager()

    def is_owner(self, user):
        # TODO: these UserProfile hacks should be removed by adding User FK to Project
        user_profile = UserProfile.objects.get(user_id=user.id)
        return self.data.get('organisation') == user_profile.organisation


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
