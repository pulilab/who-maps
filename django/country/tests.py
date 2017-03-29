from django.contrib.admin import AdminSite
from django.contrib.auth.models import User
from django.core.urlresolvers import reverse
from allauth.account.models import EmailConfirmation
from django.test import TestCase
from rest_framework.test import APIClient
from rest_framework.test import APITestCase

from country.admin import CountryAdmin
from country.models import Country, PartnerLogo
from user.models import UserProfile


class CountryTests(APITestCase):

    def setUp(self):
        # Create a test user with profile.
        url = reverse("rest_register")
        data = {
            "email": "test_user@gmail.com",
            "password1": "123456",
            "password2": "123456"}
        response = self.client.post(url, data)

        # Validate the account.
        key = EmailConfirmation.objects.get(email_address__email="test_user@gmail.com").key
        url = reverse("rest_verify_email")
        data = {
            "key": key,
        }
        response = self.client.post(url, data)

        # Log in the user.
        url = reverse("api_token_auth")
        data = {
            "username": "test_user@gmail.com",
            "password": "123456"}
        response = self.client.post(url, data)
        self.test_user_key = response.json().get("token")
        self.test_user_client = APIClient(HTTP_AUTHORIZATION="Token {}".format(self.test_user_key))

        self.country = Country.objects.create(name="country1", code="CC")
        PartnerLogo.objects.create(country=self.country)

    def test_get_countries(self):
        url = reverse("country-list")
        response = self.test_user_client.get(url)
        self.assertEqual(response.status_code, 200)
        self.assertIn("name", response.json()[0].keys())
        self.assertIn("code", response.json()[0].keys())
        self.assertIn("id", response.json()[0].keys())

    def test_retrieve_landing_detail(self):
        url = reverse("country-detail", kwargs={"code": self.country.code})
        response = self.test_user_client.get(url)
        self.assertEqual(response.status_code, 200)
        response_keys = response.json().keys()
        self.assertIn("name", response_keys)
        self.assertIn("code", response_keys)
        self.assertIn("logo", response_keys)
        self.assertIn("cover", response_keys)
        self.assertIn("cover_text", response_keys)
        self.assertIn("footer_text", response_keys)

    def test_retrieve_partnerlogos_list(self):
        url = reverse("country-detail", kwargs={"code": self.country.code})
        response = self.test_user_client.get(url)
        self.assertEqual(response.status_code, 200)
        self.assertIn("partner_logos", response.json().keys())
        self.assertTrue(isinstance(response.json()['partner_logos'], list))


class MockRequest:
    pass


class CountryAdminTests(TestCase):

    def setUp(self):
        self.site = AdminSite()
        self.request = MockRequest()
        self.user = User.objects.create(username="alma", password="korte")

    def test_superuser_can_see_every_country(self):
        ma = CountryAdmin(Country, self.site)
        self.user.is_superuser = True
        self.user.is_staff = True
        self.user.save()
        self.request.user = self.user
        self.assertEqual(ma.get_list_display(self.request), ('name', 'code'))
        self.assertEqual(ma.get_queryset(self.request).count(), Country.objects.all().count())

    def test_staff_can_see_no_country_if_no_user_assigned_to_country(self):
        ma = CountryAdmin(Country, self.site)
        self.user.is_superuser = False
        self.user.is_staff = True
        self.user.save()
        self.request.user = self.user
        self.assertEqual(ma.get_list_display(self.request), ('name', 'code'))
        self.assertEqual(ma.get_queryset(self.request).count(), 0)

    def test_staff_only_sees_the_country_he_is_assigned_to(self):
        ma = CountryAdmin(Country, self.site)
        self.user.is_superuser = False
        self.user.is_staff = True
        self.user.save()
        self.request.user = self.user
        user_profile = UserProfile.objects.create(user=self.user)
        Country.objects.create(name="Country1", code="CC1", user=user_profile)
        self.assertEqual(ma.get_list_display(self.request), ('name', 'code'))
        self.assertEqual(ma.get_queryset(self.request).count(), 1)
        self.assertEqual(ma.get_queryset(self.request)[0].name, "Country1")
        self.assertEqual(ma.get_queryset(self.request)[0].code, "CC1")

    def test_staff_has_some_readonly_fields(self):
        ma = CountryAdmin(Country, self.site)
        self.user.is_superuser = False
        self.user.is_staff = True
        self.user.save()
        self.request.user = self.user
        self.assertEqual(ma.get_readonly_fields(self.request), ('name', 'code', 'user', ))

    def test_superuser_can_change_every_field(self):
        ma = CountryAdmin(Country, self.site)
        self.user.is_superuser = True
        self.user.is_staff = True
        self.user.save()
        self.request.user = self.user
        self.assertEqual(ma.get_readonly_fields(self.request), ())
