from __future__ import unicode_literals

from django.core.management.base import BaseCommand
from datetime import datetime, date, timedelta

from kpiexport.models import AuditLogHealthCategories, AuditLogHFA
from kpiexport.tasks import update_auditlog_hfa_task


class Command(BaseCommand):
    help = 'Clears HFA KPI data and regenerates them for the past year'

    def handle(self, *args, **options):
        self.stdout.write("-- Clearing old data --")
        AuditLogHealthCategories.objects.all().delete()
        AuditLogHFA.objects.all().delete()
        self.stdout.write("-- Generating new data --")
        generate_date = datetime.now().astimezone() - timedelta(days=365)
        while generate_date.date() <= date.today() + timedelta(days=1):
            self.stdout.write(f"    Date: {generate_date}")
            update_auditlog_hfa_task(generate_date)
            generate_date = generate_date + timedelta(days=1)
        self.stdout.write('-- Finished --')
