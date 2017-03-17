# -*- coding: utf-8 -*-
# Generated by Django 1.9.4 on 2017-03-13 14:25
from __future__ import unicode_literals

import os
import sys
from django.core import serializers
from django.core.serializers import python
from django.db import migrations

fixture = 'initial_countries'


def load_fixture(app, fixture, ignorenonexistent=True):
    """
    A factory to load a named fixture via a data migration.
    """

    def inner(apps, schema_editor):
        """
        Loads migrations that work at current state of a model, in constrast to
        `loaddata` which requires a fixture to have data matching the fields
        defined in `models.py`.
        Based on https://gist.github.com/leifdenby/4586e350586c014c1c9a
        """
        # Do not run this when testing
        for arg in sys.argv:
            if 'test' in arg:
                return False

        # Delete all the previous data
        Country = apps.get_model('country', 'Country')
        Country.objects.all().delete()

        # relative path to fixtures
        fixtures_dir = os.path.join(app, 'fixtures')

        # monkey patch serializers `apps` so that it uses the models in the
        # current migration state
        original_apps = serializers.python.apps

        try:
            serializers.python.apps = apps

            objects = None

            for extension in ('json', 'yaml', 'xml'):
                fixture_path = os.path.join(
                    fixtures_dir,
                    '%s.%s' % (fixture, extension))

                if os.path.exists(fixture_path):
                    print("Loading fixtures from %s... " % fixture_path)

                    with open(fixture_path, 'rb') as file_:
                        objects = serializers.deserialize(
                            extension, file_,
                            ignorenonexistent=ignorenonexistent)

                        count = 0
                        for obj in objects:
                            obj.save()
                            count += 1

                        print("Loaded %d objects." % count)

            if objects is None:
                raise Exception(
                    "Couldn't find the '%s' fixture for the '%s' app." % (
                        fixture, app))
        finally:
            serializers.python.apps = original_apps

    return inner


class Migration(migrations.Migration):

    dependencies = [
        ('country', '0004_remove_country_geodata'),
    ]

    operations = [
        migrations.RunPython(load_fixture('country', fixture)),
    ]
