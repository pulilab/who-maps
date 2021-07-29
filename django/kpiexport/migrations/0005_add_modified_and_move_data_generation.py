# Generated manually 2.2.16 on 2021-07-29 11:26

from django.db import migrations, models
from kpiexport.tasks import update_auditlog_project_status_data_task
from datetime import date, timedelta
from kpiexport.tasks import update_auditlog_project_stages_data_task


def pre_fill_data_project_status(apps, schema_editor):
    generate_date = date.today() - timedelta(days=365)
    while generate_date <= date.today():
        update_auditlog_project_status_data_task(generate_date)
        generate_date = generate_date + timedelta(days=1)


def pre_fill_data_project_stages(apps, schema_editor):
    generate_date = date.today() - timedelta(days=365)
    while generate_date <= date.today():
        update_auditlog_project_stages_data_task(generate_date)
        generate_date = generate_date + timedelta(days=1)


class Migration(migrations.Migration):

    dependencies = [
        ('kpiexport', '0004_auditlogprojectstages'),
    ]

    operations = [
        migrations.AddField(
            model_name='auditlogprojectstages',
            name='modified',
            field=models.DateTimeField(auto_now=True),
        ),
        migrations.AddField(
            model_name='auditlogprojectstatus',
            name='modified',
            field=models.DateTimeField(auto_now=True),
        ),
        migrations.AddField(
            model_name='auditlogtokens',
            name='modified',
            field=models.DateTimeField(auto_now=True),
        ),
        migrations.AddField(
            model_name='auditlogusers',
            name='modified',
            field=models.DateTimeField(auto_now=True),
        ),
        migrations.RunPython(pre_fill_data_project_status, migrations.RunPython.noop),
        migrations.RunPython(pre_fill_data_project_stages, migrations.RunPython.noop),

    ]
