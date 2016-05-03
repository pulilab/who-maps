from datetime import datetime
from math import ceil

from django.core.urlresolvers import reverse
from allauth.account.models import EmailConfirmation
from rest_framework.test import APIClient
from rest_framework.test import APITestCase

from country.models import Country
from .models import Toolkit


class ToolkitTests(APITestCase):

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
        self.test_user_client = APIClient(HTTP_AUTHORIZATION="Token {}".format(self.test_user_key), format="json")

        # Create profile.
        url = reverse("userprofile-list")
        data = {
            "name": "Test Name",
            "organisation": "test_org",
            "country": "test_country"}
        response = self.test_user_client.post(url, data)

        country = Country.objects.create(name="country1")

        self.project_data = {
            "date": datetime.utcnow(),
            "name": "Test Project1",
            "organisation": "test_org",  # Should be text instead of ID - no Orgs in MVP
            "strategy": ["strat1", "strat2"],   # Can hold 'other' fields
            "country": country.id,
            "technology_platforms": ["tech1", "tech2"],  # Can hold 'other' fields
            "licenses": ["lic1", "lic2"],  # Can hold 'other' fields
            "digital_tools": ["tools1", "tools2"],  # Can hold 'other' fields
            "application": ["app1", "app2"],
            "coverage": [
                {"district": "dist1", "clients": 20, "health_workers": 5, "facilities": 4},
                {"district": "dist2", "clients": 10, "health_workers": 2, "facilities": 8}
            ],
            "started": datetime.utcnow(),
            "donors": ["donor1", "donor2"],  # Should be text instead of ID - no Donors in MVP
            "reports": ["http://foo.com", "http://bar.com"],
            "publications": ["http://foo.com", "http://bar.com"],
            "pipeline": ["pip1", "pip2"],  # Can hold 'other' fields
            "goals_to_scale": "scale",
            "anticipated_time": "time",
            "pre_assessment": [1,0,3,0,4,0],
        }

        url = reverse("project-list")
        response = self.test_user_client.post(url, self.project_data)
        self.project_id = response.json().get("id")

    def test_set_score(self):
        url = reverse("toolkit-scores", kwargs={"project_id": self.project_id})
        data = {
                "axis": 0,
                "domain": 0,
                "question": 0,
                "answer":0,
                "value": 2
            }
        response = self.test_user_client.post(url, data, format="json")
        self.assertEqual(response.status_code, 200)
        toolkit = Toolkit.objects.get_object_or_none(project=self.project_id)
        self.assertEqual(toolkit.data[0]["domains"][0]["questions"][0]["answers"][0], 2)

    def test_set_score_wrong_index(self):
        url = reverse("toolkit-scores", kwargs={"project_id": self.project_id})
        data = {
                "axis": 999,
                "domain": 0,
                "question": 0,
                "answer":0,
                "value": 2
            }
        response = self.test_user_client.post(url, data, format="json")
        self.assertEqual(response.status_code, 400)
        self.assertEqual("No such answer.", response.json()["details"])

    def test_set_score_wrong_project_id(self):
        url = reverse("toolkit-scores", kwargs={"project_id": 999})
        data = {
                "axis": 0,
                "domain": 0,
                "question": 0,
                "answer":0,
                "value": 2
            }
        response = self.test_user_client.post(url, data, format="json")
        self.assertEqual(response.status_code, 400)
        self.assertEqual("No such project.", response.json()["details"])

    def test_get_toolkit_data(self):
        url = reverse("toolkit-scores", kwargs={"project_id": self.project_id})
        data = {
                "axis": 0,
                "domain": 0,
                "question": 0,
                "answer":0,
                "value": 2
            }
        response = self.test_user_client.post(url, data, format="json")
        url = reverse("toolkit-data", kwargs={"project_id": self.project_id})
        response = self.test_user_client.get(url, format="json")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()[0]["domains"][0]["questions"][0]["answers"][0], 2)

    def test_get_toolkit_data_wrong_project_id(self):
        url = reverse("toolkit-data", kwargs={"project_id": 999})
        response = self.test_user_client.get(url, format="json")
        self.assertEqual(response.status_code, 400)
        self.assertEqual("No such project.", response.json()["details"])

    def test_get_toolkit_data_statistics(self):
        url = reverse("toolkit-scores", kwargs={"project_id": self.project_id})
        data = {
                "axis": 0,
                "domain": 0,
                "question": 0,
                "answer":0,
                "value": 2
            }
        response = self.test_user_client.post(url, data, format="json")
        data = {
                "axis": 0,
                "domain": 1,
                "question": 0,
                "answer":0,
                "value": 3
            }
        response = self.test_user_client.post(url, data, format="json")
        url = reverse("toolkit-data", kwargs={"project_id": self.project_id})
        response = self.test_user_client.get(url, format="json")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()[0]["domains"][0]["questions"][0]["answers"][0], 2)
        self.assertEqual(response.json()[0]["domains"][0]["domain_sum"], 2)
        self.assertEqual(ceil(response.json()[0]["domains"][0]["domain_percentage"]), 100)
        self.assertEqual(response.json()[0]["domains"][1]["questions"][0]["answers"][0], 3)
        self.assertEqual(response.json()[0]["domains"][1]["domain_sum"], 3)
        self.assertEqual(ceil(response.json()[0]["domains"][1]["domain_percentage"]), 14)
        self.assertEqual(ceil(response.json()[0]["axis_score"]), 38)
        self.assertEqual(ceil(response.json()[0]["axis_completion"]), 9)
