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
from django.db.models import Q, F, IntegerField
from django.contrib.postgres.fields.jsonb import KeyTextTransform
from django.db.models.functions import Cast


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
        data['draft'] = Project.objects.filter(public_id="").count()
        data['published'] = data['total'] - data['draft']

        # name must be unique and data filled in order to be publishable
        # TODO: check if I'm missing something!
        data['publishable'] = Project.objects.filter(public_id="").filter(data__isnull=False).distinct('name').count()
        data['deletable'] = Project.objects.filter(
            reduce(operator.or_, (Q(name__contains=x) for x in self.obsolete_project_markers))).count()
        # This is in no way perfect, but should be good enough for a oneshot

        data['duplicates'] = Project.objects.values('name', 'id').annotate(Count('name')).order_by().\
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

        qs_last_week = User.objects.filter(last_login__range=(last_week, today)).\
            annotate(account_type=F('userprofile__account_type')).\
            values('account_type').annotate(Count("id")).order_by()
        data['last_week_logins'] = {account_types[x['account_type']]: x['id__count']
                                    for x in qs_last_week}
        qs_last_month = User.objects.filter(last_login__range=(last_month, today)).\
            annotate(account_type=F('userprofile__account_type')).\
            values('account_type').annotate(Count("id")).order_by()
        data['last_month_logins'] = {account_types[x['account_type']]: x['id__count']
                                     for x in qs_last_month}

        qs_all_time = User.objects.all().annotate(account_type=F('userprofile__account_type')).\
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
        qs_project_countries = Project.objects.published_only().\
            annotate(country_id=Cast(KeyTextTransform('country', 'data'), output_field=IntegerField()))
        data['detailed'] = dict()
        for country in qs_countries:
            if country.name not in data['detailed']:
                data['detailed'][country.name] = dict()
            data['detailed'][country.name] = {
                'total_projects': qs_project_countries.filter(country_id=country.id).count(),
                'pending': ProjectApproval.objects.
                filter(project__in=qs_project_countries.filter(country_id=country.id)).
                filter(approved__isnull=True)
                .count(),
                'approved': ProjectApproval.objects.
                filter(project__in=qs_project_countries.filter(country_id=country.id)).
                filter(approved=True)
                .count(),
                'rejected': ProjectApproval.objects.
                filter(project__in=qs_project_countries.filter(country_id=country.id)).
                filter(approved=False)
                .count(),
                'started': ProjectApproval.objects.
                filter(project__in=qs_project_countries.filter(country_id=country.id)).
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

    def format_output(self, data: dict):
        separator_line = "-" * 20
        separator_line_small = "-" * 10
        indent = " " * 4
        indent_small = " " * 2
        out_str = str()
        out_str += 'Project KPIs:' + '\n'
        out_str += separator_line + '\n'
        out_str += indent + f'Deletable: {data["project"]["deletable"]}' + '\n'
        out_str += indent + f'Draft: {data["project"]["draft"]}' + '\n'
        out_str += indent + f'Possible duplicates: {data["project"]["duplicates"]}' + '\n'
        out_str += indent + f'Publishable: {data["project"]["publishable"]}' + '\n'
        out_str += indent + f'Total: {data["project"]["total"]}' + '\n'
        out_str += '\n'
        out_str += 'User KPIs:' + '\n'
        out_str += separator_line + '\n'
        out_str += indent_small + 'All users' + '\n'
        out_str += separator_line_small + '\n'
        for stat in data['user']['all_time']:
            out_str += indent + f'{stat}: {data["user"]["all_time"][stat]}' + '\n'
        out_str += '\n'
        out_str += indent_small + 'Last week logins' + '\n'
        out_str += separator_line_small + '\n'
        for stat in data['user']['last_week_logins']:
            out_str += indent + f'{stat}: {data["user"]["last_week_logins"][stat]}' + '\n'
        out_str += '\n'
        out_str += indent_small + 'Last month logins' + '\n'
        out_str += separator_line_small + '\n'
        for stat in data['user']['last_month_logins']:
            out_str += indent + f'{stat}: {data["user"]["last_month_logins"][stat]}' + '\n'
        out_str += '\n'
        out_str += 'Approval KPIs:' + '\n'
        out_str += separator_line + '\n'
        out_str += indent_small + 'Overall stats' + '\n'
        out_str += separator_line_small + '\n'
        out_str += indent + f'Countries using MOH approval: {data["approval"]["moh_countries_total"]}' + '\n'
        out_str += indent_small + 'By-country stats' + '\n'
        out_str += separator_line_small + '\n'
        for country_name in data['approval']['detailed']:
            out_str += indent_small + country_name + '\n'
            for stat in data['approval']['detailed'][country_name]:
                out_str += indent + f'{stat}: {data["approval"]["detailed"][country_name][stat]}\n'
        out_str += '\n'
        out_str += 'Api usage:' + '\n'
        out_str += separator_line + '\n'
        out_str += indent_small + 'Tokens in use' + '\n'
        out_str += separator_line_small + '\n'
        for token in data['tokens']['tokens']:
            out_str += indent + token + '\n'
        out_str += separator_line_small + '\n'
        out_str += indent + f"Total imported projects: {data['tokens']['total_imported_projects']} \n"
        out_str += '\n'
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
