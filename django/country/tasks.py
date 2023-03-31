from django.conf import settings
from django.core.management import call_command
from django.utils import timezone
from django.utils.translation import gettext_lazy as _

from core.utils import send_mail_wrapper
from scheduler.celery import app


@app.task(name='update_gdhi_data_task')
def update_gdhi_data_task(country_code, override):
    call_command('gdhi', country_code=country_code, override=override)


@app.task(name="send_new_custom_country_question_digest")
def send_new_custom_country_question_digest():
    """
    Sends digest to all project's team members that a new custom question has been asked by the country
    """
    from country.models import CountryCustomQuestion
    from search.models import ProjectSearch
    from user.models import UserProfile

    questions = CountryCustomQuestion.objects.filter(
        created__gt=timezone.now() - timezone.timedelta(hours=settings.NEW_QUESTION_DIGEST_PERIOD))\
        .select_related('country')
    countries = set(questions.values_list('country', flat=True))

    for country_id in countries:
        country_questions = questions.filter(country_id=country_id)
        country = country_questions.first().country

        country_projects = ProjectSearch.objects.filter(country_id=country_id)
        country_project_team_members = set(country_projects.values_list('project__team', flat=True))

        for member in country_project_team_members:
            member_projects = [p.project for p in country_projects.filter(project__team=member)]
            try:
                member_profile = UserProfile.objects.get(id=member)
            except UserProfile.DoesNotExist:  # pragma: no cover
                pass
            else:
                subject = _(f"{country.name} has published new question(s) that relate to your project(s)")
                send_mail_wrapper(subject=subject,
                                  email_type='cc_digest_country',
                                  to=member_profile.user.email,
                                  language=member_profile.language or settings.LANGUAGE_CODE,
                                  context={
                                      'projects': member_projects,
                                      'questions': country_questions,
                                      'name': member_profile.name,
                                      'country_name': country.name
                                  })


@app.task(name="send_new_custom_donor_question_digest")
def send_new_custom_donor_question_digest():
    """
    Sends digest to all project's team members that a new custom question has been asked by the donor
    """
    from country.models import DonorCustomQuestion
    from search.models import ProjectSearch
    from user.models import UserProfile

    questions = DonorCustomQuestion.objects.filter(
        created__gt=timezone.now() - timezone.timedelta(hours=settings.NEW_QUESTION_DIGEST_PERIOD))\
        .select_related('donor')
    donors = set(questions.values_list('donor', flat=True))

    for donor_id in donors:
        donor_questions = questions.filter(donor_id=donor_id)
        donor = donor_questions.first().donor

        donor_projects = ProjectSearch.objects.filter(donors__overlap=[donor.id])
        donor_project_team_members = set(donor_projects.values_list('project__team', flat=True))

        for member in donor_project_team_members:
            member_projects = [p.project for p in donor_projects.filter(project__team=member)]
            try:
                member_profile = UserProfile.objects.get(id=member)
            except UserProfile.DoesNotExist:  # pragma: no cover
                pass
            else:
                subject = _(f"{donor.name} has published new question(s) that relate to your project(s)")
                send_mail_wrapper(subject=subject,
                                  email_type='cc_digest_donor',
                                  to=member_profile.user.email,
                                  language=member_profile.language or settings.LANGUAGE_CODE,
                                  context={
                                      'projects': member_projects,
                                      'questions': donor_questions,
                                      'name': member_profile.name,
                                      'donor_name': donor.name
                                  })
