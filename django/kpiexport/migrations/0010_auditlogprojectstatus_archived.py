# Generated by Django 4.2.1 on 2023-05-19 20:24

import django.contrib.postgres.fields
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('kpiexport', '0009_alter_auditlogdatastandards_data_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='auditlogprojectstatus',
            name='archived',
            field=django.contrib.postgres.fields.ArrayField(base_field=models.IntegerField(blank=True, null=True), blank=True, default=list, size=None),
        ),
    ]