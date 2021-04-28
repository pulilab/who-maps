# Generated manually

import django.contrib.postgres.fields.jsonb
from django.db import migrations, models
import django.db.models.deletion

from datetime import date, timedelta
from kpiexport.tasks import update_auditlog_user_data_task


def pre_fill_data(apps, schema_editor):
    generate_date = date.today() - timedelta(days=365)
    while generate_date <= date.today():
        update_auditlog_user_data_task(generate_date)
        generate_date = generate_date + timedelta(days=1)


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('country', '0051_add_global_country'),
        ('user', '0029_auto_20200727_1244')
    ]

    operations = [
        migrations.CreateModel(
            name='AuditLogUsers',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('date', models.DateField(help_text='WARNING: Only use the year and month of this')),
                ('data', django.contrib.postgres.fields.jsonb.JSONField(blank=True, default=dict)),
                ('registered', models.IntegerField(default=0)),
                ('active', models.IntegerField(default=0)),
                ('country', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, blank=True, null=True,
                                              to='country.Country')),
            ],
            options={
                'verbose_name': 'User KPI',
                'verbose_name_plural': 'User KPIs',
            },
        ),
        migrations.RunPython(pre_fill_data, migrations.RunPython.noop),
    ]
