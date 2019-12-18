from django.core.management import call_command

from scheduler.celery import app


@app.task(name='update_gdhi_data_task')
def update_gdhi_data_task(country_code, override):
    call_command('gdhi', country_code=country_code, override=override)
