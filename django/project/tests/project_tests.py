import copy
from datetime import datetime

from django.urls import reverse

from django.core import mail
from django.contrib.admin.sites import AdminSite
from django.contrib.auth.models import User
from django.core.cache import cache
from rest_framework.test import APIClient

from country.models import Country, Donor
from project.admin import ProjectAdmin
from user.models import Organisation, UserProfile
from project.models import Project, DigitalStrategy, InteroperabilityLink, TechnologyPlatform, HealthFocusArea, \
    Licence, InteroperabilityStandard, HISBucket, HSCChallenge, HSCGroup, ProjectApproval
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
        data['project'].update(dict(
            wiki="wikiorg",
            name="testing_wiki_validation"
        ))
        # Create project draft
        url = reverse("project-create", kwargs={"country_id": self.country_id})
        response = self.test_user_client.post(url, data, format="json")
        self.assertEqual(response.status_code, 201)
        project_id = response.json()['id']

        # Publish project
        url = reverse("project-publish", kwargs={"project_id": self.project_id, "country_id": self.country_id})
        response = self.test_user_client.put(url, data, format="json")
        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.json(), {'wiki': ['Enter a valid URL.']})

        data['project'].update(dict(
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
        url = reverse("project-create", kwargs={"country_id": self.country_id})
        data = copy.deepcopy(self.project_data)
        data['project'].update(dict(name="Test Project3"))
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
        url = reverse("project-create", kwargs={"country_id": self.country_id})
        data = copy.deepcopy(self.project_data)
        data['project'].update(dict(name="Test Project3"))
        response = self.test_user_client.post(url, data, format="json")
        project_id = response.data['id']
        approval = ProjectApproval.objects.filter(project_id=response.data['id']).first()
        self.assertEqual(response.status_code, 201)
        self.assertTrue(approval)
        # Approve project
        approval.approved = True
        approval.save()
        # Update project
        url = reverse("project-publish", kwargs={"project_id": project_id, "country_id": self.country_id})
        data = copy.deepcopy(self.project_data)
        data['project'].update(dict(name="Test Project updated"))
        response = self.test_user_client.put(url, data, format="json")
        new_approval = ProjectApproval.objects.filter(project_id=response.data['id']).first()
        self.assertEqual(response.status_code, 200)
        self.assertEqual(new_approval.approved, None)

    def test_create_validating_list_fields_invalid_data(self):
        url = reverse("project-create", kwargs={"country_id": self.country_id})
        data = copy.deepcopy(self.project_data)
        data['project'].update(dict(
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
        self.assertEqual(len(response.json()['project'].keys()), 8)
        self.assertEqual(response.json()['project']['implementing_partners']['0'], ['Not a valid string.'])
        self.assertEqual(response.json()['project']['health_focus_areas']['0'], ['A valid integer is required.'])
        self.assertEqual(response.json()['project']['licenses']['0'], ['A valid integer is required.'])
        self.assertEqual(response.json()['project']['donors']['0'], ['A valid integer is required.'])
        self.assertEqual(response.json()['project']['his_bucket']['0'], ['A valid integer is required.'])
        self.assertEqual(response.json()['project']['hsc_challenges']['0'], ['A valid integer is required.'])
        self.assertEqual(response.json()['project']['interoperability_links'], [{'id': ['This field is required.']}])
        self.assertEqual(response.json()['project']['interoperability_standards']['0'],
                         ['A valid integer is required.'])

    def test_create_new_project_with_platform_name_missing(self):
        url = reverse("project-create", kwargs={"country_id": self.country_id})
        data = copy.deepcopy(self.project_data)
        new_data = {
            "name": "Test Project91",
            "platforms": [{
                "strategies": []
            }]
        }
        data['project'].update(new_data)
        response = self.test_user_client.post(url, data, format="json")
        self.assertEqual(response.status_code, 400)
        self.assertIn("platforms", response.json()['project'])
        self.assertEqual(response.json()['project']['platforms'][0]['id'][0], 'This field is required.')

    def test_create_new_project_with_platform_empty_array(self):
        url = reverse("project-create", kwargs={"country_id": self.country_id})
        data = copy.deepcopy(self.project_data)
        new_data = {
            "name": "Test Project91",
            "platforms": []
        }
        data['project'].update(new_data)
        response = self.test_user_client.post(url, data, format="json")
        self.assertEqual(response.status_code, 201)

    def test_create_new_project_with_platform_strategies_missing(self):
        url = reverse("project-create", kwargs={"country_id": self.country_id})
        data = copy.deepcopy(self.project_data)
        new_data = {
            "name": "Test Project92",
            "platforms": [{
                "name": "strat1"
            }]
        }
        data['project'].update(new_data)
        response = self.test_user_client.post(url, data, format="json")
        self.assertEqual(response.status_code, 400)
        self.assertIn("platforms", response.json()['project'])
        self.assertEqual(response.json()['project']['platforms'][0]['strategies'][0], 'This field is required.')

    def test_create_new_project_with_platform_strategies_empty(self):
        url = reverse("project-create", kwargs={"country_id": self.country_id})
        data = copy.deepcopy(self.project_data)
        new_data = {
            "name": "Test Project93",
            "platforms": [{
                "id": 1,
                "strategies": []
            }]
        }
        data['project'].update(new_data)
        response = self.test_user_client.post(url, data, format="json")
        self.assertEqual(response.status_code, 201)
        self.assertEqual(response.json()['draft']['platforms'][0]['strategies'], list())

    def test_create_new_project_with_platform_extra_data(self):
        url = reverse("project-create", kwargs={"country_id": self.country_id})
        data = copy.deepcopy(self.project_data)
        new_data = {
            "name": "Test Project93",
            "platforms": [{
                "id": 1,
                "strategies": [],
                "extra": "lol"
            }]
        }
        data['project'].update(new_data)
        response = self.test_user_client.post(url, data, format="json")
        self.assertEqual(response.status_code, 201)
        self.assertEqual(response.json()['draft']['platforms'][0]['strategies'], list())
        self.assertNotIn("extra", response.json()['draft']['platforms'][0])

    def test_publish_project_makes_public_id(self):
        url = reverse("project-create", kwargs={"country_id": self.country_id})
        data = copy.deepcopy(self.project_data)
        data['project'].update(name="Test Project4")
        response = self.test_user_client.post(url, data, format="json")
        self.assertEqual(response.status_code, 201)
        self.assertFalse(response.json()['public_id'])
        project_id = response.json()['id']

        url = reverse("project-publish", kwargs={"project_id": project_id, "country_id": self.country_id})
        response = self.test_user_client.put(url, data, format="json")
        self.assertEqual(response.status_code, 200)
        self.assertTrue(response.json()['public_id'])

        url = reverse("project-retrieve", kwargs={"pk": project_id})
        response = self.test_user_client.get(url)
        self.assertEqual(response.status_code, 200)
        self.assertTrue(response.json()['public_id'])

    def test_update_project(self):
        url = reverse("project-publish", kwargs={"project_id": self.project_id, "country_id": self.country_id})
        data = copy.deepcopy(self.project_data)
        data['project'].update(name="TestProject98",
                               platforms=[{"id": 999, "strategies": [998]}])
        response = self.test_user_client.put(url, data, format="json")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()['published']["platforms"][0]["id"], 999)
        self.assertEqual(response.json()['published']["platforms"][0]["strategies"][0], 998)

    def test_update_project_errors(self):
        url = reverse("project-publish", kwargs={"project_id": self.project_id, "country_id": self.country_id})
        data = copy.deepcopy(self.project_data)
        data['project'].update(name="TestProject93", platforms=[{"name": "updated platform"}])
        response = self.test_user_client.put(url, data, format="json")
        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.json()['platforms'][0]['strategies'][0], 'This field is required.')

    def test_create_new_project_unique_name(self):
        url = reverse("project-create", kwargs={"country_id": self.country_id})
        response = self.test_user_client.post(url, self.project_data, format="json")
        self.assertEqual(response.status_code, 201)
        project_id = response.json()['id']
        self.assertEqual(response.json()['draft']['name'], self.project_data['project']['name'])

        url = reverse("project-publish", kwargs={"project_id": project_id, "country_id": self.country_id})
        response = self.test_user_client.put(url, self.project_data, format="json")

        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.json()['project']['name'][0], 'This field must be unique.')

    def test_retrieve_project(self):
        url = reverse("project-retrieve", kwargs={"pk": self.project_id})
        response = self.test_user_client.get(url, HTTP_ACCEPT_LANGUAGE='en')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()['published'].get("name"), "Test Project1")
        self.assertEqual(response.json()['published'].get("national_level_deployment")["clients"], 20000)
        self.assertEqual(response.json()['published'].get("platforms")[0]["id"],
                         self.project_data['project']['platforms'][0]['id'])
        self.assertEqual(response.json()['published'].get("country"), self.country_id)

        response = self.test_user_client.get(url, HTTP_ACCEPT_LANGUAGE='fr')
        self.assertEqual(response.status_code, 200)

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

    def test_create_project_adds_owner_to_team(self):
        url = reverse("project-create", kwargs={"country_id": self.country_id})
        data = copy.deepcopy(self.project_data)
        data['project'].update(name="Test Project3")
        response = self.test_user_client.post(url, data, format="json")
        self.assertEqual(response.status_code, 201)

        userprofile = UserProfile.objects.get(name="Test Name")
        project = Project.objects.get(id=response.json()['id'])
        self.assertEqual(project.team.first(), userprofile)

    def test_team_cant_be_but_viewers_can_be_empty(self):
        url = reverse("project-create", kwargs={"country_id": self.country_id})
        data = copy.deepcopy(self.project_data)
        data['project'].update(name="Test Project4")
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
                         self.project_data['project']['health_focus_areas'])

        data = copy.deepcopy(self.project_data)
        data['project'].update(health_focus_areas=[1])
        url = reverse("project-publish", kwargs={"project_id": self.project_id, "country_id": self.country_id})
        response = self.test_user_client.put(url, data, format="json")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()['published']["health_focus_areas"], data['health_focus_areas'])
        self.assertNotEqual(response.json()['published']["health_focus_areas"],
                            self.project_data['project']['health_focus_areas'])

        response = self.test_user_client.get(retrieve_url)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()['published'].get('health_focus_areas'), data['health_focus_areas'])
        self.assertNotEqual(response.json()['published'].get('health_focus_areas'),
                            self.project_data['project']['health_focus_areas'])

    def test_update_project_with_different_invalid_name(self):
        url = reverse("project-publish", kwargs={"project_id": self.project_id, "country_id": self.country_id})
        data = copy.deepcopy(self.project_data)
        data['project'].update(
            name="toolongnamemorethan128charactersisaninvalidnameheretoolongnamemorethan128charactersisaninv"
                 "alidnameheretoolongnamemorethan128charactersisaninvalidnamehere")
        response = self.test_user_client.put(url, data, format="json")
        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.json()["name"][0], 'Ensure this field has no more than 128 characters.')

    def test_update_project_with_new_name_that_collides_with_a_different_project(self):
        url = reverse("project-create", kwargs={"country_id": self.country_id})
        data = copy.deepcopy(self.project_data)
        data['project'].update(name="thisnameisunique")
        response = self.test_user_client.post(url, data, format="json")
        self.assertEqual(response.status_code, 201)
        project_id = response.json()['id']

        url = reverse("project-publish", kwargs={"project_id": project_id, "country_id": self.country_id})
        response = self.test_user_client.put(url, data, format="json")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(Project.objects.count(), 2)

        url = reverse("project-publish", kwargs={"project_id": self.project_id, "country_id": self.country_id})
        data = copy.deepcopy(self.project_data)
        data['project'].update(name="thisnameisunique")
        response = self.test_user_client.put(url, data, format="json")
        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.json()["name"][0], 'This field must be unique.')

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

        self.project_data = {"project": {
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
            "coverage_second_level": [
                {"district": "ward1", "clients": 209, "health_workers": 59, "facilities": 49},
                {"district": "ward2", "clients": 109, "health_workers": 29, "facilities": 89}
            ],
            "national_level_deployment":
                {"clients": 20000, "health_workers": 0, "facilities": 0,
                 "facilities_list": ['facility1', 'facility2', 'facility3']},
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
        }}

        # Create project draft
        url = reverse("project-create", kwargs={"country_id": country.id})
        response = self.test_user_client.post(url, self.project_data, format="json")
        self.assertEqual(response.status_code, 201, response.json())

        project_id = response.json().get("id")

        # Publish
        url = reverse("project-publish", kwargs={"project_id": project_id, "country_id": country.id})
        response = self.test_user_client.put(url, self.project_data, format="json")
        self.assertEqual(response.status_code, 200, response.json())

        return project_id, country.id

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
        url = reverse("project-publish", kwargs={"project_id": self.project_id, "country_id": self.country_id})
        data = copy.deepcopy(self.project_data)
        data['project'].update(
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
        self.assertEqual(response.json()[0]['name'], self.project_data['project']['name'])
        self.assertEqual(response.json()[0]['country'], self.country_id)

    def test_remove_stale_donors_from_projects(self):
        project = Project.objects.last()
        self.assertEqual(project.data['donors'], [self.d1.id, self.d2.id])

        Donor.objects.get(id=self.d2.id).delete()
        Project.remove_stale_donors()
        project.refresh_from_db()
        self.assertEqual(project.data['donors'], [self.d1.id])
