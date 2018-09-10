# Generated by Django 2.1 on 2018-09-10 11:58

import django.contrib.postgres.fields
from django.db import migrations, models
import django.db.models.deletion
import django.db.models.manager


class Migration(migrations.Migration):

    dependencies = [
        ('country', '0040_auto_20180905_0935'),
    ]

    operations = [
        migrations.CreateModel(
            name='CountryCustomQuestion',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('order', models.PositiveIntegerField(db_index=True, editable=False)),
                ('created', models.DateTimeField(auto_now_add=True)),
                ('modified', models.DateTimeField(auto_now=True)),
                ('is_active', models.BooleanField(default=True)),
                ('type', models.IntegerField(choices=[(1, 'Text answer'), (2, 'Numeric answer'), (3, 'Yes/No answer'), (4, 'Single choice'), (5, 'Multiple choice')], default=1)),
                ('question', models.CharField(max_length=256)),
                ('options', django.contrib.postgres.fields.ArrayField(base_field=models.CharField(max_length=256), blank=True, null=True, size=None)),
                ('private', models.BooleanField(default=False)),
                ('required', models.BooleanField(default=False)),
                ('country', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='country_questions', to='country.Country')),
            ],
            options={
                'ordering': ('order',),
                'abstract': False,
            },
            managers=[
                ('all_objects', django.db.models.manager.Manager()),
            ],
        ),
        migrations.CreateModel(
            name='DonorCustomQuestion',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('order', models.PositiveIntegerField(db_index=True, editable=False)),
                ('created', models.DateTimeField(auto_now_add=True)),
                ('modified', models.DateTimeField(auto_now=True)),
                ('is_active', models.BooleanField(default=True)),
                ('type', models.IntegerField(choices=[(1, 'Text answer'), (2, 'Numeric answer'), (3, 'Yes/No answer'), (4, 'Single choice'), (5, 'Multiple choice')], default=1)),
                ('question', models.CharField(max_length=256)),
                ('options', django.contrib.postgres.fields.ArrayField(base_field=models.CharField(max_length=256), blank=True, null=True, size=None)),
                ('private', models.BooleanField(default=False)),
                ('required', models.BooleanField(default=False)),
                ('donor', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='donor_questions', to='country.Donor')),
            ],
            options={
                'ordering': ('order',),
                'abstract': False,
            },
            managers=[
                ('all_objects', django.db.models.manager.Manager()),
            ],
        ),
    ]
