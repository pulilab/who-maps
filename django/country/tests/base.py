from allauth.account.models import EmailConfirmation
from django.urls import reverse
from django.utils import timezone
from rest_framework.test import APITestCase, APIClient

from country.models import Country, PartnerLogo, Donor, DonorPartnerLogo


class CountryBaseTests(APITestCase):
    def setUp(self):
        # Create a test user with profile.
        url = reverse("rest_register")
        data = {"email": "test_user@gmail.com", "password1": "123456hetNYOLC", "password2": "123456hetNYOLC"}
        self.client.post(url, data)

        # Validate the account.
        key = EmailConfirmation.objects.get(email_address__email="test_user@gmail.com").key
        url = reverse("rest_verify_email")
        data = {
            "key": key,
        }
        self.client.post(url, data)

        # Log in the user.
        url = reverse("api_token_auth")
        data = {"username": "test_user@gmail.com", "password": "123456hetNYOLC"}
        response = self.client.post(url, data)
        self.test_user = response.json()
        self.test_user_key = response.json().get("token")
        self.test_user_client = APIClient(HTTP_AUTHORIZATION="Token {}".format(self.test_user_key))

        self.country = Country.objects.create(name="country1", code="CC", map_activated_on=timezone.now())
        self.country.name_en = 'Hungary'
        self.country.name_fr = 'Hongrie'
        self.country.save()
        PartnerLogo.objects.create(country=self.country)


class DonorBaseTests(APITestCase):
    def setUp(self):
        # Create a test user with profile.
        url = reverse("rest_register")
        data = {"email": "test_user@gmail.com", "password1": "123456hetNYOLC", "password2": "123456hetNYOLC"}
        self.client.post(url, data)

        # Validate the account.
        key = EmailConfirmation.objects.get(email_address__email="test_user@gmail.com").key
        url = reverse("rest_verify_email")
        data = {
            "key": key,
        }
        self.client.post(url, data)

        # Log in the user.
        url = reverse("api_token_auth")
        data = {"username": "test_user@gmail.com", "password": "123456hetNYOLC"}
        response = self.client.post(url, data)
        self.test_user = response.json()
        self.test_user_key = response.json().get("token")
        self.test_user_client = APIClient(HTTP_AUTHORIZATION="Token {}".format(self.test_user_key))

        self.donor = Donor.objects.create(name="donor1", code="donor1")
        self.donor.name_en = 'Donor Group'
        self.donor.name_fr = 'Doner Grup'
        self.donor.save()
        DonorPartnerLogo.objects.create(donor=self.donor)
