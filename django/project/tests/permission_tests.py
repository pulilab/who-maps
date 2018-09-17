from django.urls import reverse

from country.models import CountryField
from django.core import mail
from django.contrib.auth.models import User
from rest_framework.test import APIClient

from user.models import Organisation, UserProfile
from project.models import Project

from project.tests.setup import SetupTests


class PermissionTests(SetupTests):
    def test_team_member_can_update_project_groups(self):
        user_2 = User.objects.create_superuser(username='test_2', email='test2@test.test', password='a')
        user_2_profile = UserProfile.objects.create(user=user_2, language='fr')

        url = reverse("project-groups", kwargs={"pk": self.project_id})

        user_profile_id = UserProfile.objects.first().id
        groups = {
            "team": [user_profile_id, user_2_profile.id],
            "viewers": [user_profile_id]
        }
        response = self.test_user_client.put(url, groups, format="json")

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()['team'], [user_profile_id, user_2_profile.id])
        self.assertEqual(response.json()['viewers'], [user_profile_id])

        self.assertEqual(len(mail.outbox), 3)

        first_en = '<meta http-equiv="content-language" content="en">' in mail.outbox[-2].message().as_string()
        en_index = -2 if first_en else -1
        fr_index = -1 if first_en else -2

        outgoing_en_email = mail.outbox[en_index].message()
        outgoing_en_email_text = outgoing_en_email.as_string()
        self.assertEqual(mail.outbox[en_index].subject, "You were added to a project!")
        self.assertIn('<meta http-equiv="content-language" content="en">', outgoing_en_email_text)
        self.assertNotIn('{{', outgoing_en_email_text)

        outgoing_fr_email_text = mail.outbox[fr_index].message().as_string()
        self.assertIn('<meta http-equiv="content-language" content="fr">', outgoing_fr_email_text)
        self.assertNotIn('{{', outgoing_fr_email_text)

    def test_team_viewer_cannot_update_project_groups(self):
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
            "password1": "123456hetNYOLC",
            "password2": "123456hetNYOLC"}
        response = self.client.post(url, data, format="json")

        # Log in the user.
        url = reverse("api_token_auth")
        data = {
            "username": "test_user2@gmail.com",
            "password": "123456hetNYOLC"}
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
            "country": self.country_id}
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
        url = reverse("project-retrieve", kwargs={"pk": self.project_id})
        anon_client = APIClient(format="json")
        response = anon_client.get(url)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()['published'].get("name"), "Test Project1")
        self.assertEqual(response.json()['published'].get("platforms")[0].get('id'),
                         self.project_data['platforms'][0]['id'])

        # filtering checks
        for key in Project.FIELDS_FOR_MEMBERS_ONLY + Project.FIELDS_FOR_LOGGED_IN:
            self.assertNotIn(key, response.json())

    def test_retrieve_project_non_member_user(self):
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

        url = reverse("project-retrieve", kwargs={"pk": self.project_id})
        response = test_user_client.get(url)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()['published'].get("name"), "Test Project1")
        self.assertEqual(response.json()['published'].get("platforms")[0].get('id'),
                         self.project_data['platforms'][0]['id'])

        # filtering checks
        for key in Project.FIELDS_FOR_MEMBERS_ONLY:
            self.assertNotIn(key, response.json())

    def test_members_receive_last_version_info(self):
        url = reverse("project-retrieve", kwargs={"pk": self.project_id})
        response = self.test_user_client.get(url)
        self.assertEqual(response.status_code, 200)
        self.assertNotIn("last_version", response.json())

        url = reverse("make-version", kwargs={"project_id": self.project_id})
        self.test_user_client.post(url, format="json")
        url = reverse("get-coverage-versions", kwargs={"project_id": self.project_id})
        response = self.test_user_client.get(url)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.json()), 1)

        url = reverse("project-retrieve", kwargs={"pk": self.project_id})
        response = self.test_user_client.get(url)
        self.assertEqual(response.status_code, 200)
        self.assertIn("last_version", response.json()['published'])

    def test_csv_export_failed(self):
        url = reverse("csv-export")
        response = self.test_user_client.post(url, {"data": [1, 2]}, format="json")
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
        self.assertContains(response, "National Level Deployment: [Clients: 20000, Health Workers: 0, Facilities: 0]")
        self.assertContains(response, "District: dist1 [Clients: 20, Health Workers: 5, Facilities: 4], "
                                      "District: dist2 [Clients: 10, Health Workers: 2, Facilities: 8]")
        self.assertContains(response, "District: ward1 [Clients: 209, Health Workers: 59, Facilities: 49], "
                                      "District: ward2 [Clients: 109, Health Workers: 29, Facilities: 89]")
        self.assertContains(response, "Donor1, Donor2")

    def test_csv_export_success_without_coverage(self):
        url = reverse("csv-export")
        p = Project.objects.get()
        p.data.pop('coverage')
        p.data.pop('coverage_second_level')
        p.data.pop('national_level_deployment')
        p.save()
        response = self.test_user_client.post(url, [1, 2, Project.objects.get().id], format="json")
        self.assertEqual(response.status_code, 200)
        headers = dict(response.items())
        self.assertEqual(headers['Content-Type'], 'text/csv')
        self.assertEqual(headers['Content-Disposition'], 'attachment; filename="csv.csv"')
        self.assertContains(response, "Test Project1")
        self.assertContains(response, "a@a.com")
        self.assertNotContains(response, "National Level Deployment: [Clients: 20000, Health Workers: 0, "
                                         "Facilities: 0]")
        self.assertNotContains(response, "District: dist1 [Clients: 20, Health Workers: 5, Facilities: 4], "
                                         "District: dist2 [Clients: 10, Health Workers: 2, Facilities: 8]")
        self.assertNotContains(response, "District: ward1 [Clients: 209, Health Workers: 59, Facilities: 49], "
                                         "District: ward2 [Clients: 109, Health Workers: 29, Facilities: 89]")

    def test_retrieve_project_with_country_fields(self):
        schema_1 = CountryField.objects.create(country=self.country, type=1, question="q1?", schema=True)
        cf1 = CountryField.objects.create(project_id=self.project_id, country=self.country, type=1, question="q1?",
                                          answer="a1", schema=False, schema_instance=schema_1)
        url = reverse("project-retrieve", kwargs={"pk": self.project_id})
        response = self.test_user_client.get(url)

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()['published'].get("name"), "Test Project1")
        self.assertEqual(response.json()['published'].get("national_level_deployment")["clients"], 20000)
        self.assertEqual(response.json()['published'].get("platforms")[0]["id"],
                         self.project_data['platforms'][0]['id'])
        self.assertEqual(response.json()['published'].get("country"), self.country_id)

        self.assertEqual(response.json()['published']['fields'][0]['schema_id'], schema_1.id)
        self.assertEqual(response.json()['published']['fields'][0]['country'], cf1.country.id)
        self.assertEqual(response.json()['published']['fields'][0]['project'], cf1.project.id)
        self.assertEqual(response.json()['published']['fields'][0]['type'], cf1.type)
        self.assertEqual(response.json()['published']['fields'][0]['question'], cf1.question)
        self.assertEqual(response.json()['published']['fields'][0]['answer'], cf1.answer)

    def test_retrieve_project_with_country_fields_without_schema(self):
        CountryField.objects.create(project_id=self.project_id, country=self.country, type=1, question="q1?",
                                    answer="a1", schema=False)
        url = reverse("project-retrieve", kwargs={"pk": self.project_id})
        response = self.test_user_client.get(url)

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()['published'].get("name"), "Test Project1")
        self.assertEqual(response.json()['published'].get("national_level_deployment")["clients"], 20000)
        self.assertEqual(response.json()['published'].get("platforms")[0]["id"],
                         self.project_data['platforms'][0]['id'])
        self.assertEqual(response.json()['published'].get("country"), self.country_id)
        self.assertEqual(len(response.json()['published']['fields']), 0)

    def test_retrieve_project_and_draft_with_country_fields(self):
        schema_1 = CountryField.objects.create(country=self.country, type=1, question="q1?", schema=True)
        schema_2 = CountryField.objects.create(country=self.country, type=1, question="q2?", schema=True)
        cf1 = CountryField.objects.create(project_id=self.project_id, country=self.country, type=1, question="q1?",
                                          answer="published1", draft="draft1", schema=False, schema_instance=schema_1)
        cf2 = CountryField.objects.create(project_id=self.project_id, country=self.country, type=1, question="q2?",
                                          draft="draft2", answer="", schema=False, schema_instance=schema_2)
        url = reverse("project-retrieve", kwargs={"pk": self.project_id})
        response = self.test_user_client.get(url)

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()['published'].get("name"), "Test Project1")
        self.assertEqual(response.json()['published'].get("national_level_deployment")["clients"], 20000)
        self.assertEqual(response.json()['published'].get("platforms")[0]["id"],
                         self.project_data['platforms'][0]['id'])
        self.assertEqual(response.json()['published'].get("country"), self.country_id)

        # published
        self.assertEqual(response.json()['published']['fields'][0]['schema_id'], schema_1.id)
        self.assertEqual(response.json()['published']['fields'][0]['country'], cf1.country.id)
        self.assertEqual(response.json()['published']['fields'][0]['project'], cf1.project.id)
        self.assertEqual(response.json()['published']['fields'][0]['type'], cf1.type)
        self.assertEqual(response.json()['published']['fields'][0]['question'], cf1.question)
        self.assertEqual(response.json()['published']['fields'][0]['answer'], cf1.answer)
        self.assertEqual(response.json()['published']['fields'][1]['schema_id'], schema_2.id)
        self.assertEqual(response.json()['published']['fields'][1]['type'], cf2.type)
        self.assertEqual(response.json()['published']['fields'][1]['question'], cf2.question)
        self.assertEqual(response.json()['published']['fields'][1]['answer'], cf2.answer)

        # draft
        self.assertEqual(response.json()['draft']['fields'][0]['schema_id'], schema_1.id)
        self.assertEqual(response.json()['draft']['fields'][0]['country'], cf1.country.id)
        self.assertEqual(response.json()['draft']['fields'][0]['project'], cf1.project.id)
        self.assertEqual(response.json()['draft']['fields'][0]['type'], cf1.type)
        self.assertEqual(response.json()['draft']['fields'][0]['question'], cf1.question)
        self.assertEqual(response.json()['draft']['fields'][0]['answer'], cf1.draft)
        self.assertEqual(response.json()['draft']['fields'][1]['type'], cf2.type)
        self.assertEqual(response.json()['draft']['fields'][1]['question'], cf2.question)
        self.assertEqual(response.json()['draft']['fields'][1]['answer'], cf2.draft)

    def test_project_structure_export(self):
        url = reverse("get-project-structure-export")
        response = self.test_user_client.get(url)

        self.assertEqual(len(response.data['interoperability_links']), 8)
        self.assertEqual(len(response.data['technology_platforms']), 48)
        self.assertEqual(len(response.data['digital_strategies']), 117)
