# -*- coding: utf-8 -*-
# Generated by Django 1.10.6 on 2018-01-10 23:24
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('country', '0027_auto_20180110_0240'),
    ]

    operations = [
        migrations.AddField(
            model_name='country',
            name='map_activated_on',
            field=models.DateTimeField(blank=True, help_text='WARNING: this field is for developers only', null=True),
        ),
    ]
