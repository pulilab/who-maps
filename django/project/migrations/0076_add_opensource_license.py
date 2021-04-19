# Generated manually

from django.db import migrations


def create_license_opensource(apps, schema_editor):
    Licence = apps.get_model('project', 'Licence')
    Licence.objects.get_or_create(name="Open Source Software", name_en="Open Source Software")


def delete_license_opensource(apps, schema_editor):
    Licence = apps.get_model('project', 'Licence')
    try:
        lic = Licence.objects.get(name="Open Source Software")
        lic.delete()
    except Licence.DoesNotExist:
        pass


class Migration(migrations.Migration):

    dependencies = [
        ('project', '0075_projectversion_user'),
    ]

    operations = [
        migrations.RunPython(create_license_opensource, delete_license_opensource),
    ]
