# Generated by Django 2.1 on 2020-01-07 13:28

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('user', '0025_auto_20190312_1658'),
        ('project', '0064_auto_20191218_0914'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='technologyplatform',
            options={'verbose_name': 'Software', 'verbose_name_plural': 'Software'},
        ),
        migrations.AddField(
            model_name='technologyplatform',
            name='added_by',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, to='user.UserProfile'),
        ),
        migrations.AddField(
            model_name='technologyplatform',
            name='state',
            field=models.IntegerField(choices=[(1, 'Approved'), (2, 'Pending'), (3, 'Declined')], default=1),
        ),
    ]
