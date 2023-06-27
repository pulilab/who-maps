from datetime import timedelta, date

from rest_framework.test import APITestCase
from rest_framework.reverse import reverse

from kpiexport.tasks import update_auditlog_data_standards_task
from kpiexport.tests.kpi_base import KPITestDataWithProjects


class KPIDataStandardsTests(KPITestDataWithProjects, APITestCase):
    def setUp(self):
        super().setUp()
        generate_date = date.today() - timedelta(days=150)
        while generate_date <= date.today() + timedelta(days=1):
            update_auditlog_data_standards_task(generate_date)
            generate_date = generate_date + timedelta(days=1)

    def test_data_standards_kpi_nofilter(self):
        url = reverse("data-standards-kpi")
        response = self.test_user_client.get(url)
        expected = \
            [{
                'date': self.date_3_str,
                'standards': {'1': 4, '2': 4, '4': 4}
            }]

        self.assertEqual(response.status_code, 200)
        self.validate_response(expected, response.json())

    def test_data_standards_kpi_country_filter(self):
        url = reverse("data-standards-kpi")
        url += f'?country={self.country1.id}'
        response = self.test_user_client.get(url)
        expected = \
            [{
                'date': self.date_3_str,
                'standards': {'1': 4, '2': 4, '4': 4}
            }]

        self.assertEqual(response.status_code, 200)
        self.validate_response(expected, response.json())

    def test_data_standards_kpi_investor_filter(self):
        url = reverse("data-standards-kpi")
        url += f'?investor={self.d2.id}'
        response = self.test_user_client.get(url)
        expected = \
            [{'date': self.date_3_str,
              'standards': {'1': 3, '2': 3, '4': 3}
              }]

        self.assertEqual(response.status_code, 200)
        self.validate_response(expected, response.json())
