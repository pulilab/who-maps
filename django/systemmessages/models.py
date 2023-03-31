from django.db import models, transaction
from django.db.models.signals import post_save
from django.dispatch import receiver

from core.models import ExtendedModel
from django.utils.translation import gettext_lazy as _

from .tasks import send_system_message


class SystemMessage(ExtendedModel):
    ALL_USERS = 'AU'
    PROJECT_OWNERS = 'APO'
    PROJECT_OWNERS_WITH_PUBLISHED_PROJECTS = 'APOWP'
    RECEIVER_TYPE_CHOICES = (
        (ALL_USERS, _('All users')),
        (PROJECT_OWNERS, _('Project owners')),
        (PROJECT_OWNERS_WITH_PUBLISHED_PROJECTS, _('Project owners with published projects')),
    )

    subject = models.CharField(max_length=200)
    receiver_type = models.CharField(max_length=5, choices=RECEIVER_TYPE_CHOICES, default=ALL_USERS)
    message = models.TextField()
    receivers_number = models.IntegerField(blank=True, null=True)

    def __str__(self):   # pragma: no cover
        return "{} {}".format(self.created, self.subject)


@receiver(post_save, sender=SystemMessage)
def send_message(sender, instance, created, **kwargs):
    if created:
        transaction.on_commit(lambda: send_system_message.apply_async(args=(instance.pk,)))
