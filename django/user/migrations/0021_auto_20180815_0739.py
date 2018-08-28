# Generated by Django 2.0.7 on 2018-08-15 07:39

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('user', '0020_auto_20180815_0722'),
    ]

    operations = [
        migrations.AlterField(
            model_name='userprofile',
            name='account_type',
            field=models.CharField(choices=[('I', 'Implementer'), ('D', 'Financial Investor'), ('DA', 'Donor Admin'), ('SDA', 'Super Donor Admin'), ('G', 'Government'), ('CA', 'Country Admin'), ('SCA', 'Super Country Admin'), ('Y', 'Inventory User')], default='I', max_length=3),
        ),
    ]
