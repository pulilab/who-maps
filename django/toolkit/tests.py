from datetime import datetime
from math import ceil

from django.core.urlresolvers import reverse
from django.core import mail
from allauth.account.models import EmailConfirmation
from rest_framework.test import APIClient
from rest_framework.test import APITestCase

from country.models import Country
from user.models import Organisation
from .models import Toolkit
from . import tasks


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
        self.user_profile_id = response.json().get('user_profile_id')

        # Create profile.
        self.org = Organisation.objects.create(name="org1")
        url = reverse("userprofile-detail", kwargs={"pk": self.user_profile_id})
        data = {
            "name": "Test Name",
            "organisation": self.org.id,
            "country": "test_country"}
        response = self.test_user_client.put(url, data)
        self.user_profile_id = response.json()['id']

        country = Country.objects.create(name="country1")

        self.project_data = {
            "date": datetime.utcnow(),
            "name": "Test Project1",
            "organisation": self.org.id,
            "contact_name": "name1",
            "contact_email": "a@a.com",
            "implementation_overview": "overview",
            "implementation_dates": "2016",
            "health_focus_areas": ["area1", "area2"],
            "geographic_scope": "somewhere",
            "country": country.id,
            "platforms": [{
                "name": "platform1",
                "strategies": ["strat1", "strat2"]
            }, {
                "name": "platform2",
                "strategies": ["strat1", "strat9"]
            }],
            "licenses": ["lic1", "lic2"],  # Can hold 'other' fields
            "coverage": [
                {"district": "dist1", "clients": 20, "health_workers": 5, "facilities": 4},
                {"district": "dist2", "clients": 10, "health_workers": 2, "facilities": 8}
            ],
            "national_level_deployment":
                {"clients": 20000, "health_workers": 0, "facilities": 0},
            "donors": ["donor1", "donor2"],
            "his_bucket": ["tax1", "tax2"],
            "hsc_challenges": ["challange1", "challange2"],
            "interventions": ["int1", "int2", "int3"],
            "government_investor": True,
            "implementing_partners": ["partner1", "partner2"],
            "repository": "http://some.repo",
            "mobile_application": "app1, app2",
            "wiki": "http://wiki.org",
            "interoperability_links": [None, "http://blabla.com", None, None, None, None, None, None,
                                       "http://example.org"],
            "interoperability_standards": ["CSD - Care Services Discovery"],
            "data_exchanges": ["de1", "de2"],
            "start_date": str(datetime.today().date()),
            "end_date": str(datetime.today().date())
        }

        url = reverse("project-crud")
        response = self.test_user_client.post(url, self.project_data, format="json")
        self.project_id = response.json().get("id")

        url = reverse("project-groups", kwargs={"pk": self.project_id})
        groups = {
            "team": [self.user_profile_id],
            "viewers": []
        }
        self.test_user_client.put(url, groups)

    def test_set_score(self):
        url = reverse("toolkit-scores", kwargs={"project_id": self.project_id})
        data = {
                "axis": 0,
                "domain": 0,
                "question": 0,
                "answer": 0,
                "value": 2
            }
        response = self.test_user_client.post(url, data, format="json")
        self.assertEqual(response.status_code, 200)
        toolkit = Toolkit.objects.get_object_or_none(project=self.project_id)
        self.assertEqual(toolkit.data[0]["domains"][0]["questions"][0]["answers"][0], 2)

    def test_set_score_fail(self):
        url = reverse("toolkit-scores", kwargs={"project_id": self.project_id})
        data = {
                "axis": 0,
                "domain": 0,
                "question": 0,
                "answer": 0,
                "value": "2s"
            }
        response = self.test_user_client.post(url, data, format="json")
        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.json()['value'][0], 'A valid integer is required.')

    def test_set_score_wrong_index(self):
        url = reverse("toolkit-scores", kwargs={"project_id": self.project_id})
        data = {
                "axis": 999,
                "domain": 0,
                "question": 0,
                "answer": 0,
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
                "answer": 0,
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
                "answer": 0,
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
                "answer": 0,
                "value": 2
            }
        response = self.test_user_client.post(url, data, format="json")
        data = {
                "axis": 0,
                "domain": 1,
                "question": 0,
                "answer": 0,
                "value": 3
            }
        response = self.test_user_client.post(url, data, format="json")
        url = reverse("toolkit-data", kwargs={"project_id": self.project_id})
        response = self.test_user_client.get(url, format="json")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()[0]["domains"][0]["questions"][0]["answers"][0], 2)
        self.assertEqual(response.json()[0]["domains"][0]["domain_sum"], 2)
        self.assertEqual(ceil(response.json()[0]["domains"][0]["domain_percentage"]), 100)
        self.assertEqual(ceil(response.json()[0]["domains"][0]["domain_completion"]), 100)
        self.assertEqual(response.json()[0]["domains"][1]["questions"][0]["answers"][0], 3)
        self.assertEqual(response.json()[0]["domains"][1]["domain_sum"], 3)
        self.assertEqual(ceil(response.json()[0]["domains"][1]["domain_percentage"]), 14)
        self.assertEqual(ceil(response.json()[0]["domains"][1]["domain_completion"]), 10)
        self.assertEqual(ceil(response.json()[0]["axis_score"]), 38)
        self.assertEqual(ceil(response.json()[0]["axis_completion"]), 9)

    def test_send_daily_toolkit_digest(self):
        url = reverse("toolkit-scores", kwargs={"project_id": self.project_id})
        data = {
                "axis": 0,
                "domain": 0,
                "question": 0,
                "answer": 0,
                "value": 2
            }
        response = self.test_user_client.post(url, data, format="json")
        tasks.send_daily_toolkit_digest()
        self.assertEqual(mail.outbox[1].subject, "MAPS Toolkit updated!")
