# -*- coding: utf-8 -*-
# Generated by Django 1.10.6 on 2018-07-04 10:54
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('user', '0017_userprofile_odk_sync'),
    ]

    operations = [
        migrations.AlterField(
            model_name='userprofile',
            name='odk_sync',
            field=models.BooleanField(default=False, verbose_name='User has been synced with ODK'),
        ),
    ]
