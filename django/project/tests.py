import copy
import tempfile
from datetime import datetime

from django.test import TestCase
from django.test.client import Client
from django.core.urlresolvers import reverse
from django.test.client import MULTIPART_CONTENT, BOUNDARY, encode_multipart
from allauth.account.models import EmailConfirmation

from .models import Strategy, Technology, Application, Pipeline, Publication
from .models import Report

class ProjectTests(TestCase):

    def setUp(self):
        # Create a test user with profile.
        url = reverse("rest_register")
        data = {
            "email": "test_user@gmail.com",
            "password1": "123456",
            "password2": "123456"}
        response = self.client.post(url, data)
        self.test_user_key = response.json().get("key")
        self.test_user_client = Client(HTTP_AUTHORIZATION="Token {}".format(self.test_user_key))

        # Validate the account.
        key = EmailConfirmation.objects.get(email_address__email="test_user@gmail.com").key
        url = reverse("rest_verify_email")
        data = {
            "key": key,
        }
        response = self.client.post(url, data)

        # Create profile.
        url = reverse("userprofile-list")
        data = {
            "name": "Test Name",
            "organisation": "test_org",
            "country": "test_country"}
        response = self.test_user_client.post(url, data)

        # Log in the user.
        url = reverse("rest_login")
        data = {
            "email": "test_user@gmail.com",
            "password": "123456"}
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

        # Create Project with other, publications and reports.
        data = copy.deepcopy(self.project_data)
        data.update(name="Test Project2")
        data.update(publications=[{"url": "http://test.com"},{"url": "http://test.com"}])
        data.update(reports=[{"url": "http://test.com"},{"url": "http://test.com"}])
        data.update(strategy_other=["other_strat1", "other_strat2"])
        data.update(technology_other=["other_tech1", "other_tech2"])
        data.update(pipeline_other=["other_pipe1", "other_pipe2"])
        file1 = tempfile.NamedTemporaryFile(suffix=".pdf")
        file2 = tempfile.NamedTemporaryFile(suffix=".pdf")
        file3 = tempfile.NamedTemporaryFile(suffix=".pdf")
        file4 = tempfile.NamedTemporaryFile(suffix=".pdf")
        pub_files = {"publication_0": file1, "publication_1": file2}
        report_files = {"report_0": file3, "report_1": file4}
        data.update(pub_files)
        data.update(report_files)
        response = self.test_user_client.post(url, data, format="multipart")
        self.pub_rep_other_project_id = response.json().get("id")

    def test_create_new_project_basic_data(self):
        url = reverse("project-list")
        data = copy.deepcopy(self.project_data)
        data.update(name="Test Project3")
        response = self.test_user_client.post(url, data)
        self.assertEqual(response.status_code, 201)

    def test_create_new_project_bad_data(self):
        url = reverse("project-list")
        data = copy.deepcopy(self.project_data)
        data.update(name="")
        data.update(organisation="")
        data.update(clients="foo")
        data.update(health_workers="foo")
        data.update(facilities="foo")
        response = self.test_user_client.post(url, data)
        self.assertEqual(response.status_code, 400)

    def test_retrieve_project(self):
        url = reverse("project-detail", kwargs={"pk": self.project_id})
        response = self.test_user_client.get(url)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json().get("name"), "Test Project1")

    def test_create_new_project_with_other_data(self):
        url = reverse("project-list")
        data = copy.deepcopy(self.project_data)
        data.update(name="Test Project4")
        data.update(strategy_other=["other1", "other2"])
        data.update(technology_other=["other1", "other2"])
        data.update(pipeline_other=["other1", "other2"])
        response = self.test_user_client.post(url, data)
        self.assertEqual(response.status_code, 201)
        self.assertEqual(len(response.json().get("strategy")), 4)
        self.assertEqual(len(response.json().get("technology")), 4)
        self.assertEqual(len(response.json().get("pipeline")), 4)

    def test_create_retrieve_new_project_with_rep_pub(self):
        url = reverse("project-list")
        data = copy.deepcopy(self.project_data)
        data.update(name="Test Project4")
        data.update(publications=[{"url": "http://test.com"},{"url": "http://test.com"}])
        data.update(reports=[{"url": "http://test.com"},{"url": "http://test.com"}])
        file1 = tempfile.NamedTemporaryFile(suffix=".pdf")
        file2 = tempfile.NamedTemporaryFile(suffix=".pdf")
        file3 = tempfile.NamedTemporaryFile(suffix=".pdf")
        file4 = tempfile.NamedTemporaryFile(suffix=".pdf")
        pub_files = {"publication_0": file1, "publication_1": file2}
        report_files = {"report_0": file3, "report_1": file4}
        data.update(pub_files)
        data.update(report_files)
        response = self.test_user_client.post(url, data, format="multipart")
        self.assertEqual(response.status_code, 201)

    def test_retrieve_project_with_pub_rep_data(self):
        url = reverse("project-detail", kwargs={"pk": self.pub_rep_other_project_id})
        response = self.test_user_client.get(url)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.json().get("reports")), 4)
        self.assertEqual(len(response.json().get("publications")), 4)

    def test_update_project_with_pub_rep(self):
        url = reverse("project-detail", kwargs={"pk": self.pub_rep_other_project_id})
        response = self.test_user_client.get(url)
        data = response.json()
        url = reverse("project-detail", kwargs={"pk": data.get("id")})
        data["publications"].pop()
        data["reports"].pop()
        response = self.test_user_client.put(
                                url,
                                data=encode_multipart(BOUNDARY, data),
                                content_type=MULTIPART_CONTENT)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.json().get("reports")), 3)
        self.assertEqual(len(response.json().get("publications")), 3)

    def test_retrieve_reports_and_publications(self):
        url = reverse("project-detail", kwargs={"pk": self.pub_rep_other_project_id})
        response = self.test_user_client.get(url)
        data = response.json()
        url = reverse("get-publication", kwargs={"pk": data["publications"][0]["id"]})
        response = self.test_user_client.get(url)
        self.assertEqual(response.status_code, 200)
        url = reverse("get-report", kwargs={"pk": data["reports"][0]["id"]})
        response = self.test_user_client.get(url)
        self.assertEqual(response.status_code, 200)

    def test_retrieve_project_detail_template(self):
        url = reverse("template-project-detail")
        response = self.test_user_client.get(url)
        self.assertEqual(response.status_code, 200)
        self.assertContains(response, "Strategy1")
        self.assertContains(response, "Technology1")
        self.assertContains(response, "Pipeline1")
        self.assertContains(response, "Application1")

    def test_retrieve_project_detail_template_id(self):
        url = reverse("template-project-detail-id", kwargs={"project_id": self.pub_rep_other_project_id})
        response = self.test_user_client.get(url)
        self.assertEqual(response.status_code, 200)
        self.assertContains(response, "Strategy1")
        self.assertContains(response, "other_strat1")
        self.assertContains(response, "Technology1")
        self.assertContains(response, "other_tech1")
        self.assertContains(response, "Pipeline1")
        self.assertContains(response, "other_pipe1")
        self.assertContains(response, "Application1")

    def test_retrieve_project_detail_template_wrong_id(self):
        url = reverse("template-project-detail-id", kwargs={"project_id": 999})
        response = self.test_user_client.get(url)
        self.assertEqual(response.status_code, 400)
