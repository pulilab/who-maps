# Generated manually 2.2.16 on 2021-07-29 11:26

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('kpiexport', '0004_auditlogprojectstages'),
    ]

    operations = [
        migrations.AddField(
            model_name='auditlogprojectstages',
            name='modified',
            field=models.DateTimeField(auto_now=True),
        ),
        migrations.AddField(
            model_name='auditlogprojectstatus',
            name='modified',
            field=models.DateTimeField(auto_now=True),
        ),
        migrations.AddField(
            model_name='auditlogtokens',
            name='modified',
            field=models.DateTimeField(auto_now=True),
        ),
        migrations.AddField(
            model_name='auditlogusers',
            name='modified',
            field=models.DateTimeField(auto_now=True),
        ),
    ]
