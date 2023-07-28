import copy
from datetime import datetime
from unittest import mock
from django.test import override_settings
from django.core.cache import cache

from allauth.account.models import EmailConfirmation
from django.core import mail
from rest_framework.reverse import reverse
from rest_framework.test import APITestCase, APIClient
from who_maps.throttle import ExternalAPIUserRateThrottle

from core.factories import CountryFactory, OrganisationFactory
from country.models import Country, Donor
from project.models import Project, ProjectVersion
from user.models import UserProfile, Organisation


class ExternalAPITests(APITestCase):
    def setUp(self):
        # Create a test user with profile.
        url = reverse("rest_register")
        data = {
            "email": "digitalclearinghouse@who.int",
            "password1": "123456hetNYOLC",
            "password2": "123456hetNYOLC"}
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, 201, response.json())
        self.user_profile_id = response.json().get('user_profile_id')

        # Validate the account.
        key = EmailConfirmation.objects.get(email_address__email="digitalclearinghouse@who.int").key
        url = reverse("rest_verify_email")
        data = {
            "key": key,
        }
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, 200, response.json())

        # Log in the user.
        url = reverse("token_obtain_pair")
        data = {
            "username": "digitalclearinghouse@who.int",
            "password": "123456hetNYOLC"}
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, 200, response.json())
        self.test_user_key = response.json().get("access")
        self.test_user_client = APIClient(HTTP_AUTHORIZATION="Token {}".format(self.test_user_key), format="json")

        # Update profile.
        self.org = OrganisationFactory(name="org1")
        self.country = CountryFactory(name="country1", code='CTR1', project_approval=True,
                                      region=Country.REGIONS[0][0], name_en='Hungary', name_fr='Hongrie')
        self.country_id = self.country.id
        self.donor, _ = Donor.objects.get_or_create(name="Other", defaults={'code': "other"})

        url = reverse("userprofile-detail", kwargs={"pk": self.user_profile_id})
        data = {
            "name": "Digital Clearing House",
            "organisation": self.org.id,
            "country": self.country_id}
        response = self.test_user_client.put(url, data, format='json')
        self.assertEqual(response.status_code, 200, response.json())
        self.user_profile_id = response.json().get('id')

        self.userprofile = UserProfile.objects.get(id=self.user_profile_id)
        self.country.users.add(self.userprofile)
        self.client_code = "xNhlb4"

        self.project_data = {
            "project": dict(
                name="Test Project1", organisation="test organisation", contact_name="name1",
                contact_email="team_member@added.com", implementation_overview="overview", health_focus_areas=[1, 2],
                services_and_application_types=[1, 2],
                country=self.country_id,
                donors=[self.donor.id],
                software=[1],
                dhis=[1, 2],
                hsc_challenges=[1, 2], start_date=str(datetime.today().date()))}

    def test_post_to_publish_from_external_source(self):
        url = reverse("project-external-publish", kwargs={'client_code': self.client_code})
        response = self.test_user_client.post(url, self.project_data, format="json")
        self.assertEqual(response.status_code, 201, response.json())

        self.assertTrue(response.json().get("id"))
        project_id = response.json().get("id")
        project = Project.objects.get(id=project_id)

        self.assertTrue(project.from_external)
        self.assertTrue(project.public_id)
        self.assertEqual(self.project_data['project']['name'], project.name)

        org = Organisation.objects.get(name=self.project_data['project']['organisation'])
        self.assertEqual(self.project_data['project']['organisation'], org.name)

        self.assertEqual(project.data['donors'], [self.donor.id])

        self.assertEqual(project.data['national_level_deployment'],
                         {"clients": 0, "health_workers": 0, "facilities": 0})

        welcome_emails_count = 0
        for m in mail.outbox:
            if m.subject == 'Welcome to the Digital Health Atlas':
                welcome_emails_count += 1
        self.assertEqual(welcome_emails_count, 2)

        notified_on_member_add_count = 0
        for m in mail.outbox:
            if m.subject == 'You have been added to a project in the Digital Health Atlas':
                notified_on_member_add_count += 1

                self.assertTrue("team_member@added.com" in m.to)
        self.assertEqual(notified_on_member_add_count, 1)

        set_password_sent = 0
        for m in mail.outbox:
            if m.subject == "Set Your Password on Digital Health Atlas":
                set_password_sent += 1
                self.assertTrue("team_member@added.com" in m.to)
        self.assertEqual(set_password_sent, 1)

    def test_post_to_draft_from_external_source(self):
        url = reverse("project-external-draft", kwargs={'client_code': self.client_code})
        response = self.test_user_client.post(url, self.project_data, format="json")
        self.assertEqual(response.status_code, 201, response.json())

        self.assertTrue(response.json().get("id"))
        project_id = response.json().get("id")
        project = Project.objects.get(id=project_id)

        self.assertTrue(project.from_external)
        self.assertFalse(project.public_id)
        self.assertEqual(self.project_data['project']['name'], project.name)

        self.assertEqual(project.draft['donors'], [self.donor.id])

        welcome_emails_count = 0
        for m in mail.outbox:
            if m.subject == 'Welcome to the Digital Health Atlas':
                welcome_emails_count += 1
        self.assertEqual(welcome_emails_count, 1)

    def test_invalid_source_draft(self):
        url = reverse("project-external-draft", kwargs={'client_code': 'TRUST-ME-NOT-A-HACKER'})
        response = self.test_user_client.post(url, self.project_data, format="json")

        self.assertEqual(response.status_code, 400, response.json())
        self.assertEqual(response.json(), {'client_code': "Client code is invalid"})

    def test_invalid_source_publish(self):
        url = reverse("project-external-publish", kwargs={'client_code': 'TRUST-ME-NOT-A-HACKER'})
        response = self.test_user_client.post(url, self.project_data, format="json")

        self.assertEqual(response.status_code, 400, response.json())
        self.assertEqual(response.json(), {'client_code': "Client code is invalid"})

    def test_no_project_draft(self):
        url = reverse("project-external-draft", kwargs={'client_code': self.client_code})
        response = self.test_user_client.post(url, {}, format="json")

        self.assertEqual(response.status_code, 400, response.json())
        self.assertEqual(response.json(), {'project': 'Project data is missing'})

    def test_invalid_email_draft(self):
        project_data = copy.deepcopy(self.project_data)
        project_data['project']['contact_email'] = "invalid_email"
        url = reverse("project-external-draft", kwargs={'client_code': self.client_code})
        response = self.test_user_client.post(url, project_data, format="json")

        self.assertEqual(response.status_code, 400, response.json())
        self.assertEqual(response.json(), {'project': {'contact_email': ['Enter a valid email address.']}})

    def test_invalid_email_published(self):
        project_data = copy.deepcopy(self.project_data)
        project_data['project']['contact_email'] = "invalid_email"
        url = reverse("project-external-publish", kwargs={'client_code': self.client_code})
        response = self.test_user_client.post(url, project_data, format="json")

        self.assertEqual(response.status_code, 400, response.json())
        self.assertEqual(response.json(), {'project': {'contact_email': ['Enter a valid email address.']}})

    @mock.patch('who_maps.throttle.ExternalAPIUserRateThrottle.get_rate', return_value='2/minute')
    @override_settings(CACHES={
        'default': {
            'BACKEND': 'django.core.cache.backends.filebased.FileBasedCache',
            'LOCATION': '/var/tmp/django_cache',
        }
    })
    def test_external_api_throttle_success(self, throttle_mock):
        project_data = copy.deepcopy(self.project_data)

        rate = ExternalAPIUserRateThrottle().get_rate()
        split = rate.split('/')

        url = reverse("project-external-publish", kwargs={'client_code': self.client_code})
        for i in range(0, int(split[0])):
            project_data['project']['name'] = f'test throttle {i}'
            response = self.test_user_client.post(url, project_data, format="json")
            self.assertEqual(response.status_code, 201, response.json())
            self.assertTrue(response.json().get("id"))

        # next request should be throttled
        project_data['project']['name'] = 'test throttle no-go'
        response = self.test_user_client.post(url, project_data, format="json")
        self.assertEqual(response.status_code, 429, response.json())
        self.assertIn('Request was throttled. Expected available in', response.json()['detail'])
        cache.clear()

    def test_transaction_rollbacks_on_external_draft_publish(self):
        project_data = copy.deepcopy(self.project_data)
        project_data['project']['contact_email'] = 'roll@this.back'
        # only required for publish
        del project_data['project']['implementation_overview']

        url = reverse("project-external-publish", kwargs={'client_code': self.client_code})
        response = self.test_user_client.post(url, project_data, format="json")
        self.assertEqual(response.status_code, 400)
        self.assertEqual(Project.objects.filter(
            draft__contact_email=project_data['project']['contact_email']).count(), 0)
        self.assertEqual(Project.objects.filter(
            data__contact_email=project_data['project']['contact_email']).count(), 0)

    def test_external_publish_makes_draft_first(self):
        project_data = copy.deepcopy(self.project_data)
        project_data['project']['contact_email'] = 'do.not.roll@this.back'

        url = reverse("project-external-publish", kwargs={'client_code': self.client_code})
        response = self.test_user_client.post(url, project_data, format="json")
        self.assertEqual(response.status_code, 201)
        data = response.json()
        self.assertTrue(data['public_id'] != '')
        self.assertEqual(data['draft'], data['published'])
        self.assertEqual(data['published']['contact_email'], project_data['project']['contact_email'])

        draft = Project.objects.get(draft__contact_email=project_data['project']['contact_email'])
        published = Project.objects.get(data__contact_email=project_data['project']['contact_email'])

        self.assertEqual(draft.id, published.id)
        self.assertEqual(ProjectVersion.objects.filter(project=draft.id).count(), 2)
