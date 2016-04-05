from django.db import models
from django.contrib.postgres.fields import JSONField

from core.models import ExtendedModel
from project.models import Project


class HSS(ExtendedModel):
    project = models.ForeignKey(Project)
    data = JSONField()
