# Generated by Django 2.1 on 2018-12-03 10:45

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('project', '0056_historicalprojectapproval_modified'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='digitalstrategy',
            options={'ordering': ['group', 'name'], 'verbose_name_plural': 'Digital Strategies'},
        ),
        migrations.AlterModelOptions(
            name='hscchallenge',
            options={'ordering': ['group', 'name'], 'verbose_name': 'Health System Challenge', 'verbose_name_plural': 'Health System Challenges'},
        ),
        migrations.AlterModelOptions(
            name='hscgroup',
            options={'ordering': ['name'], 'verbose_name': 'Health System Challenge Group'},
        ),
    ]