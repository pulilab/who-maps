# -*- coding: utf-8 -*-
# Generated by Django 1.9.4 on 2017-03-13 14:25
from __future__ import unicode_literals

from django.core.management import call_command
from django.db import migrations

fixture = 'initial_countries'


def load_fixture(apps, schema_editor):
    call_command('loaddata', fixture)


class Migration(migrations.Migration):

    dependencies = [
        ('country', '0004_remove_country_geodata'),
    ]

    operations = [
        migrations.RunPython(load_fixture),
    ]
