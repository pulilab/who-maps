import copy

from django.urls import reverse
from project.models import Project, HealthFocusArea, HealthCategory

from project.tests.setup import SetupTests


class ProjectDraftTests(SetupTests):
    def setUp(self):
        # Published without draft in SetupsTests
        super(ProjectDraftTests, self).setUp()

        # Draft
        self.project_draft_data = {'project': {
            'name': 'Draft Proj 1',
            'country': self.country_id,
            'health_focus_areas': []
        }}

        url = reverse("project-create", kwargs={"country_id": self.country_id})
        response = self.test_user_client.post(url, self.project_draft_data, format="json")
        self.project_draft_id = response.json().get("id")

        # Published
        url = reverse("project-publish", kwargs={"project_id": self.project_draft_id, "country_id": self.country_id})
        data = copy.deepcopy(self.project_data)
        data.update(name='Proj 1')
        response = self.test_user_client.put(url, data, format="json")
        self.project_pub_id = response.json().get("id")

        # Draft without published
        self.project_draft_data = {'project': {
            'name': 'Draft Proj 2',
            'country': self.country_id,
            'organisation': self.org.id,
            'health_focus_areas': []
        }}

        url = reverse("project-create", kwargs={"country_id": self.country_id})
        response = self.test_user_client.post(url, self.project_draft_data, format="json")
        self.project_draft_id = response.json().get("id")

    def test_create_new_draft_project_basic_data(self):
        url = reverse("project-create", kwargs={"country_id": self.country_id})
        data = copy.deepcopy(self.project_draft_data)
        data['project'].update(name='Draft Proj 3', implementation_overview="Test overview")
        response = self.test_user_client.post(url, data, format="json")

        self.assertEqual(response.status_code, 201)
        self.assertEqual(response.json()['draft']['name'], 'Draft Proj 3')
        self.assertEqual(response.json()['draft']['implementation_overview'], 'Test overview')
        self.assertEqual(int(response.json()['draft']['organisation']), self.org.id)
        self.assertEqual(int(response.json()['draft']['country']), self.country_id)
        self.assertEqual(response.json()['published'], {})
        self.assertFalse(response.json()['public_id'])

    def test_create_new_draft_name_is_not_unique(self):
        url = reverse("project-create", kwargs={"country_id": self.country_id})
        response = self.test_user_client.post(url, self.project_draft_data, format="json")
        self.assertEqual(response.status_code, 201)
        self.assertNotEqual(self.project_draft_id, response.json().get("id"))
        self.assertEqual(Project.objects.filter(name='Draft Proj 2').count(), 2)

    def test_create_new_project_bad_data(self):
        url = reverse("project-publish", kwargs={"project_id": self.project_draft_id, "country_id": self.country_id})
        data = copy.deepcopy(self.project_data)
        data.update(name="")
        data.update(organisation="")
        response = self.test_user_client.put(url, data, format="json")
        self.assertEqual(response.status_code, 400)

    def test_retrieve_published_project_with_draft(self):
        url = reverse("project-retrieve", kwargs={"pk": self.project_pub_id})
        response = self.test_user_client.get(url, format="json")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()['draft']['name'], 'Proj 1')
        self.assertEqual(response.json()['published']['name'], 'Proj 1')
        self.assertTrue(response.json()['public_id'])

    def test_retrieve_draft_only(self):
        url = reverse("project-retrieve", kwargs={"pk": self.project_draft_id})
        response = self.test_user_client.get(url, format="json")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()['draft']['name'], 'Draft Proj 2')
        self.assertEqual(response.json()['published'], {})
        self.assertFalse(response.json()['public_id'])

    def test_update_draft_project(self):
        url = reverse("project-draft", kwargs={"pk": self.project_draft_id})
        data = copy.deepcopy(self.project_draft_data)
        data.update(name="TestProject98",
                    platforms=[{"id": 999, "strategies": [999]}])
        response = self.test_user_client.put(url, data, format="json")
        self.assertEqual(response.status_code, 200)
        self.assertNotEqual(response.json()['draft']["platforms"][0]["id"], self.project_data['platforms'][0]['id'])
        self.assertNotEqual(response.json()['draft']["platforms"][0]["strategies"][0],
                            self.project_data['platforms'][0]['strategies'][0])

    def test_project_draft_merged_list(self):
        url = reverse("project-list")
        response = self.test_user_client.get(url)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.json()), 3)
        self.assertTrue("id" in response.json()[0])
        self.assertTrue(response.json()[0]["draft"])
        self.assertTrue(response.json()[0]["published"])
        self.assertTrue(response.json()[0]['public_id'])
        self.assertTrue("id" in response.json()[1])
        self.assertTrue(response.json()[1]["draft"])
        self.assertTrue(response.json()[1]["published"])
        self.assertTrue(response.json()[1]['public_id'])
        self.assertTrue("id" in response.json()[2])
        self.assertTrue(response.json()[2]["draft"])
        self.assertFalse(response.json()[2]["published"])
        self.assertFalse(response.json()[2]['public_id'])

    def test_draft_equal_to_publish_after_publish(self):
        url = reverse("project-retrieve", kwargs={"pk": self.project_draft_id})
        response = self.test_user_client.get(url, format="json")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()['draft']['name'], 'Draft Proj 2')
        self.assertNotEqual(response.json()['draft'], response.json()['published'])

        url = reverse("project-publish", kwargs={"pk": self.project_draft_id})
        data = copy.deepcopy(self.project_data)
        data.update(name='Proj 2')
        response = self.test_user_client.put(url, data, format="json")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()['draft']['name'], 'Proj 2')
        self.assertEqual(response.json()['draft'], response.json()['published'])

    def test_healthcategory_str(self):
        hc = HealthCategory.objects.all().first()
        self.assertEqual(str(hc), 'Adolescent and Youth Health')

    def test_healthfocusarea_str(self):
        hfa = HealthFocusArea.objects.all().first()
        self.assertEqual(str(hfa), '[Adolescent and Youth Health] Adolescents and communicable diseases')

    def test_make_version_for_draft(self):
        url = reverse("make-version", kwargs={"project_id": self.project_draft_id})
        response = self.test_user_client.post(url, format="json")
        self.assertEqual(response.status_code, 406)

    def test_project_create_can_send_blank_fields_in(self):
        # add one new project where health_focus_areas is empty
        project_data = copy.copy(self.project_data)
        project_data['name'] = "Test Project8"
        project_data['health_focus_areas'] = []
        url = reverse("project-create")
        response = self.test_user_client.post(url, project_data, format="json")
        self.assertEqual(response.status_code, 201)
        self.assertIn("implementing_partners", response.json()['draft'])

    def test_create_project_empty_partial_nld(self):
        url = reverse("project-create", kwargs={"country_id": self.country_id})
        data = copy.deepcopy(self.project_draft_data)
        data['project'].update(name='Draft Proj 3', national_level_deployment=None)
        response = self.test_user_client.post(url, data, format="json")
        project_id = response.json()['id']
        self.assertEqual(response.status_code, 201)
        self.assertIsNone(response.json()['draft']['national_level_deployment'])
        self.assertIsNone(Project.objects.get(id=project_id).draft['national_level_deployment'])

        data['project'].update(name='Draft Proj 4', national_level_deployment={'clients': 0, 'facilities': 10})
        response = self.test_user_client.post(url, data, format="json")
        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.json(), {'project':
                         {'national_level_deployment': {'health_workers': ['This field is required.']}}})

        data['project'].update(name='Draft Proj 5', national_level_deployment={'clients': None, 'facilities': 10})
        response = self.test_user_client.post(url, data, format="json")
        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.json(), {'project': {'national_level_deployment': {
            'clients': ['This field may not be null.'],
            'health_workers': ['This field is required.']}}})

        data['project'].update(name='Draft Proj 6',
                    national_level_deployment={'clients': 80, 'facilities': 10, 'health_workers': 3})
        response = self.test_user_client.post(url, data, format="json")
        project_id = response.json()['id']
        self.assertEqual(response.status_code, 201)
        self.assertEqual(response.json()['draft']['national_level_deployment'],
                         {'clients': 80, 'health_workers': 3, 'facilities': 10})

        url = reverse("project-publish", kwargs={"pk": project_id})
        data = copy.deepcopy(self.project_data)
        data.update(name='Proj 6', national_level_deployment=None)
        response = self.test_user_client.put(url, data, format="json")
        self.assertEqual(response.status_code, 200)
        self.assertIsNone(response.json()['draft']['national_level_deployment'])
        self.assertIsNone(Project.objects.get(id=project_id).draft['national_level_deployment'])

    def test_published_country_cannot_change(self):
        url = reverse("project-publish", kwargs={"pk": self.project_pub_id})
        data = copy.deepcopy(self.project_data)
        data.update(name='unique', country=999)
        response = self.test_user_client.put(url, data, format="json")
        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.json(), {'country': ['Country cannot be altered on published projects.']})

    def test_draft_country_can_change(self):
        url = reverse("project-draft", kwargs={"pk": self.project_draft_id})
        data = copy.deepcopy(self.project_draft_data)
        data.update(country=20)
        response = self.test_user_client.put(url, data, format="json")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()['draft']["country"], 20)

    def test_published_country_cannot_change_even_in_draft(self):
        url = reverse("project-draft", kwargs={"pk": self.project_pub_id})
        data = copy.deepcopy(self.project_data)
        data.update(country=20)
        response = self.test_user_client.put(url, data, format="json")
        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.json(), {'country': ['Country cannot be altered on published projects.']})

    def test_retrieve_project_with_second_sublevel(self):
        url = reverse("project-retrieve", kwargs={"pk": self.project_pub_id})
        response = self.test_user_client.get(url)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()['draft']['coverage_second_level'],
                         response.json()['published']['coverage_second_level'])
        self.assertNotEqual(response.json()['published']['coverage_second_level'],
                            response.json()['published']['coverage'])
