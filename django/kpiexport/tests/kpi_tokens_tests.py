from datetime import date, timedelta

from rest_framework.test import APITestCase
from rest_framework.reverse import reverse

from kpiexport.tasks import update_auditlog_token_data_task
from kpiexport.tests.kpi_base import KPITestData


class KPITokensTests(KPITestData, APITestCase):
    def setUp(self):
        super().setUp()
        generate_date = date.today() - timedelta(days=150)
        while generate_date <= date.today():
            update_auditlog_token_data_task(generate_date)
            generate_date = generate_date + timedelta(days=1)

    def test_token_kpi_nofilter(self):
        url = reverse("token-kpi")
        response = self.test_user_client.get(url)
        expected = \
            [{'country': None, 'date': self.date_1_str, 'tokens': 3},
             {'country': None, 'date': self.date_2_str, 'tokens': 2}]

        self.assertEqual(response.status_code, 200)
        self.validate_response(expected, response.json())

    def test_token_kpi_country_filter(self):
        url = reverse("token-kpi")
        url += f'?country={self.country2.id}'
        response = self.test_user_client.get(url)
        expected = \
            [{'country': self.country2.id, 'date': self.date_1_str, 'tokens': 3},
             {'country': self.country2.id, 'date': self.date_2_str, 'tokens': 2}]
        self.assertEqual(response.status_code, 200)
        self.validate_response(expected, response.json())

    def test_token_kpi_investor_filter(self):
        url = reverse("token-kpi")
        url += f'?investor={self.d1.id}'
        response = self.test_user_client.get(url)
        expected = \
            [{'country': None,
              'date': self.date_1_str,
              'tokens': 1}]
        self.assertEqual(response.status_code, 200)
        self.validate_response(expected, response.json())

        url = reverse("token-kpi")
        url += f'?investor={self.d2.id}'
        response = self.test_user_client.get(url)
        expected = \
            [{'country': None,
              'date': self.date_1_str,
              'tokens': 2},
             {'country': None,
              'date': self.date_2_str,
              'tokens': 2}]

        self.assertEqual(response.status_code, 200)
        self.validate_response(expected, response.json())

    def test_token_kpi_time_filter(self):
        url = reverse("token-kpi")
        url += f'?from={self.date_2.year}-{self.date_2.month}&to={self.date_3.year}-{self.date_3.month}'
        response = self.test_user_client.get(url)
        expected = \
            [{'date': self.date_2_str, 'country': None, 'tokens': 2}]
        self.assertEqual(response.status_code, 200)
        self.validate_response(expected, response.json())

    def test_token_kpi_multi_filter(self):
        url = reverse("token-kpi")
        url += f'?from={self.date_2.year}-{self.date_2.month}&to={self.date_3.year}-{self.date_3.month}' \
               f'&country={self.country2.id}'
        response = self.test_user_client.get(url)
        expected = \
            [{'country': self.country2.id, 'date': self.date_2_str, 'tokens': 2}]

        self.assertEqual(response.status_code, 200)
        self.validate_response(expected, response.json())

    def test_token_kpi_detailed(self):
        url = reverse("token-kpi")
        url += '?detailed=true'
        response = self.test_user_client.get(url)
        expected = \
            [{'country': None,
              'data':
                  {str(self.d1.id): {
                      'CA': 0,
                      'D': 0,
                      'DA': 0,
                      'G': 0,
                      'I': 1,
                      'SCA': 0,
                      'SDA': 0,
                      'Y': 0,
                      'total': 1,
                  },
                      str(self.d2.id): {
                          'CA': 0,
                          'D': 0,
                          'DA': 0,
                          'G': 1,
                          'I': 1,
                          'SCA': 0,
                          'SDA': 0,
                          'Y': 0,
                          'total': 2},
                      'total': {
                          'CA': 0,
                          'D': 0,
                          'DA': 0,
                          'G': 1,
                          'I': 2,
                          'SCA': 0,
                          'SDA': 0,
                          'Y': 0,
                      }
                  },
              'date': self.date_1_str,
              'tokens': 3},
             {'country': None,
              'data': {
                  str(self.d1.id): {
                      'CA': 0,
                      'D': 0,
                      'DA': 0,
                      'G': 0,
                      'I': 0,
                      'SCA': 0,
                      'SDA': 0,
                      'Y': 0,
                      'total': 0},
                  str(self.d2.id): {
                      'CA': 0,
                      'D': 0,
                      'DA': 0,
                      'G': 0,
                      'I': 2,
                      'SCA': 0,
                      'SDA': 0,
                      'Y': 0,
                      'total': 2},
                  'total': {'CA': 0,
                            'D': 0,
                            'DA': 0,
                            'G': 0,
                            'I': 2,
                            'SCA': 0,
                            'SDA': 0,
                            'Y': 0,
                            }
              },
              'date': self.date_2_str,
              'tokens': 2}]

        self.assertEqual(response.status_code, 200)
        self.validate_response(expected, response.json())

    def test_token_kpi_detailed_filters(self):
        url = reverse("token-kpi")
        url += f'?from={self.date_2.year}-{self.date_2.month}&to={self.date_3.year}-{self.date_3.month}' \
               f'&country={self.country2.id}&investor={self.d2.id}&detailed=true'
        response = self.test_user_client.get(url)
        expected = \
            [{
                'date': self.date_2_str,
                'country': self.country2.id,
                'data': {'CA': 0,
                         'D': 0,
                         'DA': 0,
                         'G': 0,
                         'I': 2,
                         'SCA': 0,
                         'SDA': 0,
                         'Y': 0,
                         'total': 2},
                'tokens': 2}]

        self.assertEqual(response.status_code, 200)
        self.validate_response(expected, response.json())
