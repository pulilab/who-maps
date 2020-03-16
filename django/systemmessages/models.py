from django.db import models
from core.models import ExtendedModel
from django.utils.translation import ugettext_lazy as _


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
    receivers_number = models.IntegerField()

    def __str__(self):
        return "{} {}".format(self.created, self.subject)
