import os

import datetime
import operator
from functools import reduce
from django.db.models import Count
from django.utils import timezone
from rest_framework.authtoken.models import Token

# from django.contrib.postgres.aggregates import ArrayAgg
from project.models import Project, ProjectApproval, ProjectImportV2
from country.models import Country
from user.models import User, UserProfile
from django.db.models import Q, F, IntegerField
from search.models import ProjectSearch

from django.contrib.postgres.fields.jsonb import KeyTextTransform
from django.db.models.functions import Cast
import pprint


def calc_user_data(country_code: str = None):
    # TODO: role filter, base date filter
    # Number of user-logins the past 7 days: ( grouped by user types, Implementer, Country Admin, Investor Admin…)
    # Number of user-logins the past 30 days:  ( grouped by user types, Implementer, Country Admin, Investor Admin…)
    # Number of user all time:  ( grouped by user types, Implementer, Country Admin, Investor Admin…)
    data = dict()
    # need to get humanly-readable stuff
    account_types = {x: y for x, y in UserProfile.ACCOUNT_TYPE_CHOICES}
    account_types[None] = 'Unknown'
    today = timezone.now() + datetime.timedelta(1)
    last_week = timezone.now() - datetime.timedelta(7)
    last_month = timezone.now() - datetime.timedelta(30)
    qs_users = User.objects.all()
    if country_code:
        country = Country.objects.get(country_code)
        qs_users = qs_users.filter(userprofile__country=country)

    qs_last_week = qs_users.filter(last_login__range=(last_week, today)). \
        annotate(account_type=F('userprofile__account_type')). \
        values('account_type').annotate(Count("id")).order_by()
    data['Last week logins'] = {account_types[x['account_type']]: x['id__count']
                                for x in qs_last_week}
    qs_last_month = qs_users.filter(last_login__range=(last_month, today)). \
        annotate(account_type=F('userprofile__account_type')). \
        values('account_type').annotate(Count("id")).order_by()
    data['Last month logins'] = {account_types[x['account_type']]: x['id__count']
                                 for x in qs_last_month}

    qs_all_time = qs_users.annotate(account_type=F('userprofile__account_type')). \
        values('account_type').annotate(Count("id")).order_by()
    data['All time logins'] = {account_types[x['account_type']]: x['id__count']
                               for x in qs_all_time}
    return data


def calc_country_data(country_code: str = None):
    # TODO: date_from and date_to filtering
    # Number of countries using MOH approval, number of projects in each, and group by count and %
    #    (pending, Approved,  Rejected)
    # Number of Projects where the Assessment process was started
    #    (any "score" was created on the assessment of project)
    data = dict()
    qs_countries = Country.objects.filter(project_approval=True)
    data['moh_countries'] = {
        'count': qs_countries.count(),
        'list': list(qs_countries.values_list('name', flat=True))
    }
    data['detailed'] = dict()
    if country_code:
        country = Country.objects.get(country_code)
        qs_countries = Country.objects.filter(id=country.id)

    for country in qs_countries:
        qs_base = ProjectSearch.objects.filter(country=country.id)
        qs_values = qs_base.values('project')
        if country.name not in data['detailed']:
            data['detailed'][country.name] = dict()
        data['detailed'][country.name] = {
            'has_moh_approval': country.project_approval,
            'total_projects': qs_base.count(),
            'pending': ProjectApproval.objects.filter(project__in=qs_values).filter(approved__isnull=True).count(),
            'approved': ProjectApproval.objects.filter(project__in=qs_values).filter(approved=True).count(),
            'rejected': ProjectApproval.objects.filter(project__in=qs_values).filter(approved=False).count(),
            'started': ProjectApproval.objects.filter(project__in=qs_values).count()
        }
    return data


def calc_imported_projects(country_code: str = None):
    """
    -- number of imported projects from "Previous Imports" by date
    -- API users ( tokens activated on QA / Prod ) (Note: nicetohave, if possible, show num imported projects pr.
       Token )
    """
    data = dict()
    tokens = Token.objects.all()
    if country_code:
        country = Country.objects.get(country_code)
    data['total_imported_projects'] = \
        ProjectImportV2.objects.all().values_list('rows__project').distinct().count() if not country_code else \
        ProjectImportV2.objects.filter(country=country).values_list('rows__project').distinct().count()
    data['tokens'] = list(tokens.values_list('user__username', flat=True))

    # !!! This is apparently buggy in Django 2.1. Need to update to 2.2 at least to have more detailed info
    # See: https://github.com/Suor/django-cacheops/issues/316
    # import_to_projects = ProjectImportV2.objects.\
    #     annotate(projects=ArrayAgg('rows__project', distinct=True)).\
    #     annotate(p_count=Count('projects')).\
    #     filter(p_count__gt=0)

    return data
