# -*- coding: utf-8 -*-
# Generated by Django 1.10.6 on 2017-11-26 13:22
from __future__ import unicode_literals

from django.conf import settings
import django.contrib.postgres.fields
import django.contrib.postgres.fields.jsonb
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('project', '0023_auto_20171119_1145'),
    ]

    operations = [
        migrations.CreateModel(
            name='ProjectImport',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created', models.DateTimeField(auto_now_add=True)),
                ('modified', models.DateTimeField(auto_now=True)),
                ('csv', models.FileField(upload_to='')),
                ('headers', django.contrib.postgres.fields.ArrayField(base_field=models.CharField(max_length=512), blank=True, null=True, size=None)),
                ('mapping', django.contrib.postgres.fields.jsonb.JSONField(default=dict)),
                ('imported', models.TextField(blank=True, default='', null=True)),
                ('failed', models.TextField(blank=True, default='', null=True)),
                ('status', models.NullBooleanField()),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.AlterModelOptions(
            name='digitalstrategy',
            options={'verbose_name_plural': 'Digital Strategies'},
        ),
    ]
