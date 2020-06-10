import copy
from datetime import datetime

from allauth.account.models import EmailConfirmation
from django.core import mail
from rest_framework.reverse import reverse
from rest_framework.test import APITestCase, APIClient

from core.factories import CountryFactory, OrganisationFactory
from country.models import Country, Donor
from project.models import Project
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

        # Validate the account.
        key = EmailConfirmation.objects.get(email_address__email="digitalclearinghouse@who.int").key
        url = reverse("rest_verify_email")
        data = {
            "key": key,
        }
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, 200, response.json())

        # Log in the user.
        url = reverse("api_token_auth")
        data = {
            "username": "digitalclearinghouse@who.int",
            "password": "123456hetNYOLC"}
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, 200, response.json())
        self.test_user_key = response.json().get("token")
        self.test_user_client = APIClient(HTTP_AUTHORIZATION="Token {}".format(self.test_user_key), format="json")
        self.user_profile_id = response.json().get('user_profile_id')

        # Update profile.
        self.org = OrganisationFactory(name="org1")
        self.country = CountryFactory(name="country1", code='CTR1', project_approval=True,
                                      region=Country.REGIONS[0][0], name_en='Hungary', name_fr='Hongrie')
        self.country_id = self.country.id

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

        self.project_data = {"project": {
            "name": "Test Project1",
            "organisation": "test organisation",
            "contact_name": "name1",
            "contact_email": "team_member@added.com",
            "implementation_overview": "overview",
            "health_focus_areas": [1, 2],
            "country": self.country_id,
            "platforms": [{
                "id": 1,
                "strategies": [1, 2]
            }],
            "hsc_challenges": [1, 2],
            "start_date": str(datetime.today().date())
        }}

    def test_post_to_publish_from_external_source(self):
        url = reverse("project-external-publish")
        response = self.test_user_client.post(url, self.project_data, format="json")
        self.assertEqual(response.status_code, 201, response.json())

        self.assertTrue(response.json().get("id"))
        project_id = response.json().get("id")
        project = Project.objects.get(id=project_id)

        self.assertTrue(project.from_dch)
        self.assertTrue(project.public_id)
        self.assertEqual(self.project_data['project']['name'], project.name)

        org = Organisation.objects.get(name=self.project_data['project']['organisation'])
        self.assertEqual(self.project_data['project']['organisation'], org.name)

        donor = Donor.objects.get(name="Other")
        self.assertEqual(project.data['donors'], [donor.id])

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

    def test_name_clash_resolved_automatically(self):
        url = reverse("project-external-publish")
        response = self.test_user_client.post(url, self.project_data, format="json")
        self.assertEqual(response.status_code, 201, response.json())
        self.assertTrue(response.json().get("id"))
        project_1_id = response.json().get("id")

        url = reverse("project-external-publish")
        response = self.test_user_client.post(url, self.project_data, format="json")
        self.assertEqual(response.status_code, 201, response.json())
        self.assertTrue(response.json().get("id"))
        project_2_id = response.json().get("id")

        self.assertNotEqual(project_1_id, project_2_id)

        project_1 = Project.objects.get(id=project_1_id)
        project_2 = Project.objects.get(id=project_2_id)
        self.assertNotEqual(project_1.name, project_2.name)
        self.assertEqual(self.project_data['project']['name'], project_1.name)

    def test_invalid_email_published(self):
        project_data = copy.deepcopy(self.project_data)
        project_data['project']['contact_email'] = "invalid_email"
        url = reverse("project-external-publish")
        response = self.test_user_client.post(url, project_data, format="json")

        self.assertEqual(response.status_code, 400, response.json())
        self.assertEqual(response.json(), {'project': {'contact_email': ['Enter a valid email address.']}})