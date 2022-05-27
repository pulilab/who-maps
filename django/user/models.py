from django.db import models, transaction
from django.conf import settings
from django.contrib.auth import get_user_model
from django.contrib.auth.models import User
from django.contrib.auth.hashers import make_password, PBKDF2PasswordHasher
from django.db.models.signals import post_save, pre_save
from django.dispatch import receiver
from django.utils.translation import ugettext_lazy as _

from core.models import ExtendedModel
from .tasks import sync_user_to_odk, send_user_request_to_admins


def set_password(self, raw_password):  # pragma: no cover
    self.password = make_password(raw_password)
    self._password = raw_password
    self._set_password = True  # inject this to detect password change


User.set_password = set_password
PBKDF2PasswordHasher.iterations = 30000


class Organisation(ExtendedModel):
    name = models.CharField(unique=True, max_length=255)

    def __str__(self):  # pragma: no cover
        return self.name

    @classmethod
    def get_or_create_insensitive(cls, project_org):
        try:
            org_id = int(project_org)
        except ValueError:
            try:
                org = cls.objects.get(name__iexact=project_org)
            except Organisation.DoesNotExist:
                org = cls.objects.create(name=project_org)
            org_id = org.id
        return org_id


class UserProfile(ExtendedModel):
    IMPLEMENTER = 'I'
    DONOR = 'D'
    DONOR_ADMIN = 'DA'
    SUPER_DONOR_ADMIN = 'SDA'
    GOVERNMENT = 'G'
    COUNTRY_ADMIN = 'CA'
    SUPER_COUNTRY_ADMIN = 'SCA'
    INVENTORY = 'Y'
    ACCOUNT_TYPE_CHOICES = (
        (IMPLEMENTER, _('Implementer')),
        (DONOR, _('Investor Viewer')),
        (DONOR_ADMIN, _('Investor Admin')),
        (SUPER_DONOR_ADMIN, _('Investor System Admin')),
        (GOVERNMENT, _('Government Viewer')),
        (COUNTRY_ADMIN, _('Government Admin')),
        (SUPER_COUNTRY_ADMIN, _('Government System Admin')),
        (INVENTORY, _('Inventory User')),
    )

    account_type = models.CharField(
        max_length=3,
        choices=ACCOUNT_TYPE_CHOICES,
        default=IMPLEMENTER,
    )
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    name = models.CharField(max_length=100, blank=True, null=True)
    organisation = models.ForeignKey(Organisation, blank=True, null=True, on_delete=models.SET_NULL)
    country = models.ForeignKey('country.Country', null=True,  blank=True, on_delete=models.SET_NULL)
    donor = models.ForeignKey('country.Donor', related_name='userprofiles', null=True,  blank=True, 
                              on_delete=models.SET_NULL)
    language = models.CharField(max_length=2, choices=settings.LANGUAGES, default='en')
    odk_sync = models.BooleanField(default=False, verbose_name="User has been synced with ODK")
    # phone = models.CharField(blank=True, null=True, max_length=50)
    title = models.CharField(blank=True, null=True, max_length=100)
    linkedin = models.URLField(blank=True, null=True)

    project_updates_notification = models.BooleanField(default=True)
    daily_toolkit_digest_notification = models.BooleanField(default=True)
    project_approval_request_notification = models.BooleanField(default=True)
    role_request_notification = models.BooleanField(default=True)

    def __str__(self):
        return "{} <{}>".format(self.name, self.user.email) if self.name else ""

    @staticmethod
    def get_sentinel_user():
        user, _ = get_user_model().objects.get_or_create(username='deleted')
        profile, _ = UserProfile.objects.get_or_create(name='Deleted user', user=user)
        return profile

    def is_government_type(self):
        return self.account_type in [self.GOVERNMENT, self.COUNTRY_ADMIN, self.SUPER_COUNTRY_ADMIN]

    def is_investor_type(self):
        return self.account_type in [self.DONOR, self.DONOR_ADMIN, self.SUPER_DONOR_ADMIN]

    @property
    def account_type_approved(self):
        from country.models import Country
        from country.models import Donor

        approved_ca = self.account_type == self.COUNTRY_ADMIN and Country.objects.filter(admins=self).exists()
        approved_sca = self.account_type == self.SUPER_COUNTRY_ADMIN and Country.objects.filter(
            super_admins=self).exists()
        approved_da = self.account_type == self.DONOR_ADMIN and Donor.objects.filter(admins=self).exists()
        approved_sda = self.account_type == self.SUPER_DONOR_ADMIN and Donor.objects.filter(
            super_admins=self).exists()
        return self.user.is_superuser or approved_ca or approved_sca or approved_da or approved_sda


@receiver(pre_save, sender=UserProfile)
def admin_request_on_change(sender, instance, **kwargs):
    if instance.id:
        old_account_type = UserProfile.objects.get(id=instance.id).account_type
        if instance.account_type != UserProfile.IMPLEMENTER and instance.account_type != old_account_type:
            instance.__trigger_send = True


@receiver(post_save, sender=UserProfile)
def admin_request_on_create(sender, instance, created, **kwargs):
    if created and instance.account_type != UserProfile.IMPLEMENTER or getattr(instance, '__trigger_send', False):
        send_user_request_to_admins.apply_async(args=(instance.pk,))


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
