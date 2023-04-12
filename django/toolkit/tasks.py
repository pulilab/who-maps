from django.conf import settings
from django.utils import timezone
from django.utils.translation import gettext_lazy as _
from celery.utils.log import get_task_logger

from core.utils import send_mail_wrapper
from project.models import Project
from scheduler.celery import app

logger = get_task_logger(__name__)


@app.task(name="send_toolkit_digest")
def send_toolkit_digest():
    """
    Sends digest on maps toolkit changes to team members.
    """
    projects = Project.objects.published_only().filter(
        toolkit__modified__gt=timezone.now() - timezone.timedelta(hours=settings.TOOLKIT_DIGEST_PERIOD))

    for project in projects:
        toolkit = project.toolkit_set.last()
        if toolkit and toolkit.modified - toolkit.created > timezone.timedelta(seconds=10):
            for profile in project.team.filter(daily_toolkit_digest_notification=True):
                context = {"project_id": project.id, "project_name": project.name}
                subject = _(f"{project.name}'s assessment has been updated")
                send_mail_wrapper(subject=subject,
                                  email_type="toolkit_digest",
                                  to=profile.user.email,
                                  language=profile.language,
                                  context=context)
