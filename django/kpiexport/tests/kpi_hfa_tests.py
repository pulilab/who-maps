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
