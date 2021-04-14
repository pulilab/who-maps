from rest_framework.test import APITestCase, APIClient
from rest_framework.reverse import reverse

from core.factories import OrganisationFactory, DonorFactory, UserProfileFactory
from country.models import Country, Donor
from user.models import UserProfile, Organisation

from datetime import datetime, date, timedelta
from random import randint

from allauth.account.models import EmailConfirmation
from django.utils.timezone import localdate, localtime
from kpiexport.tasks import update_auditlog_user_data_task
from rest_framework.authtoken.models import Token


class TestUserKPIData:
    """
    Base class for User KPI tests. In setUp, it creates:
    - 5 test user profiles with different countries and investors
    - 2 countries
    - 2 donors
    """

    def setUp(self):
        # Create organisation and donors
        self.org = OrganisationFactory(name="org1")
        self.d1 = DonorFactory(name="Donor1", code="donor1")
        self.d2 = DonorFactory(name="Donor2", code="donor2")
        # Create countries
        self.country_global, _ = Country.objects.get_or_create(name="Global")
        self.country1, _ = Country.objects.get_or_create(name="kpi_country_1",
                                                         defaults={"code": "CTR1",
                                                                   "project_approval": False,
                                                                   "region": Country.REGIONS[0][0]})
        self.country2, _ = Country.objects.get_or_create(name="kpi_country_2",
                                                         defaults={"code": "CTR2",
                                                                   "project_approval": True,
                                                                   "region": Country.REGIONS[0][0]})
        # Create users
        self.userprofile_1, self.test_user_key, self.test_user_client = self.create_user(org=self.org,
                                                                                         country=self.country1)
        self.userprofile_1.donor = self.d1
        self.userprofile_1.save()
        self.userprofile_2 = UserProfileFactory(name="USER2", account_type=UserProfile.IMPLEMENTER,
                                                country=self.country2)
        self.userprofile_2.user.date_joined = localtime() - timedelta(days=100)
        self.userprofile_2.user.last_login = localtime() - timedelta(days=1)  # yesterday
        self.userprofile_2.donor = self.d1
        self.userprofile_2.user.save()
        self.userprofile_2.save()

        self.userprofile_3 = UserProfileFactory(name="USER3", account_type=UserProfile.GOVERNMENT,
                                                country=self.country2)
        self.userprofile_3.user.date_joined = localtime() - timedelta(days=100)
        self.userprofile_3.user.last_login = localtime() - timedelta(days=1)  # yesterday
        self.userprofile_3.donor = self.d2
        self.userprofile_3.user.save()
        self.userprofile_3.save()

        self.userprofile_4 = UserProfileFactory(name="USER4", account_type=UserProfile.IMPLEMENTER,
                                                country=self.country2)
        self.userprofile_4.user.date_joined = localtime() - timedelta(days=100)
        self.userprofile_4.user.last_login = localtime() - timedelta(days=1)  # yesterday
        self.userprofile_4.donor = self.d2
        self.userprofile_4.user.save()
        self.userprofile_4.save()

        self.userprofile_5 = UserProfileFactory(name="USER5", account_type=UserProfile.IMPLEMENTER,
                                                country=self.country2)
        self.userprofile_5.user.date_joined = localtime() - timedelta(days=80)
        self.userprofile_5.user.last_login = localtime() - timedelta(days=60)  # two months ago
        self.userprofile_5.donor = self.d2
        self.userprofile_5.user.save()
        self.userprofile_5.save()

        self.userprofile_6 = UserProfileFactory(name="USER6", account_type=UserProfile.IMPLEMENTER,
                                                country=self.country2)
        self.userprofile_6.user.date_joined = localtime() - timedelta(days=80)
        self.userprofile_6.user.last_login = localtime() - timedelta(days=60)  # about two months ago
        self.userprofile_6.donor = self.d2
        self.userprofile_6.user.save()
        self.userprofile_6.save()

        generate_date = date.today() - timedelta(days=101)
        while generate_date <= date.today():
            update_auditlog_user_data_task(generate_date)
            generate_date = generate_date + timedelta(days=1)

    def create_user(self, user_email="test_user@gmail.com", user_password_1="123456hetNYOLC",
                    user_password_2="123456hetNYOLC", org: Organisation = None, country: Country = None):
        """
        Create a test user with profile.
        """
        if org is None:  # pragma: no cover
            org = self.org
        if country is None:  # pragma: no cover
            country = self.country

        url = reverse("rest_register")
        data = {
            "email": user_email,
            "password1": user_password_1,
            "password2": user_password_2}

        response = self.client.post(url, data)
        self.assertEqual(response.status_code, 201, response.json())

        # Validate the account.
        key = EmailConfirmation.objects.get(email_address__email="test_user@gmail.com").key
        url = reverse("rest_verify_email")
        data = {
            "key": key,
        }
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, 200, response.json())

        # Log in the user.
        url = reverse("api_token_auth")
        data = {
            "username": "test_user@gmail.com",
            "password": "123456hetNYOLC"}
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, 200, response.json())
        test_user_key = response.json().get("token")
        test_user_client = APIClient(HTTP_AUTHORIZATION="Token {}".format(test_user_key), format="json")
        user_profile_id = response.json().get('user_profile_id')

        # Update profile
        url = reverse("userprofile-detail", kwargs={"pk": user_profile_id})
        data = {
            "name": "Test Name",
            "organisation": org.pk,
            "country": country.pk}
        response = test_user_client.put(url, data, format='json')
        self.assertEqual(response.status_code, 200, response.json())

        userprofile = UserProfile.objects.get(id=user_profile_id)
        country.users.add(userprofile)

        return userprofile, test_user_key, test_user_client


class KPIUserTests(TestUserKPIData, APITestCase):

    def test_user_kpi_nofilter(self):
        url = reverse("user-kpi")
        response = self.client.get(url)
        expected = [{'active': 0,
                     'country': self.country2.id,
                     'data': {'1': {'I': {'active': 0, 'registered': 1}},
                              '2': {'G': {'active': 0, 'registered': 1},
                                    'I': {'active': 0, 'registered': 3}}},
                     'date': '2021-01-01',
                     'registered': 5},
                    {'active': 0,
                     'country': self.country_global.id,
                     'data': {'1': {'I': {'active': 0, 'registered': 1}},
                              '2': {'G': {'active': 0, 'registered': 1},
                                    'I': {'active': 0, 'registered': 3}}},
                     'date': '2021-01-01',
                     'registered': 5},
                    {'active': 2,
                     'country': self.country2.id,
                     'data': {'2': {'I': {'active': 2, 'registered': 0}}},
                     'date': '2021-02-01',
                     'registered': 0},
                    {'active': 2,
                     'country': self.country_global.id,
                     'data': {'2': {'I': {'active': 2, 'registered': 0}}},
                     'date': '2021-02-01',
                     'registered': 0},
                    {'active': 3,
                     'country': self.country2.id,
                     'data': {'1': {'I': {'active': 1, 'registered': 0}},
                              '2': {'G': {'active': 1, 'registered': 0},
                                    'I': {'active': 1, 'registered': 0}}},
                     'date': '2021-04-01',
                     'registered': 0},
                    {'active': 3,
                     'country': self.country_global.id,
                     'data': {'1': {'I': {'active': 1, 'registered': 0}},
                              '2': {'G': {'active': 1, 'registered': 0},
                                    'I': {'active': 1, 'registered': 0}}},
                     'date': '2021-04-01',
                     'registered': 0}]

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json(), expected)

    def test_user_kpi_country_filter(self):
        url = reverse("user-kpi")
        url += f'?country={self.country2.id}'
        response = self.client.get(url)
        expected = []
        import ipdb
        ipdb.set_trace()

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json(), expected)
