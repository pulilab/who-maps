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
    from country.models import Country, Donor
    from copy import deepcopy

    if current_date is None:  # pragma: no cover
        current_date = timezone.now().date()

    def create_empty_log_entries(empty_gen_date):
        """
        Creates empty log entries for all countries and donors for all dates
        """

        def fill_data_for_donors(log_entry, donor_ids):
            choices = [x[0] for x in UserProfile.ACCOUNT_TYPE_CHOICES]
            choices.append('total')
            donor_ids = set(donor_ids)
            donor_ids.add('total')
            stat_dict = {c: {"active": 0, "registered": 0} for c in choices}
            data_dict = {d_id: stat_dict for d_id in donor_ids}
            data_dict['total'] = deepcopy(data_dict['total'])
            data_dict['total'].pop('total')
            log_entry.data = data_dict
            log_entry.save()

        log_global, created = AuditLogUsers.objects.get_or_create(date=empty_gen_date, country=None)
        if created:
            donors = list(Donor.objects.all().values_list('id', flat=True))
            # fill global entry
            fill_data_for_donors(log_global, donors)
            # fill country entries
            countries = Country.objects.all()
            for country in countries:
                log, created = AuditLogUsers.objects.get_or_create(date=empty_gen_date, country=country)
                if created:
                    fill_data_for_donors(log, donors)

    def add_entry_to_data(entry, country, donor_id, log_date, attr_name):
        # get or create auditlog
        log_entry, _ = AuditLogUsers.objects.get_or_create(date=log_date, country=country)
        new_value = log_entry.__getattribute__(attr_name) + entry['id__count']
        log_entry.__setattr__(attr_name, new_value)
        # generate total data
        if not log_entry.data.get('total'):  # pragma: no cover
            log_entry.data['total'] = dict()
        if not log_entry.data['total'].get(entry['account_type']):  # pragma: no cover
            log_entry.data['total'][entry['account_type']] = dict(active=0, registered=0)
        # Generate data structure if needed
        if not log_entry.data.get(donor_id):  # pragma: no cover
            log_entry.data[donor_id] = dict(total=dict(active=0, registered=0))
        if not log_entry.data[donor_id].get(entry['account_type']):  # pragma: no cover
            log_entry.data[donor_id][entry['account_type']] = dict(active=0, registered=0)
        log_entry.data[donor_id][entry['account_type']][attr_name] += entry['id__count']
        log_entry.data[donor_id]['total'][attr_name] += entry['id__count']
        log_entry.data['total'][entry['account_type']][attr_name] += entry['id__count']
        log_entry.save()

    date = current_date - timedelta(days=1)
    log_date = datetime(date.year, date.month, 1).date()
    # fill relevant logs with empty data if not existing
    create_empty_log_entries(log_date)
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
    from country.models import Country, Donor
    from user.models import UserProfile
    from copy import deepcopy

    if current_date is None:  # pragma: no cover
        current_date = timezone.now().date()

    def create_empty_log_entries(empty_gen_date):
        """
        Creates empty log entries for all countries and donors for all dates
        """

        def fill_data_for_donors(log_entry, donor_ids):
            choices = [x[0] for x in UserProfile.ACCOUNT_TYPE_CHOICES]
            choices.append('total')
            donor_ids = set(donor_ids)
            donor_ids.add('total')
            stat_dict = {c: 0 for c in choices}
            data_dict = {d_id: stat_dict for d_id in donor_ids}
            data_dict['total'] = deepcopy(data_dict['total'])
            data_dict['total'].pop('total')
            log_entry.data = data_dict
            log_entry.save()

        log_global, created = AuditLogTokens.objects.get_or_create(date=empty_gen_date, country=None)
        if created:
            donors = list(Donor.objects.all().values_list('id', flat=True))
            # fill global entry
            fill_data_for_donors(log_global, donors)
            # fill country entries
            countries = Country.objects.all()
            for country in countries:
                log, created = AuditLogTokens.objects.get_or_create(date=empty_gen_date, country=country)
                if created:
                    fill_data_for_donors(log, donors)

    def add_entry_to_data(entry, country, donor_id, log_date):
        # get or create auditlog
        log_entry, _ = AuditLogTokens.objects.get_or_create(date=log_date, country=country)
        log_entry.tokens += entry['user_id__count']
        # generate total data
        if not log_entry.data.get('total'):  # pragma: no cover
            log_entry.data['total'] = dict()
        if not log_entry.data['total'].get(entry['account_type']):  # pragma: no cover
            log_entry.data['total'][entry['account_type']] = 0
        # Generate data structure if needed
        if not log_entry.data.get(donor_id):  # pragma: no cover
            log_entry.data[donor_id] = dict(total=0)
        if not log_entry.data[donor_id].get(entry['account_type']):
            log_entry.data[donor_id][entry['account_type']] = 0
        log_entry.data[donor_id][entry['account_type']] += entry['user_id__count']
        log_entry.data[donor_id]['total'] += entry['user_id__count']
        log_entry.data['total'][entry['account_type']] += entry['user_id__count']
        log_entry.save()

    date = current_date - timedelta(days=1)
    log_date = datetime(date.year, date.month, 1).date()
    create_empty_log_entries(log_date)
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
    from country.models import Country, Donor

    from django.contrib.postgres.fields.jsonb import KeyTextTransform
    from django.db.models.functions import Cast
    import json

    def create_empty_log_entries(empty_gen_date):
        """
        Creates empty log entries for all countries and donors for all dates
        """

        def fill_data_for_donors(log_entry, donor_ids):
            stats = \
                {
                    "draft": [],
                    "growth": 0,
                    "published": [],
                    "to_delete": [],
                    "unpublished": [],
                    "ready_to_publish": []
                }
            stats_dict = {donor_id: stats for donor_id in donor_ids}
            log_entry.data = stats_dict
            log_entry.save()

        log_global, created = AuditLogProjectStatus.objects.get_or_create(date=empty_gen_date, country=None)
        if created:
            donors = list(Donor.objects.all().values_list('id', flat=True))
            fill_data_for_donors(log_global, donors)
            # fill country entries
            countries = Country.objects.all()
            for country in countries:
                log, created = AuditLogProjectStatus.objects.get_or_create(date=empty_gen_date, country=country)
                if created:
                    fill_data_for_donors(log, donors)

    if current_date is None:
        current_date = timezone.now().date()

    def add_stats_to_data(entry, donor_id, status_change, project_id):
        if not entry.data.get(donor_id):  # pragma: no cover
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
        if status_change.new:
            entry.data[donor_id]['growth'] += 1

    date = current_date - timedelta(days=1)
    log_date = datetime(date.year, date.month, 1).date()
    create_empty_log_entries(log_date)
    qs = ProjectVersion.objects.filter(created__date=date). \
        annotate(country=Cast(KeyTextTransform('country', 'data'),
                              output_field=IntegerField())). \
        annotate(donors=Cast(KeyTextTransform('donors', 'data'),
                             output_field=CharField())). \
        order_by('project'). \
        distinct('project')

    log_entry_global, _ = AuditLogProjectStatus.objects.get_or_create(date=log_date, country=None)
    for entry in qs:
        country = Country.objects.get(id=entry.country) if entry.country else None
        log_entry, _ = AuditLogProjectStatus.objects.get_or_create(date=log_date, country=country)
        status_change = project_status_change_sum(date=date, project=entry.project, country=country)

        donors = json.loads(entry.donors) if entry.donors else []
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
        if status_change.new:
            log_entry.growth += 1
            log_entry_global.growth += 1

        for donor in donors:
            add_stats_to_data(log_entry, donor, status_change, entry.project.id)
            add_stats_to_data(log_entry_global, donor, status_change, entry.project.id)
        log_entry.save()
        log_entry_global.save()


@app.task(name='auditlog_update_project_stages_data')
def update_auditlog_project_stages_data_task(current_date=None):
    """
    Schedulable task to update project stages statistics
    Needs to run daily - overwrites this month's tasks
    """
    from project.models import ProjectVersion, Stage
    from kpiexport.models import AuditLogProjectStages
    from country.models import Country, Donor

    def create_empty_log_entries(empty_gen_date):
        """
        Creates empty log entries for all countries and donors for all dates
        """

        def fill_data_for_donors(log_entry, donor_ids):
            stages_list = list(Stage.objects.all().values_list('id', flat=True))
            stages_dict = {s_id: [] for s_id in stages_list}
            data_dict = {d_id: stages_dict for d_id in donor_ids}
            log_entry.data = data_dict
            log_entry.stages = stages_dict
            log_entry.save()

        log_global, created = AuditLogProjectStages.objects.get_or_create(date=empty_gen_date, country=None)
        if created:
            donors = list(Donor.objects.all().values_list('id', flat=True))
            fill_data_for_donors(log_global, donors)
            # fill country entries
            countries = Country.objects.all()
            for country in countries:
                log, created = AuditLogProjectStages.objects.get_or_create(date=empty_gen_date, country=country)
                if created:
                    fill_data_for_donors(log, donors)

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
        if stage_id_str not in log_entry.stages:  # pragma: no cover
            log_entry.stages[stage_id_str] = []
        stages_list = log_entry.stages[stage_id_str]
        stages_list.append(entry.project.id)
        log_entry.stages[stage_id_str] = list(set(stages_list))
        # Generate by-donor data
        donors = entry.data.get('donors')
        # Generate data structure if needed
        for donor_id in donors:
            donor_str = str(donor_id)
            if donor_str not in log_entry.data:  # pragma: no cover
                log_entry.data[donor_str] = {}
            if stage_id_str not in log_entry.data[donor_str]:  # pragma: no cover
                log_entry.data[donor_str][stage_id_str] = []
            donor_stages = log_entry.data[donor_str][stage_id_str]
            donor_stages.append(entry.project.id)
            log_entry.data[donor_str][stage_id_str] = list(set(donor_stages))
        log_entry.save()

    date = current_date - timedelta(days=1)
    log_date = datetime(date.year, date.month, 1).date()
    create_empty_log_entries(log_date)
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
