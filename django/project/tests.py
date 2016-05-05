import copy
import tempfile
from datetime import datetime

from django.core.urlresolvers import reverse
from django.test.client import MULTIPART_CONTENT, BOUNDARY, encode_multipart
from allauth.account.models import EmailConfirmation
from rest_framework.test import APIClient
from rest_framework.test import APITestCase

from country.models import Country


class ProjectTests(APITestCase):

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

        url = reverse("file-list", kwargs={"project_id": self.project_id})
        data = {}
        file1 = tempfile.NamedTemporaryFile(suffix=".pdf")
        file2 = tempfile.NamedTemporaryFile(suffix=".pdf")
        file3 = tempfile.NamedTemporaryFile(suffix=".pdf")
        file4 = tempfile.NamedTemporaryFile(suffix=".pdf")
        pub_files = {"publication_0": file1, "publication_1": file2}
        report_files = {"report_0": file3, "report_1": file4}
        data.update(pub_files)
        data.update(report_files)
        response = self.test_user_client.post(url, data, format="multipart")

    def test_retrieve_project_srtucture(self):
        url = reverse("get-project-structure")
        response = self.test_user_client.get(url)
        self.assertEqual(response.status_code, 200)
        self.assertContains(response, "countries")
        self.assertContains(response, "strategies")

    def test_create_new_project_basic_data(self):
        url = reverse("project-list")
        data = copy.deepcopy(self.project_data)
        data.update(name="Test Project3")
        response = self.test_user_client.post(url, data)
        self.assertEqual(response.status_code, 201)

    def test_update_project(self):
        url = reverse("project-detail", kwargs={"pk": self.project_id})
        data = copy.deepcopy(self.project_data)
        data.update(name="Test Project5")
        response = self.test_user_client.post(url, data)
        self.assertEqual(response.status_code, 200)

    def test_create_new_project_bad_data(self):
        url = reverse("project-list")
        data = copy.deepcopy(self.project_data)
        data.update(name="")
        data.update(organisation="")
        response = self.test_user_client.post(url, data)
        self.assertEqual(response.status_code, 400)

    def test_retrieve_project(self):
        url = reverse("project-detail", kwargs={"pk": self.project_id})
        response = self.test_user_client.get(url)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json().get("name"), "Test Project1")

    def test_retrieve_project_list(self):
        url = reverse("project-list")
        response = self.test_user_client.get(url)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()[0].get("name"), "Test Project1")

    def test_upload_files_to_project(self):
        url = reverse("file-list", kwargs={"project_id": self.project_id})
        data = {}
        file1 = tempfile.NamedTemporaryFile(suffix=".pdf")
        file2 = tempfile.NamedTemporaryFile(suffix=".pdf")
        file3 = tempfile.NamedTemporaryFile(suffix=".pdf")
        file4 = tempfile.NamedTemporaryFile(suffix=".pdf")
        pub_files = {"publication_0": file1, "publication_1": file2}
        report_files = {"report_0": file3, "report_1": file4}
        data.update(pub_files)
        data.update(report_files)
        response = self.test_user_client.post(url, data, format="multipart")
        self.assertEqual(response.status_code, 200)

    def test_retrieve_file(self):
        url = reverse("file-list", kwargs={"project_id": self.project_id})
        response = self.test_user_client.get(url)
        data = response.json()
        url = reverse("file-detail", kwargs={"pk": data[0]["id"]})
        response = self.test_user_client.get(url)
        self.assertEqual(response.status_code, 200)

    def test_delete_file(self):
        url = reverse("file-list", kwargs={"project_id": self.project_id})
        response = self.test_user_client.get(url)
        data = response.json()
        url = reverse("file-detail", kwargs={"pk": data[0]["id"]})
        response = self.test_user_client.delete(url)
        self.assertEqual(response.status_code, 204)

    def test_make_version(self):
        url = reverse("make-version", kwargs={"project_id": self.project_id})
        response = self.test_user_client.post(url)
        self.assertEqual(response.status_code, 201)

    def test_make_version_wrong_id(self):
        url = reverse("make-version", kwargs={"project_id": 999})
        response = self.test_user_client.post(url)
        self.assertEqual(response.status_code, 400)

    def test_get_coverage_versions(self):
        url = reverse("make-version", kwargs={"project_id": self.project_id})
        response = self.test_user_client.post(url)
        url = reverse("get-coverage-versions", kwargs={"project_id": self.project_id})
        response = self.test_user_client.get(url)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.json()), 1)

    def test_get_toolkit_versions(self):
        url = reverse("make-version", kwargs={"project_id": self.project_id})
        response = self.test_user_client.post(url)
        url = reverse("get-toolkit-versions", kwargs={"project_id": self.project_id})
        response = self.test_user_client.get(url)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.json()), 1)

    def test_version_numbers_increasing(self):
        url = reverse("make-version", kwargs={"project_id": self.project_id})
        response = self.test_user_client.post(url)
        response = self.test_user_client.post(url)
        url = reverse("get-toolkit-versions", kwargs={"project_id": self.project_id})
        response = self.test_user_client.get(url)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.json()), 2)
        self.assertEqual(response.json()[1]["version"], 2)
