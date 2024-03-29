# Generated by Django 2.1 on 2020-02-10 12:52

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('user', '0026_auto_20200117_1550'),
    ]

    operations = [
        migrations.AddField(
            model_name='userprofile',
            name='linkedin',
            field=models.URLField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='userprofile',
            name='phone',
            field=models.CharField(blank=True, max_length=50, null=True),
        ),
        migrations.AddField(
            model_name='userprofile',
            name='title',
            field=models.CharField(blank=True, max_length=100, null=True),
        ),
    ]
