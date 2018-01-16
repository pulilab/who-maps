from collections import defaultdict
from django.conf import settings
from django.utils.translation import ugettext, override

from django.core import mail
from django.template import loader
from django.utils import timezone
from celery.utils.log import get_task_logger

from country.models import Country
from .models import Project
from scheduler.celery import app

logger = get_task_logger(__name__)


@app.task(name="send_project_approval_digest")
def send_project_approval_digest():
    countries = Country.objects.exclude(users=None)
    for country in countries:
        if country.project_approval:
            projects_today = Project.objects.filter(data__country=country.id, approval__approved__isnull=True,
                                                    created__day=timezone.now().day)
            projects_earlier = Project.objects.filter(
                data__country=country.id, approval__approved__isnull=True).exclude(id__in=projects_today.values('id'))

            if not projects_today and not projects_earlier:
                return

            html_template = loader.get_template('email/status_report_inline.html')

            email_mapping = defaultdict(list)
            for profile in country.users.all():
                email_mapping[profile.language].append(profile.user.email)

            for language, email_list in email_mapping.items():
                with override(language):
                    subject = ugettext('Projects waiting for your approval')
                    html_message = html_template.render({'projects_today': projects_today,
                                                         'projects_earlier': projects_earlier,
                                                         'language': language})

                mail.send_mail(
                    subject=subject,
                    message='',
                    from_email=settings.FROM_EMAIL,
                    recipient_list=email_list,
                    html_message=html_message)
