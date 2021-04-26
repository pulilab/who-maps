from rest_framework.test import APITestCase, APIClient
from rest_framework.reverse import reverse

from core.factories import OrganisationFactory, DonorFactory, UserProfileFactory
from country.models import Country, Donor
from user.models import UserProfile, Organisation

from datetime import datetime, date, timedelta
from random import randint

from allauth.account.models import EmailConfirmation
from django.utils import timezone
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
        self.country1, _ = Country.objects.get_or_create(name="kpi_country_1",
                                                         defaults={"code": "CTR1",
                                                                   "project_approval": True,
                                                                   "region": Country.REGIONS[0][0]})
        self.country2, _ = Country.objects.get_or_create(name="kpi_country_2",
                                                         defaults={"code": "CTR2",
                                                                   "project_approval": True,
                                                                   "region": Country.REGIONS[0][0]})
        # Create users
        self.userprofile_1, self.test_user_key, self.test_user_client = self.create_user(org=self.org,
                                                                                         country=self.country1)

        self.userprofile_2 = UserProfileFactory(name="USER2", account_type=UserProfile.IMPLEMENTER,
                                                country=self.country2)
        self.userprofile_2.user.date_joined = date.today() - timedelta(days=100)
        self.userprofile_2.user.last_login = date.today() - timedelta(days=1)  # yesterday

        self.userprofile_3 = UserProfileFactory(name="USER3", account_type=UserProfile.GOVERNMENT,
                                                country=self.country2)
        self.userprofile_3.user.date_joined = date.today() - timedelta(days=100)
        self.userprofile_3.user.last_login = date.today() - timedelta(days=1)  # yesterday

        self.userprofile_4 = UserProfileFactory(name="USER4", account_type=UserProfile.IMPLEMENTER,
                                                country=self.country2)
        self.userprofile_4.user.date_joined = date.today() - timedelta(days=100)
        self.userprofile_4.user.last_login = date.today() - timedelta(days=1)  # yesterday

        self.userprofile_5 = UserProfileFactory(name="USER4", account_type=UserProfile.IMPLEMENTER,
                                                country=self.country2)
        self.userprofile_5.user.date_joined = date.today() - timedelta(days=80)
        self.userprofile_5.user.last_login = date.today() - timedelta(days=60)  # about two months ago

        generate_date = date.today() - timedelta(days=100)
        while generate_date < date.today():
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
        import ipdb
        ipdb.set_trace()

        url = reverse("user-kpi")
        response = self.client.get(url)
        expected = {'deletable': 0, 'draft': 10, 'duplicates': 0, 'publishable': 10, 'published': 10, 'total': 20}
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json(), expected)

