import copy
from datetime import datetime

from allauth.account.models import EmailConfirmation
from django.core import mail
from rest_framework.reverse import reverse
from rest_framework.test import APITestCase, APIClient

from core.factories import CountryFactory, OrganisationFactory
from country.models import Country, Donor
from project.models import Project
from user.models import UserProfile, Organisation


class ExternalAPITests(APITestCase):
    def setUp(self):
        # Create a test user with profile.
        url = reverse("rest_register")
        data = {
            "email": "digitalclearinghouse@who.int",
            "password1": "123456hetNYOLC",
            "password2": "123456hetNYOLC"}
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, 201, response.json())

        # Validate the account.
        key = EmailConfirmation.objects.get(email_address__email="digitalclearinghouse@who.int").key
        url = reverse("rest_verify_email")
        data = {
            "key": key,
        }
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, 200, response.json())

        # Log in the user.
        url = reverse("api_token_auth")
        data = {
            "username": "digitalclearinghouse@who.int",
            "password": "123456hetNYOLC"}
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, 200, response.json())
        self.test_user_key = response.json().get("token")
        self.test_user_client = APIClient(HTTP_AUTHORIZATION="Token {}".format(self.test_user_key), format="json")
        self.user_profile_id = response.json().get('user_profile_id')

        # Update profile.
        self.org = OrganisationFactory(name="org1")
        self.country = CountryFactory(name="country1", code='CTR1', project_approval=True,
                                      region=Country.REGIONS[0][0], name_en='Hungary', name_fr='Hongrie')
        self.country_id = self.country.id

        url = reverse("userprofile-detail", kwargs={"pk": self.user_profile_id})
        data = {
            "name": "Digital Clearing House",
            "organisation": self.org.id,
            "country": self.country_id}
        response = self.test_user_client.put(url, data, format='json')
        self.assertEqual(response.status_code, 200, response.json())
        self.user_profile_id = response.json().get('id')

        self.userprofile = UserProfile.objects.get(id=self.user_profile_id)
        self.country.users.add(self.userprofile)

        self.project_data = {"project": {
            "name": "Test Project1",
            "organisation": "test organisation",
            "contact_name": "name1",
            "contact_email": "team_member@added.com",
            "implementation_overview": "overview",
            "health_focus_areas": [1, 2],
            "country": self.country_id,
            "platforms": [{
                "id": 1,
                "strategies": [1, 2]
            }],
            "hsc_challenges": [1, 2],
            "start_date": str(datetime.today().date())
        }}
