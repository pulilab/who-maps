# Generated manually

from django.db import migrations, models
import django.db.models.deletion


def create_version_initial_users(apps, schema_editor):
    ProjectVersion = apps.get_model('project', 'ProjectVersion')

    for version in ProjectVersion.objects.all():
        if not version.user:
            version.user = version.project.team.first()
            version.save()


class Migration(migrations.Migration):

    dependencies = [
        ('user', '0029_auto_20200727_1244'),
        ('project', '0074_projectversion'),
    ]

    operations = [
        migrations.AddField(
            model_name='projectversion',
            name='user',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE,
                                    related_name='published_versions', to='user.UserProfile'),
        ),
        migrations.RunPython(create_version_initial_users, migrations.RunPython.noop),
        migrations.AlterField(
            model_name='projectversion',
            name='user',
            field=models.ForeignKey(null=False, on_delete=django.db.models.deletion.CASCADE,
                                    related_name='published_versions', to='user.UserProfile'),
        ),
    ]
