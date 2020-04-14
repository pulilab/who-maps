# Generated by Django 2.1 on 2020-04-08 12:08

from django.db import migrations


def add_global(apps, schema_editor):
    Country = apps.get_model('country', 'Country')
    Country.objects.get_or_create(name='Global', name_en='Global', is_global=True,
                                  gdhi_enabled=False)

def remove_global(apps, schema_editor):
    Country = apps.get_model('country', 'Country')
    country = Country.objects.get(is_global=True)
    country.delete()


class Migration(migrations.Migration):

    dependencies = [
        ('country', '0050_country_is_global'),
    ]

    operations = [
        migrations.RunPython(add_global, remove_global)
    ]
