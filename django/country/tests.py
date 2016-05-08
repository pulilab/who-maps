from django.core.urlresolvers import reverse
from allauth.account.models import EmailConfirmation
from rest_framework.test import APIClient
from rest_framework.test import APITestCase

from .models import Country


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

        geodata = {
            "admin_level_5": {
                "objects": {
                    "admin_level_5": {
                        "geometries": [
                            {
                                "properties": {
                                    "name": "Some District",
                                    "admin_level": "5"
                                }
                            }
                        ]
                    }
                }
            }
        }

        geodata2 = {
            "admin_level_4": {
                "objects": {
                    "admin_level_4": {
                        "geometries": [
                            {
                                "properties": {
                                    "name": "Some District",
                                    "admin_level": "4"
                                }
                            }
                        ]
                    }
                }
            }
        }

        country, _ = Country.objects.get_or_create(name="india", geodata=geodata)
        country.save()
        self.country_id = country.id

        country, _ = Country.objects.get_or_create(name="kenya", geodata=geodata2)
        country.save()
        self.country_id2 = country.id

    def test_get_geodata(self):
        url = reverse("get-geodata", kwargs={"country_id": self.country_id})
        response = self.test_user_client.get(url)
        self.assertEqual(response.status_code, 200)
        self.assertIn("admin_level_5", response.json().keys())

    def test_get_countries(self):
        url = reverse("country-list")
        response = self.test_user_client.get(url)
        self.assertEqual(response.status_code, 200)
        self.assertIn("name", response.json()[0].keys())

    def test_get_districts_lvl5(self):
        url = reverse("get-districts", kwargs={"country_id": self.country_id})
        response = self.test_user_client.get(url)
        self.assertEqual(response.status_code, 200)
        self.assertIn("Some District", response.json())

    def test_get_districts_lvl4(self):
        url = reverse("get-districts", kwargs={"country_id": self.country_id2})
        response = self.test_user_client.get(url)
        self.assertEqual(response.status_code, 200)
        self.assertIn("Some District", response.json())
