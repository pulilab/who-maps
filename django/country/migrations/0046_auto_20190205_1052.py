# Generated by Django 2.1 on 2019-02-05 10:52

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('country', '0045_auto_20181106_1410'),
    ]

    operations = [
        migrations.AddField(
            model_name='country',
            name='name_ar',
            field=models.CharField(max_length=255, null=True, unique=True),
        ),
        migrations.AddField(
            model_name='donor',
            name='name_ar',
            field=models.CharField(max_length=255, null=True, unique=True),
        ),
    ]