from django.conf import settings
from django.core import mail
from django.template import loader
from celery.utils.log import get_task_logger

from country.models import Country
from .models import Project
from scheduler.celery import app

logger = get_task_logger(__name__)

#
# @app.task(name="send_project_approval_digest")
# def send_project_approval_digest():
#     countries = Country.objects.exclude(user__isnull=True)
#     for country in countries:
#         if country.project_approval:
#             projects = Project.objects.filter(data__country=country.id, approval__isnull=True)
#             html_template = loader.get_template('email/project_approval_list.html')
#             html_message = html_template.render({'projects': projects, 'user': country.user.id})
#             mail.send_mail(
#                 subject='Projects waiting for your approval',
#                 message='',
#                 from_email=settings.FROM_EMAIL,
#                 recipient_list=[country.user.user.email],
#                 html_message=html_message)
