# -*- coding: utf-8 -*-
# Generated by Django 1.10.6 on 2017-12-12 13:46
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('user', '0009_auto_20171204_1457'),
    ]

    operations = [
        migrations.AddField(
            model_name='userprofile',
            name='language',
            field=models.CharField(choices=[('en', 'English'), ('fr', 'French'), ('es', 'French'), ('pt', 'French')], default='en', max_length=2),
        ),
    ]
