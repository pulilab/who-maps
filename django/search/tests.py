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

    def test_search_no_results(self):
        url = reverse("search-project-list")
        data = {"q": "phrase2"}
        response = self.test_user_client.get(url, data, format="json")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.json()['results']['projects']), 0)
        self.assertEqual(response.json()['count'], 0)
        self.assertEqual(response.json()['results'],
                         {'projects': [], 'search_term': 'phrase2', 'search_in': [], 'type': 'map'})