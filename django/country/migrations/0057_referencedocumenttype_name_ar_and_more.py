# Generated by Django 4.2.3 on 2023-08-11 11:34

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('country', '0056_referencedocumenttype_remove_referencedocument_types_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='referencedocumenttype',
            name='name_ar',
            field=models.CharField(max_length=64, null=True),
        ),
        migrations.AddField(
            model_name='referencedocumenttype',
            name='name_en',
            field=models.CharField(max_length=64, null=True),
        ),
        migrations.AddField(
            model_name='referencedocumenttype',
            name='name_es',
            field=models.CharField(max_length=64, null=True),
        ),
        migrations.AddField(
            model_name='referencedocumenttype',
            name='name_fr',
            field=models.CharField(max_length=64, null=True),
        ),
        migrations.AddField(
            model_name='referencedocumenttype',
            name='name_pt',
            field=models.CharField(max_length=64, null=True),
        ),
    ]
