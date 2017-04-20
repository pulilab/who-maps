from django.db import models
from django.contrib.auth.models import User

from core.models import NameByIDMixin, ExtendedModel


class Organisation(NameByIDMixin, ExtendedModel):
    name = models.CharField(unique=True, max_length=100)

    def __str__(self):  # pragma: no cover
        return self.name


class UserProfile(ExtendedModel):
    IMPLEMENTER = 'I'
    DONOR = 'D'
    GOVERNMENT = 'G'
    INVENTORY = 'Y'
    ACCOUNT_TYPE_CHOICES = (
        (IMPLEMENTER, 'Implementer'),
        (DONOR, 'Financial Investor'),
        (GOVERNMENT, 'Government'),
        (INVENTORY, 'Inventory User'),
    )

    account_type = models.CharField(
        max_length=1,
        choices=ACCOUNT_TYPE_CHOICES,
        default=IMPLEMENTER,
    )
    user = models.OneToOneField(User)
    name = models.CharField(max_length=100, blank=True, null=True)
    organisation = models.ForeignKey(Organisation, blank=True, null=True)
    country = models.CharField(max_length=100, blank=True, null=True)

    def __str__(self):
        return self.name if self.name else ""
