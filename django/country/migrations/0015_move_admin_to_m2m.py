# -*- coding: utf-8 -*-
# Generated by Django 1.10.6 on 2017-11-27 11:31
from __future__ import unicode_literals

from django.db import migrations


def move_country_admin_to_m2m(apps, schema_editor):
    Country = apps.get_model('country', 'Country')
    for country in Country.objects.all():
        if country.user is None:
            continue

        country.users.add(country.user)
        country.save()


class Migration(migrations.Migration):

    dependencies = [
        ('country', '0014_country_users'),
    ]

    operations = [
        migrations.RunPython(move_country_admin_to_m2m)
    ]
