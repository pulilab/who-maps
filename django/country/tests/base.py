from allauth.account.models import EmailConfirmation
from django.urls import reverse
from django.utils import timezone
from rest_framework.test import APITestCase, APIClient

from core.factories import DonorFactory, CountryFactory
from country.models import PartnerLogo, DonorPartnerLogo


class CountryBaseTests(APITestCase):
    def setUp(self):
        # Create a test user with profile.
        url = reverse("rest_register")
        data = {"email": "test_user@gmail.com", "password1": "123456hetNYOLC", "password2": "123456hetNYOLC"}
        response = self.client.post(url, data)
        self.test_user = response.json()

        # Validate the account.
        key = EmailConfirmation.objects.get(email_address__email="test_user@gmail.com").key
        url = reverse("rest_verify_email")
        data = {
            "key": key,
        }
        self.client.post(url, data)

        # Log in the user.
        url = reverse("token_obtain_pair")
        data = {"username": "test_user@gmail.com", "password": "123456hetNYOLC"}
        response = self.client.post(url, data)
        self.test_user_key = response.json().get("access")
        self.test_user_client = APIClient(HTTP_AUTHORIZATION="Token {}".format(self.test_user_key))
        self.country = CountryFactory(name="country1", code="CC", map_activated_on=timezone.now(), name_en='Hungary',
                                      name_fr='Hongrie')
        PartnerLogo.objects.create(country=self.country)


class DonorBaseTests(APITestCase):
    def setUp(self):
        # Create a test user with profile.
        url = reverse("rest_register")
        data = {"email": "test_user@gmail.com", "password1": "123456hetNYOLC", "password2": "123456hetNYOLC"}
        response = self.client.post(url, data)
        self.test_user = response.json()

        # Validate the account.
        key = EmailConfirmation.objects.get(email_address__email="test_user@gmail.com").key
        url = reverse("rest_verify_email")
        data = {
            "key": key,
        }
        self.client.post(url, data)

        # Log in the user.
        url = reverse("token_obtain_pair")
        data = {"username": "test_user@gmail.com", "password": "123456hetNYOLC"}
        response = self.client.post(url, data)
        self.test_user_key = response.json().get("access")
        self.test_user_client = APIClient(HTTP_AUTHORIZATION="Token {}".format(self.test_user_key))
        self.donor = DonorFactory(name="donor1", code="donor1", name_en='Donor Group', name_fr='Doner Grup')
        DonorPartnerLogo.objects.create(donor=self.donor)
