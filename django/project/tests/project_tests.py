import copy
from datetime import datetime
from unittest import mock

from allauth.account.models import EmailAddress
from django.urls import reverse
from django.utils import timezone
from rest_framework import status

from core.factories import UserFactory, UserProfileFactory, OrganisationFactory, TechnologyPlatformFactory, \
    DigitalStrategyFactory, ProjectFactory
from django.core import mail
from django.contrib.auth.models import User
from django.core.cache import cache
from rest_framework.test import APIClient

from country.models import Country, Donor
from user.models import UserProfile, Organisation
from project.models import Project, DigitalStrategy, TechnologyPlatform, Licence, ProjectApproval
from project.tasks import send_project_approval_digest, \
    send_project_updated_digest, notify_superusers_about_new_pending_software, notify_user_about_software_approval, \
    send_draft_only_reminders

from project.tests.setup import SetupTests


class ProjectTests(SetupTests):
    def test_retrieve_project_structure(self):
        url = reverse("get-project-structure")
        response = self.test_user_client.get(url)
        self.assertEqual(response.status_code, 200)
        self.assertContains(response, "strategies")
        self.assertContains(response, "technology_platforms")
        self.assertContains(response, "osi_licenses")
        self.assertContains(response, "interoperability_links")
        self.assertContains(response, "interoperability_standards")
        self.assertContains(response, "his_bucket")
        self.assertContains(response, "hsc_challenges")

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
        url = reverse("project-create", kwargs={"country_id": self.country1.id})
        response = self.test_user_client.post(url, data, format="json")
        self.assertEqual(response.status_code, 201)
        project_id = response.json()['id']

        # Publish project
        url = reverse("project-publish", kwargs={"project_id": project_id, "country_id": self.country1.id})
        response = self.test_user_client.put(url, data, format="json")
        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.json()['project'], {'wiki': ['Enter a valid URL.']})

        data['project'].update(dict(
            wiki="wiki.cancerresearch",
        ))

        # Try to publish it again
        response = self.test_user_client.put(url, data, format="json")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()['draft']['wiki'], 'wiki.cancerresearch')
        self.assertEqual(response.json()['published']['wiki'], 'wiki.cancerresearch')

    def test_create_new_project_approval_required(self):
        c = Country.objects.get(id=self.country1.id)
        c.project_approval = True
        c.users.add(self.user_profile_id)
        c.save()
        url = reverse("project-create", kwargs={"country_id": self.country1.id})
        data = copy.deepcopy(self.project_data)
        data['project'].update(dict(name="Test Project3"))
        response = self.test_user_client.post(url, data, format="json")
        self.assertEqual(response.status_code, 201)
        self.assertEqual(ProjectApproval.objects.filter(project_id=response.data['id']).exists(), True)

    def test_create_new_project_approval_required_on_update(self):
        # Make country approval-required
        c = Country.objects.get(id=self.country1.id)
        c.project_approval = True
        c.users.add(self.user_profile_id)
        c.save()
        # Create project
        url = reverse("project-create", kwargs={"country_id": self.country1.id})
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
        url = reverse("project-publish", kwargs={"project_id": project_id, "country_id": self.country1.id})
        data = copy.deepcopy(self.project_data)
        data['project'].update(dict(name="Test Project updated"))
        response = self.test_user_client.put(url, data, format="json")
        new_approval = ProjectApproval.objects.filter(project_id=response.data['id']).first()
        self.assertEqual(response.status_code, 200)
        self.assertEqual(new_approval.approved, None)

    def test_project_approval_project_methods(self):
        project = Project.objects.get(id=self.project_id)
        project.approve()

        approval = ProjectApproval.objects.get(project_id=self.project_id)

        self.assertTrue(project.approval.approved)
        self.assertTrue(approval.approved)

        project.disapprove()
        approval.refresh_from_db()

        self.assertFalse(project.approval.approved)
        self.assertFalse(approval.approved)

        project.reset_approval()
        approval.refresh_from_db()

        self.assertIsNone(project.approval.approved)
        self.assertIsNone(approval.approved)

        self.assertEqual(approval.__str__(), 'Approval for {}'.format(project.name))

    def test_project_approval_list_by_country(self):
        url = reverse("approval", kwargs={"country_id": self.country1.id})
        response = self.test_user_client.get(url, format="json")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()[0]['project_name'], self.project_data['project']['name'])
        self.assertEqual(response.json()[0]['history'][0]['history_user__userprofile'], self.user_profile_id)
        self.assertIsNone(response.json()[0]['history'][0]['approved'])
        self.assertIsNone(response.json()[0]['history'][0]['reason'])

    def test_project_approval_approve(self):
        project = Project.objects.get(id=self.project_id)
        approval = project.approval

        url = reverse("approval", kwargs={"pk": approval.id})
        response = self.test_user_client.put(url, data={}, format="json")
        self.assertEqual(response.status_code, 403)
        self.assertEqual(response.json(), {'detail': 'You do not have permission to perform this action.'})

        self.country1.admins.add(self.user_profile_id)
        url = reverse("approval", kwargs={"pk": approval.id})
        response = self.test_user_client.put(url, data={'approved': True, 'reason': 'all good'}, format="json")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.json()['history']), 2)
        self.assertTrue(response.json()['history'][0]['approved'], self.user_profile_id)
        self.assertEqual(response.json()['history'][0]['reason'], 'all good')

    def test_create_validating_list_fields_invalid_data(self):
        url = reverse("project-create", kwargs={"country_id": self.country1.id})
        data = copy.deepcopy(self.project_data)
        data['project'].update(dict(
            name="Test Project4",
            implementing_partners=[{"object": "not good"}],
            health_focus_areas=[{"object": "not good"}],
            osi_licenses=[{"object": "not good"}],
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
        self.assertEqual(response.json()['project']['osi_licenses']['0'], ['A valid integer is required.'])
        self.assertEqual(response.json()['project']['donors']['0'], ['A valid integer is required.'])
        self.assertEqual(response.json()['project']['his_bucket']['0'], ['A valid integer is required.'])
        self.assertEqual(response.json()['project']['hsc_challenges']['0'], ['A valid integer is required.'])
        self.assertEqual(response.json()['project']['interoperability_links'], [{'id': ['This field is required.']}])
        self.assertEqual(response.json()['project']['interoperability_standards']['0'],
                         ['A valid integer is required.'])

    def test_publish_project_makes_public_id(self):
        url = reverse("project-create", kwargs={"country_id": self.country1.id})
        data = copy.deepcopy(self.project_data)
        data['project'].update(name="Test Project4")
        response = self.test_user_client.post(url, data, format="json")
        self.assertEqual(response.status_code, 201)
        self.assertFalse(response.json()['public_id'])
        project_id = response.json()['id']

        url = reverse("project-publish", kwargs={"project_id": project_id, "country_id": self.country1.id})
        response = self.test_user_client.put(url, data, format="json")
        self.assertEqual(response.status_code, 200)
        self.assertTrue(response.json()['public_id'])
        public_id = response.json()['public_id']

        url = reverse("project-retrieve", kwargs={"pk": project_id})
        response = self.test_user_client.get(url)
        self.assertEqual(response.status_code, 200)
        self.assertTrue(response.json()['public_id'])

        url = reverse("project-retrieve", kwargs={"public_id": public_id})
        response = self.test_user_client.get(url)
        self.assertEqual(response.status_code, 200)
        self.assertTrue(response.json()['public_id'])

    def test_update_project(self):
        url = reverse("project-publish", kwargs={"project_id": self.project_id, "country_id": self.country1.id})
        data = copy.deepcopy(self.project_data)
        data['project'].update(name="TestProject98")
        response = self.test_user_client.put(url, data, format="json")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()['published']["name"], "TestProject98")

    def test_project_data_missing(self):
        data = copy.deepcopy(self.project_data)
        data.pop('project', None)

        url = reverse("project-publish", kwargs={"project_id": self.project_id, "country_id": self.country1.id})
        response = self.test_user_client.put(url, data, format="json")
        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.json(), {'project': 'Project data is missing'})

        url = reverse("project-draft", kwargs={"project_id": self.project_id, "country_id": self.country1.id})
        response = self.test_user_client.put(url, data, format="json")
        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.json(), {'project': 'Project data is missing'})

        url = reverse("project-create", kwargs={"country_id": self.country1.id})
        response = self.test_user_client.post(url, data, format="json")
        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.json(), {'project': 'Project data is missing'})

    def test_create_new_project_unique_name(self):
        url = reverse("project-create", kwargs={"country_id": self.country1.id})
        response = self.test_user_client.post(url, self.project_data, format="json")
        self.assertEqual(response.status_code, 201)
        project_id = response.json()['id']
        self.assertEqual(response.json()['draft']['name'], self.project_data['project']['name'])

        url = reverse("project-publish", kwargs={"project_id": project_id, "country_id": self.country1.id})
        response = self.test_user_client.put(url, self.project_data, format="json")

        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.json()['project']['name'][0], 'This field must be unique.')

    def test_retrieve_project(self):
        url = reverse("project-retrieve", kwargs={"pk": self.project_id})
        response = self.test_user_client.get(url, HTTP_ACCEPT_LANGUAGE='en')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()['published'].get("name"), "Test Project1")
        self.assertEqual(response.json()['published'].get("national_level_deployment")["clients"], 20000)
        self.assertEqual(response.json()['published'].get("country"), self.country1.id)

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
        self.test_user_client.post(url, format="json")
        url = reverse("get-coverage-versions", kwargs={"project_id": self.project_id})
        response = self.test_user_client.get(url)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.json()), 1)
        self.assertEqual(len(response.json()[0]['data']), 3)

    def test_get_toolkit_versions(self):
        url = reverse("make-version", kwargs={"project_id": self.project_id})
        self.test_user_client.post(url, format="json")
        url = reverse("get-toolkit-versions", kwargs={"project_id": self.project_id})
        response = self.test_user_client.get(url)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.json()), 1)

    def test_version_numbers_increasing(self):
        url = reverse("make-version", kwargs={"project_id": self.project_id})
        self.test_user_client.post(url, format="json")
        self.test_user_client.post(url, format="json")
        url = reverse("get-toolkit-versions", kwargs={"project_id": self.project_id})
        response = self.test_user_client.get(url)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.json()), 2)
        self.assertEqual(response.json()[1]["version"], 2)

    def test_retrieve_last_version(self):
        url = reverse("make-version", kwargs={"project_id": self.project_id})
        self.test_user_client.post(url, format="json")
        url = reverse("project-retrieve", kwargs={"pk": self.project_id})
        response = self.test_user_client.get(url)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()['published'].get("name"), "Test Project1")
        self.assertEqual(response.json()['published'].get("last_version"), 1)
        self.assertIn("last_version_date", response.json()['published'])

    def test_create_project_adds_owner_to_team(self):
        url = reverse("project-create", kwargs={"country_id": self.country1.id})
        data = copy.deepcopy(self.project_data)
        data['project'].update(name="Test Project3")
        response = self.test_user_client.post(url, data, format="json")
        self.assertEqual(response.status_code, 201)

        userprofile = UserProfile.objects.get(name="Test Name")
        project = Project.objects.get(id=response.json()['id'])
        self.assertEqual(project.team.first(), userprofile)

    def test_team_cant_be_but_viewers_can_be_empty(self):
        url = reverse("project-create", kwargs={"country_id": self.country1.id})
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
        user_profile_id = response.json().get("user_profile_id")

        # Log in the user.
        url = reverse("token_obtain_pair")
        data = {
            "username": "test_user2@gmail.com",
            "password": "123456hetNYOLC"}
        response = self.client.post(url, data)
        test_user_key = response.json().get("access")
        test_user_client = APIClient(HTTP_AUTHORIZATION="Token {}".format(test_user_key), format="json")

        # update profile.
        org = OrganisationFactory(name="org2")
        url = reverse("userprofile-detail", kwargs={"pk": user_profile_id})
        data = {
            "name": "Test Name 2",
            "organisation": org.id,
            "country": self.country1.id}
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
        user_profile_id = response.json().get('user_profile_id')

        # Log in the user.
        url = reverse("token_obtain_pair")
        data = {
            "username": "test_user2@gmail.com",
            "password": "123456hetNYOLC"}
        response = self.client.post(url, data)
        test_user_key = response.json().get("access")
        test_user_client = APIClient(HTTP_AUTHORIZATION="Token {}".format(test_user_key), format="json")

        # update profile.
        org = OrganisationFactory(name="org2")
        url = reverse("userprofile-detail", kwargs={"pk": user_profile_id})
        data = {
            "name": "Test Name 2",
            "organisation": org.id,
            "country": self.country1.id}
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

    def test_add_new_users_by_invalid_email(self):
        url = reverse("project-groups", kwargs={"pk": self.project_id})
        response = self.test_user_client.get(url)
        self.assertEqual(response.status_code, 200)

        groups = {
            "team": [],
            "viewers": [],
            "new_team_emails": ["new_email"],
            "new_viewer_emails": ["yolo"]
        }
        response = self.test_user_client.put(url, groups, format="json")

        self.assertEqual(response.json(), {'new_team_emails': {'0': ['Enter a valid email address.']},
                                           'new_viewer_emails': {'0': ['Enter a valid email address.']}})

    def test_add_new_users_by_email(self):
        url = reverse("project-groups", kwargs={"pk": self.project_id})
        response = self.test_user_client.get(url)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(UserProfile.objects.count(), 1)
        self.assertEqual(EmailAddress.objects.count(), 1)
        owner_id = response.json()['team'][0]

        groups = {
            "team": [],
            "viewers": [],
            "new_team_emails": ["new_email@yo.com"],
            "new_viewer_emails": ["new_email@lol.ok"]
        }
        response = self.test_user_client.put(url, groups, format="json")

        self.assertTrue(response.json()['team'])
        self.assertTrue(response.json()['viewers'])
        self.assertTrue(owner_id not in response.json()['team'])
        self.assertEqual(UserProfile.objects.count(), 3)
        self.assertEqual(EmailAddress.objects.count(), 3)

        welcome_emails_count = 0
        for m in mail.outbox:
            if m.subject == 'Welcome to the Digital Health Atlas':
                welcome_emails_count += 1
        self.assertEqual(welcome_emails_count, 3)

        notified_on_member_add_count = 0
        for m in mail.outbox:
            if m.subject == 'You have been added to a project in the Digital Health Atlas':
                notified_on_member_add_count += 1
                self.assertTrue("new_email@yo.com" in m.to or "new_email@lol.ok" in m.to)
        self.assertEqual(notified_on_member_add_count, 2)

        set_password_sent = 0
        for m in mail.outbox:
            if m.subject == "Set Your Password on Digital Health Atlas":
                set_password_sent += 1
                self.assertTrue("new_email@yo.com" in m.to or "new_email@lol.ok" in m.to)
        self.assertEqual(set_password_sent, 2)

    def test_add_new_users_by_already_existing_email(self):
        url = reverse("project-groups", kwargs={"pk": self.project_id})
        response = self.test_user_client.get(url)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(UserProfile.objects.count(), 1)
        owner_id = response.json()['team'][0]
        owner_email = UserProfile.objects.get().user.email

        groups = {
            "team": [owner_id],
            "viewers": [],
            "new_team_emails": [owner_email],
            "new_viewer_emails": [owner_email]
        }
        response = self.test_user_client.put(url, groups, format="json")
        self.assertTrue(owner_id in response.json()['team'])
        self.assertTrue(owner_id in response.json()['viewers'])
        self.assertEqual(UserProfile.objects.count(), 1)

    def test_update_project_updates_health_focus_areas(self):
        retrieve_url = reverse("project-retrieve", kwargs={"pk": self.project_id})
        response = self.test_user_client.get(retrieve_url)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()['published'].get('health_focus_areas'),
                         self.project_data['project']['health_focus_areas'])

        data = copy.deepcopy(self.project_data)
        data['project'].update(health_focus_areas=[1])
        url = reverse("project-publish", kwargs={"project_id": self.project_id, "country_id": self.country1.id})
        response = self.test_user_client.put(url, data, format="json")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()['published']["health_focus_areas"], data['project']['health_focus_areas'])
        self.assertNotEqual(response.json()['published']["health_focus_areas"],
                            self.project_data['project']['health_focus_areas'])

        response = self.test_user_client.get(retrieve_url)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()['published'].get('health_focus_areas'), data['project']['health_focus_areas'])
        self.assertNotEqual(response.json()['published'].get('health_focus_areas'),
                            self.project_data['project']['health_focus_areas'])

    def test_update_project_with_different_invalid_name(self):
        url = reverse("project-publish", kwargs={"project_id": self.project_id, "country_id": self.country1.id})
        data = copy.deepcopy(self.project_data)
        data['project'].update(
            name="toolongnamemorethan128charactersisaninvalidnameheretoolongnamemorethan128charactersisaninv"
                 "toolongnamemorethan128charactersisaninvalidnameheretoolongnamemorethan128charactersisaninv"
                 "toolongnamemorethan128charactersisaninvalidnameheretoolongnamemorethan128charactersisaninv"
                 "alidnameheretoolongnamemorethan128charactersisaninvalidnamehere")
        response = self.test_user_client.put(url, data, format="json")
        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.json()['project']["name"][0], 'Ensure this field has no more than 250 characters.')

    def test_update_project_with_new_name_that_collides_with_a_different_project(self):
        url = reverse("project-create", kwargs={"country_id": self.country1.id})
        data = copy.deepcopy(self.project_data)
        data['project'].update(name="thisnameisunique")
        response = self.test_user_client.post(url, data, format="json")
        self.assertEqual(response.status_code, 201)
        project_id = response.json()['id']

        url = reverse("project-publish", kwargs={"project_id": project_id, "country_id": self.country1.id})
        response = self.test_user_client.put(url, data, format="json")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(Project.objects.count(), 2)

        url = reverse("project-publish", kwargs={"project_id": self.project_id, "country_id": self.country1.id})
        data = copy.deepcopy(self.project_data)
        data['project'].update(name="thisnameisunique")
        response = self.test_user_client.put(url, data, format="json")
        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.json()['project']["name"][0], 'This field must be unique.')

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
            "health_focus_areas": [1, 2],
            "geographic_scope": "somewhere",
            "country": country.id,
            "software": [1, 2],
            "dhis": [1, 2, 9],
            "osi_licenses": [1, 2],
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
            "end_date": str(datetime.today().date()),
            "stages": [{
                "id": 1,
                "date": str(datetime.today().date()),
                "note": "stage 1 note",
            }, {
                "id": 2,
                "date": str(datetime.today().date()),
                "note": "stage 2 note",
            }],
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

    def test_project_approval_email(self):
        user_2 = UserFactory(username='test_2', email='test2@test.test', password='a', is_staff=True, is_superuser=True)
        user_2_profile = UserProfileFactory(user=user_2, language='fr')

        c = Country.objects.get(id=self.country1.id)
        c.project_approval = True
        c.admins.add(self.user_profile_id, user_2_profile)
        c.save()
        send_project_approval_digest()

        first_en = '<meta http-equiv="content-language" content="en">' in mail.outbox[-2].message().as_string()
        en_index = -2 if first_en else -1
        fr_index = -1 if first_en else -2

        outgoing_en_email_text = mail.outbox[en_index].message().as_string()
        self.assertIn('/en/-/admin/country', outgoing_en_email_text)
        self.assertIn('<meta http-equiv="content-language" content="en">', outgoing_en_email_text)

        outgoing_fr_email_text = mail.outbox[fr_index].message().as_string()
        self.assertIn('/fr/-/admin/country', outgoing_fr_email_text)
        self.assertIn('<meta http-equiv="content-language" content="fr">', outgoing_fr_email_text)

    @mock.patch('project.tasks.send_mail_wrapper', return_value=None)
    def test_project_approval_email_without_users_to_notify(self, send_email_wrapper):
        user_profile = UserProfile.objects.get(id=self.user_profile_id)
        user_profile.project_approval_request_notification = False
        user_profile.save()

        user_2 = UserFactory(username='test_2', email='test2@test.test', password='a', is_staff=True, is_superuser=True)
        user_2_profile = UserProfileFactory(user=user_2, language='fr', project_approval_request_notification=False)

        c = Country.objects.get(id=self.country1.id)
        c.project_approval = True
        c.admins.add(self.user_profile_id, user_2_profile)
        c.save()
        send_project_approval_digest()

        send_email_wrapper.assert_not_called()

    def test_project_approval_email_not_sent(self):
        pa = Project.objects.get(id=self.project_id).approval
        pa.approved = True
        pa.save()
        send_project_approval_digest()
        for m in mail.outbox:
            self.assertNotIn('/en/-/admin/country', m.message().as_string())

    def test_country_admins_access_all_projects_in_country_as_viewer(self):
        # Create a test user with profile.
        url = reverse("rest_register")
        data = {
            "email": "test_user2@gmail.com",
            "password1": "123456hetNYOLC",
            "password2": "123456hetNYOLC"}
        response = self.client.post(url, data, format="json")
        user_profile_id = response.json().get('user_profile_id')

        # Log in the user.
        url = reverse("token_obtain_pair")
        data = {
            "username": "test_user2@gmail.com",
            "password": "123456hetNYOLC"}
        response = self.client.post(url, data, format="json")
        test_user_key = response.json().get("access")
        test_user_client = APIClient(HTTP_AUTHORIZATION="Token {}".format(test_user_key), format="json")

        # update profile.
        org = OrganisationFactory(name="org2")
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
        self.assertTrue('last_version' not in response.json()['published'])

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
        response = self.client.post(url, data, format="json")
        user_profile_id = response.json().get('user_profile_id')

        # Log in the user.
        url = reverse("token_obtain_pair")
        data = {
            "username": "test_user2@gmail.com",
            "password": "123456hetNYOLC"}
        response = self.client.post(url, data, format="json")
        test_user_key = response.json().get("access")
        test_user_client = APIClient(HTTP_AUTHORIZATION="Token {}".format(test_user_key), format="json")

        # update profile.
        org = OrganisationFactory(name="org2")
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
        url = reverse("project-publish", kwargs={"project_id": self.project_id, "country_id": self.country1.id})
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
        self.assertEqual(response.json()[0]['country'], self.country1.id)

    def test_remove_stale_donors_from_projects(self):
        project = Project.objects.last()
        self.assertEqual(project.data['donors'], [self.d1.id, self.d2.id])

        Donor.objects.get(id=self.d2.id).delete()
        Project.remove_stale_donors()
        project.refresh_from_db()
        self.assertEqual(project.data['donors'], [self.d1.id])

    def test_get_project_404_success(self):
        url = reverse("project-retrieve", kwargs={"pk": 10000000})
        response = self.test_user_client.get(url, format="json")
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND, response.json())

    @mock.patch('project.views.notify_superusers_about_new_pending_software.apply_async')
    def test_technology_platform_create(self, task):
        task.return_value = None

        user = UserFactory(username='test_user_100000', password='test_user_100000')
        user_profile = UserProfileFactory(user=user, name="test_user_100000")

        data = {
            'name': 'test platform',
            'state': TechnologyPlatform.APPROVED,  # should have no effect
            'added_by': user_profile.id,  # should have no effect
        }
        url = reverse('technologyplatform-list')
        response = self.test_user_client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED, response.json())
        data = response.json()
        self.assertEqual(data['state'], TechnologyPlatform.PENDING)
        self.assertEqual(data['added_by'], self.user_profile_id)

        call_args_list = task.call_args_list
        self.assertEqual(call_args_list[0][0][0][0], data['id'])

    @mock.patch('project.tasks.send_mail_wrapper')
    def test_notify_default_notification_email_about_pending_software_success(self, send_email):
        send_email.return_value = None

        super_users = User.objects.filter(is_superuser=True)
        # remove super user status from the current super users
        for user in super_users:
            user.is_superuser = False
            user.save()

        test_super_user_1 = UserFactory(username='bh_superuser_1', email='bh+1@pulilab.com', password='puli_1234',
                                        is_staff=True, is_superuser=True)
        test_super_user_2 = UserFactory(username='bh_superuser_2', email='bh+2@pulilab.com', password='puli_1234',
                                        is_staff=True, is_superuser=True)
        try:
            software = TechnologyPlatformFactory(name='pending software')

            with self.settings(NOTIFICATION_EMAIL='default@email.com'):
                notify_superusers_about_new_pending_software.apply((software.id,))

                call_args_list = send_email.call_args_list[0][1]
                self.assertEqual(call_args_list['subject'], 'New software is pending for approval')
                self.assertEqual(call_args_list['email_type'], 'new_pending_software')
                self.assertIn('default@email.com', call_args_list['to'])
                self.assertEqual(call_args_list['context']['software_name'], software.name)

        finally:
            test_super_user_1.delete()
            test_super_user_2.delete()

            # give back super user status
            for user in super_users:
                user.is_superuser = True
                user.save()

    @mock.patch('project.tasks.send_mail_wrapper')
    def test_notify_super_users_about_pending_software_success(self, send_email):
        send_email.return_value = None

        super_users = User.objects.filter(is_superuser=True)
        # remove super user status from the current super users
        for user in super_users:
            user.is_superuser = False
            user.save()

        test_super_user_1 = UserFactory(username='bh_superuser_1', email='bh+1@pulilab.com', password='puli_1234',
                                        is_staff=True, is_superuser=True)
        test_super_user_2 = UserFactory(username='bh_superuser_2', email='bh+2@pulilab.com', password='puli_1234',
                                        is_staff=True, is_superuser=True)
        try:
            software = TechnologyPlatformFactory(name='pending software')

            with self.settings(NOTIFICATION_EMAIL=''):
                notify_superusers_about_new_pending_software.apply((software.id,))

                call_args_list = send_email.call_args_list[0][1]
                self.assertEqual(call_args_list['subject'], 'New software is pending for approval')
                self.assertEqual(call_args_list['email_type'], 'new_pending_software')
                self.assertIn(test_super_user_1.email, call_args_list['to'])
                self.assertIn(test_super_user_2.email, call_args_list['to'])
                self.assertEqual(call_args_list['context']['software_name'], software.name)
        finally:
            test_super_user_1.delete()
            test_super_user_2.delete()

            # give back super user status
            for user in super_users:
                user.is_superuser = True
                user.save()

    @mock.patch('project.tasks.send_mail_wrapper', return_value=None)
    def test_notify_user_about_software_approve(self, send_email):
        software = TechnologyPlatformFactory(name='pending software', added_by_id=self.user_profile_id)
        notify_user_about_software_approval.apply(args=('test', software.id))
        notify_user_about_software_approval.apply(args=('approve', software.id))

        send_email.assert_called_once()
        call_args_list = send_email.call_args_list[0][1]
        self.assertEqual(call_args_list['subject'], 'The software you requested has been approved')
        self.assertEqual(call_args_list['email_type'], 'software_approved')
        self.assertEqual(call_args_list['context']['software_name'], software.name)

    @mock.patch('project.tasks.send_mail_wrapper', return_value=None)
    def test_notify_user_about_software_decline(self, send_email):
        software = TechnologyPlatformFactory(name='pending software', added_by_id=self.user_profile_id)
        notify_user_about_software_approval.apply(args=('decline', software.id))

        call_args_list = send_email.call_args_list[0][1]
        self.assertEqual(call_args_list['subject'], 'The software you requested has been declined')
        self.assertEqual(call_args_list['email_type'], 'software_declined')
        self.assertEqual(call_args_list['context']['software_name'], software.name)

    @mock.patch('project.tasks.send_mail_wrapper', return_value=None)
    def test_notify_user_about_software_approval_fail(self, send_email):
        software = TechnologyPlatformFactory(name='pending software')
        notify_user_about_software_approval.apply(args=('approve', software.id))

        send_email.assert_not_called()

    @mock.patch('project.tasks.notify_user_about_software_approval.apply_async', return_value=None)
    def test_software_decline(self, notify_user_about_software_approval):
        country = Country.objects.last()

        software_1 = TechnologyPlatformFactory(name='approved')
        software_2 = TechnologyPlatformFactory(name='will be declined', state=TechnologyPlatform.PENDING)

        s_parent = DigitalStrategyFactory(name="strategy parent", group=DigitalStrategy.GROUP_CHOICES[0])
        s1 = DigitalStrategyFactory(parent=s_parent, name="strategy1", group=DigitalStrategy.GROUP_CHOICES[0])

        data = {"project": {
            "date": datetime.utcnow(),
            "name": "Test Project 10000",
            "organisation": self.org.id,
            "contact_name": "test_contact",
            "contact_email": "a@a.com",
            "implementation_overview": "overview",
            "health_focus_areas": [1, 2],
            "country": country.id,
            "software": [software_1.id, software_2.id],
            "dhis": [s1.id],
            "his_bucket": [1, 2],
            "donors": [self.d1.id],
            "hsc_challenges": [1, 2],
            "start_date": str(datetime.today().date()),
            "stages": [{
                "id": 1,
                "date": str(datetime.today().date()),
                "note": "stage 1 note"
            }],
        }}

        url = reverse("project-create", kwargs={"country_id": country.id})
        response = self.test_user_client.post(url, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED, response.json())

        project = Project.objects.get(pk=response.json()['id'])
        self.assertEqual(len(project.draft['software']), 2)

        url = reverse("project-publish", kwargs=dict(project_id=project.id, country_id=country.id))
        response = self.test_user_client.put(url, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK, response.json())

        project.refresh_from_db()
        self.assertEqual(len(project.draft['software']), 2)
        self.assertEqual(len(project.data['software']), 2)

        # decline software
        software_2.state = TechnologyPlatform.DECLINED
        software_2.save()

        project.refresh_from_db()
        self.assertEqual(len(project.draft['software']), 1)
        self.assertEqual(project.draft['software'][0], software_1.id)
        self.assertEqual(len(project.data['software']), 1)
        self.assertEqual(project.data['software'][0], software_1.id)

        notify_user_about_software_approval.assert_called_once_with(args=('decline', software_2.pk,))

    @mock.patch('project.tasks.send_mail_wrapper')
    def test_duplicate_software_add(self, send_email):
        send_email.return_value = None

        url = reverse("technologyplatform-list")
        response = self.test_user_client.post(url, {'name': "test software"}, format="json")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED, response.json())

        response = self.test_user_client.post(url, {'name': "test software"}, format="json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST, {'name': ['This field must be unique.']})

        response = self.test_user_client.post(url, {'name': "Test Software"}, format="json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST, {'name': ['This field must be unique.']})

    def test_send_project_updated_digest(self):
        project = Project.objects.last()

        user_2 = UserFactory(username='test_2', email='test2@test.test', password='a', is_staff=True, is_superuser=True)
        user_2_profile = UserProfileFactory(user=user_2, language='en')

        user_3 = UserFactory(username='test_3', email='test3@test.test', password='a', is_staff=True, is_superuser=True)
        user_3_profile = UserProfileFactory(user=user_3, language='en')

        user_4 = UserFactory(username='test_4', email='test4@test.test', password='a', is_staff=True, is_superuser=True)
        user_4_profile = UserProfileFactory(user=user_4, language='en')

        c = project.search.country
        c.admins.add(self.user_profile_id, user_2_profile)
        c.save()

        self.assertEqual(project.data['donors'], [self.d1.id, self.d2.id])
        self.d1.super_admins.add(user_3_profile)
        self.d2.super_admins.add(user_4_profile)
        self.d1.save()
        self.d2.save()

        project.created = project.modified - timezone.timedelta(seconds=20)
        project.save()
        send_project_updated_digest()
        profile = UserProfile.objects.get(id=self.user_profile_id)
        self.assertEqual(mail.outbox[1].subject, f'Digital Health Atlas project(s) in {c.name} have been updated')
        self.assertTrue(profile.user.email in mail.outbox[1].to)
        self.assertTrue(user_2.email in mail.outbox[1].to)
        self.assertEqual(mail.outbox[2].subject,
                         f'Digital Health Atlas project(s) that {self.d1.name} invests in have been updated')
        self.assertEqual(mail.outbox[2].to, [user_3.email])
        self.assertEqual(mail.outbox[3].subject,
                         f'Digital Health Atlas project(s) that {self.d2.name} invests in have been updated')
        self.assertEqual(mail.outbox[3].to, [user_4.email])

    def test_unpublish_project(self):
        data = copy.deepcopy(self.project_data)
        data['project']['name'] = 'test unpublish'

        # create project draft
        url = reverse('project-create', kwargs={'country_id': self.country1.id})
        response = self.test_user_client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED, response.json())
        resp_data = response.json()
        self.assertEqual(resp_data['public_id'], '')

        project = Project.objects.get(id=resp_data['id'])
        self.assertEqual(project.data, {})

        self.check_project_search_init_state(project)

        # publish project
        url = reverse('project-publish', kwargs={'project_id': resp_data['id'], 'country_id': self.country1.id})
        response = self.test_user_client.put(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK, response.json())
        resp_data = response.json()
        self.assertNotEqual(resp_data['public_id'], '')

        project.refresh_from_db()
        self.assertNotEqual(project.data, {})

        # check project search
        self.assertEqual(project.search.project_id, project.id)
        self.assertNotEqual(project.search.country_id, None)
        self.assertNotEqual(project.search.organisation_id, None)
        self.assertNotEqual(project.search.donors, [])
        self.assertNotEqual(project.search.donor_names, [])
        self.assertNotEqual(project.search.software, [])
        self.assertNotEqual(project.search.coverage, [])
        self.assertNotEqual(project.search.hsc, [])
        self.assertNotEqual(project.search.hfa_categories, [])

        # unpublish project
        url = reverse('project-unpublish', kwargs={'project_id': resp_data['id']})
        response = self.test_user_client.put(url, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK, response.json())
        resp_data = response.json()
        self.assertEqual(resp_data['public_id'], '')

        project.refresh_from_db()
        self.assertEqual(project.data, {})

        self.check_project_search_init_state(project)

    @mock.patch('project.tasks.send_mail_wrapper', return_value=None)
    def test_send_project_updated_digest_without_users_to_notify(self, send_email_wrapper):
        project = Project.objects.last()

        user_profile = UserProfile.objects.get(id=self.user_profile_id)
        user_profile.project_updates_notification = False
        user_profile.save()

        user_2 = UserFactory(username='test_2', email='test2@test.test', password='a', is_staff=True, is_superuser=True)
        user_2_profile = UserProfileFactory(user=user_2, language='en', project_updates_notification=False)

        user_3 = UserFactory(username='test_3', email='test3@test.test', password='a', is_staff=True, is_superuser=True)
        user_3_profile = UserProfileFactory(user=user_3, language='en', project_updates_notification=False)

        user_4 = UserFactory(username='test_4', email='test4@test.test', password='a', is_staff=True, is_superuser=True)
        user_4_profile = UserProfileFactory(user=user_4, language='en', project_updates_notification=False)

        c = project.search.country
        c.admins.add(self.user_profile_id, user_2_profile)
        c.save()

        self.assertEqual(project.data['donors'], [self.d1.id, self.d2.id])
        self.d1.super_admins.add(user_3_profile)
        self.d2.super_admins.add(user_4_profile)
        self.d1.save()
        self.d2.save()

        project.created = project.modified - timezone.timedelta(seconds=20)
        project.save()
        send_project_updated_digest()

        send_email_wrapper.assert_not_called()

    @mock.patch('project.tasks.send_mail_wrapper')
    def test_draft_only_reminders(self, send_email):
        project_name = "published in country"
        p = ProjectFactory(name=project_name)
        p.team.add(self.userprofile)

        send_draft_only_reminders.apply()

        call_args_list = send_email.call_args_list[0][1]
        self.assertEqual(call_args_list['subject'], f"Complete your project in the Digital Health Atlas '{p.name}'")
        self.assertEqual(call_args_list['email_type'], 'draft_reminder')
        self.assertIn('test_user@gmail.com', call_args_list['to'])
        self.assertEqual(call_args_list['context']['project_id'], p.id)

    def xtest_research_project(self):  # pragma: no cover
        # TODO: might be re-enabled later
        data = copy.deepcopy(self.project_data)
        data['project']['name'] = 'Test Project 100'
        data['project']['research'] = True

        # create project
        url = reverse("project-create", kwargs={"country_id": self.country1.id})
        response = self.test_user_client.post(url, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED, response.json())

        project_id = response.json()['id']

        self.assertEqual(response.json()['draft']['research'], True)

        # update project, try to change research
        data['project']['research'] = False
        url = reverse("project-draft", kwargs={"project_id": project_id, "country_id": self.country1.id})
        response = self.test_user_client.put(url, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK, response.json())

        # research can't be changed if it is already set
        self.assertEqual(response.json()['draft']['research'], True)

        # publish project and try to change research
        url = reverse("project-publish", kwargs={"project_id": project_id, "country_id": self.country1.id})
        response = self.test_user_client.put(url, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK, response.json())

        # research can't be changed if it is already set
        self.assertEqual(response.json()['draft']['research'], True)
        self.assertEqual(response.json()['published']['research'], True)

    def test_organisation_added_by_string(self):
        url = reverse("project-create", kwargs={"country_id": self.country1.id})
        data = copy.deepcopy(self.project_data)
        new_org = "NEWEST OF ALL"
        new_data = {
            "name": "Test Project991",
            "organisation": new_org
        }
        data['project'].update(new_data)

        self.assertFalse(Organisation.objects.filter(name__iexact=new_org).exists())
        response = self.test_user_client.post(url, data, format="json")
        self.assertEqual(response.status_code, 201)
        self.assertTrue(Organisation.objects.filter(name__iexact=new_org).exists())
        self.assertEqual(int(response.json()['draft']["organisation"]),
                         Organisation.objects.get(name=new_org).id)

    def test_hsc_challenge_other_field(self):
        url = reverse("project-create", kwargs={"country_id": self.country1.id})
        data = copy.deepcopy(self.project_data)
        data['project']['name'] = 'Uniqu3 proj3ct nam3'
        del data['project']['hsc_challenges']

        response = self.test_user_client.post(url, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED, response.json())

        project_id = response.json()['id']

        url = reverse("project-publish", kwargs={"project_id": project_id, "country_id": self.country1.id})
        response = self.test_user_client.put(url, data, format="json")

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST, response.json())
        self.assertEqual(response.json(), {'project': {'hsc_challenges': ['No challenges selected']}})

        data['project']['hsc_challenges_other'] = ['hsc_other1', 'hsc_other2']

        response = self.test_user_client.put(url, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK, response.json())
        self.assertEqual(response.json()['published']['hsc_challenges_other'], data['project']['hsc_challenges_other'])

    def test_archived_projects(self):
        project_data = self.generate_project_data(project_name="Test Project Archived")
        archived_project = self.create_draft_project(project_data)
        self.publish_project(archived_project.id, project_data)

        count_before_archiving = Project.objects.all().count()

        # archive it through API
        url = reverse("project-archive", kwargs={"project_id": archived_project.id})
        response = self.test_user_client.put(url, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        count_after_archiving = Project.objects.all().count()
        self.assertEqual(count_before_archiving, count_after_archiving + 1)

        # try to archive it again, should fail
        url = reverse("project-archive", kwargs={"project_id": archived_project.id})
        response = self.test_user_client.put(url, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.json(), {'detail': 'No such project'})

        url = reverse("userprofile-me")
        response = self.test_user_client.get(url, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK, response.json())
        archive = response.json()['archive']
        self.assertEqual(len(archive), 2)
        self.assertTrue(archive[1]['archived'])
        self.assertIsNone(archive[1]['published'])
        self.assertEqual(archive[1]['public_id'], '')
        self.assertEqual(archive[1]['draft']['name'], archived_project.name)

    def test_country_admins_can_list_all_projects_in_country(self):
        self._create_new_project()
        p_not_in_country = Project.objects.get(name="Test Project2")
        p_in_my_country = Project.objects.get(name="Test Project1")

        url = reverse("project-admin-list")
        response = self.test_user_client.get(url, format="json")
        self.assertEqual(response.status_code, 403)

        # add me as admin
        self.userprofile.account_type = UserProfile.COUNTRY_ADMIN
        self.userprofile.save()
        self.userprofile.country.admins.add(self.userprofile)

        response = self.test_user_client.get(url, format="json")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()['count'], 1)
        self.assertEqual(response.json()['results'][0]['id'], p_in_my_country.id)

        p_not_in_country.data['country'] = self.userprofile.country.id
        p_not_in_country.save()

        response = self.test_user_client.get(url, format="json")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()['count'], 2)

        response = self.test_user_client.get(url + '?search=Project2', format="json")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()['count'], 1)
        self.assertEqual(response.json()['results'][0]['id'], p_not_in_country.id)

        response = self.test_user_client.get(url + f'?search={p_in_my_country.team.first().name}', format="json")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()['count'], 2)

        response = self.test_user_client.get(url + f'?search={p_in_my_country.team.first().user.email}', format="json")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()['count'], 2)