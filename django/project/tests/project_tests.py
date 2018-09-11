import copy
import csv
from datetime import datetime

from django.urls import reverse
from mock import patch
from io import StringIO

from django.core import mail
from django.contrib.admin.sites import AdminSite
from django.contrib.auth.models import User
from django.core.cache import cache
from django.http import HttpResponse
from django.utils.encoding import force_text
from rest_framework.test import APIClient

from country.models import Country
from project.admin import ProjectAdmin
from user.models import Organisation, UserProfile
from project.models import Project, DigitalStrategy, InteroperabilityLink, TechnologyPlatform, HealthFocusArea, \
    Licence, InteroperabilityStandard, HISBucket, HSCChallenge, HSCGroup, ProjectApproval
from project.admin import ProjectApprovalAdmin
from project.tasks import send_project_approval_digest

from project.tests.setup import SetupTests, MockRequest


class ProjectTests(SetupTests):
    def test_retrieve_project_structure(self):
        url = reverse("get-project-structure")
        response = self.test_user_client.get(url)
        self.assertEqual(response.status_code, 200)
        self.assertContains(response, "strategies")
        self.assertContains(response, "technology_platforms")
        self.assertContains(response, "licenses")
        self.assertContains(response, "interoperability_links")
        self.assertContains(response, "interoperability_standards")
        self.assertContains(response, "his_bucket")
        self.assertContains(response, "hsc_challenges")
        self.assertEqual(len(response.json().keys()), 8)

    def test_retrieve_project_structure_cache(self):
        with self.settings(CACHES={'default': {'BACKEND': 'django.core.cache.backends.locmem.LocMemCache'}}):
            cache.clear()
            # Shouldn't exists
            cache_data = cache.get('project-structure-data')
            self.assertTrue(cache_data is None)

            # First time retrieval should create cache data
            url = reverse("get-project-structure")
            response = self.test_user_client.get(url)
            cache_data = cache.get('project-structure-data-en')
            self.assertEqual(response.status_code, 200)
            self.assertFalse(cache_data is None)

            # Changing cached data should invalidate cache
            lic = Licence.objects.all().first()
            lic.name = 'other'
            lic.save()
            cache_data = cache.get('project-structure-data')
            self.assertTrue(cache_data is None)

            # Retrieval should create cache data again
            url = reverse("get-project-structure")
            response = self.test_user_client.get(url)
            cache_data = cache.get('project-structure-data-en')
            self.assertEqual(response.status_code, 200)
            self.assertFalse(cache_data is None)

    def test_validate_wiki_url(self):
        data = copy.deepcopy(self.project_data)
        data.update(dict(
            wiki="wikiorg",
            name="testing_wiki_validation"
        ))
        # Create project draft
        url = reverse("project-create")
        response = self.test_user_client.post(url, data, format="json")
        self.assertEqual(response.status_code, 201)
        project_id = response.json()['id']

        # Publish project
        url = reverse("project-publish", kwargs={'pk': project_id})
        response = self.test_user_client.put(url, data, format="json")
        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.json(), {'wiki': ['Enter a valid URL.']})

        data.update(dict(
            wiki="wiki.cancerresearch",
        ))

        # Try to publish it again
        response = self.test_user_client.put(url, data, format="json")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()['draft']['wiki'], 'wiki.cancerresearch')
        self.assertEqual(response.json()['published']['wiki'], 'wiki.cancerresearch')

    def test_create_new_project_approval_required(self):
        c = Country.objects.get(id=self.country_id)
        c.project_approval = True
        c.users.add(self.user_profile_id)
        c.save()
        url = reverse("project-create")
        data = copy.deepcopy(self.project_data)
        data.update(dict(name="Test Project3"))
        response = self.test_user_client.post(url, data, format="json")
        self.assertEqual(response.status_code, 201)
        self.assertEqual(ProjectApproval.objects.filter(project_id=response.data['id']).exists(), True)

    def test_create_new_project_approval_required_on_update(self):
        # Make country approval-required
        c = Country.objects.get(id=self.country_id)
        c.project_approval = True
        c.users.add(self.user_profile_id)
        c.save()
        # Create project
        url = reverse("project-create")
        data = copy.deepcopy(self.project_data)
        data.update(dict(name="Test Project3"))
        response = self.test_user_client.post(url, data, format="json")
        project_id = response.data['id']
        approval = ProjectApproval.objects.filter(project_id=response.data['id']).first()
        self.assertEqual(response.status_code, 201)
        self.assertTrue(approval)
        # Approve project
        approval.approved = True
        approval.save()
        # Update project
        url = reverse("project-publish", kwargs={'pk': project_id})
        data = copy.deepcopy(self.project_data)
        data.update(dict(name="Test Project updated"))
        response = self.test_user_client.put(url, data, format="json")
        new_approval = ProjectApproval.objects.filter(project_id=response.data['id']).first()
        self.assertEqual(response.status_code, 200)
        self.assertEqual(new_approval.approved, None)

    def test_create_validating_list_fields_invalid_data(self):
        url = reverse("project-create")
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
        self.assertEqual(response.json()['implementing_partners']['0'], ['Not a valid string.'])
        self.assertEqual(response.json()['health_focus_areas']['0'], ['A valid integer is required.'])
        self.assertEqual(response.json()['licenses']['0'], ['A valid integer is required.'])
        self.assertEqual(response.json()['donors']['0'], ['A valid integer is required.'])
        self.assertEqual(response.json()['his_bucket']['0'], ['A valid integer is required.'])
        self.assertEqual(response.json()['hsc_challenges']['0'], ['A valid integer is required.'])
        self.assertEqual(response.json()['interoperability_links'], [{'id': ['This field is required.']}])
        self.assertEqual(response.json()['interoperability_standards']['0'], ['A valid integer is required.'])

    def test_create_new_project_with_platform_name_missing(self):
        url = reverse("project-create")
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
        self.assertEqual(response.json()['platforms'][0]['id'][0], 'This field is required.')

    def test_create_new_project_with_platform_empty_array(self):
        url = reverse("project-create")
        data = copy.deepcopy(self.project_data)
        new_data = {
            "name": "Test Project91",
            "platforms": []
        }
        data.update(new_data)
        response = self.test_user_client.post(url, data, format="json")
        self.assertEqual(response.status_code, 201)

    def test_create_new_project_with_platform_strategies_missing(self):
        url = reverse("project-create")
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
        url = reverse("project-create")
        data = copy.deepcopy(self.project_data)
        new_data = {
            "name": "Test Project93",
            "platforms": [{
                "id": 1,
                "strategies": []
            }]
        }
        data.update(new_data)
        response = self.test_user_client.post(url, data, format="json")
        self.assertEqual(response.status_code, 201)
        self.assertEqual(response.json()['draft']['platforms'][0]['strategies'], list())

    def test_create_new_project_with_platform_extra_data(self):
        url = reverse("project-create")
        data = copy.deepcopy(self.project_data)
        new_data = {
            "name": "Test Project93",
            "platforms": [{
                "id": 1,
                "strategies": [],
                "extra": "lol"
            }]
        }
        data.update(new_data)
        response = self.test_user_client.post(url, data, format="json")
        self.assertEqual(response.status_code, 201)
        self.assertEqual(response.json()['draft']['platforms'][0]['strategies'], list())
        self.assertNotIn("extra", response.json()['draft']['platforms'][0])

    def test_publish_project_makes_public_id(self):
        url = reverse("project-create")
        data = copy.deepcopy(self.project_data)
        data.update(name="Test Project4")
        response = self.test_user_client.post(url, data, format="json")
        self.assertEqual(response.status_code, 201)
        self.assertFalse(response.json()['public_id'])
        project_id = response.json()['id']

        url = reverse("project-publish", kwargs={"pk": project_id})
        response = self.test_user_client.put(url, data, format="json")
        self.assertEqual(response.status_code, 200)
        self.assertTrue(response.json()['public_id'])

        url = reverse("project-retrieve", kwargs={"pk": project_id})
        response = self.test_user_client.get(url)
        self.assertEqual(response.status_code, 200)
        self.assertTrue(response.json()['public_id'])

    def test_update_project(self):
        url = reverse("project-publish", kwargs={"pk": self.project_id})
        data = copy.deepcopy(self.project_data)
        data.update(name="TestProject98",
                    platforms=[{"id": 999, "strategies": [998]}])
        response = self.test_user_client.put(url, data, format="json")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()['published']["platforms"][0]["id"], 999)
        self.assertEqual(response.json()['published']["platforms"][0]["strategies"][0], 998)
        self.assertEqual(response.json()['published'].get("organisation_name"), self.org.name)

    def test_update_project_errors(self):
        url = reverse("project-publish", kwargs={"pk": self.project_id})
        data = copy.deepcopy(self.project_data)
        data.update(name="TestProject93", platforms=[{"name": "updated platform"}])
        response = self.test_user_client.put(url, data, format="json")
        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.json()['platforms'][0]['strategies'][0], 'This field is required.')

    def test_create_new_project_unique_name(self):
        url = reverse("project-create")
        response = self.test_user_client.post(url, self.project_data, format="json")
        self.assertEqual(response.status_code, 201)
        project_id = response.json()['id']
        self.assertEqual(response.json()['draft']['name'], self.project_data['name'])

        url = reverse("project-publish", kwargs={"pk": project_id})
        response = self.test_user_client.put(url, self.project_data, format="json")

        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.json()['name'][0], 'This field must be unique.')

    def test_retrieve_project(self):
        url = reverse("project-retrieve", kwargs={"pk": self.project_id})
        response = self.test_user_client.get(url, HTTP_ACCEPT_LANGUAGE='en')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()['published'].get("name"), "Test Project1")
        self.assertEqual(response.json()['published'].get("organisation_name"), self.org.name)
        self.assertEqual(response.json()['published'].get("national_level_deployment")["clients"], 20000)
        self.assertEqual(response.json()['published'].get("platforms")[0]["id"],
                         self.project_data['platforms'][0]['id'])
        self.assertEqual(response.json()['published'].get("country"), self.country_id)
        self.assertEqual(response.json()['published'].get("country_name"), 'Hungary')

        response = self.test_user_client.get(url, HTTP_ACCEPT_LANGUAGE='fr')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()['published'].get("country_name"), 'Hongrie')

    def test_retrieve_project_government_details(self):
        url = reverse("project-retrieve", kwargs={"pk": self.project_id})
        response = self.test_user_client.get(url)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()['published'].get("name"), "Test Project1")
        self.assertTrue(response.json()['published'].get("government_investor") in [0, 1, 2])

    def test_retrieve_wrong_http_command(self):
        url = reverse("project-retrieve", kwargs={"pk": self.project_id})
        response = self.test_user_client.put(url)
        self.assertEqual(response.status_code, 405)
        self.assertEqual(response.json(), {'detail': 'Method "PUT" not allowed.'})

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
        url = reverse("project-retrieve", kwargs={"pk": self.project_id})
        response = self.test_user_client.get(url)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()['published'].get("name"), "Test Project1")
        self.assertEqual(response.json()['published'].get("last_version"), 1)
        self.assertIn("last_version_date", response.json()['published'])

    def test_retrieve_project_list_by_country(self):
        project_data = copy.copy(self.project_data)
        project_data['name'] = "Test Project2"
        url = reverse("project-create")
        response = self.test_user_client.post(url, project_data, format="json")

        self.assertEqual(response.status_code, 201)
        project_id = response.json()['id']
        url = reverse("project-publish", kwargs={"pk": project_id})
        response = self.test_user_client.put(url, project_data, format="json")
        self.assertEqual(response.status_code, 200)

        url = reverse("project-country-list", kwargs={"country_id": self.country_id})
        response = self.test_user_client.get(url)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()[0].get("name"), "Test Project1")
        nameslist = [x.challenge for x in HSCChallenge.objects.get_names_for_ids(self.project_data['hsc_challenges'])]
        self.assertEqual(response.json()[0].get("hsc_challenges"), nameslist)
        nameslist = [x.name for x in HealthFocusArea.objects.get_names_for_ids(
            self.project_data['health_focus_areas'])]
        self.assertEqual(response.json()[0].get("health_focus_areas"), nameslist)
        nameslist = [x.name for x in HISBucket.objects.get_names_for_ids(self.project_data['his_bucket'])]
        self.assertEqual(response.json()[0].get("his_bucket"), nameslist)
        nameslist = [x.name for x in TechnologyPlatform.objects.get_names_for_ids(
            [x['id'] for x in self.project_data['platforms']])]
        self.assertEqual(response.json()[0].get("platforms"), nameslist)
        self.assertEqual(len(response.json()), 2)

    def test_retrieve_project_list_by_country_all(self):
        # add a new project that I don't own
        project_data = copy.copy(self.project_data)
        project_data['name'] = "Test Project2"
        project_data['organisation'] = str(Organisation.objects.create(name="org2").id)

        url = reverse("project-create")
        response = self.test_user_client.post(url, project_data, format="json")
        self.assertEqual(response.status_code, 201)
        project_id = response.json()['id']
        url = reverse("project-publish", kwargs={"pk": project_id})
        response = self.test_user_client.put(url, project_data, format="json")
        self.assertEqual(response.status_code, 200)

        # This will stay as draft
        project_data = copy.copy(self.project_data)
        project_data['name'] = "Test Project3"
        project_data['organisation'] = str(Organisation.objects.create(name="org3").id)

        url = reverse("project-create")
        response = self.test_user_client.post(url, project_data, format="json")
        self.assertEqual(response.status_code, 201)

        url = reverse("project-country-list", kwargs={"country_id": self.country_id})
        response = self.test_user_client.get(url)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.json()), 2)
        self.assertEqual(response.json()[0].get("name"), "Test Project1")
        self.assertEqual(response.json()[1].get("name"), "Test Project2")
        self.assertEqual(response.json()[1].get("approved"), None)

    def test_retrieve_project_exclude_draft(self):
        project_data = copy.copy(self.project_data)
        project_data['name'] = "Test Project2"
        url = reverse("project-create")
        response = self.test_user_client.post(url, project_data, format="json")
        self.assertEqual(response.status_code, 201)

        url = reverse("project-country-list", kwargs={"country_id": self.country_id})
        response = self.test_user_client.get(url)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()[0].get("name"), "Test Project1")
        self.assertEqual(len(response.json()), 1)

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
        url = reverse("project-create")
        response = self.test_user_client.post(url, project_data, format="json")
        self.assertEqual(response.status_code, 201)
        project_id = response.json()['id']
        url = reverse("project-publish", kwargs={"pk": project_id})
        response = self.test_user_client.put(url, project_data, format="json")
        self.assertEqual(response.status_code, 200)

        url = reverse("project-by-district", kwargs={"country_id": self.country_id})
        response = self.test_user_client.get(url)
        self.assertEqual(response.status_code, 200)
        self.assertIsInstance(response.json(), dict)
        self.assertEqual(response.json().keys(), {"dist1": None, "dist2": None}.keys())
        self.assertEqual(response.json()['dist1'][0]['approved'], None)

    def test_create_project_adds_owner_to_team(self):
        url = reverse("project-create")
        data = copy.deepcopy(self.project_data)
        data.update(name="Test Project3")
        response = self.test_user_client.post(url, data, format="json")
        self.assertEqual(response.status_code, 201)

        userprofile = UserProfile.objects.get(name="Test Name")
        project = Project.objects.get(id=response.json()['id'])
        self.assertEqual(project.team.first(), userprofile)

    def test_team_cant_be_but_viewers_can_be_empty(self):
        url = reverse("project-create")
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
        self.assertEqual(response.json()['team'][0], self.user_profile_id)

    def test_project_group_add_user_to_team(self):
        # Create a test user with profile.
        url = reverse("rest_register")
        data = {
            "email": "test_user2@gmail.com",
            "password1": "123456hetNYOLC",
            "password2": "123456hetNYOLC"}
        response = self.client.post(url, data, format="json")

        # Log in the user.
        url = reverse("api_token_auth")
        data = {
            "username": "test_user2@gmail.com",
            "password": "123456hetNYOLC"}
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
            "country": self.country_id}
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
        self.assertEqual(response.json()['team'][0], user_profile_id)

    def test_project_group_add_user_always_overwrites_all_groups(self):
        url = reverse("project-groups", kwargs={"pk": self.project_id})
        response = self.test_user_client.get(url)
        self.assertEqual(response.status_code, 200)
        owner_id = response.json()['team'][0]

        # Create a test user with profile.
        url = reverse("rest_register")
        data = {
            "email": "test_user2@gmail.com",
            "password1": "123456hetNYOLC",
            "password2": "123456hetNYOLC"}
        response = self.client.post(url, data, format="json")

        # Log in the user.
        url = reverse("api_token_auth")
        data = {
            "username": "test_user2@gmail.com",
            "password": "123456hetNYOLC"}
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
            "country": self.country_id}
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

    def test_update_project_updates_health_focus_areas(self):
        retrieve_url = reverse("project-retrieve", kwargs={"pk": self.project_id})
        response = self.test_user_client.get(retrieve_url)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()['published'].get('health_focus_areas'),
                         self.project_data['health_focus_areas'])

        data = copy.deepcopy(self.project_data)
        data.update(health_focus_areas=[1])
        url = reverse("project-publish", kwargs={"pk": self.project_id})
        response = self.test_user_client.put(url, data, format="json")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()['published']["health_focus_areas"], data['health_focus_areas'])
        self.assertNotEqual(response.json()['published']["health_focus_areas"], self.project_data['health_focus_areas'])

        response = self.test_user_client.get(retrieve_url)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()['published'].get('health_focus_areas'), data['health_focus_areas'])
        self.assertNotEqual(response.json()['published'].get('health_focus_areas'),
                            self.project_data['health_focus_areas'])

    def test_update_project_with_different_invalid_name(self):
        url = reverse("project-publish", kwargs={"pk": self.project_id})
        data = copy.deepcopy(self.project_data)
        data.update(name="toolongnamemorethan128charactersisaninvalidnameheretoolongnamemorethan128charactersisaninv"
                         "alidnameheretoolongnamemorethan128charactersisaninvalidnamehere")
        response = self.test_user_client.put(url, data, format="json")
        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.json()["name"][0], 'Ensure this field has no more than 128 characters.')

    def test_update_project_with_new_name_that_collides_with_a_different_project(self):
        url = reverse("project-create")
        data = copy.deepcopy(self.project_data)
        data.update(name="thisnameisunique")
        response = self.test_user_client.post(url, data, format="json")
        self.assertEqual(response.status_code, 201)
        project_id = response.json()['id']

        url = reverse("project-publish", kwargs={"pk": project_id})
        response = self.test_user_client.put(url, data, format="json")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(Project.objects.count(), 2)

        url = reverse("project-publish", kwargs={"pk": self.project_id})
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

    def test_licences_str(self):
        item = Licence.objects.create(name='name')
        self.assertEqual(str(item), 'name')

    def test_iopstandard_str(self):
        item = InteroperabilityStandard.objects.create(name='name')
        self.assertEqual(str(item), 'name')

    def test_hisbucket_str(self):
        item = HISBucket.objects.create(name='name')
        self.assertEqual(str(item), 'name')

    def test_hsc_str(self):
        hsc_group = HSCGroup.objects.create(name='name')
        item = HSCChallenge.objects.create(name='challenge', group=hsc_group)
        self.assertEqual(str(item), '(name) challenge')

    def _create_new_project(self):
        country, c = Country.objects.get_or_create(code='CTR2', defaults={'name': "country2",
                                                                          'project_approval': False})

        user = UserProfile.objects.get(id=self.user_profile_id)
        country.users.add(user)

        self.project_data = {
            "date": datetime.utcnow(),
            "name": "Test Project{}".format(Project.objects.all().count() + 1),
            "organisation": self.org.id,
            "contact_name": "name2",
            "contact_email": "a@a.com",
            "implementation_overview": "overview",
            "implementation_dates": "2016",
            "health_focus_areas": [1, 2],
            "geographic_scope": "somewhere",
            "country": country.id,
            "platforms": [{
                "id": 1,
                "strategies": [1, 2]
            }, {
                "id": 2,
                "strategies": [1, 9]
            }],
            "licenses": [1, 2],
            "coverage": [
                {"district": "dist1", "clients": 20, "health_workers": 5, "facilities": 4},
                {"district": "dist2", "clients": 10, "health_workers": 2, "facilities": 8}
            ],
            "national_level_deployment":
                {"clients": 20000, "health_workers": 0, "facilities": 0},
            "donors": [self.d1.id, self.d2.id],
            "his_bucket": [1, 2],
            "hsc_challenges": [1, 2],
            "government_investor": 0,
            "implementing_partners": ["partner1", "partner2"],
            "repository": "http://some.repo",
            "mobile_application": "http://mobile.app.org",
            "wiki": "http://wiki.org",
            "interoperability_links": [{"id": 1, "selected": True, "link": "http://blabla.com"},
                                       {"id": 2, "selected": True},
                                       {"id": 3, "selected": True, "link": "http://example.org"}],
            "interoperability_standards": [1],
            "start_date": str(datetime.today().date()),
            "end_date": str(datetime.today().date())
        }

        # Create project draft
        url = reverse("project-create")
        response = self.test_user_client.post(url, self.project_data, format="json")
        self.assertEqual(response.status_code, 201, response.json())

        project_id = response.json().get("id")

        # Publish
        url = reverse("project-publish", kwargs={"pk": project_id})
        response = self.test_user_client.put(url, self.project_data, format="json")
        self.assertEqual(response.status_code, 200, response.json())

        return project_id

    @patch('django.contrib.admin.options.messages')
    def test_project_approval_admin_filter_country_admins(self, mocked_messages):
        messages = []
        mocked_messages.add_message = lambda s, *args, **kwargs: messages.append((args, kwargs))

        self._create_new_project()

        request = MockRequest()
        site = AdminSite()
        user = UserProfile.objects.get(id=self.user_profile_id).user
        request.user = user
        ma = ProjectApprovalAdmin(ProjectApproval, site)
        self.assertEqual(ma.get_queryset(request).count(), 1)
        self.assertEqual(len(messages), 1)

    def test_project_approval_admin_link_add(self):
        request = MockRequest()
        site = AdminSite()
        user = UserProfile.objects.get(id=self.user_profile_id).user
        request.user = user
        ma = ProjectApprovalAdmin(ProjectApproval, site)
        link = ma.link(ProjectApproval())
        self.assertEqual(link, '-')

    def test_project_approval_admin_link_edit(self):
        request = MockRequest()
        site = AdminSite()
        user = UserProfile.objects.get(id=self.user_profile_id).user
        request.user = user
        ma = ProjectApprovalAdmin(ProjectApproval, site)
        project_approval = ProjectApproval.objects.get(project_id=self.project_id)
        link = ma.link(project_approval)

        expected_link = "<a target='_blank' href='/app/{}/edit-project/publish/'>See project</a>"\
            .format(self.project_id)
        self.assertEqual(link, expected_link)

    def test_project_admin_link_add(self):
        request = MockRequest()
        site = AdminSite()
        user = UserProfile.objects.get(id=self.user_profile_id).user
        request.user = user
        pa = ProjectAdmin(Project, site)
        link = pa.link(Project())
        self.assertEqual(link, '-')

    def test_project_admin_link_edit(self):
        request = MockRequest()
        site = AdminSite()
        user = UserProfile.objects.get(id=self.user_profile_id).user
        request.user = user
        pa = ProjectAdmin(Project, site)
        p = Project.objects.create(name="test link")
        link = pa.link(p)

        expected_link = "<a target='_blank' href='/app/{}/edit-project/draft/'>See project</a>".format(p.id)
        self.assertEqual(link, expected_link)

    @patch('django.contrib.admin.options.messages')
    def test_project_approval_admin_export(self, mocked_messages):
        messages = []
        mocked_messages.add_message = lambda s, *args, **kwargs: messages.append((args, kwargs))

        ProjectApproval.objects.all().delete()
        Country.objects.create(name='country2', code='CTR2', project_approval=True)
        user = UserProfile.objects.get(id=self.user_profile_id).user

        project_1_id = self._create_new_project()
        project_1 = Project.objects.get(id=project_1_id)
        project_2_id = self._create_new_project()
        project_2 = Project.objects.get(id=project_2_id)
        project_3_id = self._create_new_project()
        project_3 = Project.objects.get(id=project_3_id)

        approval_1 = ProjectApproval.objects.get(project_id=project_1_id)
        self.assertIsNone(approval_1.user)
        self.assertIsNone(approval_1.approved)
        self.assertIsNone(approval_1.reason)

        approval_2 = ProjectApproval.objects.get(project_id=project_2_id)
        approval_2.user = user.userprofile
        approval_2.approved = True
        approval_2.reason = "it's fine"
        approval_2.save()

        approval_3 = ProjectApproval.objects.get(project_id=project_3_id)
        approval_3.user = user.userprofile
        approval_3.approved = False
        approval_3.reason = "not suitable"
        approval_3.save()

        request = MockRequest()
        site = AdminSite()
        request.user = user
        ma = ProjectApprovalAdmin(ProjectApproval, site)

        response = ma.export_project_approvals(request, ProjectApproval.objects.all())
        self.assertTrue(isinstance(response, HttpResponse))
        self.assertEqual(response['Content-Disposition'], 'attachment; filename=project_approval_export.csv')

        f = StringIO(force_text(response.content))
        lines = [l for l in csv.reader(f)]
        self.assertEqual(len(lines), 4)
        self.assertEqual(lines[0],
                         ['Project name',
                          'Approved by',
                          'Status',
                          'Country',
                          'Reason'])

        self.assertEqual(lines[1],
                         [project_1.name,
                          '-',
                          'Pending',
                          'country2',
                          ''])

        self.assertEqual(lines[2],
                         [project_2.name,
                          'Test Name',
                          'Approved',
                          'country2',
                          "it's fine"])

        self.assertEqual(lines[3],
                         [project_3.name,
                          'Test Name',
                          'Rejected',
                          'country2',
                          'not suitable'])

    def test_project_approval_email(self):
        user_2 = User.objects.create_superuser(username='test_2', email='test2@test.test', password='a')
        user_2_profile = UserProfile.objects.create(user=user_2, language='fr')

        c = Country.objects.get(id=self.country_id)
        c.project_approval = True
        c.users.add(self.user_profile_id, user_2_profile)
        c.save()
        send_project_approval_digest()

        first_en = '<meta http-equiv="content-language" content="en">' in mail.outbox[-2].message().as_string()
        en_index = -2 if first_en else -1
        fr_index = -1 if first_en else -2

        outgoing_en_email_text = mail.outbox[en_index].message().as_string()

        self.assertIn('admin/project/projectapproval/', outgoing_en_email_text)
        self.assertIn('<meta http-equiv="content-language" content="en">', outgoing_en_email_text)

        outgoing_fr_email_text = mail.outbox[fr_index].message().as_string()

        self.assertIn('<meta http-equiv="content-language" content="fr">', outgoing_fr_email_text)

    def test_project_approval_email_not_sent(self):
        pa = Project.objects.get(id=self.project_id).approval
        pa.approved = True
        pa.save()
        send_project_approval_digest()
        for m in mail.outbox:
            self.assertFalse('<meta http-equiv="content-language" content="en">' in m.message().as_string())

    def test_country_admins_access_all_projects_in_country_as_viewer(self):
        # Create a test user with profile.
        url = reverse("rest_register")
        data = {
            "email": "test_user2@gmail.com",
            "password1": "123456hetNYOLC",
            "password2": "123456hetNYOLC"}
        self.client.post(url, data, format="json")

        # Log in the user.
        url = reverse("api_token_auth")
        data = {
            "username": "test_user2@gmail.com",
            "password": "123456hetNYOLC"}
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

        self._create_new_project()

        p_in_country = Project.objects.get(name="Test Project2")
        p_not_in_country = Project.objects.get(name="Test Project1")

        # make user country admin of CTR2
        country = Country.objects.get(code="CTR2")
        country.users.add(self.user_profile_id)
        # make sure he is not a country admin of project 1's country
        p_not_in_country.get_country().users.remove(self.user_profile_id)

        # remove this user from all the projects
        for p in Project.objects.all():
            p.team.remove(self.user_profile_id)
            p.team.add(user_profile_id)

            # this user doesn't belong to any project anymore
            self.assertFalse(p.team.filter(id=self.user_profile_id).exists())
            self.assertFalse(p.viewers.filter(id=self.user_profile_id).exists())

            # the project belongs to the new user now
            self.assertTrue(p.team.filter(id=user_profile_id).exists())

        url = reverse("project-retrieve", kwargs={"pk": p_in_country.id})
        response = self.test_user_client.get(url, format="json")
        self.assertEqual(response.status_code, 200)
        self.assertIsInstance(response.json()['published']['start_date'], str)
        self.assertEqual(response.json()['draft']['name'], p_in_country.name)

        url = reverse("project-retrieve", kwargs={"pk": p_not_in_country.id})
        response = self.test_user_client.get(url, format="json")
        self.assertIsNone(response.json()['draft'])
        self.assertTrue('start_date' not in response.json()['published'])

        # Only works for retrieve, the list won't list any project that are not his/her
        url = reverse("project-list")
        response = self.test_user_client.get(url)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.json()), 0)

    def test_admins_access_all_projects_as_viewer(self):
        # Create a test user with profile.
        url = reverse("rest_register")
        data = {
            "email": "test_user2@gmail.com",
            "password1": "123456hetNYOLC",
            "password2": "123456hetNYOLC"}
        self.client.post(url, data, format="json")

        # Log in the user.
        url = reverse("api_token_auth")
        data = {
            "username": "test_user2@gmail.com",
            "password": "123456hetNYOLC"}
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

        self._create_new_project()

        p_in_country = Project.objects.get(name="Test Project2")
        p_not_in_country = Project.objects.get(name="Test Project1")

        # make sure he is not a country admin of project 1 or 2's country
        p_in_country.get_country().users.remove(self.user_profile_id)
        p_not_in_country.get_country().users.remove(self.user_profile_id)

        # make user a superuser
        self.userprofile.user.is_superuser = True
        self.userprofile.user.save()

        # remove this user from all the projects
        for p in Project.objects.all():
            p.team.remove(self.user_profile_id)
            p.team.add(user_profile_id)

            # this user doesn't belong to any project anymore
            self.assertFalse(p.team.filter(id=self.user_profile_id).exists())
            self.assertFalse(p.viewers.filter(id=self.user_profile_id).exists())

            # the project belongs to the new user now
            self.assertTrue(p.team.filter(id=user_profile_id).exists())

        # superuser still has access to the project
        url = reverse("project-retrieve", kwargs={"pk": p_in_country.id})
        response = self.test_user_client.get(url, format="json")
        self.assertEqual(response.status_code, 200)
        # access member only property
        self.assertIsInstance(response.json()['published']['start_date'], str)
        # access draft which is only for members only by default
        self.assertEqual(response.json()['draft']['name'], p_in_country.name)

        # superuser still has access to the project
        url = reverse("project-retrieve", kwargs={"pk": p_not_in_country.id})
        response = self.test_user_client.get(url, format="json")
        # access member only property
        self.assertIsInstance(response.json()['published']['start_date'], str)
        # access draft which is only for members only by default
        self.assertEqual(response.json()['draft']['name'], p_not_in_country.name)

        # Only works for retrieve, the list won't list any project that are not his/her
        url = reverse("project-list")
        response = self.test_user_client.get(url)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.json()), 0)

    def test_project_country_facilities_list_retrieve(self):
        url = reverse("project-retrieve", kwargs={"pk": self.project_id})
        response = self.test_user_client.get(url, format="json")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()['published']['national_level_deployment']['facilities_list'],
                         ['facility1', 'facility2', 'facility3'])

    def test_project_country_facilities_list_update(self):
        url = reverse("project-publish", kwargs={"pk": self.project_id})
        data = copy.deepcopy(self.project_data)
        data.update(
            coverage=[
                {"district": "dist1", "clients": 20, "health_workers": 5, "facilities": 4,
                 "facilities_list": ['facility_district1_1', 'facility_district1_2', 'facility_district1_3']},
                {"district": "dist2", "clients": 10, "health_workers": 2, "facilities": 8,
                 "facilities_list": ['facility_district2_1', 'facility_district2_2', 'facility_district3_3']}
            ],
            coverage_second_level=[
                {"district": "ward1", "clients": 209, "health_workers": 59, "facilities": 49,
                 "facilities_list": ['facility_ward1_1', 'facility_ward1_2', 'facility_ward1_3']},
                {"district": "ward2", "clients": 109, "health_workers": 29, "facilities": 89,
                 "facilities_list": ['facility_ward2_1', 'facility_ward2_2', 'facility_ward2_3']}
            ]
        )

        response = self.test_user_client.put(url, data, format="json")
        self.assertEqual(response.json()['published']['national_level_deployment']['facilities_list'],
                         ['facility1', 'facility2', 'facility3'])
        self.assertEqual(response.json()['published']['coverage'][0]['facilities_list'],
                         ['facility_district1_1', 'facility_district1_2', 'facility_district1_3'])
        self.assertEqual(response.json()['published']['coverage_second_level'][1]['facilities_list'],
                         ['facility_ward2_1', 'facility_ward2_2', 'facility_ward2_3'])

    def test_map_project_country_view(self):
        url = reverse("project-map")
        response = self.test_user_client.get(url)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()[0]['id'], self.project_id)
        self.assertEqual(response.json()[0]['name'], self.project_data['name'])
        self.assertEqual(response.json()[0]['country'], self.country_id)
