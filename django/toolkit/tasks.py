import json
from datetime import timedelta
from django.conf import settings
from django.utils import timezone
from django.core import mail
from django.template import loader
from celery.decorators import periodic_task
from celery.utils.log import get_task_logger

from project.models import Project
from toolkit.models import Toolkit

logger = get_task_logger(__name__)


@periodic_task(run_every=timedelta(hours=settings.TOOLKIT_DIGEST_PERIOD), name="send_daily_toolkit_digest")
def send_daily_toolkit_digest():
    """
    Sends daily digest on maps toolkit changes to team members.
    """
    projects = Project.objects.all()
    for project in projects:
        toolkit = Toolkit.objects.get_object_or_none(project_id=project.id)
        time_period = (timezone.localtime(timezone.now()) - timedelta(hours=settings.TOOLKIT_DIGEST_PERIOD))
        if toolkit and toolkit.modified > time_period:
            logger.info("Toolkit updated recently.")
            html_template = loader.get_template("email/toolkit_digest.html")
            html_message = html_template.render({"project_id": project.id})
            emails = []
            for profile in project.team.all():
                mail.send_mail(
                    subject="MAPS Toolkit updated!",
                    message="",
                    from_email=settings.FROM_EMAIL,
                    recipient_list=[profile.user.email],
                    html_message=html_message)
