# Generated by Django 4.2 on 2023-04-12 08:15

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('user', '0031_remove_userprofile_odk_sync'),
    ]

    operations = [
        migrations.AddField(
            model_name='userprofile',
            name='invited',
            field=models.BooleanField(default=False),
        ),
    ]
