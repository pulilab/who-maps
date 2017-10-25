import copy
from datetime import datetime

from django.core import mail
from django.core.urlresolvers import reverse
from django.contrib.admin.sites import AdminSite
from django.contrib.admin.options import ModelAdmin
from django.test import TestCase
from allauth.account.models import EmailConfirmation
from rest_framework.test import APIClient
from rest_framework.test import APITestCase

from country.models import Country, CountryField
from user.models import Organisation, UserProfile
from .serializers import ProjectSerializer
from .models import Project, DigitalStrategy, InteroperabilityLink, TechnologyPlatform, ProjectDraft, \
    ProjectApproval
from .admin import DigitalStrategyAdmin, ProjectApprovalAdmin
from .tasks import send_project_approval_digest


class MockRequest:
    GET = {}


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

        self.country = Country.objects.create(name="country1")
        self.country_id = self.country.id

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
            "country": self.country_id,
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
            "hsc_challenges": ["challenge1", "challenge2"],
            "government_approved": True,
            "government_investor": 0,
            "implementing_partners": ["partner1", "partner2"],
            "repository": "http://some.repo",
            "mobile_application": "app1, app2",
            "wiki": "http://wiki.org",
            "interoperability_links": [{"name": "link1", "selected": True, "link": "http://blabla.com"},
                                       {"name": "link2", "selected": True},
                                       {"name": "link3", "selected": True, "link": "http://example.org"}],
            "interoperability_standards": ["CSD - Care Services Discovery"],
            "start_date": str(datetime.today().date()),
            "end_date": str(datetime.today().date())
        }

        url = reverse("project-crud")
        response = self.test_user_client.post(url, self.project_data, format="json")
        self.assertEqual(response.status_code, 201)
        self.project_id = response.json().get("id")


class ProjectTests(SetupTests):

    def test_retrieve_project_structure(self):
        url = reverse("get-project-structure")
        response = self.test_user_client.get(url)
        self.assertEqual(response.status_code, 200)
        self.assertContains(response, "strategies")
        self.assertContains(response, "technology_platforms")
        self.assertContains(response, "licenses")
        self.assertContains(response, "applications")
        self.assertContains(response, "interoperability_links")
        self.assertContains(response, "interoperability_standards")
        self.assertContains(response, "his_bucket")
        self.assertContains(response, "hsc_challenges")
        self.assertEqual(len(response.json().keys()), 9)

    def test_create_new_project_basic_data(self):
        url = reverse("project-crud")
        data = copy.deepcopy(self.project_data)
        data.update(dict(name="Test Project3"))
        response = self.test_user_client.post(url, data, format="json")
        self.assertEqual(response.status_code, 201)

    def test_create_validating_list_fields_invalid_data(self):
        url = reverse("project-crud")
        data = copy.deepcopy(self.project_data)
        data.update(dict(
            name="Test Project4",
            implementing_partners=[{"object": "not good"}],
            health_focus_areas=[{"object": "not good"}],
            licenses=[{"object": "not good"}],
            donors=[{"object": "not good"}],
            his_bucket=[{"object": "not good"}],
            hsc_challenges=[{"object": "not good"}],
            interoperability_links=[{"object": "not good"}],
            interoperability_standards=[{"object": "not good"}],
        ))
        response = self.test_user_client.post(url, data, format="json")
        self.assertEqual(response.status_code, 400)
        self.assertEqual(len(response.json().keys()), 8)
        self.assertEqual(response.json()['implementing_partners'][0], 'Not a valid string.')
        self.assertEqual(response.json()['health_focus_areas'][0], 'Not a valid string.')
        self.assertEqual(response.json()['licenses'][0], 'Not a valid string.')
        self.assertEqual(response.json()['donors'][0], 'Not a valid string.')
        self.assertEqual(response.json()['his_bucket'][0], 'Not a valid string.')
        self.assertEqual(response.json()['hsc_challenges'][0], 'Not a valid string.')
        self.assertEqual(response.json()['interoperability_links'][0], {'name': ['This field is required.']})
        self.assertEqual(response.json()['interoperability_standards'][0], 'Not a valid string.')

    def test_create_new_project_with_platform_name_missing(self):
        url = reverse("project-crud")
        data = copy.deepcopy(self.project_data)
        new_data = {
            "name": "Test Project91",
            "platforms": [{
                "strategies": []
            }]
        }
        data.update(new_data)
        response = self.test_user_client.post(url, data, format="json")
        self.assertEqual(response.status_code, 400)
        self.assertIn("platforms", response.json())
        self.assertEqual(response.json()['platforms'][0]['name'][0], 'This field is required.')

    def test_create_new_project_with_platform_strategies_missing(self):
        url = reverse("project-crud")
        data = copy.deepcopy(self.project_data)
        new_data = {
            "name": "Test Project92",
            "platforms": [{
                "name": "strat1"
            }]
        }
        data.update(new_data)
        response = self.test_user_client.post(url, data, format="json")
        self.assertEqual(response.status_code, 400)
        self.assertIn("platforms", response.json())
        self.assertEqual(response.json()['platforms'][0]['strategies'][0], 'This field is required.')

    def test_create_new_project_with_platform_strategies_empty(self):
        url = reverse("project-crud")
        data = copy.deepcopy(self.project_data)
        new_data = {
            "name": "Test Project93",
            "platforms": [{
                "name": "strat1",
                "strategies": []
            }]
        }
        data.update(new_data)
        response = self.test_user_client.post(url, data, format="json")
        self.assertEqual(response.status_code, 201)
        self.assertEqual(response.json()['platforms'][0]['strategies'], list())

    def test_create_new_project_with_platform_extra_data(self):
        url = reverse("project-crud")
        data = copy.deepcopy(self.project_data)
        new_data = {
            "name": "Test Project93",
            "platforms": [{
                "name": "strat1",
                "strategies": [],
                "extra": "lol"
            }]
        }
        data.update(new_data)
        response = self.test_user_client.post(url, data, format="json")
        self.assertEqual(response.status_code, 201)
        self.assertEqual(response.json()['platforms'][0]['strategies'], list())
        self.assertNotIn("extra", response.json()['platforms'][0])

    def test_create_new_project_makes_public_id(self):
        url = reverse("project-crud")
        data = copy.deepcopy(self.project_data)
        data.update(name="Test Project4")
        response = self.test_user_client.post(url, data, format="json")
        self.assertEqual(response.status_code, 201)
        project_id = response.json()['id']

        url = reverse("project-detail", kwargs={"pk": project_id})
        response = self.test_user_client.get(url)
        self.assertEqual(response.status_code, 200)
        self.assertTrue(response.json()['published']['public_id'])

    def test_update_project(self):
        url = reverse("project-detail", kwargs={"pk": self.project_id})
        data = copy.deepcopy(self.project_data)
        data.update(name="TestProject98",
                    platforms=[{"name": "updated platform", "strategies": ["new strat"]}])
        response = self.test_user_client.put(url, data, format="json")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()["platforms"][0]["name"], "updated platform")
        self.assertEqual(response.json()["platforms"][0]["strategies"][0], "new strat")

    def test_update_project_platform_biggies(self):
        url = reverse("project-detail", kwargs={"pk": self.project_id})
        data = copy.deepcopy(self.project_data)
        data.update(name="TestProject98",
                    platforms=[{"name": "updated platform", "strategies": ["Transmit targeted health information \
                                                                            and promotion content to a client based \
                                                                            on a clinical care plan or \
                                                                            health/demographic characteristics"]}])
        response = self.test_user_client.put(url, data, format="json")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()["platforms"][0]["name"], "updated platform")
        self.assertEqual(response.json()["platforms"][0]["strategies"][0], data["platforms"][0]["strategies"][0])

    def test_update_project_healthfocus_biggies(self):
        url = reverse("project-detail", kwargs={"pk": self.project_id})
        data = copy.deepcopy(self.project_data)
        data.update(health_focus_areas=["a"*511])
        response = self.test_user_client.put(url, data, format="json")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()["health_focus_areas"][0], data["health_focus_areas"][0])

    def test_update_project_errors(self):
        url = reverse("project-detail", kwargs={"pk": self.project_id})
        data = copy.deepcopy(self.project_data)
        data.update(name="TestProject93", platforms=[{"name": "updated platform"}])
        response = self.test_user_client.put(url, data, format="json")
        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.json()['platforms'][0]['strategies'][0], 'This field is required.')

    def test_create_new_project_unique_name(self):
        url = reverse("project-crud")
        response = self.test_user_client.post(url, self.project_data, format="json")
        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.json()['name'][0], 'This field must be unique.')

    def test_create_new_project_bad_data(self):
        url = reverse("project-crud")
        data = copy.deepcopy(self.project_data)
        data.update(name="")
        data.update(organisation="")
        response = self.test_user_client.post(url, data, format="json")
        self.assertEqual(response.status_code, 400)

    def test_retrieve_project(self):
        url = reverse("project-detail", kwargs={"pk": self.project_id})
        response = self.test_user_client.get(url)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()['published'].get("name"), "Test Project1")
        self.assertEqual(response.json()['published'].get("organisation_name"), self.org.name)
        self.assertEqual(response.json()['published'].get("national_level_deployment")["clients"], 20000)
        self.assertEqual(response.json()['published'].get("platforms")[0]["name"], "platform1")
        self.assertEqual(response.json()['published'].get("country"), self.country_id)
        self.assertEqual(response.json()['published'].get("country_name"), self.country.name)

    def test_retrieve_project_government_details(self):
        url = reverse("project-detail", kwargs={"pk": self.project_id})
        response = self.test_user_client.get(url)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()['published'].get("name"), "Test Project1")
        self.assertTrue(response.json()['published'].get("government_approved"))
        self.assertTrue(response.json()['published'].get("government_investor") in [0, 1, 2])

    def test_retrieve_project_list(self):
        url = reverse("project-list")
        response = self.test_user_client.get(url)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()[0]['published'].get("name"), "Test Project1")

    def test_make_version(self):
        url = reverse("make-version", kwargs={"project_id": self.project_id})
        response = self.test_user_client.post(url, format="json")
        self.assertEqual(response.status_code, 201)
        self.assertIn('coverage', response.json())
        self.assertIn('toolkit', response.json())
        self.assertIn('last_version', response.json()['coverage'])
        self.assertIn('last_version_date', response.json()['coverage'])
        self.assertIn('last_version', response.json()['toolkit'])
        self.assertIn('last_version_date', response.json()['toolkit'])

    def test_make_version_wrong_id(self):
        url = reverse("make-version", kwargs={"project_id": 999})
        response = self.test_user_client.post(url, format="json")
        self.assertEqual(response.status_code, 400)

    def test_get_coverage_versions(self):
        url = reverse("make-version", kwargs={"project_id": self.project_id})
        response = self.test_user_client.post(url, format="json")
        url = reverse("get-coverage-versions", kwargs={"project_id": self.project_id})
        response = self.test_user_client.get(url)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.json()), 1)
        self.assertEqual(len(response.json()[0]['data']), 3)

    def test_get_toolkit_versions(self):
        url = reverse("make-version", kwargs={"project_id": self.project_id})
        response = self.test_user_client.post(url, format="json")
        url = reverse("get-toolkit-versions", kwargs={"project_id": self.project_id})
        response = self.test_user_client.get(url)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.json()), 1)

    def test_version_numbers_increasing(self):
        url = reverse("make-version", kwargs={"project_id": self.project_id})
        response = self.test_user_client.post(url, format="json")
        response = self.test_user_client.post(url, format="json")
        url = reverse("get-toolkit-versions", kwargs={"project_id": self.project_id})
        response = self.test_user_client.get(url)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.json()), 2)
        self.assertEqual(response.json()[1]["version"], 2)

    def test_retrieve_last_version(self):
        url = reverse("make-version", kwargs={"project_id": self.project_id})
        response = self.test_user_client.post(url, format="json")
        url = reverse("project-detail", kwargs={"pk": self.project_id})
        response = self.test_user_client.get(url)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()['published'].get("name"), "Test Project1")
        self.assertEqual(response.json()['published'].get("last_version"), 1)
        self.assertIn("last_version_date", response.json()['published'])

    def test_retrieve_project_list_by_country(self):
        project_data = copy.copy(self.project_data)
        project_data['name'] = "Test Project2"
        url = reverse("project-crud")
        response = self.test_user_client.post(url, project_data, format="json")

        url = reverse("project-country-list", kwargs={"country_id": self.country_id})
        response = self.test_user_client.get(url)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()[0].get("name"), "Test Project1")
        self.assertEqual(len(response.json()), 2)

    def test_retrieve_project_list_by_country_all(self):
        # add a new project that I don't own
        project_data = copy.copy(self.project_data)
        project_data['name'] = "Test Project2"
        project_data['organisation'] = str(Organisation.objects.create(name="org2").id)

        url = reverse("project-crud")
        response = self.test_user_client.post(url, project_data, format="json")
        self.assertEqual(response.status_code, 201)

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
        project_data = copy.copy(self.project_data)
        project_data['name'] = "Test Project 2"
        url = reverse("project-crud")
        response = self.test_user_client.post(url, project_data, format="json")

        url = reverse("project-by-district", kwargs={"country_id": self.country_id})
        response = self.test_user_client.get(url)
        self.assertEqual(response.status_code, 200)
        self.assertIsInstance(response.json(), dict)
        self.assertEqual(response.json().keys(), {"dist1": None, "dist2": None}.keys())

    def test_create_project_adds_owner_to_team(self):
        url = reverse("project-crud")
        data = copy.deepcopy(self.project_data)
        data.update(name="Test Project3")
        response = self.test_user_client.post(url, data, format="json")
        self.assertEqual(response.status_code, 201)
        userprofile = UserProfile.objects.get(name="Test Name")
        project = Project.objects.get(id=response.json()['id'])
        self.assertEqual(project.team.first(), userprofile)

    def test_team_cant_be_but_viewers_can_be_empty(self):
        url = reverse("project-crud")
        data = copy.deepcopy(self.project_data)
        data.update(name="Test Project4")
        response = self.test_user_client.post(url, data, format="json")
        self.assertEqual(response.status_code, 201)
        userprofile = UserProfile.objects.get(name="Test Name")
        project = Project.objects.get(id=response.json()['id'])
        self.assertEqual(project.team.first(), userprofile)

        url = reverse("project-groups", kwargs={"pk": project.id})

        groups = {
            "team": [userprofile.id],
            "viewers": [userprofile.id]
        }

        response = self.test_user_client.put(url, groups)
        self.assertTrue("team" in response.json())
        self.assertTrue("viewers" in response.json())
        self.assertEqual(response.json()['team'], [userprofile.id])
        self.assertEqual(response.json()['viewers'], [userprofile.id])

        url = reverse("project-groups", kwargs={"pk": project.id})

        groups = {
            "team": [],
            "viewers": []
        }
        response = self.test_user_client.put(url, groups)

        self.assertTrue("team" in response.json())
        self.assertTrue("viewers" in response.json())
        self.assertEqual(response.json()['team'], [userprofile.id])
        self.assertEqual(response.json()['viewers'], [])

    def test_by_user_manager(self):
        url = reverse("project-list")
        response = self.test_user_client.get(url)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()[0]['published']['name'], "Test Project1")

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
        response = self.client.post(url, data, format="json")

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
        response = test_user_client.put(url, data, format="json")

        user_profile_id = response.json()['id']

        url = reverse("project-groups", kwargs={"pk": self.project_id})

        groups = {
            "team": [user_profile_id],
            "viewers": []
        }
        response = self.test_user_client.put(url, groups, format="json")

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
        response = self.client.post(url, data, format="json")

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
        response = test_user_client.put(url, data, format="json")

        user_profile_id = response.json()['id']

        url = reverse("project-groups", kwargs={"pk": self.project_id})

        groups = {
            "team": [user_profile_id],
            "viewers": []
        }
        response = self.test_user_client.put(url, groups, format="json")

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

    def test_update_project_updates_health_focus_areas(self):
        url = reverse("project-detail", kwargs={"pk": self.project_id})
        response = self.test_user_client.get(url)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()['published'].get('health_focus_areas'), self.project_data['health_focus_areas'])

        data = copy.deepcopy(self.project_data)
        data.update(health_focus_areas=['area1'])
        response = self.test_user_client.put(url, data, format="json")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()["health_focus_areas"], data['health_focus_areas'])

        response = self.test_user_client.get(url)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()['published'].get('health_focus_areas'), data['health_focus_areas'])

    def test_update_project_with_different_invalid_name(self):
        url = reverse("project-detail", kwargs={"pk": self.project_id})
        data = copy.deepcopy(self.project_data)
        data.update(name="toolongnamemorethan128charactersisaninvalidnameheretoolongnamemorethan128charactersisaninvalidnameheretoolongnamemorethan128charactersisaninvalidnamehere")
        response = self.test_user_client.put(url, data, format="json")
        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.json()["name"][0], 'Ensure this field has no more than 128 characters.')

    def test_update_project_with_new_name_that_collides_with_a_different_project(self):
        url = reverse("project-crud")
        data = copy.deepcopy(self.project_data)
        data.update(name="thisnameisunique")
        response = self.test_user_client.post(url, data, format="json")
        self.assertEqual(response.status_code, 201)
        self.assertEqual(Project.objects.count(), 2)

        url = reverse("project-detail", kwargs={"pk": self.project_id})
        data = copy.deepcopy(self.project_data)
        data.update(name="thisnameisunique")
        response = self.test_user_client.put(url, data, format="json")
        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.json()["name"][0], 'This field must be unique.')

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
        self.assertIn("health_focus_areas", response.json()[0])
        self.assertIn("geographic_scope", response.json()[0])

    def test_project_create_can_send_blank_fields_in(self):
        # add one new project where health_focus_areas is empty
        project_data = copy.copy(self.project_data)
        project_data['name'] = "Test Project8"
        project_data['health_focus_areas'] = []
        url = reverse("project-crud")
        response = self.test_user_client.post(url, project_data, format="json")
        self.assertEqual(response.status_code, 201)
        self.assertIn("implementing_partners", response.json())

    def test_digitalstrategies_str(self):
        ds1 = DigitalStrategy.objects.create(name='ds1', group='Client')
        ds2 = DigitalStrategy.objects.create(name='ds2', group='Client', parent=ds1)
        self.assertEqual(str(ds1), '[Client] ds1')
        self.assertEqual(str(ds2), '[Client] [ds1] ds2')

    def test_interop_str(self):
        io = InteroperabilityLink.objects.create(pre='bla', name='io')
        self.assertEqual(str(io), 'io')

    def test_platforms_str(self):
        tp = TechnologyPlatform.objects.create(name='tp')
        self.assertEqual(str(tp), 'tp')


class ProjectDraftTests(SetupTests):

    def setUp(self):
        # Published without draft in SetupsTests
        super(ProjectDraftTests, self).setUp()

        # Draft without published
        self.project_draft_data = {
            'name': 'Draft Proj 1',
            'country': self.country_id,
            'project': None
        }

        url = reverse("project-draft-crud")
        response = self.test_user_client.post(url, self.project_draft_data, format="json")
        self.project_draft_id = response.json().get("id")

        # Published and its dfraft
        url = reverse("project-crud")
        data = copy.deepcopy(self.project_data)
        data.update(name='Proj 2')
        response = self.test_user_client.post(url, data, format="json")
        self.project_pub_id = response.json().get("id")

        self.project_draft_pub_data = {
            'name': 'Draft Proj 2',
            'country': self.country_id,
            'project': self.project_pub_id,
        }

        url = reverse("project-draft-crud")
        response = self.test_user_client.post(url, self.project_draft_pub_data, format="json")
        self.project_draft_pub_id = response.json().get("id")

    def test_create_new_draft_project_basic_data(self):
        url = reverse("project-draft-crud")
        data = copy.deepcopy(self.project_draft_data)
        data.update(name='Draft Proj 3')
        response = self.test_user_client.post(url, data, format="json")

        self.assertEqual(response.status_code, 201)

    def test_retrieve_draft_project(self):
        url = reverse("project-draft-detail", kwargs={"pk": self.project_draft_id})
        response = self.test_user_client.get(url)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()['draft']['name'], 'Draft Proj 1')
        self.assertEqual(response.json()['published'], None)

    def test_retireve_published_project(self):
        url = reverse("project-detail", kwargs={"pk": self.project_id})
        response = self.test_user_client.get(url, format="json")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()['published']['name'], 'Test Project1')
        self.assertEqual(response.json()['draft'], None)

    def test_retireve_published_project_with_draft(self):
        url = reverse("project-detail", kwargs={"pk": self.project_pub_id})
        response = self.test_user_client.get(url, format="json")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()['draft']['name'], 'Draft Proj 2')
        self.assertEqual(response.json()['published']['name'], 'Proj 2')

    def test_update_draft_project(self):
        url = reverse("project-draft-detail", kwargs={"pk": self.project_draft_id})
        data = copy.deepcopy(self.project_draft_data)
        data.update(name="TestProject98",
                    platforms=[{"name": "updated platform", "strategies": ["new strat"]}])
        response = self.test_user_client.put(url, data, format="json")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()["platforms"][0]["name"], "updated platform")
        self.assertEqual(response.json()["platforms"][0]["strategies"][0], "new strat")

    def test_project_draft_merged_list(self):
        url = reverse("project-list")
        response = self.test_user_client.get(url)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()[0]["draft"], None)
        self.assertEqual(response.json()[0]["published"]["name"], "Test Project1")
        self.assertEqual(response.json()[1]["draft"]["name"], "Draft Proj 2")
        self.assertEqual(response.json()[1]["published"]["name"], "Proj 2")
        self.assertEqual(response.json()[2]["draft"]["name"], "Draft Proj 1")
        self.assertEqual(response.json()[2]["published"], None)

    def test_delete_draft_after_publish(self):
        url = reverse("project-crud")
        data = copy.deepcopy(self.project_data)
        data.update(name='Draft Proj 3', project=self.project_id, project_draft=self.project_draft_id)
        response = self.test_user_client.post(url, data, format="json")
        self.assertEqual(ProjectDraft.objects.filter(id=self.project_draft_id).exists(), False)

    def test_project_approval_email(self):
        Country.objects.filter(id=self.country_id).update(project_approval=True, user_id=self.user_profile_id)
        send_project_approval_digest()
        self.assertIn('admin/project/projectapproval/add', mail.outbox[1].message().as_string())

    def test_project_approval_admin(self):
        site = AdminSite()
        ma = ProjectApprovalAdmin(ProjectApproval, site)
        project_approval = ProjectApproval.objects.create(user_id=self.user_profile_id, project_id=self.project_id, approved=True)
        self.assertEqual(ma.link(project_approval), "<a href='/app/project/1'>See project</a>")


class PermissionTests(SetupTests):

    def test_team_member_can_update_project_groups(self):
        url = reverse("project-groups", kwargs={"pk": self.project_id})

        user_profile_id = UserProfile.objects.first().id
        groups = {
            "team": [user_profile_id],
            "viewers": [user_profile_id]
        }
        response = self.test_user_client.put(url, groups, format="json")

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
        response = self.client.post(url, data, format="json")

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
        response = test_user_client.put(url, data, format="json")

        user_profile_id = response.json()['id']

        url = reverse("project-groups", kwargs={"pk": self.project_id})

        groups = {
            "team": [owner_id],
            "viewers": [user_profile_id]
        }
        response = self.test_user_client.put(url, groups, format="json")

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
        response = self.client.post(url, data, format="json")

        # Log in the user.
        url = reverse("api_token_auth")
        data = {
            "username": "test_user2@gmail.com",
            "password": "123456"}
        response = self.client.post(url, data, format="json")
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
        response = test_user_client.put(url, data, format="json")
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
        self.assertEqual(response.json()['published'].get("name"), "Test Project1")
        self.assertEqual(response.json()['published'].get("platforms")[0].get('name'), "platform1")

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
        self.client.post(url, data, format="json")

        # Log in the user.
        url = reverse("api_token_auth")
        data = {
            "username": "test_user2@gmail.com",
            "password": "123456"}
        response = self.client.post(url, data, format="json")
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
        test_user_client.put(url, data, format="json")

        url = reverse("project-detail", kwargs={"pk": self.project_id})
        response = test_user_client.get(url)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()['published'].get("name"), "Test Project1")
        self.assertEqual(response.json()['published'].get("platforms")[0].get('name'), "platform1")

        # filtering checks
        for key in Project.FIELDS_FOR_MEMBERS_ONLY:
            self.assertNotIn(key, response.json())

    def test_members_receive_last_version_info(self):
        url = reverse("project-detail", kwargs={"pk": self.project_id})
        response = self.test_user_client.get(url)
        self.assertEqual(response.status_code, 200)
        self.assertNotIn("last_version", response.json())

        url = reverse("make-version", kwargs={"project_id": self.project_id})
        response = self.test_user_client.post(url, format="json")
        url = reverse("get-coverage-versions", kwargs={"project_id": self.project_id})
        response = self.test_user_client.get(url)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.json()), 1)

        url = reverse("project-detail", kwargs={"pk": self.project_id})
        response = self.test_user_client.get(url)
        self.assertEqual(response.status_code, 200)
        self.assertIn("last_version", response.json()['published'])

    def test_csv_export_failed(self):
        url = reverse("csv-export")
        response = self.test_user_client.post(url, {"data": [1,2]}, format="json")
        self.assertEqual(response.status_code, 404)

    def test_csv_export_success(self):
        url = reverse("csv-export")
        response = self.test_user_client.post(url, [1, 2, Project.objects.get().id], format="json")
        self.assertEqual(response.status_code, 200)
        headers = dict(response.items())
        self.assertEqual(headers['Content-Type'], 'text/csv')
        self.assertEqual(headers['Content-Disposition'], 'attachment; filename="csv.csv"')
        self.assertContains(response, "Test Project1")
        self.assertContains(response, "a@a.com")

    def test_retrieve_project_with_country_fields(self):
        CountryField.objects.create(country=self.country, type=1, question="q1?", schema=True)
        cf1 = CountryField.objects.create(project_id=self.project_id, country=self.country, type=1, question="q1?", answer="a1", schema=False)
        url = reverse("project-detail", kwargs={"pk": self.project_id})
        response = self.test_user_client.get(url)

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()['published'].get("name"), "Test Project1")
        self.assertEqual(response.json()['published'].get("organisation_name"), self.org.name)
        self.assertEqual(response.json()['published'].get("national_level_deployment")["clients"], 20000)
        self.assertEqual(response.json()['published'].get("platforms")[0]["name"], "platform1")
        self.assertEqual(response.json()['published'].get("country"), self.country_id)
        self.assertEqual(response.json()['published'].get("country_name"), self.country.name)

        self.assertEqual(response.json()['published']['fields'][0]['country'], cf1.country.id)
        self.assertEqual(response.json()['published']['fields'][0]['project'], cf1.project.id)
        self.assertEqual(response.json()['published']['fields'][0]['type'], cf1.type)
        self.assertEqual(response.json()['published']['fields'][0]['question'], cf1.question)
        self.assertEqual(response.json()['published']['fields'][0]['answer'], cf1.answer)

    def test_retrieve_project_with_country_fields_without_schema(self):
        CountryField.objects.create(project_id=self.project_id, country=self.country, type=1, question="q1?", answer="a1", schema=False)
        url = reverse("project-detail", kwargs={"pk": self.project_id})
        response = self.test_user_client.get(url)

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()['published'].get("name"), "Test Project1")
        self.assertEqual(response.json()['published'].get("organisation_name"), self.org.name)
        self.assertEqual(response.json()['published'].get("national_level_deployment")["clients"], 20000)
        self.assertEqual(response.json()['published'].get("platforms")[0]["name"], "platform1")
        self.assertEqual(response.json()['published'].get("country"), self.country_id)
        self.assertEqual(response.json()['published'].get("country_name"), self.country.name)

        self.assertEqual(len(response.json()['published']['fields']), 0)

    def test_project_structure_export(self):
        url = reverse("get-project-structure-export")
        response = self.test_user_client.get(url)

        self.assertEqual(len(response.data['interoperability_links']), 8)
        self.assertEqual(response.data['interoperability_links'][0], {'id': 1, 'name': 'Client Registry'})
        self.assertEqual(len(response.data['technology_platforms']), 46)
        self.assertEqual(response.data['technology_platforms'][0], {'id': 1, 'name': 'Adobe Forms'})
        self.assertEqual(len(response.data['digital_strategies']), 111)
        self.assertEqual(response.data['digital_strategies'][0], {'id': 1, 'name': 'Targeted client communication'})


class TestSoftDelete(APITestCase):

    def test_on_instance_delete(self):
        ds1 = DigitalStrategy.objects.create(name='ds1', group='Client')
        self.assertEqual(ds1.is_active, True)

        ds1.delete()
        self.assertEqual(ds1.is_active, False)

    def test_queryset_delete(self):
        total_count = DigitalStrategy.objects.all().count()
        self.assertEqual(total_count, 111)

        active_count = DigitalStrategy.objects.filter(is_active=True).count()
        self.assertEqual(active_count, 111)

        is_active_false_count = DigitalStrategy.all_objects.filter(is_active=False).count()
        self.assertEqual(is_active_false_count, 0)

        DigitalStrategy.objects.all().delete()

        active_count = DigitalStrategy.objects.filter(is_active=True).count()
        self.assertEqual(active_count, 0)

        active_count = DigitalStrategy.objects.all().count()
        self.assertEqual(active_count, 0)

        is_active_false_count = DigitalStrategy.all_objects.filter(is_active=False).count()
        self.assertEqual(is_active_false_count, 111)


class TestAdmin(TestCase):

    def setUp(self):
        self.request = MockRequest()
        self.site = AdminSite()

    def test_admin(self):
        admin = DigitalStrategyAdmin(DigitalStrategy, self.site)
        self.assertEqual(admin.get_queryset(self.request).count(), DigitalStrategy.all_objects.all().count())
        self.assertEqual(admin.get_list_display(self.request), ['__str__', 'is_active'])
        admin.list_display = ['__str__', 'is_active']
        self.assertEqual(admin.get_list_display(self.request), ['__str__', 'is_active'])
