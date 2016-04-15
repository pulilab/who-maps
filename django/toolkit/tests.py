from datetime import datetime
from math import ceil

from django.core.urlresolvers import reverse
from allauth.account.models import EmailConfirmation
from rest_framework.test import APIClient
from rest_framework.test import APITestCase

from project.models import Strategy, Technology, Application, Pipeline, Publication
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
        self.test_user_client = APIClient(HTTP_AUTHORIZATION="Token {}".format(self.test_user_key))

        # Create profile.
        url = reverse("userprofile-list")
        data = {
            "name": "Test Name",
            "organisation": "test_org",
            "country": "test_country"}
        response = self.test_user_client.post(url, data)

        # Creating basic data.
        strat1 = Strategy.objects.create(project_specific=False, name="Strategy1")
        strat2 = Strategy.objects.create(project_specific=False, name="Strategy2")
        tech1 = Technology.objects.create(project_specific=False, name="Technology1")
        tech2 = Technology.objects.create(project_specific=False, name="Technology2")
        app1 = Application.objects.create(name="Application1")
        app2 = Application.objects.create(name="Application2")
        pipeline1 = Pipeline.objects.create(project_specific=False, name="Pipeline1")
        pipeline2 = Pipeline.objects.create(project_specific=False, name="Pipeline2")

        self.project_data = {
            "date": datetime.utcnow(),
            "name": "Test Project1",
            "organisation": "test_org",  # same as for the test user.
            "strategy": [strat1.id, strat2.id],
            "technology": [tech1.id, tech2.id],
            "application": [app1.id, app2.id],
            "clients": 10,
            "health_workers": 80,
            "facilities": 5,
            "started": datetime.utcnow(),
            "donors": "Donor1, Donor2",
            "pipeline": [pipeline1.id, pipeline2.id],
            "goals_to_scale": "Some goal.",
            "anticipated_time": "3 years."
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
        self.assertEqual(ceil(response.json()[0]["domains"][0]["domain_percentage"]), 25)
        self.assertEqual(response.json()[0]["domains"][1]["questions"][0]["answers"][0], 3)
        self.assertEqual(response.json()[0]["domains"][1]["domain_sum"], 3)
        self.assertEqual(ceil(response.json()[0]["domains"][1]["domain_percentage"]), 14)
        self.assertEqual(ceil(response.json()[0]["axis_score"]), 13)
