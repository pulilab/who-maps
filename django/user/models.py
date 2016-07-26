from django.db import models
from django.contrib.auth.models import User

from core.models import ExtendedModel


class Organisation(ExtendedModel):
    name = models.CharField(unique=True, max_length=100)

    @classmethod
    def get_name_by_id(cls, org_id=None):
        if not org_id:
            return ""

        org = cls.objects.get_object_or_none(id=org_id)
        return org.name if org else ""

    def __str__(self):
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
