# Generated by Django 2.2.16 on 2022-05-19 09:40

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('user', '0029_auto_20200727_1244'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='userprofile',
            name='phone',
        ),
    ]