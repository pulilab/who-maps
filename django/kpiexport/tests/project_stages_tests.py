from rest_framework.test import APITestCase
from rest_framework.reverse import reverse
from kpiexport.tests.kpi_base import KPITestDataWithProjects


class KPIProjectStagesTests(KPITestDataWithProjects, APITestCase):

    def test_project_stages_kpi_nofilter(self):
        url = reverse("project-stages-kpi")
        response = self.test_user_client.get(url)
        expected = \
            [{'country': None, 'date': self.date_1_str, 'stages': {'1': 2, '2': 1, '4': 1}},
             {'country': None, 'date': self.date_2_str, 'stages': {'1': 1, '2': 2, '4': 2}},
             {'country': None, 'date': self.date_3_str, 'stages': {'1': 2, '2': 1, '4': 1}}]

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json(), expected)

    def test_project_stages_kpi_country_filter(self):
        url = reverse("project-stages-kpi")
        url += f'?country={self.country2.id}'
        response = self.test_user_client.get(url)
        expected = \
            [{'country': self.country2.id, 'date': self.date_2_str, 'stages': {'1': 1, '2': 2, '4': 2}}]

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json(), expected)

    def test_project_stages_kpi_investor_filter(self):
        url = reverse("project-stages-kpi")
        url += f'?investor={self.d1.id}'
        response = self.test_user_client.get(url)
        expected = \
            [{'country': None, 'date': self.date_1_str, 'stages': {'2': 1}},
             {'country': None, 'date': self.date_2_str, 'stages': {'2': 2}},
             {'country': None, 'date': self.date_3_str, 'stages': {'2': 1}}]

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json(), expected)

    def test_project_stages_kpi_time_filter(self):
        url = reverse("project-stages-kpi")
        url += f'?from={self.date_2.year}-{self.date_2.month}&to={self.date_3.year}-{self.date_3.month}'
        response = self.test_user_client.get(url)
        expected = \
            [{'country': None, 'date': self.date_2_str, 'stages': {'1': 1, '2': 2, '4': 2}},
             {'country': None, 'date': self.date_3_str, 'stages': {'1': 2, '2': 1, '4': 1}}]

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json(), expected)

    def test_project_stages_kpi_multi_filter(self):
        url = reverse("project-stages-kpi")
        url += f'?from={self.date_2.year}-{self.date_2.month}&to={self.date_3.year}-{self.date_3.month}' \
               f'&country={self.country2.id}'
        response = self.test_user_client.get(url)
        expected = \
            [{'country': self.country2.id, 'date': self.date_2_str, 'stages': {'1': 1, '2': 2, '4': 2}}]

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json(), expected)

    def test_project_stages_kpi_detailed(self):
        url = reverse("project-stages-kpi")
        url += '?detailed=true'
        response = self.test_user_client.get(url)
        expected = \
            [{'country': None,
              'data': {str(self.d1.id): {'2': 1}, str(self.d2.id): {'1': 2, '4': 1}},
              'date': self.date_1_str,
              'stages': {'1': 2, '2': 1, '4': 1}},
             {'country': None,
              'data': {str(self.d1.id): {'2': 2}},
              'date': self.date_2_str,
              'stages': {'1': 1, '2': 2, '4': 2}},
             {'country': None,
              'data': {str(self.d1.id): {'2': 1}, str(self.d2.id): {'1': 2, '4': 1}},
              'date': self.date_3_str,
              'stages': {'1': 2, '2': 1, '4': 1}}]

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json(), expected)

    def test_project_stages_kpi_detailed_filters(self):
        url = reverse("project-stages-kpi")
        url += f'?detailed=true&investor={self.d1.id}'
        response = self.test_user_client.get(url)
        expected = \
            [{'country': None, 'data': {'2': 1}, 'date': self.date_1_str, 'stages': {'2': 1}},
             {'country': None, 'data': {'2': 2}, 'date': self.date_2_str, 'stages': {'2': 2}},
             {'country': None, 'data': {'2': 1}, 'date': self.date_3_str, 'stages': {'2': 1}}]

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json(), expected)
