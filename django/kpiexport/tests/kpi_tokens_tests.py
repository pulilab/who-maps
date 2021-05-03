from rest_framework.test import APITestCase
from rest_framework.reverse import reverse
from kpiexport.tests.kpi_base import KPITestData


class KPITokensTests(KPITestData, APITestCase):

    def test_token_kpi_nofilter(self):
        url = reverse("token-kpi")
        response = self.client.get(url)
        expected = \
            [{'country': None, 'date': self.date_1_str, 'tokens': 3},
             {'country': None, 'date': self.date_2_str, 'tokens': 2}]

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json(), expected)

    def test_token_kpi_country_filter(self):
        url = reverse("token-kpi")
        url += f'?country={self.country2.id}'
        response = self.client.get(url)
        expected = \
            [{'country': self.country2.id, 'date': self.date_1_str, 'tokens': 3},
             {'country': self.country2.id, 'date': self.date_2_str, 'tokens': 2}]
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json(), expected)

    def test_token_kpi_investor_filter(self):
        url = reverse("token-kpi")
        url += f'?investor={self.d1.id}'
        response = self.client.get(url)
        expected = \
            [{'country': None,
              'data': {str(self.d1.id): {'I': 1, 'total': 1},
                       str(self.d2.id): {'G': 1, 'I': 1, 'total': 2},
                       'total': {'G': 1, 'I': 2}},
              'date': self.date_1_str,
              'tokens': 3}]
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json(), expected)

        url = reverse("token-kpi")
        url += f'?investor={self.d2.id}'
        response = self.client.get(url)
        expected = \
            [{'country': None,
              'data': {str(self.d1.id): {'I': 1, 'total': 1},
                       str(self.d2.id): {'G': 1, 'I': 1, 'total': 2},
                       'total': {'G': 1, 'I': 2}},
              'date': self.date_1_str,
              'tokens': 3},
             {'country': None,
              'data': {str(self.d2.id): {'I': 2, 'total': 2}, 'total': {'I': 2}},
              'date': self.date_2_str,
              'tokens': 2}]

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json(), expected)

    def test_token_kpi_time_filter(self):
        url = reverse("token-kpi")
        url += f'?from={self.date_2.year}-{self.date_2.month}&to={self.date_3.year}-{self.date_3.month}'
        response = self.client.get(url)
        expected = \
            [{'date': self.date_2_str, 'country': None, 'tokens': 2}]
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json(), expected)

    def test_token_kpi_multi_filter(self):
        url = reverse("token-kpi")
        url += f'?from={self.date_2.year}-{self.date_2.month}&to={self.date_3.year}-{self.date_3.month}' \
               f'&country={self.country2.id}'
        response = self.client.get(url)
        expected = \
            [{'country': self.country2.id, 'date': self.date_2_str, 'tokens': 2}]

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json(), expected)

    def test_token_kpi_detailed(self):
        url = reverse("token-kpi")
        url += '?detailed=true'
        response = self.client.get(url)
        expected = \
            [{'country': None,
              'data': {str(self.d1.id): {'I': 1, 'total': 1},
                       str(self.d2.id): {'G': 1, 'I': 1, 'total': 2},
                       'total': {'G': 1, 'I': 2}},
              'date': self.date_1_str,
              'tokens': 3},
             {'country': None,
              'data': {str(self.d2.id): {'I': 2, 'total': 2}, 'total': {'I': 2}},
              'date': self.date_2_str,
              'tokens': 2}]

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json(), expected)
