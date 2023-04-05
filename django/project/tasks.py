import json
import operator
import traceback
import logging
from functools import reduce

import requests

from datetime import datetime

from collections import defaultdict
from django.conf import settings
from django.core.exceptions import ObjectDoesNotExist
from django.core.mail import send_mail
from django.contrib.auth.models import User
from django.db.models import Q
from django.urls import reverse
from django.utils.translation import gettext
from django.utils import timezone
from django.template import loader
from django.utils.translation import gettext_lazy as _

from celery.utils.log import get_task_logger
from rest_framework.exceptions import ValidationError

from core.utils import send_mail_wrapper
from user.models import Organisation
from country.models import Country, Donor

from .models import Project, InteroperabilityLink, TechnologyPlatform
from .serializers import ProjectDraftSerializer

from scheduler.celery import app
from urllib.parse import urljoin

logger = get_task_logger(__name__)


@app.task(name="send_project_approval_digest")
def send_project_approval_digest():
    countries = Country.objects.filter(project_approval=True)
    for country in countries:
        projects = Project.objects.filter(data__country=country.id, approval__approved__isnull=True)

        if not projects:
            return

        email_mapping = defaultdict(list)
        receiver_super_admins = country.super_admins.filter(project_approval_request_notification=True)
        receiver_admins = country.admins.filter(project_approval_request_notification=True)
        for profile in receiver_super_admins | receiver_admins:
            email_mapping[profile.language].append(profile.user.email)

        for language, email_list in email_mapping.items():
            context = {'country_name': country.name, 'projects': projects}

            send_mail_wrapper(subject=_('Action required: New projects awaiting approval'),
                              email_type='status_report',
                              to=email_list,
                              language=language,
                              context=context)


@app.task(name="send_project_updated_digest")
def send_project_updated_digest():
    """
    Sends digest on published project changes to country and donor admins.
    """
    projects = Project.objects.published_only().filter(
        modified__gt=timezone.now() - timezone.timedelta(hours=settings.PROJECT_UPDATE_DIGEST_PERIOD))\
        .select_related('search', 'search__country')

    countries = set(projects.values_list('search__country', flat=True))
    for country_id in countries:
        country_projects = projects.filter(search__country_id=country_id)
        country = country_projects.first().search.country

        email_mapping = defaultdict(list)
        receiver_super_admins = country.super_admins.filter(project_updates_notification=True)
        receiver_admins = country.admins.filter(project_updates_notification=True)
        for profile in receiver_super_admins | receiver_admins:
            email_mapping[profile.language].append(profile.user.email)

        for language, email_list in email_mapping.items():
            context = {'name': country.name, 'projects': country_projects}
            subject = _(f"Digital Health Atlas project(s) in {country.name} have been updated")
            send_mail_wrapper(subject=subject,
                              email_type='project_updated_admin_digest',
                              to=email_list,
                              language=language,
                              context=context)

    donors_qs = projects.values_list('search__donors', flat=True)
    donors = list(set(reduce(operator.add, list(donors_qs))))
    for donor in Donor.objects.filter(id__in=donors):
        donor_projects = projects.filter(search__donors__overlap=[donor.id])

        email_mapping = defaultdict(list)
        receiver_donor_super_admins = donor.super_admins.filter(project_updates_notification=True)
        receiver_donor_admins = donor.admins.filter(project_updates_notification=True)
        for profile in receiver_donor_super_admins | receiver_donor_admins:
            email_mapping[profile.language].append(profile.user.email)

        for language, email_list in email_mapping.items():
            context = {'name': donor.name, 'projects': donor_projects}
            subject = _(f"Digital Health Atlas project(s) that {donor.name} invests in have been updated")
            send_mail_wrapper(subject=subject,
                              email_type='project_updated_admin_digest',
                              to=email_list,
                              language=language,
                              context=context)


@app.task(name='notify_superusers_about_new_pending_software')
def notify_superusers_about_new_pending_software(software_id):
    software = TechnologyPlatform.objects.get(id=software_id)
    if not settings.NOTIFICATION_EMAIL:
        super_users = User.objects.filter(is_superuser=True)
    else:
        super_users = User.objects.filter(email=settings.NOTIFICATION_EMAIL)
    email_mapping = defaultdict(list)
    super_users_list_raw = [()]
    if not super_users:
        super_users_list_raw = [('en', settings.NOTIFICATION_EMAIL)]
    else:
        for user in super_users:
            try:
                email_mapping[user.userprofile.language].append(user.email)
            except ObjectDoesNotExist:
                email_mapping[settings.LANGUAGE_CODE].append(user.email)

    change_url = reverse('admin:project_{}_change'.format(software._meta.model_name), args=(software.id,))
    email_mapping_items = email_mapping.items() if super_users else super_users_list_raw
    for language, email_list in email_mapping_items:
        send_mail_wrapper(subject=_('New software is pending for approval'),
                          email_type="new_pending_software",
                          to=email_list,
                          language=language,
                          context={'software_name': software.name,
                                   'change_url': change_url,
                                   'added_by': software.added_by})


@app.task(name='notify_user_about_software_approval')
def notify_user_about_software_approval(action, software_id):
    software = TechnologyPlatform.objects.get(id=software_id)
    if not software.added_by:
        return

    if action == 'approve':
        subject = _("The software you requested has been approved")
        email_type = "software_approved"
    elif action == 'decline':
        subject = _("The software you requested has been declined")
        email_type = "software_declined"
    else:
        return

    send_mail_wrapper(subject=subject,
                      email_type=email_type,
                      to=software.added_by.user.email,
                      language=software.added_by.language or settings.LANGUAGE_CODE,
                      context={'software_name': software.name})


@app.task(name="send_draft_only_reminders")
def send_draft_only_reminders():
    """
    Sends reminder to projects that are draft only to publish.
    """
    from project.models import Project

    projects = Project.objects.draft_only()
    if getattr(settings, 'DRAFT_ONLY_REMINDER_LIMITED', False):  # pragma: no cover
        projects = [projects.last()]

    for p in projects:
        email_mapping = defaultdict(list)
        for profile in p.team.all():
            email_mapping[profile.language].append(profile.user.email)

        for language, email_list in email_mapping.items():
            send_mail_wrapper(subject=_(f"Complete your project in the Digital Health Atlas '{p.name}'"),
                              email_type='draft_reminder',
                              to=email_list,
                              language=language,
                              context={'project_id': p.id})


@app.task(name="send_no_country_question_answers_reminder")
def send_no_country_question_answers_reminder():
    """
    Sends reminder to projects that has no country question answers.
    """
    from project.models import Project
    from user.models import UserProfile
    from country.models import CountryCustomQuestion

    country_ids = CountryCustomQuestion.objects.filter(required=True).order_by('country').distinct().\
        values_list('country', flat=True)
    projects = Project.objects.published_only().filter(search__country__in=country_ids).\
        filter(Q(data__country_custom_answers__isnull=True) |
               Q(data__country_custom_answers={}) |
               Q(data__country_custom_answers=[]))

    project_team_members = set(projects.values_list('team', flat=True))

    for member in project_team_members:
        try:
            profile = UserProfile.objects.get(id=member)
        except UserProfile.DoesNotExist:  # pragma: no cover
            pass
        else:
            member_projects = [project for project in projects.filter(team=member)]
            subject = _("Your country has asked question(s) you haven't answered yet")
            details = _('The following project(s) have not answered all the required question(s) asked by the country:')
            send_mail_wrapper(
                subject=subject,
                email_type='missing_data_common_template',
                to=profile.user.email,
                language=profile.language or settings.LANGUAGE_CODE,
                context={
                    'projects': member_projects,
                    'name': profile.name,
                    'details': details,
                }
            )


@app.task(name="send_not_every_country_question_has_answer_reminder")
def send_not_every_required_country_question_has_answer_reminder():
    """
    Sends reminder to projects that has no answer for every required country question.
    """
    from project.models import Project
    from user.models import UserProfile
    from country.models import CountryCustomQuestion

    required_questions = CountryCustomQuestion.objects.filter(required=True)
    country_ids = required_questions.order_by('country').distinct().values_list('country', flat=True)
    projects = Project.objects.published_only().filter(search__country__in=country_ids).\
        filter(data__country_custom_answers__isnull=False)

    projects_require_reminder_ids = []
    for project in projects:
        answered_question_ids = [item['question_id'] for item in project.data['country_custom_answers']]
        for question in required_questions.filter(country=project.search.country):
            if question.id not in answered_question_ids:
                projects_require_reminder_ids.append(project.id)
                break

    projects_require_reminder = projects.filter(id__in=projects_require_reminder_ids)

    project_team_members = set(projects_require_reminder.values_list('team', flat=True))

    for member in project_team_members:
        try:
            profile = UserProfile.objects.get(id=member)
        except UserProfile.DoesNotExist:  # pragma: no cover
            pass
        else:
            member_projects = [project for project in projects_require_reminder.filter(team=member)]
            subject = _("Your country has asked question(s) you haven't answered yet")
            details = _('The following project(s) have not answered all the required question(s) asked by the country:')
            send_mail_wrapper(
                subject=subject,
                email_type='missing_data_common_template',
                to=profile.user.email,
                language=profile.language or settings.LANGUAGE_CODE,
                context={
                    'projects': member_projects,
                    'name': profile.name,
                    'details': details,
                }
            )


@app.task(name="send_empty_stages_reminder")
def send_empty_stages_reminder():
    """
    Sends reminder to projects that has no stages.
    """
    from project.models import Project
    from user.models import UserProfile

    projects = Project.objects.published_only().filter(
        Q(data__stages__isnull=True) |
        Q(data__stages=[]) |
        Q(data__stages={})
    )

    project_team_members = set(projects.values_list('team', flat=True))

    for member in project_team_members:
        try:
            profile = UserProfile.objects.get(id=member)
        except UserProfile.DoesNotExist:  # pragma: no cover
            pass
        else:
            member_projects = [project for project in projects.filter(team=member)]
            subject = _("Digital Health Atlas introduces project stages")
            details = _('Please take a look at the new stages section and set them for the following project(s):')
            send_mail_wrapper(
                subject=subject,
                email_type='missing_data_common_template',
                to=profile.user.email,
                language=profile.language or settings.LANGUAGE_CODE,
                context={
                    'projects': member_projects,
                    'name': profile.name,
                    'details': details,
                }
            )


@app.task(name="send_coverage_reminder")
def send_coverage_reminder():
    """
    Sends reminder to projects where coverage data is missing or not complete
    """
    from project.models import Project
    from user.models import UserProfile

    keys_to_check = ['clients', 'facilities', 'health_workers']

    projects_need_reminder = []

    # check where national level deployment is filled
    projects = Project.objects.published_only().national_level_deployment_not_empty()
    for project in projects:
        deployment = project.data['national_level_deployment']
        if all(deployment[key] == 0 for key in keys_to_check):
            projects_need_reminder.append(project.id)

    # check where coverage is filled
    projects = Project.objects.published_only().coverage_not_empty()
    for project in projects:
        coverage = project.data['coverage']
        for district_data in coverage:
            if all(district_data[key] == 0 for key in keys_to_check):
                projects_need_reminder.append(project.id)
                break

    projects_to_remind = Project.objects.filter(id__in=projects_need_reminder)

    # where both keys are missing
    projects_to_remind |= Project.objects.published_only().coverage_empty().national_level_deployment_empty()

    project_team_members = set(projects_to_remind.values_list('team', flat=True))

    for member in project_team_members:
        try:
            profile = UserProfile.objects.get(id=member)
        except UserProfile.DoesNotExist:  # pragma: no cover
            pass
        else:
            member_projects = [project for project in projects_to_remind.filter(team=member)]
            subject = _("Please set your project's coverage on the Digital Health Atlas")
            details = _('Coverage data is missing or is incomplete for the following project(s):')
            send_mail_wrapper(
                subject=subject,
                email_type='missing_data_common_template',
                to=profile.user.email,
                language=profile.language or settings.LANGUAGE_CODE,
                context={
                    'projects': member_projects,
                    'name': profile.name,
                    'details': details,
                }
            )
