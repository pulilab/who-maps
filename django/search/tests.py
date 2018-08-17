import copy

from django.urls import reverse

from project.models import Project, TechnologyPlatform, DigitalStrategy, HealthFocusArea, HSCChallenge
from project.tests import SetupTests


class SearchTests(SetupTests):
    def setUp(self):
        super(SearchTests, self).setUp()
        # create draft
        url = reverse("project-create")
        project_data2 = copy.deepcopy(self.project_data)
        project_data2.update(name="phrase3 phrase5")
        project_data2.update(country=self.country_id)
        response = self.test_user_client.post(url, project_data2, format="json")
        self.assertEqual(response.status_code, 201)
        project_id = response.json()['id']

        # publish it
        url = reverse("project-publish", kwargs=dict(pk=project_id))
        response = self.test_user_client.put(url, project_data2, format="json")
        self.assertEqual(response.status_code, 200)

    def test_search_no_results(self):
        url = reverse("search-project-list")
        data = {"q": "phrase2"}
        response = self.test_user_client.get(url, data, format="json")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.json()['results']['projects']), 0)
        self.assertEqual(response.json()['count'], 0)
        self.assertEqual(response.json()['results'],
                         {'projects': [], 'search_term': 'phrase2', 'search_in': [], 'type': 'map'})

    def test_no_query_params_returns_all_published_projects(self):
        url = reverse("search-project-list")
        response = self.test_user_client.get(url, format="json")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()['count'], Project.objects.published_only().count())

    def test_only_search_term_without_search_in(self):
        url = reverse("search-project-list")
        data = {"q": "phrase3"}  # PROJECT NAME
        response = self.test_user_client.get(url, data, format="json")
        self.assertEqual(response.status_code, 200)
        self.assertTrue(response.json()['count'] >= 1)

        data = {"q": "org1"}  # ORGANISATION
        response = self.test_user_client.get(url, data, format="json")
        self.assertEqual(response.status_code, 200)
        self.assertTrue(response.json()['count'] >= 1)

        data = {"q": "Hungary"}  # COUNTRY
        response = self.test_user_client.get(url, data, format="json")
        self.assertEqual(response.status_code, 200)
        self.assertTrue(response.json()['count'] >= 1)

        data = {"q": "overview"}  # OVERVIEW
        response = self.test_user_client.get(url, data, format="json")
        self.assertEqual(response.status_code, 200)
        self.assertTrue(response.json()['count'] >= 1)

        data = {"q": "dist1"}  # LOCATION
        response = self.test_user_client.get(url, data, format="json")
        self.assertEqual(response.status_code, 200)
        self.assertTrue(response.json()['count'] >= 1)

        data = {"q": "partner1"}  # PARTNER
        response = self.test_user_client.get(url, data, format="json")
        self.assertEqual(response.status_code, 200)
        self.assertTrue(response.json()['count'] >= 1)

        data = {"q": "donor1"}  # DONOR
        response = self.test_user_client.get(url, data, format="json")
        self.assertEqual(response.status_code, 200)
        self.assertTrue(response.json()['count'] >= 1)

    def test_only_search_term_with_search_in(self):
        url = reverse("search-project-list")
        data = {"q": "phrase3", "in": "name"}  # PROJECT NAME
        response = self.test_user_client.get(url, data, format="json")
        self.assertEqual(response.status_code, 200)
        self.assertTrue(response.json()['count'] >= 1)

        data = {"q": "org1", "in": "name"}  # ORGANISATION
        response = self.test_user_client.get(url, data, format="json")
        self.assertEqual(response.status_code, 200)
        self.assertTrue(response.json()['count'] == 0)

        data = {"q": "Hungary", "in": "name"}  # COUNTRY
        response = self.test_user_client.get(url, data, format="json")
        self.assertEqual(response.status_code, 200)
        self.assertTrue(response.json()['count'] == 0)

        data = {"q": "overview", "in": "name"}  # OVERVIEW
        response = self.test_user_client.get(url, data, format="json")
        self.assertEqual(response.status_code, 200)
        self.assertTrue(response.json()['count'] == 0)

        data = {"q": "dist1", "in": "name"}  # LOCATION
        response = self.test_user_client.get(url, data, format="json")
        self.assertEqual(response.status_code, 200)
        self.assertTrue(response.json()['count'] == 0)

        data = {"q": "partner1", "in": "name"}  # PARTNER
        response = self.test_user_client.get(url, data, format="json")
        self.assertEqual(response.status_code, 200)
        self.assertTrue(response.json()['count'] == 0)

        data = {"q": "donor1", "in": "name"}  # DONOR
        response = self.test_user_client.get(url, data, format="json")
        self.assertEqual(response.status_code, 200)
        self.assertTrue(response.json()['count'] == 0)
