# Generated manually 2.2.16 on 2021-04-23 10:46

import django.contrib.postgres.fields.jsonb
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('country', '0051_add_global_country'),
        ('kpiexport', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='AuditLogTokens',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('date', models.DateField(help_text='WARNING: Only use the year and month of this')),
                ('data', django.contrib.postgres.fields.jsonb.JSONField(blank=True, default=dict)),
                ('tokens', models.IntegerField(default=0)),
                ('country', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, blank=True, null=True,
                                              to='country.Country')),
            ],
            options={
                'verbose_name': 'Token KPI',
                'verbose_name_plural': 'Token KPIs',
            },
        ),
    ]
