from rest_framework.test import APITestCase
from rest_framework.reverse import reverse
from kpiexport.tests.kpi_base import KPITestDataWithProjects


class KPIProjectStagesTests(KPITestDataWithProjects, APITestCase):

    def test_project_stages_kpi_nofilter(self):
        url = reverse("project-stages-kpi")
        response = self.test_user_client.get(url)
        expected = \
            [{
                'country': None,
                'date': self.date_1_str,
                'stages': {
                    '1': 2,
                    '10': 0,
                    '2': 1,
                    '3': 0,
                    '4': 1,
                    '5': 0,
                    '6': 0,
                    '7': 0,
                    '8': 0,
                    '9': 0
                },
            },
             {
                 'country': None,
                 'date': self.date_2_str,
                 'stages': {
                     '1': 1,
                     '10': 0,
                     '2': 2,
                     '3': 0,
                     '4': 2,
                     '5': 0,
                     '6': 0,
                     '7': 0,
                     '8': 0,
                     '9': 0
                 }
             },
             {
                 'country': None,
                 'date': self.date_3_str,
                 'stages': {
                     '1': 2,
                     '10': 0,
                     '2': 1,
                     '3': 0,
                     '4': 1,
                     '5': 0,
                     '6': 0,
                     '7': 0,
                     '8': 0,
                     '9': 0
                 },
             }]

        self.assertEqual(response.status_code, 200)
        self.validate_response(expected, response.json())

    def test_project_stages_kpi_country_filter(self):
        url = reverse("project-stages-kpi")
        url += f'?country={self.country2.id}'
        response = self.test_user_client.get(url)
        expected = \
            [{
                'country': self.country2.id,
                'date': self.date_2_str,
                'stages': {
                    '1': 1,
                    '10': 0,
                    '2': 2,
                    '3': 0,
                    '4': 2,
                    '5': 0,
                    '6': 0,
                    '7': 0,
                    '8': 0,
                    '9': 0
                }
            }]

        self.assertEqual(response.status_code, 200)
        self.validate_response(expected, response.json())

    def test_project_stages_kpi_investor_filter(self):
        url = reverse("project-stages-kpi")
        url += f'?investor={self.d1.id}'
        response = self.test_user_client.get(url)
        expected = \
            [{
                'country': None,
                'date': self.date_1_str,
                'stages': {
                    '1': 0,
                    '10': 0,
                    '2': 1,
                    '3': 0,
                    '4': 0,
                    '5': 0,
                    '6': 0,
                    '7': 0,
                    '8': 0,
                    '9': 0
                }
            },
             {
                 'country': None,
                 'date': self.date_2_str,
                 'stages': {
                     '1': 0,
                     '10': 0,
                     '2': 2,
                     '3': 0,
                     '4': 0,
                     '5': 0,
                     '6': 0,
                     '7': 0,
                     '8': 0,
                     '9': 0
                 },
             },
             {
                 'country': None,
                 'date': self.date_3_str,
                 'stages': {
                     '1': 0,
                     '10': 0,
                     '2': 1,
                     '3': 0,
                     '4': 0,
                     '5': 0,
                     '6': 0,
                     '7': 0,
                     '8': 0,
                     '9': 0
                 },
             }]

        self.assertEqual(response.status_code, 200)
        self.validate_response(expected, response.json())

    def test_project_stages_kpi_filter_details(self):
        url = reverse("project-stages-kpi")
        url += f'?from={self.date_2.year}-{self.date_2.month}&to={self.date_3.year}-{self.date_3.month}' \
               f'&investor={self.d1.id}&detailed=true&country={self.country2.id}'
        response = self.test_user_client.get(url)
        expected = \
            [{
                'country': self.country2.id,
                'data': {
                    '1': 0,
                    '10': 0,
                    '2': 2,
                    '3': 0,
                    '4': 0,
                    '5': 0,
                    '6': 0,
                    '7': 0,
                    '8': 0,
                    '9': 0
                },
                'date': self.date_2_str,
                'stages': {
                    '1': 0,
                    '10': 0,
                    '2': 2,
                    '3': 0,
                    '4': 0,
                    '5': 0,
                    '6': 0,
                    '7': 0,
                    '8': 0,
                    '9': 0
                }
            }]
        self.assertEqual(response.status_code, 200)
        self.validate_response(expected, response.json())
