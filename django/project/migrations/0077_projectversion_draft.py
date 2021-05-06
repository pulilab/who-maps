# Generated manually

from django.db import migrations, models
import django.db.models.deletion


def set_published_for_old_project_versions(apps, schema_editor):
    ProjectVersion = apps.get_model('project', 'ProjectVersion')
    for version in ProjectVersion.objects.exclude(project__public_id=''):
        version.published = True
        version.save()


def create_project_initial_versions(apps, schema_editor):
    Project = apps.get_model('project', 'Project')
    ProjectVersion = apps.get_model('project', 'ProjectVersion')

    for project in Project.objects.filter(public_id=''):
        filtered = len(ProjectVersion.objects.filter(project=project))  # handle unpublished projects too
        ProjectVersion.objects.create(project=project, data=project.draft, research=project.research, name=project.name,
                                      user=project.team.first(), version=filtered + 1)



class Migration(migrations.Migration):

    dependencies = [
        ('project', '0076_add_opensource_license'),
    ]

    operations = [
        migrations.AddField(
            model_name='projectversion',
            name='published',
            field=models.BooleanField(default=False),
        ),
        migrations.AlterField(
            model_name='projectversion',
            name='user',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE,
                                    related_name='project_versions', to='user.UserProfile'),
        ),
        migrations.RunPython(set_published_for_old_project_versions, migrations.RunPython.noop),
        migrations.RunPython(create_project_initial_versions, migrations.RunPython.noop),
    ]
