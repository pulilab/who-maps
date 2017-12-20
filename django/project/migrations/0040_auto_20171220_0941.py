# -*- coding: utf-8 -*-
# Generated by Django 1.10.6 on 2017-12-20 09:41
from __future__ import unicode_literals

from django.db import migrations


def populate_hsc_groups(apps, schema_editor):
    HSCGroup = apps.get_model('project', 'HSCGroup')
    HSCChallenge = apps.get_model('project', 'HSCChallenge')

    for challenge in HSCChallenge.objects.all():
        group, _ = HSCGroup.all_objects.get_or_create(name=challenge.name)
        challenge.group = group
        challenge.name = challenge.challenge
        challenge.save()


class Migration(migrations.Migration):

    dependencies = [
        ('project', '0039_auto_20171220_0941'),
    ]

    operations = [
        migrations.RunPython(populate_hsc_groups, migrations.RunPython.noop),
    ]
