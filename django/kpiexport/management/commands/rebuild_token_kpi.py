from __future__ import unicode_literals

from django.core.management.base import BaseCommand
from datetime import datetime, date, timedelta

from kpiexport.models import AuditLogTokens
from kpiexport.tasks import update_auditlog_token_data_task


class Command(BaseCommand):
    help = 'Clears User KPI data and regenerates them for the past year'

    def handle(self, *args, **options):
        self.stdout.write("-- Clearing old data --")
        AuditLogTokens.objects.all().delete()
        self.stdout.write("-- Generating new data --")
        generate_date = datetime.now().astimezone() - timedelta(days=365)
        while generate_date.date() <= date.today():
            update_auditlog_token_data_task(generate_date)
            generate_date = generate_date + timedelta(days=1)
        self.stdout.write('-- Finished --')
