from datetime import date, timedelta

from rest_framework.test import APITestCase
from rest_framework.reverse import reverse

from kpiexport.tasks import update_auditlog_user_data_task
from kpiexport.tests.kpi_base import KPITestData


class KPIUserTests(KPITestData, APITestCase):
    def setUp(self):
        super().setUp()
        generate_date = date.today() - timedelta(days=150)
        while generate_date <= date.today() + timedelta(days=1):
            update_auditlog_user_data_task(generate_date)
            generate_date = generate_date + timedelta(days=1)

    def test_user_kpi_nofilter(self):
        url = reverse("user-kpi")
        response = self.test_user_client.get(url)
        expected = \
            [{'active': 0,
              'date': self.date_1_str,
              'registered': 3},
             {'active': 0,
              'date': self.date_2_str,
              'registered': 2},
             {'active': 2,
              'date': self.date_3_str,
              'registered': 0},
             {'active': 3,
              'date': self.date_4_str,
              'registered': 0}]
        self.assertEqual(response.status_code, 200)
        self.validate_response(expected, response.json())

    def test_user_kpi_country_filter(self):
        url = reverse("user-kpi")
        url += f'?country={self.country2.id}'
        response = self.test_user_client.get(url)
        expected = \
            [{'active': 0,
              'date': self.date_1_str,
              'registered': 1},
             {'active': 0,
              'date': self.date_2_str,
              'registered': 2},
             {'active': 2,
              'date': self.date_3_str,
              'registered': 0},
             {'active': 1,
              'date': self.date_4_str,
              'registered': 0}]
        self.assertEqual(response.status_code, 200)
        self.validate_response(expected, response.json())

    def test_user_kpi_investor_filter(self):
        url = reverse("user-kpi")
        url += f'?investor={self.d1.id}'
        response = self.test_user_client.get(url)
        expected = \
            [{'active': 0,
              'date': self.date_1_str,
              'registered': 1},
             {'active': 1,
              'date': self.date_4_str,
              'registered': 0}]
        self.assertEqual(response.status_code, 200)
        self.validate_response(expected, response.json())

        url = reverse("user-kpi")
        url += f'?investor={self.d2.id}'
        response = self.test_user_client.get(url)
        expected = \
            [{'active': 0,
              'date': self.date_1_str,
              'registered': 2},
             {'active': 0,
              'date': self.date_2_str,
              'registered': 2},
             {'active': 2,
              'date': self.date_3_str,
              'registered': 0},
             {'active': 2,
              'date': self.date_4_str,
              'registered': 0}]

        self.assertEqual(response.status_code, 200)
        self.validate_response(expected, response.json())

    def test_user_kpi_time_filter(self):
        url = reverse("user-kpi")
        url += f'?from={self.date_2.year}-{self.date_2.month}&to={self.date_3.year}-{self.date_3.month}'
        response = self.test_user_client.get(url)
        expected = \
            [{'active': 0,
              'date': self.date_2_str,
              'registered': 2},
             {'active': 2,
              'date': self.date_3_str,
              'registered': 0}]
        self.assertEqual(response.status_code, 200)
        self.validate_response(expected, response.json())

    def test_user_kpi_multi_filter(self):
        url = reverse("user-kpi")
        url += f'?from={self.date_2.year}-{self.date_2.month}&to={self.date_3.year}-{self.date_3.month}' \
               f'&country={self.country2.id}'
        response = self.test_user_client.get(url)
        expected = \
            [{'active': 0,
              'date': self.date_2_str,
              'registered': 2},
             {'active': 2,
              'date': self.date_3_str,
              'registered': 0}]

        self.assertEqual(response.status_code, 200)
        self.validate_response(expected, response.json())

    def test_user_kpi_region_filter(self):
        url = reverse("user-kpi")
        url += '?region=0'
        response = self.test_user_client.get(url)
        expected = \
            [{'active': 0,
              'date': self.date_1_str,
              'registered': 2},
             {'active': 0,
              'date': self.date_2_str,
              'registered': 0},
             {'active': 0,
              'date': self.date_3_str,
              'registered': 0},
             {'active': 2,
              'date': self.date_4_str,
              'registered': 0}]
        self.assertEqual(response.status_code, 200)
        self.validate_response(expected, response.json())

    def test_user_kpi_investor__with_region_filter(self):
        url = reverse("user-kpi")
        url += f'?investor={self.d1.id}&region=0'
        response = self.test_user_client.get(url)
        expected = \
            [{'active': 0,
              'date': self.date_1_str,
              'registered': 1},
             {'active': 1,
              'date': self.date_4_str,
              'registered': 0}]
        self.assertEqual(response.status_code, 200)
        self.validate_response(expected, response.json())
