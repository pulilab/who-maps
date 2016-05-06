from django.db import models
from django.contrib.postgres.fields import JSONField

from core.models import ExtendedModel


class Project(ExtendedModel):
    name = models.CharField(max_length=255, unique=True)
    data = JSONField()


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
    data = models.BinaryField()
