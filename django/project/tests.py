import copy
import tempfile
from datetime import datetime

from django.core import mail
from django.core.files.uploadedfile import SimpleUploadedFile
from django.core.urlresolvers import reverse
from django.test.client import MULTIPART_CONTENT, BOUNDARY, encode_multipart
from allauth.account.models import EmailConfirmation
from rest_framework.test import APIClient
from rest_framework.test import APITestCase

from country.models import Country
from user.models import Organisation, UserProfile
from .models import PartnerLogo, Project


class SetupTests(APITestCase):

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

        # Update profile.
        self.org = Organisation.objects.create(name="org1")
        url = reverse("userprofile-detail", kwargs={"pk": self.user_profile_id})
        data = {
            "name": "Test Name",
            "organisation": self.org.id,
            "country": "test_country"}
        response = self.test_user_client.put(url, data)
        self.user_profile_id = response.json().get('id')

        country = Country.objects.create(name="country1")
        country.save()
        self.country_id = country.id

        self.project_data = {
            "date": datetime.utcnow(),
            "name": "Test Project1",
            "organisation": self.org.id,
            "contact_name": "name1",
            "contact_email": "a@a.com",
            "implementation_overview": "overview",
            "implementation_dates": "2016",
            "geographic_coverage": "somewhere",
            "intervention_areas": ["area1", "area2"],
            "strategy": ["strat1", "strat2"],   # Can hold 'other' fields
            "country": self.country_id,
            "objective": "objective1",
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

        url = reverse("project-crud")
        response = self.test_user_client.post(url, self.project_data, format="json")
        self.project_id = response.json().get("id")

        url = reverse("project-files", kwargs={"project_id": self.project_id})
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


class ProjectTests(SetupTests):

    def test_retrieve_project_structure(self):
        url = reverse("get-project-structure")
        response = self.test_user_client.get(url)
        self.assertEqual(response.status_code, 200)
        self.assertContains(response, "countries")
        self.assertContains(response, "strategies")
        self.assertContains(response, "intervention_areas")

    def test_create_new_project_basic_data(self):
        url = reverse("project-crud")
        data = copy.deepcopy(self.project_data)
        data.update(name="Test Project3")
        response = self.test_user_client.post(url, data)
        self.assertEqual(response.status_code, 201)

    def test_update_project(self):
        url = reverse("project-detail", kwargs={"pk": self.project_id})
        data = copy.deepcopy(self.project_data)
        data.update(goals_to_scale="updated")
        response = self.test_user_client.put(url, data)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()["goals_to_scale"], "updated")

    def test_create_new_project_unique_name(self):
        url = reverse("project-crud")
        response = self.test_user_client.post(url, self.project_data)
        self.assertEqual(response.status_code, 400)

    def test_create_new_project_bad_data(self):
        url = reverse("project-crud")
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
        self.assertEqual(response.json().get("objective"), "objective1")
        self.assertEqual(response.json().get("organisation_name"), self.org.name)

    def test_retrieve_project_list(self):
        url = reverse("project-list")
        response = self.test_user_client.get(url)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()[0].get("name"), "Test Project1")

    def test_upload_files_to_project(self):
        url = reverse("project-files", kwargs={"project_id": self.project_id})
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
        self.assertIn("id", response.json()[0])

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
        url = reverse("file-delete", kwargs={"pk": data[0]["id"]})
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

    def test_retrieve_last_version(self):
        url = reverse("make-version", kwargs={"project_id": self.project_id})
        response = self.test_user_client.post(url)
        url = reverse("project-detail", kwargs={"pk": self.project_id})
        response = self.test_user_client.get(url)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json().get("name"), "Test Project1")
        self.assertEqual(response.json().get("last_version"), 1)
        self.assertIn("last_version_date", response.json())

    def test_upload_partnerlogo(self):
        url = reverse("project-partnerlogo", kwargs={"project_id": self.project_id})
        data = {}
        file1 = tempfile.NamedTemporaryFile(suffix=".png")
        file2 = tempfile.NamedTemporaryFile(suffix=".png")
        logo_files = {"logo1": file1, "logo2": file2}
        data.update(logo_files)
        response = self.test_user_client.post(url, data, format="multipart")
        self.assertEqual(response.status_code, 200)

    def test_upload_partnerlogo_wrong_project(self):
        url = reverse("project-partnerlogo", kwargs={"project_id": 999})
        data = {}
        file1 = tempfile.NamedTemporaryFile(suffix=".png")
        file2 = tempfile.NamedTemporaryFile(suffix=".png")
        logo_files = {"logo1": file1, "logo2": file2}
        data.update(logo_files)
        response = self.test_user_client.post(url, data, format="multipart")
        self.assertEqual(response.status_code, 400)

    def test_retrieve_partnerlogos_list(self):
        url = reverse("project-partnerlogo", kwargs={"project_id": self.project_id})
        data = {}
        file1 = tempfile.NamedTemporaryFile(suffix=".png")
        file2 = tempfile.NamedTemporaryFile(suffix=".png")
        logo_files = {"logo1": file1, "logo2": file2}
        data.update(logo_files)
        response = self.test_user_client.post(url, data, format="multipart")
        url = reverse("partnerlogo-list", kwargs={"project_id": self.project_id})
        response = self.test_user_client.get(url)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.json()), 2)

    def test_delete_partnerlogo(self):
        url = reverse("project-partnerlogo", kwargs={"project_id": self.project_id})
        data = {}
        file1 = tempfile.NamedTemporaryFile(suffix=".png")
        file2 = tempfile.NamedTemporaryFile(suffix=".png")
        logo_files = {"logo1": file1, "logo2": file2}
        data.update(logo_files)
        response = self.test_user_client.post(url, data, format="multipart")
        logo = PartnerLogo.objects.all().first()
        url = reverse("partnerlogo-delete", kwargs={"pk": logo.id})
        response = self.test_user_client.delete(url)
        self.assertEqual(response.status_code, 204)

    def test_upload_partnerlogo_returns_list_of_ids_urls(self):
        url = reverse("project-partnerlogo", kwargs={"project_id": self.project_id})
        data = {}
        file1 = tempfile.NamedTemporaryFile(suffix=".png")
        file2 = tempfile.NamedTemporaryFile(suffix=".png")
        logo_files = {"logo1": file1, "logo2": file2}
        data.update(logo_files)
        response = self.test_user_client.post(url, data, format="multipart")
        self.assertEqual(response.status_code, 200)
        self.assertIsInstance(response.json(), list)
        self.assertEqual(len(response.json()), 2)
        self.assertIn("data", response.data[0])
        self.assertIn("id", response.data[0])

    def test_list_partnerlogos_returns_list_with_urls(self):
        url = reverse("project-partnerlogo", kwargs={"project_id": self.project_id})
        data = {}
        image1 = tempfile.NamedTemporaryFile(suffix=".png")
        image2 = tempfile.NamedTemporaryFile(suffix=".png")
        logo_files = {"logo1": image1, "logo2": image2}
        data.update(logo_files)
        response = self.test_user_client.post(url, data, format="multipart")
        url = reverse("partnerlogo-list", kwargs={"project_id": self.project_id})
        response = self.test_user_client.get(url)
        self.assertIsInstance(response.json(), list)
        self.assertEqual(len(response.json()), 2)
        self.assertIn("data", response.data[0])
        self.assertIn("id", response.data[0])

    def test_retrieve_project_list_by_country(self):
        project_data = {
            "date": datetime.utcnow(),
            "name": "Test Project2",
            "organisation": self.org.id,
            "contact_name": "name1",
            "contact_email": "a@a.com",
            "implementation_overview": "overview",
            "implementation_dates": "2016",
            "geographic_coverage": "somewhere",
            "intervention_areas": ["area1", "area2"],
            "strategy": ["strat1", "strat2"],   # Can hold 'other' fields
            "country": self.country_id,
            "objective": "objective1",
            "technology_platforms": ["tech1", "tech2"],  # Can hold 'other' fields
            "licenses": ["lic1", "lic2"],  # Can hold 'other' fields
            "application": ["app1", "app2"],
            "coverage": [
                {"district": "dist1", "clients": 20, "health_workers": 5, "facilities": 4},
                {"district": "dist2", "clients": 10, "health_workers": 2, "facilities": 8}
            ],
            "started": datetime.utcnow(),
            "donors": ["donor3", "donor4"],  # Should be text instead of ID - no Donors in MVP
            "reports": ["http://foo.com", "http://bar.com"],
            "publications": ["http://foo.com", "http://bar.com"],
            "pipeline": ["pip1", "pip2"],  # Can hold 'other' fields
            "goals_to_scale": "scale",
            "anticipated_time": "time",
            "pre_assessment": [1,0,3,0,4,0],
        }
        url = reverse("project-crud")
        response = self.test_user_client.post(url, project_data, format="json")

        url = reverse("project-country-list", kwargs={"country_id": self.country_id})
        response = self.test_user_client.get(url)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()[0].get("name"), "Test Project1")
        self.assertEqual(len(response.json()), 2)

    def test_retrieve_project_list_by_country_all(self):
        # add a new project that I don't own
        project_data = {
            "date": datetime.utcnow(),
            "name": "Test Project2",
            "organisation": str(Organisation.objects.create(name="org2").id),
            "contact_name": "name1",
            "contact_email": "a@a.com",
            "implementation_overview": "overview",
            "implementation_dates": "2016",
            "geographic_coverage": "somewhere",
            "intervention_areas": ["area1", "area2"],
            "strategy": ["strat1", "strat2"],   # Can hold 'other' fields
            "country": self.country_id,
            "objective": "objective1",
            "technology_platforms": ["tech1", "tech2"],  # Can hold 'other' fields
            "licenses": ["lic1", "lic2"],  # Can hold 'other' fields
            "application": ["app1", "app2"],
            "coverage": [
                {"district": "dist1", "clients": 20, "health_workers": 5, "facilities": 4},
                {"district": "dist2", "clients": 10, "health_workers": 2, "facilities": 8}
            ],
            "started": datetime.utcnow(),
            "donors": ["donor3", "donor4"],  # Should be text instead of ID - no Donors in MVP
            "reports": ["http://foo.com", "http://bar.com"],
            "publications": ["http://foo.com", "http://bar.com"],
            "pipeline": ["pip1", "pip2"],  # Can hold 'other' fields
            "goals_to_scale": "scale",
            "anticipated_time": "time",
            "repository": "repos1",
            "mobile_application": "app1, app2",
            "wiki": "http://wiki",
            "pre_assessment": [1,0,3,0,4,0],
        }
        url = reverse("project-crud")
        response = self.test_user_client.post(url, project_data)

        url = reverse("project-country-list", kwargs={"country_id": self.country_id})
        response = self.test_user_client.get(url)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.json()), 2)
        self.assertEqual(response.json()[0].get("name"), "Test Project1")
        self.assertEqual(response.json()[1].get("name"), "Test Project2")

    def test_retrieve_project_list_all_without_country(self):
        url = reverse("project-all-list")
        response = self.test_user_client.get(url)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.json()), 1)
        self.assertEqual(response.json()[0]['country'], self.country_id)

    def test_retrieve_project_list_by_district_name(self):
        # add one new project to detect district name project duplications
        project_data = {
            "date": datetime.utcnow(),
            "name": "Test Project2",
            "organisation": self.org.id,
            "contact_name": "name1",
            "contact_email": "a@a.com",
            "implementation_overview": "overview",
            "implementation_dates": "2016",
            "geographic_coverage": "somewhere",
            "intervention_areas": ["area1", "area2"],
            "strategy": ["strat1", "strat2"],   # Can hold 'other' fields
            "country": self.country_id,
            "objective": "objective1",
            "technology_platforms": ["tech1", "tech2"],  # Can hold 'other' fields
            "licenses": ["lic1", "lic2"],  # Can hold 'other' fields
            "application": ["app1", "app2"],
            "coverage": [
                {"district": "dist1", "clients": 20, "health_workers": 5, "facilities": 4},
                {"district": "dist2", "clients": 10, "health_workers": 2, "facilities": 8}
            ],
            "started": datetime.utcnow(),
            "donors": ["donor3", "donor4"],  # Should be text instead of ID - no Donors in MVP
            "reports": ["http://foo.com", "http://bar.com"],
            "publications": ["http://foo.com", "http://bar.com"],
            "pipeline": ["pip1", "pip2"],  # Can hold 'other' fields
            "goals_to_scale": "scale",
            "anticipated_time": "time",
            "pre_assessment": [1,0,3,0,4,0],
        }
        url = reverse("project-list")
        response = self.test_user_client.post(url, project_data, format="json")

        url = reverse("project-by-district", kwargs={"country_id": self.country_id})
        response = self.test_user_client.get(url)
        self.assertEqual(response.status_code, 200)
        self.assertIsInstance(response.json(), dict)
        self.assertEqual(response.json().keys(), {"dist1": None, "dist2": None}.keys())

    def test_objective_wrong_data(self):
        url = reverse("project-detail", kwargs={"pk": self.project_id})
        data = copy.deepcopy(self.project_data)
        data.update(objective="a"*251)
        response = self.test_user_client.put(url, data)
        self.assertEqual(response.status_code, 400)

    def test_create_project_adds_owner_to_team(self):
        url = reverse("project-crud")
        data = copy.deepcopy(self.project_data)
        data.update(name="Test Project3")
        response = self.test_user_client.post(url, data)
        self.assertEqual(response.status_code, 201)
        userprofile = UserProfile.objects.get(name="Test Name")
        project = Project.objects.get(id=response.json()['id'])
        self.assertEqual(project.team.first(), userprofile)

    def test_by_user_manager(self):
        url = reverse("project-list")
        response = self.test_user_client.get(url)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()[0]['name'], "Test Project1")

    def test_project_group_list_team(self):
        url = reverse("project-groups", kwargs={"pk": self.project_id})
        response = self.test_user_client.get(url)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()['team'][0]['name'], "Test Name")
        self.assertEqual(response.json()['team'][0]['org'], self.org.name)

    def test_project_group_add_user_to_team(self):
        # Create a test user with profile.
        url = reverse("rest_register")
        data = {
            "email": "test_user2@gmail.com",
            "password1": "123456",
            "password2": "123456"}
        response = self.client.post(url, data)

        # Log in the user.
        url = reverse("api_token_auth")
        data = {
            "username": "test_user2@gmail.com",
            "password": "123456"}
        response = self.client.post(url, data)
        test_user_key = response.json().get("token")
        test_user_client = APIClient(HTTP_AUTHORIZATION="Token {}".format(test_user_key), format="json")
        user_profile_id = response.json().get("user_profile_id")

        # update profile.
        org = Organisation.objects.create(name="org2")
        url = reverse("userprofile-detail", kwargs={"pk": user_profile_id})
        data = {
            "name": "Test Name 2",
            "organisation": org.id,
            "country": "test_country"}
        response = test_user_client.put(url, data)

        user_profile_id = response.json()['id']

        url = reverse("project-groups", kwargs={"pk": self.project_id})

        groups = {
            "team": [user_profile_id],
            "viewers": []
        }
        response = self.test_user_client.put(url, groups)

        self.assertTrue("team" in response.json())
        self.assertTrue("viewers" in response.json())
        self.assertEqual(response.json()['team'], [user_profile_id])

        url = reverse("project-groups", kwargs={"pk": self.project_id})
        response = self.test_user_client.get(url)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()['team'][0]['id'], user_profile_id)
        self.assertEqual(response.json()['team'][0]['name'], "Test Name 2")
        self.assertEqual(response.json()['team'][0]['org'], org.name)

    def test_project_group_add_user_always_overwrites_all_groups(self):
        url = reverse("project-groups", kwargs={"pk": self.project_id})
        response = self.test_user_client.get(url)
        self.assertEqual(response.status_code, 200)
        owner_id = response.json()['team'][0]['id']

        # Create a test user with profile.
        url = reverse("rest_register")
        data = {
            "email": "test_user2@gmail.com",
            "password1": "123456",
            "password2": "123456"}
        response = self.client.post(url, data)

        # Log in the user.
        url = reverse("api_token_auth")
        data = {
            "username": "test_user2@gmail.com",
            "password": "123456"}
        response = self.client.post(url, data)
        test_user_key = response.json().get("token")
        test_user_client = APIClient(HTTP_AUTHORIZATION="Token {}".format(test_user_key), format="json")
        user_profile_id = response.json().get('user_profile_id')

        # update profile.
        org = Organisation.objects.create(name="org2")
        url = reverse("userprofile-detail", kwargs={"pk": user_profile_id})
        data = {
            "name": "Test Name 2",
            "organisation": org.id,
            "country": "test_country"}
        response = test_user_client.put(url, data)

        user_profile_id = response.json()['id']

        url = reverse("project-groups", kwargs={"pk": self.project_id})

        groups = {
            "team": [user_profile_id],
            "viewers": []
        }
        response = self.test_user_client.put(url, groups)

        self.assertTrue("team" in response.json())
        self.assertTrue("viewers" in response.json())
        self.assertTrue(owner_id not in response.json()['team'])
        self.assertEqual(response.json()['team'], [user_profile_id])

    def test_project_group_list_has_all_the_user_profiles_listed(self):
        url = reverse("project-groups", kwargs={"pk": self.project_id})
        response = self.test_user_client.get(url)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()['team'][0]['name'], "Test Name")
        self.assertEqual(response.json()['team'][0]['org'], self.org.name)
        self.assertTrue("user_profiles" in response.json())
        self.assertEqual(len(response.json().get('user_profiles')), UserProfile.objects.count())

    def test_update_project_updates_intervention_areas(self):
        url = reverse("project-detail", kwargs={"pk": self.project_id})
        response = self.test_user_client.get(url)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json().get('intervention_areas'), self.project_data['intervention_areas'])

        data = copy.deepcopy(self.project_data)
        data.update(intervention_areas=['area1'])
        response = self.test_user_client.put(url, data)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()["intervention_areas"], data['intervention_areas'])

        response = self.test_user_client.get(url)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json().get('intervention_areas'), data['intervention_areas'])

    def test_retrieve_project_list_all_has_all_new_fields(self):
        url = reverse("project-all-list")
        response = self.test_user_client.get(url)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.json()), 1)
        self.assertEqual(response.json()[0]['country'], self.country_id)
        self.assertIn("contact_name", response.json()[0])
        self.assertIn("contact_email", response.json()[0])
        self.assertIn("implementation_overview", response.json()[0])
        self.assertIn("implementing_partners", response.json()[0])
        self.assertIn("implementation_dates", response.json()[0])
        self.assertIn("geographic_coverage", response.json()[0])
        self.assertIn("intervention_areas", response.json()[0])

class PermissionTests(SetupTests):

    def test_team_member_can_update_project_groups(self):
        url = reverse("project-groups", kwargs={"pk": self.project_id})

        user_profile_id = UserProfile.objects.first().id
        groups = {
            "team": [user_profile_id],
            "viewers": [user_profile_id]
        }
        response = self.test_user_client.put(url, groups)

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()['team'], [user_profile_id])
        self.assertEqual(response.json()['viewers'], [user_profile_id])
        self.assertEqual(mail.outbox[1].subject, "You were added to a project!")

    def test_team_viewer_cannot_update_project_groups(self):
        url = reverse("project-groups", kwargs={"pk": self.project_id})
        response = self.test_user_client.get(url)
        self.assertEqual(response.status_code, 200)
        owner_id = response.json()['team'][0]['id']

        # Create a test user with profile.
        url = reverse("rest_register")
        data = {
            "email": "test_user2@gmail.com",
            "password1": "123456",
            "password2": "123456"}
        response = self.client.post(url, data)

        # Log in the user.
        url = reverse("api_token_auth")
        data = {
            "username": "test_user2@gmail.com",
            "password": "123456"}
        response = self.client.post(url, data)
        test_user_key = response.json().get("token")
        test_user_client = APIClient(HTTP_AUTHORIZATION="Token {}".format(test_user_key), format="json")
        user_profile_id = response.json().get('user_profile_id')

        # update profile.
        org = Organisation.objects.create(name="org2")
        url = reverse("userprofile-detail", kwargs={"pk": user_profile_id})
        data = {
            "name": "Test Name 2",
            "organisation": org.id,
            "country": "test_country"}
        response = test_user_client.put(url, data)

        user_profile_id = response.json()['id']

        url = reverse("project-groups", kwargs={"pk": self.project_id})

        groups = {
            "team": [owner_id],
            "viewers": [user_profile_id]
        }
        response = self.test_user_client.put(url, groups)

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()['team'], [owner_id])
        self.assertEqual(response.json()['viewers'], [user_profile_id])

        # try to update it with the viewer
        response = test_user_client.put(url, groups)
        self.assertEqual(response.status_code, 403)
        self.assertEqual(response.json()['detail'], 'You do not have permission to perform this action.')

    def test_authenticated_users_can_list_project_groups(self):
        # Create a test user with profile.
        url = reverse("rest_register")
        data = {
            "email": "test_user2@gmail.com",
            "password1": "123456",
            "password2": "123456"}
        response = self.client.post(url, data)

        # Log in the user.
        url = reverse("api_token_auth")
        data = {
            "username": "test_user2@gmail.com",
            "password": "123456"}
        response = self.client.post(url, data)
        test_user_key = response.json().get("token")
        test_user_client = APIClient(HTTP_AUTHORIZATION="Token {}".format(test_user_key), format="json")
        user_profile_id = response.json().get('user_profile_id')

        # Create profile.
        org = Organisation.objects.create(name="org2")
        url = reverse("userprofile-detail", kwargs={"pk": user_profile_id})
        data = {
            "name": "Test Name 2",
            "organisation": org.id,
            "country": "test_country"}
        response = test_user_client.put(url, data)
        user_profile_id = response.json()['id']

        url = reverse("project-groups", kwargs={"pk": self.project_id})

        response = self.test_user_client.get(url)

        self.assertEqual(response.status_code, 200)
        self.assertTrue("team" in response.json())
        self.assertTrue("viewers" in response.json())
        self.assertTrue(user_profile_id not in response.json()['team'])
        self.assertTrue(user_profile_id not in response.json()['viewers'])

    def test_not_authenticated_cannot_list_project_groups(self):
        test_user_client = APIClient(format="json")

        url = reverse("project-groups", kwargs={"pk": self.project_id})

        response = test_user_client.get(url)
        self.assertEqual(response.status_code, 401)
        self.assertEqual(response.json()['detail'], 'Authentication credentials were not provided.')

    def test_retrieve_project_anonym_user(self):
        url = reverse("project-detail", kwargs={"pk": self.project_id})
        anon_client = APIClient(format="json")
        response = anon_client.get(url)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json().get("name"), "Test Project1")
        self.assertEqual(response.json().get("objective"), "objective1")

        # filtering checks
        for key in Project.FIELDS_FOR_MEMBERS_ONLY + Project.FIELDS_FOR_LOGGED_IN:
            self.assertNotIn(key, response.json())

    def test_retrieve_project_non_member_user(self):
        # Create a test user with profile.
        url = reverse("rest_register")
        data = {
            "email": "test_user2@gmail.com",
            "password1": "123456",
            "password2": "123456"}
        response = self.client.post(url, data)

        # Log in the user.
        url = reverse("api_token_auth")
        data = {
            "username": "test_user2@gmail.com",
            "password": "123456"}
        response = self.client.post(url, data)
        test_user_key = response.json().get("token")
        test_user_client = APIClient(HTTP_AUTHORIZATION="Token {}".format(test_user_key), format="json")
        user_profile_id = response.json().get('user_profile_id')

        # update profile.
        org = Organisation.objects.create(name="org2")
        url = reverse("userprofile-detail", kwargs={"pk": user_profile_id})
        data = {
            "name": "Test Name 2",
            "organisation": org.id,
            "country": "test_country"}
        response = test_user_client.put(url, data)

        url = reverse("project-detail", kwargs={"pk": self.project_id})
        response = test_user_client.get(url)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json().get("name"), "Test Project1")
        self.assertEqual(response.json().get("objective"), "objective1")

        # filtering checks
        for key in Project.FIELDS_FOR_MEMBERS_ONLY:
            self.assertNotIn(key, response.json())
