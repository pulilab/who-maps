# -*- coding: utf-8 -*-
# Generated by Django 1.9.4 on 2016-07-08 14:47
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('country', '0002_auto_20160422_0908'),
    ]

    operations = [
        migrations.AddField(
            model_name='country',
            name='code',
            field=models.CharField(default='NULL', help_text='ISO3166-1 country code', max_length=4),
        ),
    ]
