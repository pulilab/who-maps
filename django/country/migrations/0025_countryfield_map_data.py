# -*- coding: utf-8 -*-
# Generated by Django 1.10.6 on 2018-01-08 17:16
from __future__ import unicode_literals

import django.contrib.postgres.fields.jsonb
from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('country', '0024_auto_20180103_1253'),
    ]

    operations = [
        migrations.AddField(
            model_name='countryfield',
            name='map_data',
            field=django.contrib.postgres.fields.jsonb.JSONField(default={}),
        ),
    ]
