from django.db import models
from django.contrib.auth.models import User
from django.utils.translation import ugettext_lazy as _
from django.dispatch import receiver
from django.utils.translation import activate
from allauth.account.signals import user_logged_in

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
    country = models.CharField(max_length=100, blank=True, null=True)
    language = models.CharField(max_length=2, blank=True, null=True)

    def __str__(self):
        return "{} <{}>".format(self.name, self.user.email) if self.name else ""

# TODO need to rework this due to signals not emitted in case of token auth
# See: https://github.com/GetBlimp/django-rest-framework-jwt/issues/195
@receiver(user_logged_in)
def login_logger(request, user, **kwargs):
    if user.userprofile.language:
        activate(user.userprofile.language)
