from rest_framework.reverse import reverse
from kpiexport.tests.kpi_base import KPITestDataWithProjects


class KPIProjectStatusTests(KPITestDataWithProjects):

    def test_project_status_kpi_nofilter(self):
        url = reverse("project-status-kpi")
        response = self.test_user_client.get(url)
        expected = \
            [{'country': None,
              'date': self.date_1_str,
              'draft': 4,
              'growth': 4,
              'published': 0,
              'ready_to_publish': 4,
              'to_delete': 0,
              'unpublished': 0},
             {'country': None,
              'date': self.date_2_str,
              'draft': 5,
              'growth': 5,
              'published': 0,
              'ready_to_publish': 5,
              'to_delete': 0,
              'unpublished': 0},
             {'country': None,
              'date': self.date_3_str,
              'draft': 0,
              'growth': 0,
              'published': 4,
              'ready_to_publish': 0,
              'to_delete': 0,
              'unpublished': 0}]
        self.assertEqual(response.status_code, 200)
        self.validate_response(expected, response.json())

    def test_project_status_kpi_country_filter(self):
        url = reverse("project-status-kpi")
        url += f'?country={self.country2.id}'
        response = self.test_user_client.get(url)
        expected = \
            [{'country': self.country2.id,
              'date': self.date_2_str,
              'draft': 5,
              'growth': 5,
              'published': 0,
              'ready_to_publish': 5,
              'to_delete': 0,
              'unpublished': 0}]
        self.assertEqual(response.status_code, 200)
        self.validate_response(expected, response.json())

    def test_project_status_kpi_investor_filter(self):
        self.maxDiff = None
        url = reverse("project-status-kpi")
        url += f'?investor={self.d1.id}'
        response = self.test_user_client.get(url)
        expected = \
            [{'country': None,
              'date': self.date_1_str,
              'draft': 1,
              'growth': 1,
              'published': 0,
              'ready_to_publish': 1,
              'to_delete': 0,
              'unpublished': 0},
             {'country': None,
              'date': self.date_2_str,
              'growth': 2,
              'published': 0,
              'draft': 2,
              'ready_to_publish': 2,
              'to_delete': 0,
              'unpublished': 0},
             {'country': None,
              'date': self.date_3_str,
              'draft': 0,
              'growth': 0,
              'published': 1,
              'ready_to_publish': 0,
              'to_delete': 0,
              'unpublished': 0}]
        self.assertEqual(response.status_code, 200)
        self.validate_response(expected, response.json())

    def test_project_status_kpi_time_filter(self):
        url = reverse("project-status-kpi")
        url += f'?from={self.date_2.year}-{self.date_2.month}&to={self.date_3.year}-{self.date_3.month}'
        response = self.test_user_client.get(url)
        expected = \
            [{'country': None,
              'date': self.date_2_str,
              'draft': 5,
              'growth': 5,
              'published': 0,
              'ready_to_publish': 5,
              'to_delete': 0,
              'unpublished': 0},
             {'country': None,
              'date': self.date_3_str,
              'draft': 0,
              'growth': 0,
              'published': 4,
              'ready_to_publish': 0,
              'to_delete': 0,
              'unpublished': 0}]

        self.assertEqual(response.status_code, 200)
        self.validate_response(expected, response.json())

    def test_project_status_kpi_multi_filter(self):
        url = reverse("project-status-kpi")
        url += f'?from={self.date_2.year}-{self.date_2.month}&to={self.date_3.year}-{self.date_3.month}' \
               f'&country={self.country2.id}'
        response = self.test_user_client.get(url)
        expected = \
            [{'country': self.country2.id,
              'date': self.date_2_str,
              'draft': 5,
              'growth': 5,
              'published': 0,
              'ready_to_publish': 5,
              'to_delete': 0,
              'unpublished': 0}]

        self.assertEqual(response.status_code, 200)
        self.validate_response(expected, response.json())

    def test_project_status_kpi_detailed(self):
        url = reverse("project-status-kpi")
        url += '?detailed=true'
        response = self.test_user_client.get(url)
        expected = \
            [{'country': None,
              'data': {str(self.d1.id): {'draft': 1,
                                         'growth': 1,
                                         'published': 0,
                                         'ready_to_publish': 1,
                                         'to_delete': 0,
                                         'unpublished': 0},
                       str(self.d2.id): {'draft': 3,
                                         'growth': 3,
                                         'published': 0,
                                         'ready_to_publish': 3,
                                         'to_delete': 0,
                                         'unpublished': 0}},
              'date': self.date_1_str,
              'draft': 4,
              'growth': 4,
              'published': 0,
              'ready_to_publish': 4,
              'to_delete': 0,
              'unpublished': 0},
             {'country': None,
              'data': {
                  str(self.d1.id): {
                      'growth': 2,
                      'draft': 2,
                      'published': 0,
                      'ready_to_publish': 2,
                      'to_delete': 0,
                      'unpublished': 0},
                  str(self.d2.id): {
                      'growth': 0,
                      'draft': 0,
                      'published': 0,
                      'ready_to_publish': 0,
                      'to_delete': 0,
                      'unpublished': 0}
              },
              'date': self.date_2_str,
              'draft': 5,
              'growth': 5,
              'published': 0,
              'ready_to_publish': 5,
              'to_delete': 0,
              'unpublished': 0},
             {'country': None,
              'data': {str(self.d1.id): {'growth': 0,
                                         'draft': 0,
                                         'published': 1,
                                         'ready_to_publish': 0,
                                         'to_delete': 0,
                                         'unpublished': 0},
                       str(self.d2.id): {'growth': 0,
                                         'draft': 0,
                                         'published': 3,
                                         'ready_to_publish': 0,
                                         'to_delete': 0,
                                         'unpublished': 0}},
              'date': self.date_3_str,
              'draft': 0,
              'growth': 0,
              'published': 4,
              'ready_to_publish': 0,
              'to_delete': 0,
              'unpublished': 0}]

        self.assertEqual(response.status_code, 200)
        self.validate_response(expected, response.json())

    def test_project_status_kpi_filter_detailed(self):
        url = reverse("project-status-kpi")
        url += f'?from={self.date_2.year}-{self.date_2.month}&to={self.date_3.year}-{self.date_3.month}' \
               f'&country={self.country2.id}&investor={self.d1.id}&detailed=true'
        response = self.test_user_client.get(url)
        expected = \
            [{'country': self.country2.id,
              'data': {'growth': 1,
                       'draft': 1,
                       'published': 0,
                       'ready_to_publish': 1,
                       'to_delete': 0,
                       'unpublished': 0},
              'date': self.date_2_str,
              'draft': 1,
              'growth': 1,
              'published': 0,
              'ready_to_publish': 1,
              'to_delete': 0,
              'unpublished': 0}]
        self.assertEqual(response.status_code, 200)
        self.validate_response(expected, response.json())
