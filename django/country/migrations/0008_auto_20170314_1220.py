# -*- coding: utf-8 -*-
# Generated by Django 1.9.4 on 2017-03-14 12:20
from __future__ import unicode_literals

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('country', '0007_partnerlogo'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='country',
            options={'verbose_name_plural': 'Countries'},
        ),
        migrations.AlterField(
            model_name='country',
            name='cover',
            field=models.ImageField(blank=True, null=True, upload_to=''),
        ),
        migrations.AlterField(
            model_name='country',
            name='logo',
            field=models.ImageField(blank=True, null=True, upload_to=''),
        ),
        migrations.AlterField(
            model_name='country',
            name='user',
            field=models.ForeignKey(blank=True, help_text='User who can update the country', null=True, on_delete=django.db.models.deletion.CASCADE, related_name='country_admin', to='user.UserProfile'),
        ),
    ]
