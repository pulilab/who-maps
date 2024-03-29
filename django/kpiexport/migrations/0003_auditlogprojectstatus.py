# Generated manually 2.2.16 on 2021-05-14 20:41

import django.contrib.postgres.fields
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('country', '0051_add_global_country'),
        ('kpiexport', '0002_auditlogtokens'),
        ('project', '0077_projectversion_draft'),
    ]

    operations = [
        migrations.CreateModel(
            name='AuditLogProjectStatus',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('date', models.DateField(help_text='WARNING: Only use the year and month of this')),
                ('data', django.contrib.postgres.fields.jsonb.JSONField(blank=True, default=dict)),
                ('published', django.contrib.postgres.fields.ArrayField(base_field=models.IntegerField(blank=True, null=True), blank=True, default=list, size=None)),
                ('ready_to_publish', django.contrib.postgres.fields.ArrayField(base_field=models.IntegerField(blank=True, null=True), blank=True, default=list, size=None)),
                ('unpublished', django.contrib.postgres.fields.ArrayField(base_field=models.IntegerField(blank=True, null=True), blank=True, default=list, size=None)),
                ('to_delete', django.contrib.postgres.fields.ArrayField(base_field=models.IntegerField(blank=True, null=True), blank=True, default=list, size=None)),
                ('growth', models.IntegerField(default=0)),
                ('country', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='country.Country')),
            ],
            options={
                'verbose_name': 'Project Status KPI',
                'verbose_name_plural': 'Project Status KPIs',
            },
        ),
    ]
