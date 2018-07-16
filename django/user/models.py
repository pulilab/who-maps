from django.db import models, transaction
from django.conf import settings
from django.contrib.auth import get_user_model
from django.contrib.auth.models import User
from django.contrib.auth.hashers import make_password, PBKDF2PasswordHasher
from django.db.models.signals import post_save
from django.dispatch import receiver
from django.utils.translation import ugettext_lazy as _

from core.models import NameByIDMixin, ExtendedModel
from .tasks import sync_user_to_odk


def set_password(self, raw_password):  # pragma: no cover
    self.password = make_password(raw_password)
    self._password = raw_password
    self._set_password = True  # inject this to detect password change


User.set_password = set_password
PBKDF2PasswordHasher.iterations = 30000


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
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    name = models.CharField(max_length=100, blank=True, null=True)
    organisation = models.ForeignKey(Organisation, blank=True, null=True, on_delete=models.SET_NULL)
    country = models.ForeignKey('country.Country', null=True, on_delete=models.SET_NULL)
    language = models.CharField(max_length=2, choices=settings.LANGUAGES, default='en')
    odk_sync = models.BooleanField(default=False, verbose_name="User has been synced with ODK")

    def __str__(self):
        return "{} <{}>".format(self.name, self.user.email) if self.name else ""

    @staticmethod
    def get_sentinel_user():
        user, _ = get_user_model().objects.get_or_create(username='deleted')
        profile, _ = UserProfile.objects.get_or_create(name='Deleted user', user=user)
        return profile


@receiver(post_save, sender=UserProfile)
def odk_sync_on_created(sender, instance, created, **kwargs):
    if settings.ODK_SYNC_ENABLED:  # pragma: no cover
        if created:
            transaction.on_commit(lambda: sync_user_to_odk.apply_async(args=(instance.user.pk, False)))


@receiver(post_save, sender=User)
def odk_sync_on_pass_update(sender, instance, created, **kwargs):
    if settings.ODK_SYNC_ENABLED:  # pragma: no cover
        if created:
            instance._set_password = False
        elif getattr(instance, '_set_password', False):
            transaction.on_commit(lambda: sync_user_to_odk.apply_async(args=(instance.pk, True)))
