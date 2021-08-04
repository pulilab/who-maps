from scheduler.celery import app
from django.db.models import Count
from datetime import datetime, timedelta
from django.db.models import F
import logging
from django.utils import timezone


@app.task(name='auditlog_update_user_data')
def update_auditlog_user_data_task(current_date=None):
    """
    Schedulable task to update user statistics
    Needs to run daily - collects yesterday's stats
    """
    from kpiexport.models import AuditLogUsers
    from user.models import UserProfile
    from country.models import Country

    if current_date is None:  # pragma: no cover
        current_date = timezone.now().date()

    def add_entry_to_data(entry, country, donor_id, log_date, attr_name):
        # get or create auditlog
        log_entry, _ = AuditLogUsers.objects.get_or_create(date=log_date, country=country)
        new_value = log_entry.__getattribute__(attr_name) + entry['id__count']
        log_entry.__setattr__(attr_name, new_value)
        # generate total data
        if not log_entry.data.get('total'):
            log_entry.data['total'] = dict()
        if not log_entry.data['total'].get(entry['account_type']):
            log_entry.data['total'][entry['account_type']] = dict(active=0, registered=0)
        # Generate data structure if needed
        if not log_entry.data.get(donor_id):
            log_entry.data[donor_id] = dict(total=dict(active=0, registered=0))
        if not log_entry.data[donor_id].get(entry['account_type']):
            log_entry.data[donor_id][entry['account_type']] = dict(active=0, registered=0)
        log_entry.data[donor_id][entry['account_type']][attr_name] += entry['id__count']
        log_entry.data[donor_id]['total'][attr_name] += entry['id__count']
        log_entry.data['total'][entry['account_type']][attr_name] += entry['id__count']
        log_entry.save()

    date = current_date - timedelta(days=1)
    log_date = datetime(date.year, date.month, 1).date()
    qs_visitors = UserProfile.objects.filter(user__last_login__date=date). \
        filter(country__isnull=False). \
        values('country', 'account_type', 'donor').annotate(Count("id")).order_by()
    for entry in qs_visitors:
        try:
            country = Country.objects.get(pk=entry['country'])
            donor_id = str(entry['donor'])
            add_entry_to_data(entry, country, donor_id, log_date, 'active')
            add_entry_to_data(entry, None, donor_id, log_date, 'active')
        except Country.DoesNotExist:  # pragma: no cover
            logging.warning(f'Country with this ID does not exist: {entry["country"]}')

    qs_registered = UserProfile.objects.filter(user__date_joined__date=date). \
        filter(country__isnull=False).filter(user__last_login__date__isnull=False). \
        values('country', 'account_type', 'donor').annotate(Count("id")).order_by()
    for entry in qs_registered:
        try:
            country = Country.objects.get(pk=entry['country'])
            donor_id = str(entry['donor'])
            add_entry_to_data(entry, country, donor_id, log_date, 'registered')
            add_entry_to_data(entry, None, donor_id, log_date, 'registered')
        except Country.DoesNotExist:  # pragma: no cover
            logging.warning(f'Country with this ID does not exist: {entry["country"]}')


@app.task(name='auditlog_update_token_data')
def update_auditlog_token_data_task(current_date=None):
    """
    Schedulable task to update token statistics
    Needs to run daily - collects yesterday's stats
    """
    from rest_framework.authtoken.models import Token
    from kpiexport.models import AuditLogTokens
    from country.models import Country

    if current_date is None:  # pragma: no cover
        current_date = timezone.now().date()

    def add_entry_to_data(entry, country, donor_id, log_date):
        # get or create auditlog
        log_entry, _ = AuditLogTokens.objects.get_or_create(date=log_date, country=country)
        log_entry.tokens += entry['user_id__count']
        # generate total data
        if not log_entry.data.get('total'):
            log_entry.data['total'] = dict()
        if not log_entry.data['total'].get(entry['account_type']):
            log_entry.data['total'][entry['account_type']] = 0
        # Generate data structure if needed
        if not log_entry.data.get(donor_id):
            log_entry.data[donor_id] = dict(total=0)
        if not log_entry.data[donor_id].get(entry['account_type']):
            log_entry.data[donor_id][entry['account_type']] = 0
        log_entry.data[donor_id][entry['account_type']] += entry['user_id__count']
        log_entry.data[donor_id]['total'] += entry['user_id__count']
        log_entry.data['total'][entry['account_type']] += entry['user_id__count']
        log_entry.save()

    date = current_date - timedelta(days=1)
    log_date = datetime(date.year, date.month, 1).date()
    qs = Token.objects.filter(created__date=date).filter(user__userprofile__isnull=False). \
        filter(user__userprofile__country__isnull=False). \
        annotate(country=F('user__userprofile__country')). \
        annotate(donor=F('user__userprofile__donor')). \
        annotate(account_type=F('user__userprofile__account_type')). \
        values('country', 'donor', 'account_type').annotate(Count("user_id")).order_by()
    for entry in qs:
        try:
            country = Country.objects.get(pk=entry['country'])
            donor_id = str(entry['donor'])
            add_entry_to_data(entry, country, donor_id, log_date)
            add_entry_to_data(entry, None, donor_id, log_date)
        except Country.DoesNotExist:  # pragma: no cover
            logging.warning(f'Country with this ID does not exist: {entry["country"]}')


@app.task(name='auditlog_update_project_status_data')
def update_auditlog_project_status_data_task(current_date=None):  # pragma: no cover
    """
    Schedulable task to update project status statistics
    Needs to run daily - collects yesterday's stats
    """
    from kpiexport.models import AuditLogProjectStatus
    from kpiexport.utils import project_status_change_sum
    from project.models import Project, ProjectVersion
    from django.db.models import IntegerField, CharField
    from country.models import Country

    from django.contrib.postgres.fields.jsonb import KeyTextTransform
    from django.db.models.functions import Cast
    import json

    if current_date is None:
        current_date = timezone.now().date()

    def add_stats_to_data(entry, donor_id, status_change, project_id):
        if not entry.data.get(donor_id):
            entry.data[donor_id] = dict(
                published=[],
                unpublished=[],
                ready_to_publish=[],
                to_delete=[],
                draft=[],
                growth=0
            )
        if status_change.published and project_id not in set(entry.data[donor_id]['published']):
            entry.data[donor_id]['published'].append(project_id)
        if status_change.unpublished and project_id not in set(entry.data[donor_id]['unpublished']):
            entry.data[donor_id]['unpublished'].append(project_id)
        if status_change.ready_to_publish and project_id not in set(entry.data[donor_id]['ready_to_publish']):
            entry.data[donor_id]['ready_to_publish'].append(project_id)
        if status_change.to_delete and project_id not in set(entry.data[donor_id]['to_delete']):
            entry.data[donor_id]['to_delete'].append(project_id)
        if status_change.draft and project_id not in set(entry.data[donor_id]['draft']):
            entry.data[donor_id]['draft'].append(project_id)

    def add_growth_to_data(entry, donor_id):
        if not entry.data.get(donor_id):
            entry.data[donor_id] = dict(
                published=[],
                unpublished=[],
                ready_to_publish=[],
                to_delete=[],
                draft=[],
                growth=0
            )
        entry.data[donor_id]['growth'] += 1

    date = current_date - timedelta(days=1)
    log_date = datetime(date.year, date.month, 1).date()
    qs = ProjectVersion.objects.filter(created__date=date). \
        annotate(country=Cast(KeyTextTransform('country', 'data'),
                              output_field=IntegerField())). \
        annotate(donors=Cast(KeyTextTransform('donors', 'data'),
                             output_field=CharField())). \
        exclude(country__isnull=True). \
        exclude(donors="[]"). \
        order_by('project'). \
        distinct('project')
    qs_growth = Project.objects.filter(created__date=date)
    if qs.count() > 0 or qs_growth.count() > 0:
        log_entry_global, _ = AuditLogProjectStatus.objects.get_or_create(date=log_date, country=None)
    else:
        return
    for entry in qs:
        country = Country.objects.get(id=entry.country)
        log_entry, _ = AuditLogProjectStatus.objects.get_or_create(date=log_date, country=country)

        status_change = project_status_change_sum(date=date, project=entry.project, country=country)
        donors = json.loads(entry.donors)
        if status_change.published:
            if entry.project.id not in set(log_entry.published):
                log_entry.published.append(entry.project.id)
            if entry.project.id not in set(log_entry_global.published):
                log_entry_global.published.append(entry.project.id)
        if status_change.unpublished:
            if entry.project.id not in set(log_entry.unpublished):
                log_entry.unpublished.append(entry.project.id)
            if entry.project.id not in set(log_entry_global.unpublished):
                log_entry_global.unpublished.append(entry.project.id)
        if status_change.ready_to_publish:
            if entry.project.id not in set(log_entry.ready_to_publish):
                log_entry.ready_to_publish.append(entry.project.id)
            if entry.project.id not in set(log_entry_global.ready_to_publish):
                log_entry_global.ready_to_publish.append(entry.project.id)
        if status_change.to_delete:
            if entry.project.id not in set(log_entry.to_delete):
                log_entry.to_delete.append(entry.project.id)
            if entry.project.id not in set(log_entry_global.to_delete):
                log_entry_global.to_delete.append(entry.project.id)
        if status_change.draft:
            if entry.project.id not in set(log_entry.draft):
                log_entry.draft.append(entry.project.id)
            if entry.project.id not in set(log_entry_global.draft):
                log_entry_global.draft.append(entry.project.id)

        for donor in donors:
            add_stats_to_data(log_entry, donor, status_change, entry.project.id)
            add_stats_to_data(log_entry_global, donor, status_change, entry.project.id)
        log_entry.save()
        log_entry_global.save()

    for entry in qs_growth:
        if entry.public_id:
            country_id = entry.data.get('country')
            donors = entry.data.get('donors')
        else:
            country_id = entry.draft.get('country')
            donors = entry.draft.get('donors')
        if country_id is None:
            continue
        try:
            country = Country.objects.get(id=country_id)
        except Country.DoesNotExist:
            logger = logging.getLogger(__name__)
            logger.error(f'Invalid country ID set in project {entry.project.id}: {country_id}')
        log_entry, _ = AuditLogProjectStatus.objects.get_or_create(date=log_date, country=country)
        log_entry.growth += 1
        log_entry_global.growth += 1
        if donors is None:
            continue
        for donor in donors:
            add_growth_to_data(log_entry, donor)
            add_growth_to_data(log_entry_global, donor)
        log_entry.save()
        log_entry_global.save()


@app.task(name='auditlog_update_project_stages_data')
def update_auditlog_project_stages_data_task(current_date=None):
    """
    Schedulable task to update project stages statistics
    Needs to run daily - overwrites this month's tasks
    """
    from project.models import ProjectVersion
    from kpiexport.models import AuditLogProjectStages
    from country.models import Country

    if current_date is None:  # pragma: no cover
        current_date = timezone.now().date()

    def get_latest_stage(item: ProjectVersion):
        if 'stages' not in item.data or len(item.data['stages']) == 0:  # pragma: no cover
            return None
        return sorted(item.data['stages'], key=lambda x: x['date'], reverse=True)[0]

    def add_entry_to_data(entry: ProjectVersion, country: Country, log_date):
        project_stage = get_latest_stage(entry)
        if not project_stage:  # pragma: no cover
            return
        stage_id_str = str(project_stage['id'])
        # get or create auditlog
        log_entry, _ = AuditLogProjectStages.objects.get_or_create(date=log_date, country=country)
        # generate total stages data - we track projects by ID
        if stage_id_str not in log_entry.stages:
            log_entry.stages[stage_id_str] = []
        stages_list = log_entry.stages[stage_id_str]
        stages_list.append(entry.project.id)
        log_entry.stages[stage_id_str] = list(set(stages_list))
        # Generate by-donor data
        donors = entry.data.get('donors')
        # Generate data structure if needed
        for donor_id in donors:
            donor_str = str(donor_id)
            if donor_str not in log_entry.data:
                log_entry.data[donor_str] = {}
            if stage_id_str not in log_entry.data[donor_str]:
                log_entry.data[donor_str][stage_id_str] = []
            donor_stages = log_entry.data[donor_str][stage_id_str]
            donor_stages.append(entry.project.id)
            log_entry.data[donor_str][stage_id_str] = list(set(donor_stages))
        log_entry.save()

    date = current_date - timedelta(days=1)
    log_date = datetime(date.year, date.month, 1).date()
    qs = ProjectVersion.objects.filter(created__date=date)

    for entry in qs:
        country_id = entry.data.get('country')
        if not country_id:  # pragma: no cover
            continue
        try:
            country = Country.objects.get(pk=country_id)
            add_entry_to_data(entry, country, log_date)
            add_entry_to_data(entry, None, log_date)
        except Country.DoesNotExist:  # pragma: no cover
            logging.warning(f'Country with this ID does not exist: {country_id}')
