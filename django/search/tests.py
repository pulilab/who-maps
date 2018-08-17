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
        project_data2.update(name="phrase3 phrase5 overview")
        project_data2.update(country=self.country_id, government_investor=2)
        project_data2.update(platforms=[dict(id=1, strategies=[119, 118]),
                                        dict(id=2, strategies=[119, 171])])
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
        self.assertEqual(response.json()['count'], 0)

        data = {"q": "Hungary", "in": "name"}  # COUNTRY
        response = self.test_user_client.get(url, data, format="json")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()['count'], 0)

        data = {"q": "dist1", "in": "name"}  # LOCATION
        response = self.test_user_client.get(url, data, format="json")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()['count'], 0)

        data = {"q": "partner1", "in": "name"}  # PARTNER
        response = self.test_user_client.get(url, data, format="json")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()['count'], 0)

        data = {"q": "donor1", "in": "name"}  # DONOR
        response = self.test_user_client.get(url, data, format="json")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()['count'], 0)

    def test_found_in(self):
        url = reverse("search-project-list")
        data = {"q": "overview", "found": ""}
        response = self.test_user_client.get(url, data, format="json")
        self.assertEqual(response.status_code, 200)
        self.assertTrue(response.json()['count'] >= 1)
        self.assertTrue('found_in' in response.json()['results'])
        self.assertTrue(self.project2_id in response.json()['results']['found_in']['name'])
        self.assertTrue(self.project2_id in response.json()['results']['found_in']['overview'])
        self.assertTrue(self.project_id in response.json()['results']['found_in']['overview'])

    def test_query_length(self):
        url = reverse("search-project-list")
        data = {"q": "o"}
        response = self.test_user_client.get(url, data, format="json")
        self.assertEqual(response.status_code, 406)
        self.assertEqual(response.json()['error'], "Search term must be at least two characters long")

    def test_filter_country(self):
        url = reverse("search-project-list")
        data = {"country": self.country_id}
        response = self.test_user_client.get(url, data, format="json")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()['count'], 2)

        data = {"country": self.country_id + 999}
        response = self.test_user_client.get(url, data, format="json")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()['count'], 0)

    def test_filter_and_search(self):
        url = reverse("search-project-list")
        data = {"q": "overview", "in": "name", "country": self.country_id}
        response = self.test_user_client.get(url, data, format="json")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()['count'], 1)

    def test_filter_list_results(self):
        url = reverse("search-project-list")
        data = {"country": self.country_id, "type": "list"}
        response = self.test_user_client.get(url, data, format="json")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()['count'], 2)
        self.assertEqual(response.json()['results']['type'], 'list')
        self.assertTrue("his_bucket" in response.json()['results']['projects'][0])

    def test_filter_software(self):
        url = reverse("search-project-list")
        data = {"sw": "1"}
        response = self.test_user_client.get(url, data, format="json")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()['count'], 2)

    def test_filter_dhis(self):
        url = reverse("search-project-list")
        dhi_child = DigitalStrategy.objects.get(id=118)
        data = {"dhi": dhi_child.id}

        # Shouldn't find any, because we are filtering by parent categories only
        response = self.test_user_client.get(url, data, format="json")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()['count'], 0)

        dhi_child = DigitalStrategy.objects.get(id=118)
        data = {"dhi": dhi_child.parent.id}

        response = self.test_user_client.get(url, data, format="json")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()['count'], 1)
