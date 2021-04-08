from scheduler.celery import app
from django.db.models import Count
from datetime import datetime, date, timedelta


@app.task(name='auditlog_update_user_data')
def update_auditlog_user_data_task(current_date=date.today()):
    """
    Schedulable task to update user statistics
    Needs to run daily - collects yesterday's stats
    """
    from kpiexport.models import AuditLogUsers
    from user.models import UserProfile
    from country.models import Country
    date = current_date - timedelta(days=1)
    log_date = datetime(date.year, date.month, 1).date()
    # Fill visitors
    qs_visitors = UserProfile.objects.filter(user__last_login__date=date).\
        values('country', 'account_type', 'donor').annotate(Count("id")).order_by()
    for entry in qs_visitors:
        country = Country.objects.get(pk=entry['country'])
        donor_id = str(entry['donor'])
        log_entry, _ = AuditLogUsers.objects.get_or_create(date=log_date, country=country)
        log_entry.active += entry['id__count']

        # Generate data structure if needed
        if not log_entry.data.get(donor_id):
            log_entry.data[donor_id] = {}
        if not log_entry.data[donor_id].get(entry['account_type']):
            log_entry.data[donor_id][entry['account_type']] = {'active': 0, 'registered': 0}
        log_entry.data[donor_id][entry['account_type']]['active'] += entry['id__count']

        log_entry.save()

    qs_registered = UserProfile.objects.filter(user__date_joined__date=date).\
        values('country', 'account_type', 'donor').annotate(Count("id")).order_by()
    for entry in qs_registered:
        country = Country.objects.get(pk=entry['country'])
        donor_id = str(entry['donor'])
        log_entry, _ = AuditLogUsers.objects.get_or_create(date=log_date, country=country)
        log_entry.registered += entry['id__count']
        # Generate data structure if needed
        if not log_entry.data.get(donor_id):
            log_entry.data[donor_id] = {}
        if not log_entry.data[donor_id].get(entry['account_type']):
            log_entry.data[donor_id][entry['account_type']] = {'active': 0, 'registered': 0}
        log_entry.data[donor_id][entry['account_type']]['registered'] += entry['id__count']

        log_entry.save()

