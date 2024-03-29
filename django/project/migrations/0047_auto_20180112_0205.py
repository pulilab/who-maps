# -*- coding: utf-8 -*-
# Generated by Django 1.10.6 on 2018-01-12 02:05
from __future__ import unicode_literals

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('project', '0046_create_project_admins'),
    ]

    operations = [
        migrations.AlterField(
            model_name='projectapproval',
            name='user',
            field=models.ForeignKey(blank=True, help_text='Administrator who approved the project', null=True, on_delete=django.db.models.deletion.CASCADE, to='user.UserProfile'),
        ),
    ]
