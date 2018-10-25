from datetime import timedelta
from django.conf import settings
from django.utils import timezone
from django.utils.translation import ugettext, override

from django.core import mail
from django.template import loader
from celery.utils.log import get_task_logger

from project.models import Project
from toolkit.models import Toolkit
from scheduler.celery import app

logger = get_task_logger(__name__)


@app.task(name="send_daily_toolkit_digest")
def send_daily_toolkit_digest():
    """
    Sends daily digest on maps toolkit changes to team members.
    """
    projects = Project.objects.all()
    for project in projects:
        toolkit = Toolkit.objects.get_object_or_none(project_id=project.id)
        time_period = (timezone.localtime(timezone.now()) - timedelta(hours=settings.TOOLKIT_DIGEST_PERIOD))
        if toolkit and toolkit.modified > time_period:
            html_template = loader.get_template("email/master-inline.html")
            for profile in project.team.all():
                with override(profile.language):
                    html_message = html_template.render({"type": "toolkit_digest",
                                                         "project_id": project.id,
                                                         "language": profile.language})
                    subject = ugettext("MAPS Toolkit updated!")

                mail.send_mail(
                    subject=subject,
                    message="",
                    from_email=settings.FROM_EMAIL,
                    recipient_list=[profile.user.email],
                    html_message=html_message)
