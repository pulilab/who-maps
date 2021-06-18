from core.factories import UserProfileFactory
from user.models import UserProfile
from project.models import ProjectVersion

from datetime import datetime, date, timedelta

from django.utils.timezone import localtime
from kpiexport.tasks import update_auditlog_user_data_task, update_auditlog_token_data_task, \
    update_auditlog_project_status_data_task
from rest_framework.authtoken.models import Token
from project.tests.setup import TestData


class KPITestData(TestData):
    """
    Base class for User KPI tests. In setUp, it creates:
    - 5 test user profiles with different countries and investors
    - 2 countries
    - 2 donors
    - Tokens for all users
    """
    def setUp(self):
        super(KPITestData, self).setUp()
        self.create_anchor_dates()
        self.create_users()

        generate_date = date.today() - timedelta(days=150)
        while generate_date <= date.today():
            update_auditlog_user_data_task(generate_date)
            update_auditlog_token_data_task(generate_date)
            generate_date = generate_date + timedelta(days=1)

    def create_anchor_dates(self):
        self.date_1 = localtime() - timedelta(days=120)
        self.date_1 = datetime(self.date_1.year, self.date_1.month, 1).astimezone()
        self.date_1_str = self.date_1.strftime("%Y-%m-%d")
        self.date_2 = localtime() - timedelta(days=90)
        self.date_2 = datetime(self.date_2.year, self.date_2.month, 1).astimezone()
        self.date_2_str = self.date_2.strftime("%Y-%m-%d")
        self.date_3 = localtime() - timedelta(days=60)
        self.date_3 = datetime(self.date_3.year, self.date_3.month, 1).astimezone()
        self.date_3_str = self.date_3.strftime("%Y-%m-%d")
        self.date_4 = localtime() - timedelta(days=1)
        self.date_4 = datetime(self.date_4.year, self.date_4.month, 1).astimezone()
        self.date_4_str = self.date_4.strftime("%Y-%m-%d")

    def create_users(self):
        """
        Creates users, profiles, tokens
        """
        self.userprofile_1, self.test_user_key, self.test_user_client = self.create_user(org=self.org,
                                                                                         country=self.country1)
        self.userprofile_1.donor = self.d1
        self.userprofile_1.save()
        self.userprofile_2 = UserProfileFactory(name="USER2", account_type=UserProfile.IMPLEMENTER,
                                                country=self.country2)
        self.userprofile_2.user.date_joined = self.date_1
        self.userprofile_2.user.last_login = self.date_4  # yesterday
        self.userprofile_2.donor = self.d1
        self.userprofile_2.user.save()
        self.userprofile_2.save()
        self.token_2, _ = Token.objects.get_or_create(user=self.userprofile_2.user)
        self.token_2.created = self.date_1
        self.token_2.save()
        self.userprofile_3 = UserProfileFactory(name="USER3", account_type=UserProfile.GOVERNMENT,
                                                country=self.country2)
        self.userprofile_3.user.date_joined = self.date_1
        self.userprofile_3.user.last_login = self.date_4
        self.userprofile_3.donor = self.d2
        self.userprofile_3.user.save()
        self.userprofile_3.save()
        self.token_3, _ = Token.objects.get_or_create(user=self.userprofile_3.user)
        self.token_3.created = self.date_1
        self.token_3.save()

        self.userprofile_4 = UserProfileFactory(name="USER4", account_type=UserProfile.IMPLEMENTER,
                                                country=self.country2)
        self.userprofile_4.user.date_joined = self.date_1
        self.userprofile_4.user.last_login = self.date_4  # yesterday
        self.userprofile_4.donor = self.d2
        self.userprofile_4.user.save()
        self.userprofile_4.save()
        self.token_4, _ = Token.objects.get_or_create(user=self.userprofile_4.user)
        self.token_4.created = self.date_1
        self.token_4.save()

        self.userprofile_5 = UserProfileFactory(name="USER5", account_type=UserProfile.IMPLEMENTER,
                                                country=self.country2)
        self.userprofile_5.user.date_joined = self.date_2
        self.userprofile_5.user.last_login = self.date_3
        self.userprofile_5.donor = self.d2
        self.userprofile_5.user.save()
        self.userprofile_5.save()
        self.token_5, _ = Token.objects.get_or_create(user=self.userprofile_5.user)
        self.token_5.created = self.date_2
        self.token_5.save()

        self.userprofile_6 = UserProfileFactory(name="USER6", account_type=UserProfile.IMPLEMENTER,
                                                country=self.country2)
        self.userprofile_6.user.date_joined = self.date_2
        self.userprofile_6.user.last_login = self.date_3  # about two months ago
        self.userprofile_6.donor = self.d2
        self.userprofile_6.user.save()
        self.userprofile_6.save()
        self.token_6, _ = Token.objects.get_or_create(user=self.userprofile_6.user)
        self.token_6.created = self.date_2
        self.token_6.save()


class KPITestDataWithProjects(KPITestData):
    def setUp(self):
        super(KPITestDataWithProjects, self).setUp()

        self.projects = list()
        dates = [self.date_1.date(), self.date_2.date(), self.date_3.date(), self.date_4.date()]

        for i in range(1, 10):
            donors = list()
            if i % 3 == 0:
                donors.append(self.d1.id)
            elif i % 2 == 0:
                donors.append(self.d2.id)

            if i % 2 == 0:
                country = self.country1
            else:
                country = self.country2

            project_data = self.generate_project_data(
                project_name=f'project {i}',
                organisation=self.org,
                country=country,
                donors=donors,
                date=dates[i % 4])

            project = self.create_draft_project(project_data)
            if i % 2 == 0 and len(donors) > 0:
                self.publish_project(project.id, project_data)
        for project in self.projects:
            versions = ProjectVersion.objects.filter(project=project)
            if len(versions) == 2:
                versions[0].project.created = self.date_1
                versions[0].project.save()
                versions[0].created = self.date_1
                versions[0].save()
                versions[1].created = self.date_3
                versions[1].save()
            else:
                versions[0].project.created = self.date_1
                versions[0].project.save()
                versions[0].created = self.date_2
                versions[0].save()

        generate_date = date.today() - timedelta(days=150)
        while generate_date <= date.today() + timedelta(days=1):
            update_auditlog_project_status_data_task(generate_date)
            generate_date = generate_date + timedelta(days=1)
