from datetime import timedelta, date

from rest_framework.test import APITestCase
from rest_framework.reverse import reverse

from kpiexport.tasks import update_auditlog_hfa_task
from kpiexport.tests.kpi_base import KPITestDataWithProjects
from project.models import HealthCategory, HealthFocusArea


class KPIHFATests(KPITestDataWithProjects, APITestCase):
    def setUp(self):
        super().setUp()
        generate_date = date.today() - timedelta(days=150)
        while generate_date <= date.today() + timedelta(days=1):
            update_auditlog_hfa_task(generate_date)
            generate_date = generate_date + timedelta(days=1)

    def test_health_categories_date_filter(self):
        url = reverse("health-categories-kpi")
        url += f'?from={self.date_3.year}-{self.date_3.month}&to={self.date_3.year}-{self.date_3.month}'
        response = self.test_user_client.get(url)
        hc1 = HealthCategory.objects.get(id=1)
        hc2 = HealthCategory.objects.get(id=2)
        expected = \
            [{
                'country': None,
                'date': self.date_3_str,
                'categories': {str(hc_id.id): 0 for hc_id in HealthCategory.objects.all().order_by('id')}
            }]
        expected[0]['categories'][str(hc1.id)] = 4
        expected[0]['categories'][str(hc2.id)] = 4
        self.assertEqual(response.status_code, 200)
        self.validate_response(expected, response.json())

    def test_health_categories_kpi_country_filter(self):
        url = reverse("health-categories-kpi")
        url += f'?country={self.country1.id}'
        url += f'&from={self.date_3.year}-{self.date_3.month}&to={self.date_3.year}-{self.date_3.month}'
        response = self.test_user_client.get(url)
        hc1 = HealthCategory.objects.get(id=1)
        hc2 = HealthCategory.objects.get(id=2)
        expected = \
            [{
                'country': self.country1.id,
                'date': self.date_3_str,
                'categories': {str(hc_id.id): 0 for hc_id in HealthCategory.objects.all().order_by('id')}
            }]
        expected[0]['categories'][str(hc1.id)] = 4
        expected[0]['categories'][str(hc2.id)] = 4

        self.assertEqual(response.status_code, 200)
        self.validate_response(expected, response.json())

    def test_health_categories_kpi_investor_filter(self):
        url = reverse("health-categories-kpi")
        url += f'?investor={self.d2.id}'
        url += f'&from={self.date_3.year}-{self.date_3.month}&to={self.date_3.year}-{self.date_3.month}'
        response = self.test_user_client.get(url)
        hc1 = HealthCategory.objects.get(id=1)
        hc2 = HealthCategory.objects.get(id=2)
        expected = \
            [{
                'country': None,
                'date': self.date_3_str,
                'categories': {str(hc_id.id): 0 for hc_id in HealthCategory.objects.all().order_by('id')}
            }]
        expected[0]['categories'][str(hc1.id)] = 3
        expected[0]['categories'][str(hc2.id)] = 3

        self.assertEqual(response.status_code, 200)
        self.validate_response(expected, response.json())

    def test_health_categories_kpi_filter_details(self):
        url = reverse("health-categories-kpi")
        url += f'?from={self.date_3.year}-{self.date_3.month}&to={self.date_3.year}-{self.date_3.month}' \
               f'&investor={self.d2.id}&detailed=true&country={self.country1.id}'
        response = self.test_user_client.get(url)
        hc1 = HealthCategory.objects.get(id=1)
        hc2 = HealthCategory.objects.get(id=2)
        cat_data = {str(hc_id.id): 0 for hc_id in HealthCategory.objects.all().order_by('id')}
        expected = \
            [{
                'country': self.country1.id,
                'date': self.date_3_str,
                'categories': cat_data,
                'data': cat_data
            }]
        expected[0]['categories'][str(hc1.id)] = 3
        expected[0]['categories'][str(hc2.id)] = 3
        expected[0]['data'][str(hc1.id)] = 3
        expected[0]['data'][str(hc2.id)] = 3

        self.assertEqual(response.status_code, 200)
        self.validate_response(expected, response.json())
