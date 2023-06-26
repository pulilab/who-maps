from datetime import date, timedelta

from rest_framework.test import APITestCase
from rest_framework.reverse import reverse

from kpiexport.tasks import update_auditlog_project_stages_data_task
from kpiexport.tests.kpi_base import KPITestDataWithProjects


class KPIProjectStagesTests(KPITestDataWithProjects, APITestCase):
    def setUp(self):
        super().setUp()
        generate_date = date.today() - timedelta(days=150)
        while generate_date <= date.today() + timedelta(days=1):
            update_auditlog_project_stages_data_task(generate_date)
            generate_date = generate_date + timedelta(days=1)

    def test_project_stages_kpi_nofilter(self):
        url = reverse("project-stages-kpi")
        response = self.test_user_client.get(url)
        expected = \
            [{
                'date': self.date_3_str,
                'stages': {'1': 2,
                           '10': 0,
                           '2': 1,
                           '3': 0,
                           '4': 1,
                           '5': 0,
                           '6': 0,
                           '7': 0,
                           '8': 0,
                           '9': 0,
                           'no_data': 0},

            }]

        self.assertEqual(response.status_code, 200)
        self.validate_response(expected, response.json())

    def test_project_stages_kpi_country_filter(self):
        url = reverse("project-stages-kpi")
        url += f'?country={self.country1.id}'
        response = self.test_user_client.get(url)
        expected = \
            [{
                'date': self.date_3_str,
                'stages': {'1': 2,
                           '10': 0,
                           '2': 1,
                           '3': 0,
                           '4': 1,
                           '5': 0,
                           '6': 0,
                           '7': 0,
                           '8': 0,
                           '9': 0,
                           'no_data': 0}
            }]

        self.assertEqual(response.status_code, 200)
        self.validate_response(expected, response.json())

    def test_project_stages_kpi_investor_filter(self):
        url = reverse("project-stages-kpi")
        url += f'?investor={self.d2.id}'
        response = self.test_user_client.get(url)
        expected = \
            [{'date': self.date_3_str,
              'stages': {'1': 2,
                         '10': 0,
                         '2': 0,
                         '3': 0,
                         '4': 1,
                         '5': 0,
                         '6': 0,
                         '7': 0,
                         '8': 0,
                         '9': 0,
                         'no_data': 0}},
             ]

        self.assertEqual(response.status_code, 200)
        self.validate_response(expected, response.json())

    def test_project_stages_kpi_investor_and_region_filter(self):
        url = reverse("project-stages-kpi")
        url += f'?investor={self.d2.id}&region=0'
        response = self.test_user_client.get(url)
        expected = \
            [{'date': self.date_3_str,
              'stages': {'1': 2,
                         '10': 0,
                         '2': 0,
                         '3': 0,
                         '4': 1,
                         '5': 0,
                         '6': 0,
                         '7': 0,
                         '8': 0,
                         '9': 0,
                         'no_data': 0}},
             ]

        self.assertEqual(response.status_code, 200)
        self.validate_response(expected, response.json())
