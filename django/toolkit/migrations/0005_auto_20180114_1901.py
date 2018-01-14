# -*- coding: utf-8 -*-
# Generated by Django 1.10.6 on 2018-01-14 19:01
from __future__ import unicode_literals

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('toolkit', '0004_ids_to_toolkit_objects'),
    ]

    operations = [
        migrations.AlterField(
            model_name='toolkit',
            name='project',
            field=models.ForeignKey(on_delete=django.db.models.deletion.DO_NOTHING, to='project.Project'),
        ),
    ]
