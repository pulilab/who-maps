from django.db import models, transaction
from django.conf import settings
from django.contrib.auth.models import User
from django.db.models.signals import post_save
from django.dispatch import receiver
from django.utils.translation import ugettext_lazy as _

from core.models import NameByIDMixin, ExtendedModel
from .tasks import sync_user_to_odk


class Organisation(NameByIDMixin, ExtendedModel):
    name = models.CharField(unique=True, max_length=255)

    def __str__(self):  # pragma: no cover
        return self.name


class UserProfile(ExtendedModel):
    IMPLEMENTER = 'I'
    DONOR = 'D'
    GOVERNMENT = 'G'
    INVENTORY = 'Y'
    ACCOUNT_TYPE_CHOICES = (
        (IMPLEMENTER, _('Implementer')),
        (DONOR, _('Financial Investor')),
        (GOVERNMENT, _('Government')),
        (INVENTORY, _('Inventory User')),
    )

    account_type = models.CharField(
        max_length=1,
        choices=ACCOUNT_TYPE_CHOICES,
        default=IMPLEMENTER,
    )
    user = models.OneToOneField(User)
    name = models.CharField(max_length=100, blank=True, null=True)
    organisation = models.ForeignKey(Organisation, blank=True, null=True)
    country = models.ForeignKey('country.Country', null=True)
    language = models.CharField(max_length=2, choices=settings.LANGUAGES, default='en')
    odk_sync = models.BooleanField(default=False, verbose_name="Whether user has been synced with ODK")

    def __str__(self):
        return "{} <{}>".format(self.name, self.user.email) if self.name else ""


@receiver(post_save, sender=UserProfile)
def odk_sync_on_save(sender, instance, created, **kwargs):
    if created:
        transaction.on_commit(lambda: sync_user_to_odk.apply_async(args=(instance.pk,)))
