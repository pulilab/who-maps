# Generated by Django 2.0.7 on 2018-08-04 09:20

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('country', '0035_auto_20180802_0827'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='country',
            name='region',
        ),
    ]
