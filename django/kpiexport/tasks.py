from scheduler.celery import app
from django.db.models import Count
from datetime import datetime, date, timedelta
import logging


@app.task(name='auditlog_update_user_data')
def update_auditlog_user_data_task(current_date=date.today()):
    """
    Schedulable task to update user statistics
    Needs to run daily - collects yesterday's stats
    """
    from kpiexport.models import AuditLogUsers
    from user.models import UserProfile
    from country.models import Country

    def add_entry_to_data(entry, country, donor_id, log_date, attr_name):
        # get or create auditlog
        log_entry, _ = AuditLogUsers.objects.get_or_create(date=log_date, country=country)
        new_value = log_entry.__getattribute__(attr_name) + entry['id__count']
        log_entry.__setattr__(attr_name, new_value)
        # generate total data
        if not log_entry.data.get('total'):
            log_entry.data['total'] = dict()
        # Generate data structure if needed
        if not log_entry.data.get(donor_id):
            # TODO: generate total data per donor!
            log_entry.data[donor_id] = dict(total=dict(active=0, registered=0))
        if not log_entry.data[donor_id].get(entry['account_type']):
            log_entry.data[donor_id][entry['account_type']] = dict(active=0, registered=0)
        log_entry.data[donor_id][entry['account_type']][attr_name] += entry['id__count']

        log_entry.save()

    country_global = Country.objects.get(name='Global')
    date = current_date - timedelta(days=1)
    log_date = datetime(date.year, date.month, 1).date()
    qs_visitors = UserProfile.objects.filter(user__last_login__date=date).\
        filter(country__isnull=False).\
        values('country', 'account_type', 'donor').annotate(Count("id")).order_by()
    for entry in qs_visitors:
        try:
            country = Country.objects.get(pk=entry['country'])
            donor_id = str(entry['donor'])
            add_entry_to_data(entry, country, donor_id, log_date, 'active')
            add_entry_to_data(entry, country_global, donor_id, log_date, 'active')
        except Country.DoesNotExist:  # pragma: no cover
            logging.warning(f'Country with this ID does not exist: {entry["country"]}')

    qs_registered = UserProfile.objects.filter(user__date_joined__date=date).\
        filter(country__isnull=False).\
        values('country', 'account_type', 'donor').annotate(Count("id")).order_by()
    for entry in qs_registered:
        try:
            country = Country.objects.get(pk=entry['country'])
            donor_id = str(entry['donor'])
            add_entry_to_data(entry, country, donor_id, log_date, 'registered')
            add_entry_to_data(entry, country_global, donor_id, log_date, 'registered')
        except Country.DoesNotExist:  # pragma: no cover
            logging.warning(f'Country with this ID does not exist: {entry["country"]}')
