from django.db import models
from django.contrib.auth.models import User

from core.models import ExtendedModel


class Organisation(ExtendedModel):
    name = models.CharField(unique=True, max_length=100)


class UserProfile(ExtendedModel):
    user = models.OneToOneField(User)
    name = models.CharField(max_length=100)
    organisation = models.ForeignKey(Organisation)
    country = models.CharField(max_length=100)
