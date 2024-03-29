# -*- coding: utf-8 -*-
# Generated by Django 1.10.6 on 2017-05-05 15:13
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('country', '0012_auto_20170504_1732'),
    ]

    operations = [
        migrations.AddField(
            model_name='countryfield',
            name='schema',
            field=models.BooleanField(default=True, help_text='Determines if this is treated as the schema for country'),
        ),
        migrations.AlterField(
            model_name='countryfield',
            name='answer',
            field=models.TextField(blank=True, max_length=2000),
        ),
    ]
