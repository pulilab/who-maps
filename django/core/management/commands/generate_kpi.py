import os

import datetime
import operator
from functools import reduce
from django.core.management.base import BaseCommand
from django.conf import settings
from django.db.models import Count
from django.utils import timezone
from rest_framework.authtoken.models import Token

# from django.contrib.postgres.aggregates import ArrayAgg
from project.models import Project, ProjectApproval, ProjectImportV2
from country.models import Country
from user.models import User, UserProfile
from django.db.models import Q, F
from search.models import ProjectSearch

separator_line = "-" * 20
separator_line_small = "-" * 10
newline = "\n"


class Command(BaseCommand):
    help = """
    Generates KPIs based on the current state of the database.
    Number of countries using MOH approval, number of projects in each, and group by count and % ( pending, Approved,
    Rejected )
    Number of Projects where the Assessment process was started ( any "score" was created on the assessment of project )
    usage: generate_kpi <output_file>
    eg: generate_kpi output.txt
    """

    output_file = 'kpi.txt'

    obsolete_project_markers = {
        'test',
        'demo',
        'delete'
    }

    def calc_project_data(self):
        data = dict()
        data['total'] = Project.objects.count()
        data['draft'] = Project.objects.draft_only().count()
        data['published'] = data['total'] - data['draft']

        # name must be unique and data filled in order to be publishable
        data['publishable'] = Project.objects.draft_only().filter(data__isnull=False).distinct('name').count()
        data['deletable'] = Project.objects.filter(
            reduce(operator.or_, (Q(name__contains=x) for x in self.obsolete_project_markers))).count()
        # This is in no way perfect, but should be good enough for a oneshot

        data['duplicates'] = Project.objects.values('name', 'id').annotate(Count('name')).order_by(). \
            filter(name__count__gt=1).count()
        return data

    def calc_user_data(self):
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

        qs_last_week = User.objects.filter(last_login__range=(last_week, today)). \
            annotate(account_type=F('userprofile__account_type')). \
            values('account_type').annotate(Count("id")).order_by()
        data['last_week_logins'] = {account_types[x['account_type']]: x['id__count']
                                    for x in qs_last_week}
        qs_last_month = User.objects.filter(last_login__range=(last_month, today)). \
            annotate(account_type=F('userprofile__account_type')). \
            values('account_type').annotate(Count("id")).order_by()
        data['last_month_logins'] = {account_types[x['account_type']]: x['id__count']
                                     for x in qs_last_month}

        qs_all_time = User.objects.all().annotate(account_type=F('userprofile__account_type')). \
            values('account_type').annotate(Count("id")).order_by()
        data['all_time'] = {account_types[x['account_type']]: x['id__count']
                            for x in qs_all_time}
        return data

    def calc_country_data(self):
        # Number of countries using MOH approval, number of projects in each, and group by count and %
        #    (pending, Approved,  Rejected)
        # Number of Projects where the Assessment process was started
        #    (any "score" was created on the assessment of project)
        data = dict()
        qs_countries = Country.objects.filter(project_approval=True)
        data['moh_countries_total'] = qs_countries.count()
        data['detailed'] = dict()
        for country in qs_countries:
            if country.name not in data['detailed']:
                data['detailed'][country.name] = dict()
            data['detailed'][country.name] = {
                'total_projects': ProjectSearch.objects.filter(country=country.id).count(),
                'pending': ProjectApproval.objects.
                    filter(project__in=ProjectSearch.objects.filter(country=country.id).values('project')).
                    filter(approved__isnull=True)
                    .count(),
                'approved': ProjectApproval.objects.
                    filter(project__in=ProjectSearch.objects.filter(country=country.id).values('project')).
                    filter(approved=True)
                    .count(),
                'rejected': ProjectApproval.objects.
                    filter(project__in=ProjectSearch.objects.filter(country=country.id).values('project')).
                    filter(approved=False)
                    .count(),
                'started': ProjectApproval.objects.
                    filter(project__in=ProjectSearch.objects.filter(country=country.id).values('project')).
                    count()
            }
        return data

    def calc_imported_projects(self):
        """
        -- number of imported projects from "Previous Imports" by date
        -- API users ( tokens activated on QA / Prod ) (Note: nicetohave, if possible, show num imported projects pr.
           Token )
        """
        data = dict()
        tokens = Token.objects.all()
        data['total_imported_projects'] = ProjectImportV2.objects.all().values_list('rows__project').distinct().count()
        data['tokens'] = list(tokens.values_list('user__username', flat=True))

        # !!! This is apparently buggy in Django 2.1. Need to update to 2.2 at least to have more detailed info
        # See: https://github.com/Suor/django-cacheops/issues/316
        # import_to_projects = ProjectImportV2.objects.\
        #     annotate(projects=ArrayAgg('rows__project', distinct=True)).\
        #     annotate(p_count=Count('projects')).\
        #     filter(p_count__gt=0)

        return data

    @staticmethod
    def format_project_data(data: dict):
        out_str = f'''
Project KPIs:
{separator_line}
  Deletable: {data["deletable"]}
  Draft: {data["draft"]}
  Possible duplicates: {data["duplicates"]}
  Publishable: {data["publishable"]}'
  Total: {data["total"]}'
'''
        return out_str

    @staticmethod
    def format_user_data(data: dict):
        all_time_str = [f'    {k}: {v}' for k, v in data["all_time"].items()]
        last_week_str = [f'    {k}: {v}' for k, v in data["last_week_logins"].items()]
        last_month_str = [f'    {k}: {v}' for k, v in data["last_month_logins"].items()]

        out_str = f'''
User KPIs:
{separator_line}
  All users:
  {separator_line_small}
{newline.join(line for line in all_time_str)}
  Last month:
  {separator_line_small}
{newline.join(line for line in last_month_str)}
  Last week:
  {separator_line_small}
{newline.join(line for line in last_week_str)}
'''
        return out_str

    @staticmethod
    def format_approval_data(data: dict):
        country_data = dict()

        for country_name in data['detailed']:
            country_data[country_name] = [f'    {k}: {v}' for k, v in data['detailed'][country_name].items()]
        country_data_str = [
            f'  {k}{newline}'
            f'{newline.join(v_part for v_part in v)}'
            for k, v in country_data.items()]

        out_str = f'''
Approval KPIs:
{separator_line}
General data:
{separator_line_small}
Countries using MOH approval: {data["moh_countries_total"]}
By-country stats:
{separator_line_small}
{newline.join(c for c in country_data_str)}
'''
        return out_str

    @staticmethod
    def format_api_data(data: dict):
        out_str = f"""
Api usage:
{separator_line}
Total imported projects: {data["total_imported_projects"]}
Tokens in use
{separator_line_small}
{newline.join(v for v in data["tokens"])}
"""
        return out_str

    def format_output(self, data: dict):
        project_str = self.format_project_data(data['project'])
        user_str = self.format_user_data(data['user'])
        approval_str = self.format_approval_data(data['approval'])
        tokens_str = self.format_api_data(data['tokens'])

        out_str = \
            f'{project_str}' \
            f'' \
            f'{user_str}' \
            f'' \
            f'{approval_str}' \
            f'' \
            f'{tokens_str}' \
            f''
        return out_str

    def handle(self, *args, **options):
        self.stdout.write("-- Calculating KPIs")
        output_file = os.path.join(settings.BASE_DIR, self.output_file)
        data = dict()
        data['project'] = self.calc_project_data()
        data['user'] = self.calc_user_data()
        data['approval'] = self.calc_country_data()
        data['tokens'] = self.calc_imported_projects()
        output_str = self.format_output(data)
        self.stdout.write("-- Writing output")
        with open(output_file, "w") as text_file:
            text_file.write(output_str)
        self.stdout.write("-- Done")
