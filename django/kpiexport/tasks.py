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
    from project.models import ProjectVersion
    from django.db.models import IntegerField, CharField
    from country.models import Country, Donor

    from django.db.models.fields.json import KeyTextTransform
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
                    "archived": [],
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
                archived=[],
                ready_to_publish=[],
                to_delete=[],
                draft=[],
                growth=0
            )
        if status_change.published and project_id not in set(entry.data[donor_id]['published']):
            entry.data[donor_id]['published'].append(project_id)
        if status_change.unpublished and project_id not in set(entry.data[donor_id]['unpublished']):
            entry.data[donor_id]['unpublished'].append(project_id)
        if status_change.archived and project_id not in set(entry.data[donor_id]['archived']):
            entry.data[donor_id]['archived'].append(project_id)
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
        order_by('project', '-modified'). \
        distinct('project')

    log_entry_global, _ = AuditLogProjectStatus.objects.get_or_create(date=log_date, country=None)
    for entry in qs:
        country = Country.objects.get(id=entry.country) if entry.country else None
        log_entry, _ = AuditLogProjectStatus.objects.get_or_create(date=log_date, country=country)
        status_change = project_status_change_sum(date=date, project=entry.project, country=country)

        donors = json.loads(entry.donors) if entry.donors else []
        log_entries = {log_entry, log_entry_global}  # if country is None, this will only have 1 item

        for current_entry in log_entries:
            if status_change.published:
                if entry.project.id not in set(current_entry.published):
                    current_entry.published.append(entry.project.id)
            if status_change.unpublished:
                if entry.project.id not in set(current_entry.unpublished):
                    current_entry.unpublished.append(entry.project.id)
            if status_change.archived:
                if entry.project.id not in set(current_entry.archived):
                    current_entry.archived.append(entry.project.id)
            if status_change.ready_to_publish:
                if entry.project.id not in set(current_entry.ready_to_publish):
                    current_entry.ready_to_publish.append(entry.project.id)
            if status_change.to_delete:
                if entry.project.id not in set(current_entry.to_delete):
                    current_entry.to_delete.append(entry.project.id)
            if status_change.draft:
                if entry.project.id not in set(current_entry.draft):
                    current_entry.draft.append(entry.project.id)
            if status_change.new:
                current_entry.growth += 1

            for donor in donors:
                add_stats_to_data(current_entry, donor, status_change, entry.project.id)

            current_entry.save()


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
            stages_list = set(stages_list)
            stages_list.add('no_data')
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
            stage_id_str = 'no_data'
        else:
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
    qs = ProjectVersion.objects.filter(created__date=date, published=True)

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


@app.task(name='auditlog_update_data_standards')
def update_auditlog_data_standards_task(current_date=None):
    """
    Schedulable task to update project stages statistics
    Needs to run daily - overwrites this month's tasks
    """
    from project.models import ProjectVersion
    from kpiexport.models import AuditLogDataStandards
    from country.models import Country

    def add_entry_to_data(entry: ProjectVersion, country: Country, log_date):
        standards_data = entry.data.get('interoperability_standards', ['no_data'])
        # get or create auditlog
        log_entry, _ = AuditLogDataStandards.objects.get_or_create(date=log_date, country=country)
        # generate total standards data - we track projects by ID
        for std_id in standards_data:
            std_list = log_entry.standards.get(str(std_id), [])
            std_list.append(entry.project.id)
            log_entry.standards[str(std_id)] = list(set(std_list))
            # Generate by-donor data
            donors = entry.data.get('donors')
            # Generate data structure if needed
            for donor_id in donors:
                donor_str = str(donor_id)
                if donor_str not in log_entry.data:  # pragma: no cover
                    log_entry.data[donor_str] = {}
                donor_stds = log_entry.data[donor_str].get(str(std_id), [])
                donor_stds.append(entry.project.id)
                log_entry.data[donor_str][str(std_id)] = list(set(donor_stds))
        log_entry.save()

    if current_date is None:  # pragma: no cover
        current_date = timezone.now().date()

    date = current_date - timedelta(days=1)
    log_date = datetime(date.year, date.month, 1).date()
    qs = ProjectVersion.objects.filter(created__date=date, published=True)

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


@app.task(name='auditlog_update_hfa')
def update_auditlog_hfa_task(current_date=None):
    """
    Schedulable task to update project HFA statistics
    Needs to run daily - overwrites this month's tasks
    """
    from project.models import ProjectVersion, HealthCategory, HealthFocusArea
    from kpiexport.models import AuditLogHFA, AuditLogHealthCategories
    from country.models import Country, Donor

    def create_empty_category_entries(empty_gen_date):
        """
        Creates empty log entries for all countries and donors for all dates
        """
        def init_category_data(log_entry, donor_ids):
            category_dict = {cat_id: [] for cat_id in HealthCategory.objects.all().values_list('id', flat=True)}
            data_dict = {d_id: category_dict for d_id in donor_ids}
            log_entry.data = data_dict
            log_entry.categories = category_dict
            log_entry.save()

        log_global, created = AuditLogHealthCategories.objects.get_or_create(date=empty_gen_date, country=None)
        if created:
            donors = list(Donor.objects.all().values_list('id', flat=True))
            init_category_data(log_global, donors)
            # fill country entries
            for country in Country.objects.all():
                log, created = AuditLogHealthCategories.objects.get_or_create(date=empty_gen_date, country=country)
                if created:
                    init_category_data(log, donors)

    def create_empty_hfa_entries(empty_gen_date):
        """
        Creates empty log entries for all countries and donors for all dates
        """
        def init_hfa_data(log_entry, donor_ids):
            hfa_dict = {}
            for cat_id in HealthCategory.objects.all().values_list('id', flat=True):
                hfa_by_category = HealthFocusArea.objects.filter(health_category=cat_id).values_list('id', flat=True)
                hfa_dict[cat_id] = {hfa_id: [] for hfa_id in hfa_by_category}

            data_dict = {d_id: hfa_dict for d_id in donor_ids}
            log_entry.data = data_dict
            log_entry.hfa = hfa_dict
            log_entry.save()

        log_global, created = AuditLogHFA.objects.get_or_create(date=empty_gen_date, country=None)
        if created:
            donors = list(Donor.objects.all().values_list('id', flat=True))
            init_hfa_data(log_global, donors)
            # fill country entries
            for country in Country.objects.all():
                log, created = AuditLogHFA.objects.get_or_create(date=empty_gen_date, country=country)
                if created:
                    init_hfa_data(log, donors)

    def add_entry_data(entry: ProjectVersion, country: Country, log_date):
        hfa_data = entry.data.get('health_focus_areas', [])
        donors = entry.data.get('donors')
        # get or create auditlog
        log_entry, _ = AuditLogHFA.objects.get_or_create(date=log_date, country=country)
        cat_entry, _ = AuditLogHealthCategories.objects.get_or_create(date=log_date, country=country)
        # generate total standards data - we track projects by ID
        for hfa_id in hfa_data:
            try:
                category_id = HealthFocusArea.objects.get(id=hfa_id).health_category.id
            except HealthFocusArea.DoesNotExist:  # pragma: no cover
                continue
            except ValueError:  # pragma: no cover
                continue

            # Fill categories
            cat_list = cat_entry.categories.get(str(category_id), [])
            cat_list.append(entry.project.id)
            cat_entry.categories[str(category_id)] = list(set(cat_list))
            # Generate data structure if needed
            for donor_id in donors:
                donor_str = str(donor_id)
                if donor_str not in cat_entry.data:  # pragma: no cover
                    cat_entry.data[donor_str] = {}
                donor_cats = cat_entry.data[donor_str].get(str(category_id), [])
                donor_cats.append(entry.project.id)
                cat_entry.data[donor_str][str(category_id)] = list(set(donor_cats))

            # Fill HFAs
            hfa_dict = log_entry.hfa.get(str(category_id))
            hfa_list = hfa_dict.get(str(hfa_id), [])
            hfa_list.append(entry.project.id)
            log_entry.hfa[str(category_id)][str(hfa_id)] = list(set(hfa_list))
            # Generate data structure if needed
            for donor_id in donors:
                donor_str = str(donor_id)
                if donor_str not in log_entry.data:  # pragma: no cover
                    log_entry.data[donor_str] = {}
                donor_cats = log_entry.data[donor_str].get(str(category_id))
                donor_hfa = donor_cats.get(str(hfa_id), [])
                donor_hfa.append(entry.project.id)
                log_entry.data[donor_str][str(category_id)][str(hfa_id)] = list(set(donor_hfa))
        cat_entry.save()
        log_entry.save()

    if current_date is None:  # pragma: no cover
        current_date = timezone.now().date()

    date = current_date - timedelta(days=1)
    log_date = datetime(date.year, date.month, 1).date()
    create_empty_category_entries(log_date)
    create_empty_hfa_entries(log_date)
    qs = ProjectVersion.objects.filter(created__date=date, published=True)

    for entry in qs:
        country_id = entry.data.get('country')
        if not country_id:  # pragma: no cover
            continue
        try:
            country = Country.objects.get(pk=country_id)
            add_entry_data(entry, country, log_date)
            add_entry_data(entry, None, log_date)
        except Country.DoesNotExist:  # pragma: no cover
            logging.warning(f'Country with this ID does not exist: {country_id}')
