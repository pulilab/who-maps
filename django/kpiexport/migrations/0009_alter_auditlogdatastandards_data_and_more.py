# Generated by Django 4.2 on 2023-04-06 13:29

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('kpiexport', '0008_auditloghealthcategories_auditloghfa'),
    ]

    operations = [
        migrations.AlterField(
            model_name='auditlogdatastandards',
            name='data',
            field=models.JSONField(blank=True, default=dict),
        ),
        migrations.AlterField(
            model_name='auditlogdatastandards',
            name='standards',
            field=models.JSONField(blank=True, default=dict),
        ),
        migrations.AlterField(
            model_name='auditloghealthcategories',
            name='categories',
            field=models.JSONField(blank=True, default=dict),
        ),
        migrations.AlterField(
            model_name='auditloghealthcategories',
            name='data',
            field=models.JSONField(blank=True, default=dict),
        ),
        migrations.AlterField(
            model_name='auditloghfa',
            name='data',
            field=models.JSONField(blank=True, default=dict),
        ),
        migrations.AlterField(
            model_name='auditloghfa',
            name='hfa',
            field=models.JSONField(blank=True, default=dict),
        ),
        migrations.AlterField(
            model_name='auditlogprojectstages',
            name='data',
            field=models.JSONField(blank=True, default=dict),
        ),
        migrations.AlterField(
            model_name='auditlogprojectstages',
            name='stages',
            field=models.JSONField(blank=True, default=dict),
        ),
        migrations.AlterField(
            model_name='auditlogprojectstatus',
            name='data',
            field=models.JSONField(blank=True, default=dict),
        ),
        migrations.AlterField(
            model_name='auditlogtokens',
            name='data',
            field=models.JSONField(blank=True, default=dict),
        ),
        migrations.AlterField(
            model_name='auditlogusers',
            name='data',
            field=models.JSONField(blank=True, default=dict),
        ),
    ]