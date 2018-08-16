import copy

from django.urls import reverse

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

    def test_search_two_fields(self):
        url = reverse("search-project")
        data = {"query": "phrase2", "project_name": True, "location": True}
        response = self.test_user_client.post(url, data, format="json")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.json()), 2)

    def test_search_one_field(self):
        url = reverse("search-project")
        data = {
            "query": "phrase1",
            "project_name": True,
        }
        response = self.test_user_client.post(url, data, format="json")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.json()), 1)

    def test_search_org(self):
        url = reverse("search-project")
        data = {
            "query": "org1",
            "organisation": True,
        }
        response = self.test_user_client.post(url, data, format="json")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.json()), 2)

    def test_search_platform(self):
        url = reverse("search-project")
        data = {
            "query": "Adobe",
            "technology_platform": True,
        }
        response = self.test_user_client.post(url, data, format="json")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.json()), 2)

    def test_search_hsc(self):
        url = reverse("search-project")
        data = {
            "query": "sexuality",
        }
        response = self.test_user_client.post(url, data, format="json")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.json()), 2)

    def test_search_not_found(self):
        url = reverse("search-project")
        data = {
            "query": "nonexistent",
            "project_name": True,
            "location": True,
            "health_topic": True,
            "organisation": True
        }
        response = self.test_user_client.post(url, data, format="json")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.json()), 0)

    def test_search_not_in_main_categories(self):
        url = reverse("search-project")
        data = {"query": "overview"}
        response = self.test_user_client.post(url, data, format="json")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.json()), 2)

    def test_search_not_in_main_categories_wiki(self):
        url = reverse("search-project")
        data = {"query": "wiki.org"}
        response = self.test_user_client.post(url, data, format="json")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.json()), 2)

    def test_search_no_query(self):
        url = reverse("search-project")
        response = self.test_user_client.post(url, {}, format="json")
        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.json()['query'][0], 'This field is required.')
