from rest_framework.test import APITestCase
from rest_framework.reverse import reverse
from kpiexport.tests.kpi_base import KPITestData


class KPIUserTests(KPITestData, APITestCase):

    def test_user_kpi_nofilter(self):
        url = reverse("user-kpi")
        response = self.client.get(url)
        expected = \
            [{'active': 0,
              'data': {'total': {'G': {'active': 0, 'registered': 1},
                                 'I': {'active': 0, 'registered': 2}}},
              'country': self.country_global.id,
              'date': self.date_1_str,
              'registered': 3},
             {'active': 0,
              'data': {'total': {'I': {'active': 0, 'registered': 2}}},
              'country': self.country_global.id,
              'date': self.date_2_str,
              'registered': 2},
             {'active': 2,
              'data': {'total': {'I': {'active': 2, 'registered': 0}}},
              'country': self.country_global.id,
              'date': self.date_3_str,
              'registered': 0},
             {'active': 3,
              'data': {'total': {'G': {'active': 1, 'registered': 0},
                                 'I': {'active': 2, 'registered': 0}}},
              'country': self.country_global.id,
              'date': self.date_4_str,
              'registered': 0}]
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json(), expected)

    def test_user_kpi_country_filter(self):
        url = reverse("user-kpi")
        url += f'?country={self.country2.id}'
        response = self.client.get(url)
        expected = \
            [{'active': 0,
              'country': self.country2.id,
              'data': {'total': {'G': {'active': 0, 'registered': 1},
                                 'I': {'active': 0, 'registered': 2}}},
              'date': self.date_1_str,
              'registered': 3},
             {'active': 0,
              'country': self.country2.id,
              'data': {'total': {'I': {'active': 0, 'registered': 2}}},
              'date': self.date_2_str,
              'registered': 2},
             {'active': 2,
              'country': self.country2.id,
              'data': {'total': {'I': {'active': 2, 'registered': 0}}},
              'date': self.date_3_str,
              'registered': 0},
             {'active': 3,
              'country': self.country2.id,
              'data': {'total': {'G': {'active': 1, 'registered': 0},
                                 'I': {'active': 2, 'registered': 0}}},
              'date': self.date_4_str,
              'registered': 0}]
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json(), expected)

    def test_user_kpi_investor_filter(self):
        url = reverse("user-kpi")
        url += f'?investor={self.d1.id}'
        response = self.client.get(url)
        expected = \
            [{'active': 0,
              'country': self.country_global.id,
              'data': {str(self.d1.id): {'I': {'active': 0, 'registered': 1},
                                         'total': {'active': 0, 'registered': 1}},
                       str(self.d2.id): {'G': {'active': 0, 'registered': 1},
                                         'I': {'active': 0, 'registered': 1},
                                         'total': {'active': 0, 'registered': 2}},
                       'total': {'G': {'active': 0, 'registered': 1},
                                 'I': {'active': 0, 'registered': 2}}},
              'date': self.date_1_str,
              'registered': 3},
             {'active': 3,
              'country': self.country_global.id,
              'data': {str(self.d1.id): {'I': {'active': 1, 'registered': 0},
                                         'total': {'active': 1, 'registered': 0}},
                       str(self.d2.id): {'G': {'active': 1, 'registered': 0},
                                         'I': {'active': 1, 'registered': 0},
                                         'total': {'active': 2, 'registered': 0}},
                       'total': {'G': {'active': 1, 'registered': 0},
                                 'I': {'active': 2, 'registered': 0}}},

              'date': self.date_4_str,
              'registered': 0}]
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json(), expected)

        url = reverse("user-kpi")
        url += f'?investor={self.d2.id}'
        response = self.client.get(url)
        expected = \
            [{'active': 0,
              'country': self.country_global.id,
              'data': {str(self.d1.id): {'I': {'active': 0, 'registered': 1},
                                         'total': {'active': 0, 'registered': 1}},
                       str(self.d2.id): {'G': {'active': 0, 'registered': 1},
                                         'I': {'active': 0, 'registered': 1},
                                         'total': {'active': 0, 'registered': 2}},
                       'total': {'G': {'active': 0, 'registered': 1},
                                 'I': {'active': 0, 'registered': 2}}},

              'date': self.date_1_str,
              'registered': 3},
             {'active': 0,
              'country': self.country_global.id,
              'data': {str(self.d2.id): {'I': {'active': 0, 'registered': 2},
                                         'total': {'active': 0, 'registered': 2}},
                       'total': {'I': {'active': 0, 'registered': 2}}},

              'date': self.date_2_str,
              'registered': 2},
             {'active': 2,
              'country': self.country_global.id,
              'data': {str(self.d2.id): {'I': {'active': 2, 'registered': 0},
                                         'total': {'active': 2, 'registered': 0}},
                       'total': {'I': {'active': 2, 'registered': 0}}},
              'date': self.date_3_str,
              'registered': 0},
             {'active': 3,
              'country': self.country_global.id,
              'data': {str(self.d1.id): {'I': {'active': 1, 'registered': 0},
                                         'total': {'active': 1, 'registered': 0}},
                       str(self.d2.id): {'G': {'active': 1, 'registered': 0},
                                         'I': {'active': 1, 'registered': 0},
                                         'total': {'active': 2, 'registered': 0}},
                       'total': {'G': {'active': 1, 'registered': 0},
                                 'I': {'active': 2, 'registered': 0}}},

              'date': self.date_4_str,
              'registered': 0}]

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json(), expected)

    def test_user_kpi_time_filter(self):
        url = reverse("user-kpi")
        url += f'?from={self.date_2.year}-{self.date_2.month}&to={self.date_3.year}-{self.date_3.month}'
        response = self.client.get(url)
        expected = \
            [{'active': 0,
              'country': self.country_global.id,
              'data': {'total': {'I': {'active': 0, 'registered': 2}}},
              'date': self.date_2_str,
              'registered': 2},
             {'active': 2,
              'country': self.country_global.id,
              'data': {'total': {'I': {'active': 2, 'registered': 0}}},
              'date': self.date_3_str,
              'registered': 0}]
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json(), expected)

    def test_user_kpi_multi_filter(self):
        url = reverse("user-kpi")
        url += f'?from={self.date_2.year}-{self.date_2.month}&to={self.date_3.year}-{self.date_3.month}' \
               f'&country={self.country2.id}'
        response = self.client.get(url)
        expected = \
            [{'active': 0,
              'country': self.country2.id,
              'data': {'total': {'I': {'active': 0, 'registered': 2}}},
              'date': self.date_2_str,
              'registered': 2},
             {'active': 2,
              'country': self.country2.id,
              'data': {'total': {'I': {'active': 2, 'registered': 0}}},
              'date': self.date_3_str,
              'registered': 0}]

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json(), expected)

    def test_user_kpi_detailed(self):
        url = reverse("user-kpi")
        url += '?detailed=true'
        response = self.client.get(url)
        expected = \
            [{'active': 0,
              'country': self.country_global.id,
              'data': {str(self.d1.id): {'I': {'active': 0, 'registered': 1},
                                         'total': {'active': 0, 'registered': 1}},
                       str(self.d2.id): {'G': {'active': 0, 'registered': 1},
                                         'I': {'active': 0, 'registered': 1},
                                         'total': {'active': 0, 'registered': 2}},
                       'total': {'G': {'active': 0, 'registered': 1},
                                 'I': {'active': 0, 'registered': 2}}},

              'date': self.date_1_str,
              'registered': 3},
             {'active': 0,
              'country': self.country_global.id,
              'data': {str(self.d2.id): {'I': {'active': 0, 'registered': 2},
                                         'total': {'active': 0, 'registered': 2}},
                       'total': {'I': {'active': 0, 'registered': 2}}},
              'date': self.date_2_str,
              'registered': 2},
             {'active': 2,
              'country': self.country_global.id,
              'data': {str(self.d2.id): {'I': {'active': 2, 'registered': 0},
                                         'total': {'active': 2, 'registered': 0}},
                       'total': {'I': {'active': 2, 'registered': 0}}},
              'date': self.date_3_str,
              'registered': 0},
             {'active': 3,
              'country': self.country_global.id,
              'data': {str(self.d1.id): {'I': {'active': 1, 'registered': 0},
                                         'total': {'active': 1, 'registered': 0}},
                       str(self.d2.id): {'G': {'active': 1, 'registered': 0},
                                         'I': {'active': 1, 'registered': 0},
                                         'total': {'active': 2, 'registered': 0}},
                       'total': {'G': {'active': 1, 'registered': 0},
                                 'I': {'active': 2, 'registered': 0}}},
              'date': self.date_4_str,
              'registered': 0}]
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json(), expected)
