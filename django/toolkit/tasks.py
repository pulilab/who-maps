from django.conf import settings
from django.utils import timezone
from django.utils.translation import ugettext_lazy as _
from celery.utils.log import get_task_logger

from core.utils import send_mail_wrapper
from project.models import Project
from toolkit.models import Toolkit
from scheduler.celery import app

logger = get_task_logger(__name__)


@app.task(name="send_daily_toolkit_digest")
def send_daily_toolkit_digest():
    """
    Sends daily digest on maps toolkit changes to team members.
    """
    projects = Project.objects.published_only().filter(
        modified__gt=timezone.now() - timezone.timedelta(hours=settings.TOOLKIT_DIGEST_PERIOD))

    for project in projects:
        toolkit = Toolkit.objects.get_object_or_none(project_id=project.id)
        has_passed_creation = toolkit.modified - toolkit.created > timezone.timedelta(seconds=10)
        if toolkit and has_passed_creation:
            for profile in project.team.all():
                context = {"project_id": project.id}
                subject = _("Your Digital Health Atlas project assessment has been updated")
                send_mail_wrapper(subject=subject,
                                  email_type="toolkit_digest",
                                  to=profile.user.email,
                                  language=profile.language,
                                  context=context)
