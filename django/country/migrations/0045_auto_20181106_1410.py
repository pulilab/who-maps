# Generated by Django 2.1 on 2018-11-06 14:10

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('country', '0044_auto_20181024_1319'),
    ]

    operations = [
        migrations.AddField(
            model_name='country',
            name='lat',
            field=models.DecimalField(blank=True, decimal_places=15, max_digits=18, null=True),
        ),
        migrations.AddField(
            model_name='country',
            name='lon',
            field=models.DecimalField(blank=True, decimal_places=15, max_digits=18, null=True),
        ),
    ]
