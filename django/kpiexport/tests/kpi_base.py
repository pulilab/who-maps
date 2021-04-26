from rest_framework.test import APIClient
from rest_framework.reverse import reverse

from core.factories import OrganisationFactory, DonorFactory, UserProfileFactory
from country.models import Country
from user.models import UserProfile, Organisation

from datetime import datetime, date, timedelta

from allauth.account.models import EmailConfirmation
from django.utils.timezone import localtime
from kpiexport.tasks import update_auditlog_user_data_task, update_auditlog_token_data_task
from rest_framework.authtoken.models import Token


class KPITestData:
    """
    Base class for User KPI tests. In setUp, it creates:
    - 5 test user profiles with different countries and investors
    - 2 countries
    - 2 donors
    - Tokens for all users
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
        # Create dates
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

        # Create users
        self.userprofile_1, self.test_user_key, self.client = self.create_user(org=self.org, country=self.country1)
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

        generate_date = date.today() - timedelta(days=150)
        while generate_date <= date.today():
            update_auditlog_user_data_task(generate_date)
            update_auditlog_token_data_task(generate_date)
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
