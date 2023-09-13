# Generated by Django 4.2.3 on 2023-09-13 14:20

import ckeditor.fields
from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('project', '0086_interoperabilitystandard_description_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='hscchallenge',
            name='description',
            field=ckeditor.fields.RichTextField(blank=True),
        ),
        migrations.AddField(
            model_name='hscchallenge',
            name='description_ar',
            field=ckeditor.fields.RichTextField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='hscchallenge',
            name='description_en',
            field=ckeditor.fields.RichTextField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='hscchallenge',
            name='description_es',
            field=ckeditor.fields.RichTextField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='hscchallenge',
            name='description_fr',
            field=ckeditor.fields.RichTextField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='hscchallenge',
            name='description_pt',
            field=ckeditor.fields.RichTextField(blank=True, null=True),
        ),
    ]
