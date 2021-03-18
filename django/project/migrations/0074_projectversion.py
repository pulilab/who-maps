# Generated manually

import django.contrib.postgres.fields.jsonb
from django.db import migrations, models
import django.db.models.deletion


def create_project_initial_versions(apps, schema_editor):
    Project = apps.get_model('project', 'Project')
    ProjectVersion = apps.get_model('project', 'ProjectVersion')

    for project in Project.objects.exclude(public_id=''):
    	ProjectVersion.objects.create(project=project, data=project.data, research=project.research, name=project.name)



class Migration(migrations.Migration):

    dependencies = [
        ('project', '0073_project_metadata'),
    ]

    operations = [
        migrations.CreateModel(
            name='ProjectVersion',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created', models.DateTimeField(auto_now_add=True)),
                ('modified', models.DateTimeField(auto_now=True)),
                ('version', models.IntegerField(default=1)),
                ('data', django.contrib.postgres.fields.jsonb.JSONField(default=dict)),
                ('research', models.NullBooleanField()),
                ('name', models.CharField(max_length=255)),
                ('project', models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, related_name='versions', to='project.Project')),
            ],
            options={
                'ordering': ['modified'],
                'unique_together': {('project', 'version')},
            },
        ),
        migrations.RunPython(create_project_initial_versions, migrations.RunPython.noop),
    ]
