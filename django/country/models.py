from django.db import models
from django.contrib.postgres.fields import JSONField

from core.models import ExtendedModel


class Country(ExtendedModel):
    name = models.CharField(max_length=255, unique=True)
    display_name = models.CharField(max_length=255)
    geodata = JSONField(default=dict)
