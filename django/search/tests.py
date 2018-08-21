import copy
import itertools

from django.urls import reverse

from project.models import Project, DigitalStrategy, HealthFocusArea, HSCChallenge
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

        self.project2 = Project.objects.get(id=project_id)
        self.project2.approve()
        self.project2_id = project_id

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

    def test_filter_hfa(self):
        url = reverse("search-project-list")
        data = {"hfa": HealthFocusArea.objects.get(id=1).health_category.id}
        response = self.test_user_client.get(url, data, format="json")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()['count'], 2)

    def test_filter_hsc(self):
        url = reverse("search-project-list")
        data = {"hsc": HSCChallenge.objects.get(id=1).group.id}
        response = self.test_user_client.get(url, data, format="json")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()['count'], 2)

    def test_filter_his(self):
        url = reverse("search-project-list")
        data = {"his": 1}
        response = self.test_user_client.get(url, data, format="json")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()['count'], 2)

    def test_filter_bad_filter_term(self):
        url = reverse("search-project-list")
        data = {"his": 'k'}
        response = self.test_user_client.get(url, data, format="json")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()['count'], 0)

    def test_filter_bad_and_good_multi_filter_term(self):
        url = reverse("search-project-list")
        data = {"his": [1, 'k']}

        # will only search for the good filter term
        response = self.test_user_client.get(url, data, format="json")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()['count'], 2)

    def test_filter_region(self):
        pass

    def test_filter_donor(self):
        pass

    def test_filter_gov(self):
        url = reverse("search-project-list")
        data = {"gov": 1}
        response = self.test_user_client.get(url, data, format="json")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()['count'], 0)

        data = {"gov": 2}
        response = self.test_user_client.get(url, data, format="json")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()['count'], 1)

        data = {"gov": [1, 2]}
        response = self.test_user_client.get(url, data, format="json")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()['count'], 1)

        data = {"gov": 0}
        response = self.test_user_client.get(url, data, format="json")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()['count'], 1)

    def test_filter_approved(self):
        url = reverse("search-project-list")
        data = {"approved": 1}
        response = self.test_user_client.get(url, data, format="json")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()['count'], 1)

        # there is no disapproved project at the moment, only one that is waiting for approval
        data = {"approved": 0}
        response = self.test_user_client.get(url, data, format="json")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()['count'], 0)

        self.project2.approval.approved = False
        self.project2.approval.save()

        data = {"approved": 0}
        response = self.test_user_client.get(url, data, format="json")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()['count'], 1)

        data = {"approved": 1}
        response = self.test_user_client.get(url, data, format="json")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()['count'], 0)

    def test_multi_filter_different_filter(self):
        # all the filters are AND relations, within the same filter there's an OR relation
        url = reverse("search-project-list")
        data = {"country": self.country_id, "approved": 1}
        response = self.test_user_client.get(url, data, format="json")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()['count'], 1)

    def test_multi_filter_same_filter(self):
        # all the filters are AND relations, within the same filter there's an OR relation
        project_data = self.project_data.copy()
        project_data.update(platforms=[dict(id=1, strategies=[206]),
                                       dict(id=2, strategies=[223])])

        url = reverse("project-publish", kwargs=dict(pk=self.project_id))
        response = self.test_user_client.put(url, project_data, format="json")
        self.assertEqual(response.status_code, 200)

        p1 = Project.objects.first()
        p2 = Project.objects.last()

        p1_dhis = list(itertools.chain(*[platform['strategies'] for platform in p1.data.get('platforms')]))
        p2_dhis = list(itertools.chain(*[platform['strategies'] for platform in p2.data.get('platforms')]))

        dhi1 = p1_dhis[0]
        dhi2 = p2_dhis[0]

        self.assertNotEqual(dhi1, dhi2)

        dhi1_parent = DigitalStrategy.objects.get(id=dhi1).parent
        dhi2_parent = DigitalStrategy.objects.get(id=dhi2).parent

        self.assertNotEqual(dhi1_parent, dhi2_parent)

        data = {"dhi": dhi1_parent.id}

        url = reverse("search-project-list")

        # Should find only one
        response = self.test_user_client.get(url, data, format="json")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()['count'], 1)

        data = {"dhi": dhi2_parent.id}

        # Should find only one
        response = self.test_user_client.get(url, data, format="json")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()['count'], 1)

        data = {"dhi": [dhi1_parent.id, dhi2_parent.id]}

        # Should find two, because same-filter clauses are OR
        response = self.test_user_client.get(url, data, format="json")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()['count'], 2)
