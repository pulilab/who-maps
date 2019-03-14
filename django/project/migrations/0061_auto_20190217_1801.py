# Generated by Django 2.1 on 2019-02-17 18:01

from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('project', '0060_auto_20190213_2135'),
    ]

    operations = [
        migrations.AddField(
            model_name='projectimportv2',
            name='sheet_name',
            field=models.CharField(blank=True, max_length=256, null=True),
        ),
        migrations.AlterUniqueTogether(
            name='projectimportv2',
            unique_together={('user', 'filename', 'sheet_name')},
        ),
    ]