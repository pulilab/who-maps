# Generated by Django 2.1 on 2019-12-18 09:14

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('project', '0063_importrow_original_data'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='projectimport',
            name='user',
        ),
        migrations.DeleteModel(
            name='ProjectImport',
        ),
    ]