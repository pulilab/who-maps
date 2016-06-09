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


class UserProfile(ExtendedModel):
    IMPLEMENTER = 'I'
    DONOR = 'D'
    GOVERNMENT = 'G'
    ACCOUNT_TYPE_CHOICES = (
        (IMPLEMENTER, 'Implementer'),
        (DONOR, 'Financial Investor'),
        (GOVERNMENT, 'Government'),
    )

    account_type = models.CharField(
        max_length=1,
        choices=ACCOUNT_TYPE_CHOICES,
        default=IMPLEMENTER,
    )
    user = models.OneToOneField(User)
    name = models.CharField(max_length=100)
    organisation = models.ForeignKey(Organisation)
    country = models.CharField(max_length=100)

    def __unicode__(self):
        return "%s (%s)" % (self.name, self.organisation)
