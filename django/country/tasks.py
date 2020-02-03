from django.core.management import call_command

from scheduler.celery import app


@app.task(name='update_gdhi_data_task')
def update_gdhi_data_task(country_code, override):
    call_command('gdhi', country_code=country_code, override=override)


@app.task(name="send_new_custom_country_question_digest")
def send_new_custom_country_question_digest():
    """
    Sends daily digest to all project's team members that a new custom question has been asked by the country
    """
    from country.models import CountryCustomQuestion
    from search.models import ProjectSearch
    from user.models import UserProfile

    questions = CountryCustomQuestion.objects.filter(
        created__gt=timezone.now() - timezone.timedelta(hours=settings.NEW_QUESTION_DIGEST_PERIOD))\
        .select_related('country')
    countries = set(questions.values_list('country', flat=True))
