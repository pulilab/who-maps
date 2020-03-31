# Generated by Django 2.1 on 2020-03-30 15:03

from django.db import migrations


def update_search_objects(apps, schema_editor):
    Project = apps.get_model("project", "Project")
    for project in Project.objects.exclude(public_id=""):
        project.search.update(project)


class Migration(migrations.Migration):

    dependencies = [
        ('search', '0018_projectsearch_hfa'),
    ]

    operations = [
        migrations.RunPython(update_search_objects, reverse_code=migrations.RunPython.noop)
    ]