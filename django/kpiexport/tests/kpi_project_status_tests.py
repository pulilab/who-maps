from datetime import date, timedelta

from rest_framework.reverse import reverse

from kpiexport.tasks import update_auditlog_project_status_data_task
from kpiexport.tests.kpi_base import KPITestDataWithProjects


class KPIProjectStatusTests(KPITestDataWithProjects):
    def setUp(self):
        super().setUp()
        generate_date = date.today() - timedelta(days=150)
        while generate_date <= date.today() + timedelta(days=1):
            update_auditlog_project_status_data_task(generate_date)
            generate_date = generate_date + timedelta(days=1)

    def test_project_status_kpi_nofilter(self):
        url = reverse("project-status-kpi")
        response = self.test_user_client.get(url)
        expected = \
            [{'date': self.date_1_str,
              'draft': 5,
              'growth': 5,
              'published': 0,
              'archived': 0,
              'ready_to_publish': 5,
              'to_delete': 0,
              'unpublished': 0},
             {'date': self.date_2_str,
              'draft': 5,
              'growth': 5,
              'published': 0,
              'archived': 0,
              'ready_to_publish': 5,
              'to_delete': 0,
              'unpublished': 0},
             {'date': self.date_3_str,
              'draft': 0,
              'growth': 0,
              'published': 4,
              'archived': 1,
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
            [{'date': self.date_2_str,
              'draft': 5,
              'growth': 5,
              'published': 0,
              'archived': 0,
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
            [{'date': self.date_1_str,
              'draft': 1,
              'growth': 1,
              'published': 0,
              'archived': 0,
              'ready_to_publish': 1,
              'to_delete': 0,
              'unpublished': 0},
             {'date': self.date_2_str,
              'growth': 2,
              'published': 0,
              'archived': 0,
              'draft': 2,
              'ready_to_publish': 2,
              'to_delete': 0,
              'unpublished': 0},
             {'date': self.date_3_str,
              'draft': 0,
              'growth': 0,
              'published': 1,
              'archived': 0,
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
            [{'date': self.date_2_str,
              'draft': 5,
              'growth': 5,
              'published': 0,
              'ready_to_publish': 5,
              'archived': 0,
              'to_delete': 0,
              'unpublished': 0},
             {'date': self.date_3_str,
              'draft': 0,
              'growth': 0,
              'published': 4,
              'archived': 1,
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
            [{'date': self.date_2_str,
              'draft': 5,
              'growth': 5,
              'published': 0,
              'archived': 0,
              'ready_to_publish': 5,
              'to_delete': 0,
              'unpublished': 0}]

        self.assertEqual(response.status_code, 200)
        self.validate_response(expected, response.json())
