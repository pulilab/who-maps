# Generated manually

import django.contrib.postgres.fields.jsonb
from django.db import migrations, models
import django.db.models.deletion


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
    ]
