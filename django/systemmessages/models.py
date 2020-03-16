from django.db import models
from django.db.models.signals import post_save
from django.dispatch import receiver

from core.models import ExtendedModel
from django.utils.translation import ugettext_lazy as _

from user.models import UserProfile


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

    def __str__(self):
        return "{} {}".format(self.created, self.subject)


@receiver(post_save, sender=SystemMessage)
def send_message_and_set_receivers(sender, instance, created, **kwargs):
    if created:
        active_user_profiles = UserProfile.objects.filter(user__is_active=True)

        # set number of receivers
        if instance.receiver_type == SystemMessage.ALL_USERS:
            instance.receivers_number = active_user_profiles.count()
        elif instance.receiver_type == SystemMessage.PROJECT_OWNERS:
            instance.receivers_number = active_user_profiles.filter(team__is_active=True).count()
        elif instance.receiver_type == SystemMessage.PROJECT_OWNERS_WITH_PUBLISHED_PROJECTS:
            instance.receivers_number = active_user_profiles.exclude(team__public_id='').\
                filter(team__is_active=True).count()
        instance.save()

#         # send_message_task.apply_async(args=(instance.pk,))
