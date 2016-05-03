from datetime import datetime

from django.core.urlresolvers import reverse
from allauth.account.models import EmailConfirmation
from rest_framework.test import APIClient
from rest_framework.test import APITestCase

from country.models import Country
from .models import HSS


class HSSTests(APITestCase):

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

    def test_default_hss_created(self):
        hss = HSS.objects.get_object_or_none(project=self.project_id)
        self.assertNotEqual(hss, None)
        self.assertEqual(hss.data["continuum"][0]["column_id"], 0)

    def test_set_single_bubble(self):
        url = reverse("hss-bubbles", kwargs={"project_id": self.project_id})
        data = [{
                "app_id": 1,
                "subapp_id": 0,
                "column_id": 0,
                "colspan": 1,
                "content": "Lorem ipsum blah."
            }]
        response = self.test_user_client.post(url, data, format="json")
        self.assertEqual(response.status_code, 200)
        hss = HSS.objects.get_object_or_none(project=self.project_id)
        self.assertEqual(hss.data["applications"][0]["content"], "Lorem ipsum blah.")

    def test_set_bubble_wrong_project_id(self):
        url = reverse("hss-bubbles", kwargs={"project_id": 999})
        data = [{
                "app_id": 1,
                "subapp_id": 0,
                "column_id": 0,
                "colspan": 1,
                "content": "Lorem ipsum blah."
            }]
        response = self.test_user_client.post(url, data, format="json")
        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.json()["details"], "No such project.")

    def test_wrong_input_data(self):
        url = reverse("hss-bubbles", kwargs={"project_id": 999})
        data = [{
                "app_id": "1",
                "subapp_id": True,
                "column_id": 0,
                "colspan": 1,
                "content": 2222
            }]
        response = self.test_user_client.post(url, data, format="json")
        self.assertEqual(response.status_code, 400)

    def test_update_single_bubble(self):
        url = reverse("hss-bubbles", kwargs={"project_id": self.project_id})
        data = [{
                "app_id": 1,
                "subapp_id": 0,
                "column_id": 0,
                "colspan": 1,
                "content": "Lorem ipsum blah."
            }]
        response = self.test_user_client.post(url, data, format="json")
        data = [{
                "app_id": 1,
                "subapp_id": 0,
                "column_id": 0,
                "colspan": 1,
                "content": "Lorem ipsum blah updated."
            }]
        response = self.test_user_client.post(url, data, format="json")
        self.assertEqual(response.status_code, 200)
        hss = HSS.objects.get_object_or_none(project=self.project_id)
        self.assertEqual(len(hss.data["applications"]), 1)
        self.assertEqual(hss.data["applications"][0]["content"], "Lorem ipsum blah updated.")

    def test_add_new_single_bubble(self):
        url = reverse("hss-bubbles", kwargs={"project_id": self.project_id})
        data = [{
                "app_id": 1,
                "subapp_id": 0,
                "column_id": 0,
                "colspan": 1,
                "content": "Lorem ipsum blah."
            }]
        response = self.test_user_client.post(url, data, format="json")
        data = [{
                "app_id": 2,
                "subapp_id": 0,
                "column_id": 0,
                "colspan": 1,
                "content": "Lorem ipsum blah new."
            }]
        response = self.test_user_client.post(url, data, format="json")
        self.assertEqual(response.status_code, 200)
        hss = HSS.objects.get_object_or_none(project=self.project_id)
        self.assertEqual(len(hss.data["applications"]), 2)
        self.assertEqual(hss.data["applications"][1]["content"], "Lorem ipsum blah new.")

    def test_add_span_bubble(self):
        url = reverse("hss-bubbles", kwargs={"project_id": self.project_id})
        data = [{
                "app_id": 1,
                "subapp_id": 0,
                "column_id": 0,
                "colspan": 2,
                "content": "Lorem ipsum blah."
            },
            {
                "app_id": 1,
                "subapp_id": 0,
                "column_id": 1,
                "colspan": 0,
                "content": ""
            }]
        response = self.test_user_client.post(url, data, format="json")
        self.assertEqual(response.status_code, 200)
        hss = HSS.objects.get_object_or_none(project=self.project_id)
        self.assertEqual(len(hss.data["applications"]), 2)
        self.assertEqual(hss.data["applications"][0]["content"], "Lorem ipsum blah.")

    def test_update_continuum(self):
        url = reverse("hss-continuum", kwargs={"project_id": self.project_id})
        data = {
                "column_id": 0,
                "mother": True,
                "child": True
            }
        response = self.test_user_client.post(url, data, format="json")
        self.assertEqual(response.status_code, 200)
        hss = HSS.objects.get_object_or_none(project=self.project_id)
        self.assertTrue(hss.data["continuum"][0]["mother"])
        self.assertTrue(hss.data["continuum"][0]["child"])

    def test_update_continuum_only_mother(self):
        url = reverse("hss-continuum", kwargs={"project_id": self.project_id})
        data = {
                "column_id": 0,
                "mother": True
            }
        response = self.test_user_client.post(url, data, format="json")
        self.assertEqual(response.status_code, 200)
        hss = HSS.objects.get_object_or_none(project=self.project_id)
        self.assertTrue(hss.data["continuum"][0]["mother"])
        self.assertFalse(hss.data["continuum"][0]["child"])

    def test_update_continuum_wrong_project_id(self):
        url = reverse("hss-continuum", kwargs={"project_id": 999})
        data = {
                "column_id": 0,
                "mother": True,
                "child": True
            }
        response = self.test_user_client.post(url, data, format="json")
        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.json()["details"], "No such project.")

    def test_update_continuum_wrong_data(self):
        url = reverse("hss-continuum", kwargs={"project_id": self.project_id})
        data = {
                "column_id": 0,
                "mother": 24,
                "child": "foo"
            }
        response = self.test_user_client.post(url, data, format="json")
        self.assertEqual(response.status_code, 400)

    def test_set_constrains(self):
        url = reverse("hss-constraints", kwargs={"project_id": self.project_id})
        data = [
                {"name": "Information", "icon": "info", "active": True},
                {"name": "Availability", "icon": "check", "active": False},
                {"name": "Quality", "icon": "star", "active": True},
                {"name": "Acceptability", "icon": "accessibility", "active": True}
            ]
        response = self.test_user_client.post(url, data, format="json")
        self.assertEqual(response.status_code, 200)
        hss = HSS.objects.get_object_or_none(project=self.project_id)
        self.assertEqual(hss.data["constraints"][0]["name"], "Information")
        self.assertEqual(hss.data["constraints"][0]["active"], True)
        self.assertEqual(len(hss.data["constraints"]), 4)

    def test_set_constrains_wrong_project_id(self):
        url = reverse("hss-constraints", kwargs={"project_id": 999})
        data = [
                {"name": "Information", "icon": "info", "active": True},
                {"name": "Availability", "icon": "check", "active": False},
                {"name": "Quality", "icon": "star", "active": True},
                {"name": "Acceptability", "icon": "accessibility", "active": True}
            ]
        response = self.test_user_client.post(url, data, format="json")
        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.json()["details"], "No such project.")

    def test_set_constrains_wrong_data(self):
        url = reverse("hss-constraints", kwargs={"project_id": 999})
        data = [
                {"name": 4454544, "icon": "info", "active": "asdas"},
                {"name": "Availability", "icon": "check", "active": False},
                {"name": "Quality", "icon": "star", "active": True},
                {"name": "Acceptability", "icon": "accessibility", "active": True}
            ]
        response = self.test_user_client.post(url, data, format="json")
        self.assertEqual(response.status_code, 400)

    def test_update_constrains(self):
        url = reverse("hss-constraints", kwargs={"project_id": self.project_id})
        data = [
                {"name": "Information", "icon": "info", "active": True},
                {"name": "Availability", "icon": "check", "active": False},
                {"name": "Quality", "icon": "star", "active": True},
            ]
        response = self.test_user_client.post(url, data, format="json")
        data = [
                {"name": "Information", "icon": "info", "active": False},
                {"name": "Availability", "icon": "check", "active": False},
                {"name": "Quality", "icon": "star", "active": True},
                {"name": "Acceptability", "icon": "accessibility", "active": True}
            ]
        response = self.test_user_client.post(url, data, format="json")
        self.assertEqual(response.status_code, 200)
        hss = HSS.objects.get_object_or_none(project=self.project_id)
        self.assertEqual(hss.data["constraints"][0]["name"], "Information")
        self.assertEqual(hss.data["constraints"][0]["active"], False)
        self.assertEqual(len(hss.data["constraints"]), 4)

    def test_update_interventions(self):
        url = reverse("hss-interventions", kwargs={"project_id": self.project_id})
        data = {
                "column_id": 0,
                "interventions": [1,2],
            }
        response = self.test_user_client.post(url, data, format="json")
        self.assertEqual(response.status_code, 200)
        hss = HSS.objects.get_object_or_none(project=self.project_id)
        self.assertEqual(hss.data["interventions"][0]["interventions"], [1,2])

    def test_update_interventions_wrong_project_id(self):
        url = reverse("hss-interventions", kwargs={"project_id": 999})
        data = {
                "column_id": 0,
                "interventions": [1,2],
            }
        response = self.test_user_client.post(url, data, format="json")
        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.json()["details"], "No such project.")

    def test_update_continuum_wrong_data(self):
        url = reverse("hss-interventions", kwargs={"project_id": self.project_id})
        data = {
                "column_id": "dadsdasd",
                "interventions": 234324,
            }
        response = self.test_user_client.post(url, data, format="json")
        self.assertEqual(response.status_code, 400)

    def test_set_taxonomy(self):
        url = reverse("hss-taxonomies", kwargs={"project_id": self.project_id})
        data = {
                "app_id": 1,
                "subapp_id": 0,
                "content": ["val1", "val2"]
            }
        response = self.test_user_client.post(url, data, format="json")
        self.assertEqual(response.status_code, 200)
        hss = HSS.objects.get_object_or_none(project=self.project_id)
        self.assertEqual(hss.data["taxonomies"][0]["content"], ["val1", "val2"])

    def test_set_taxonomy_wrong_project_id(self):
        url = reverse("hss-taxonomies", kwargs={"project_id": 999})
        data = {
                "app_id": 1,
                "subapp_id": 0,
                "content": ["val1", "val2"]
            }
        response = self.test_user_client.post(url, data, format="json")
        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.json()["details"], "No such project.")

    def test_taxonomy_wrong_input_data(self):
        url = reverse("hss-taxonomies", kwargs={"project_id": self.project_id})
        data = {
                "app_id": "adsds",
                "subapp_id": 0,
                "content": 4234234
            }
        response = self.test_user_client.post(url, data, format="json")
        self.assertEqual(response.status_code, 400)

    def test_update_taxonomy(self):
        url = reverse("hss-taxonomies", kwargs={"project_id": self.project_id})
        data = {
                "app_id": 1,
                "subapp_id": 0,
                "content": ["val1", "val2"]
            }
        response = self.test_user_client.post(url, data, format="json")
        data = {
                "app_id": 1,
                "subapp_id": 0,
                "content": ["val1_updated", "val2"]
            }
        response = self.test_user_client.post(url, data, format="json")
        self.assertEqual(response.status_code, 200)
        hss = HSS.objects.get_object_or_none(project=self.project_id)
        self.assertEqual(hss.data["taxonomies"][0]["content"], ["val1_updated", "val2"])

    def test_get_hss_data(self):
        url = reverse("hss-data", kwargs={"project_id": self.project_id})
        response = self.test_user_client.get(url, format="json")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()["continuum"][0]["column_id"], 0)

    def test_get_hss_data_wrong_project_id(self):
        url = reverse("hss-data", kwargs={"project_id": 999})
        response = self.test_user_client.get(url, format="json")
        self.assertEqual(response.status_code, 400)

    def test_get_hss_structure(self):
        url = reverse("hss-structure")
        response = self.test_user_client.get(url, format="json")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()["continuum"][0]["id"], 0)
