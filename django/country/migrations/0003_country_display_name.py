# -*- coding: utf-8 -*-
# Generated by Django 1.9.4 on 2016-05-11 09:02
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('country', '0002_auto_20160422_0908'),
    ]

    operations = [
        migrations.AddField(
            model_name='country',
            name='display_name',
            field=models.CharField(default='', max_length=255),
            preserve_default=False,
        ),
    ]
