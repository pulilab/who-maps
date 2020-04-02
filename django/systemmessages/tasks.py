from collections import defaultdict

from celery.utils.log import get_task_logger
from django.conf import settings
from django.utils.translation import override

from core.utils import send_mail_wrapper
from scheduler.celery import app
from user.models import UserProfile

logger = get_task_logger(__name__)


@app.task(name="send_system_message")
def send_system_message(system_message_id):
    """
    Sends message to all users
    """
    from .models import SystemMessage

    try:
        system_message = SystemMessage.objects.get(pk=system_message_id)
    except SystemMessage.DoesNotExist:  # pragma: no cover
        pass
    else:
        active_user_profiles = UserProfile.objects.filter(user__is_active=True)

        receivers = None
        if system_message.receiver_type == SystemMessage.ALL_USERS:
            receivers = active_user_profiles
        elif system_message.receiver_type == SystemMessage.PROJECT_OWNERS:
            receivers = active_user_profiles.filter(team__is_active=True)
        elif system_message.receiver_type == SystemMessage.PROJECT_OWNERS_WITH_PUBLISHED_PROJECTS:
            receivers = active_user_profiles.exclude(team__public_id=''). \
                filter(team__is_active=True)

        if receivers:

            # limit emails
            if not settings.EMAIL_SENDING_PRODUCTION:
                receivers = receivers[:1]
                system_message.receivers_number = 1
            else:
                system_message.receivers_number = receivers.count()

            system_message.save()

            email_mapping = defaultdict(list)
            for receiver in receivers:
                email_mapping[receiver.language].append(receiver.user.email)

            for language, email_list in email_mapping.items():
                with override(language):
                    send_mail_wrapper(subject=system_message.subject,
                                      email_type="system_message",
                                      to=email_list,
                                      language=language,
                                      context={"message": system_message.message})
