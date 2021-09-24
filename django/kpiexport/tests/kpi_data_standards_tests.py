from rest_framework.test import APITestCase
from rest_framework.reverse import reverse
from kpiexport.tests.kpi_base import KPITestDataWithProjects


class KPIDataStandardsTests(KPITestDataWithProjects, APITestCase):

    def test_data_standards_kpi_nofilter(self):
        url = reverse("data-standards-kpi")
        response = self.test_user_client.get(url)
        expected = \
            [{
                'country': None,
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
                'country': self.country1.id,
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
            [{'country': None,
              'date': self.date_3_str,
              'standards': {'1': 3, '2': 3, '4': 3}
              }]

        self.assertEqual(response.status_code, 200)
        self.validate_response(expected, response.json())

    def test_data_standards_kpi_filter_details(self):
        url = reverse("data-standards-kpi")
        url += f'?from={self.date_2.year}-{self.date_2.month}&to={self.date_3.year}-{self.date_3.month}' \
               f'&investor={self.d2.id}&detailed=true&country={self.country1.id}'
        response = self.test_user_client.get(url)
        expected = \
            [{'country': self.country1.id,
              'data': {'1': 3, '2': 3, '4': 3},
              'date': self.date_3_str,
              'standards': {'1': 3, '2': 3, '4': 3}}]
        self.assertEqual(response.status_code, 200)
        self.validate_response(expected, response.json())
