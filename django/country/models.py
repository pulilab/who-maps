from django.db import models
from django.contrib.postgres.fields import JSONField

from core.models import NameByIDMixin, ExtendedModel


class Country(NameByIDMixin, ExtendedModel):
    name = models.CharField(max_length=255, unique=True)
    code = models.CharField(max_length=4, default="NULL", help_text="ISO3166-1 country code")
    geodata = JSONField(default=dict)

    def __str__(self):
        return self.name
