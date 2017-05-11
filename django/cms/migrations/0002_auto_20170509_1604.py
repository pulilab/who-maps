# -*- coding: utf-8 -*-
# Generated by Django 1.10.6 on 2017-05-09 16:04
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('cms', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='comment',
            name='state',
            field=models.IntegerField(choices=[(1, 'Normal'), (2, 'Flagged'), (3, 'Banned')], default=1),
        ),
        migrations.AlterField(
            model_name='post',
            name='state',
            field=models.IntegerField(choices=[(1, 'Normal'), (2, 'Flagged'), (3, 'Banned')], default=1),
        ),
    ]
