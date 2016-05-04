from django.db import models
from django.contrib.auth.models import User

from core.models import ExtendedModel


class UserProfile(ExtendedModel):
    user = models.OneToOneField(User)
    name = models.CharField(max_length=100)
    organisation = models.CharField(max_length=100)
    country = models.CharField(max_length=100)
