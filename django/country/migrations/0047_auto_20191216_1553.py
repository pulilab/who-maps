# Generated by Django 2.1 on 2019-12-16 15:53

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('country', '0046_auto_20190205_1052'),
    ]

    operations = [
        migrations.CreateModel(
            name='ArchitectureRoadMapDocument',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.CharField(max_length=128)),
                ('document', models.FileField(null=True, upload_to='documents/')),
            ],
        ),
        migrations.AddField(
            model_name='country',
            name='alpha_3_code',
            field=models.CharField(blank=True, max_length=3, null=True),
        ),
        migrations.AddField(
            model_name='country',
            name='gdhi_enabled',
            field=models.BooleanField(default=True),
        ),
        migrations.AddField(
            model_name='country',
            name='gni_per_capita',
            field=models.DecimalField(blank=True, decimal_places=2, max_digits=7, null=True, verbose_name='GNI per capita in Thousands'),
        ),
        migrations.AddField(
            model_name='country',
            name='health_expenditure',
            field=models.DecimalField(blank=True, decimal_places=2, max_digits=5, null=True, verbose_name='Health expenditure (% of GDP)'),
        ),
        migrations.AddField(
            model_name='country',
            name='infrastructure',
            field=models.PositiveSmallIntegerField(blank=True, choices=[(1, 'Phase 1'), (2, 'Phase 2'), (3, 'Phase 3'), (4, 'Phase 4'), (5, 'Phase 5')], null=True),
        ),
        migrations.AddField(
            model_name='country',
            name='leadership_and_governance',
            field=models.PositiveSmallIntegerField(blank=True, choices=[(1, 'Phase 1'), (2, 'Phase 2'), (3, 'Phase 3'), (4, 'Phase 4'), (5, 'Phase 5')], null=True),
        ),
        migrations.AddField(
            model_name='country',
            name='legislation_policy_compliance',
            field=models.PositiveSmallIntegerField(blank=True, choices=[(1, 'Phase 1'), (2, 'Phase 2'), (3, 'Phase 3'), (4, 'Phase 4'), (5, 'Phase 5')], null=True),
        ),
        migrations.AddField(
            model_name='country',
            name='life_expectancy',
            field=models.DecimalField(blank=True, decimal_places=2, max_digits=5, null=True, verbose_name='Life expectancy at birth (years)'),
        ),
        migrations.AddField(
            model_name='country',
            name='road_map_enabled',
            field=models.BooleanField(default=False),
        ),
        migrations.AddField(
            model_name='country',
            name='services_and_applications',
            field=models.PositiveSmallIntegerField(blank=True, choices=[(1, 'Phase 1'), (2, 'Phase 2'), (3, 'Phase 3'), (4, 'Phase 4'), (5, 'Phase 5')], null=True),
        ),
        migrations.AddField(
            model_name='country',
            name='standards_and_interoperability',
            field=models.PositiveSmallIntegerField(blank=True, choices=[(1, 'Phase 1'), (2, 'Phase 2'), (3, 'Phase 3'), (4, 'Phase 4'), (5, 'Phase 5')], null=True),
        ),
        migrations.AddField(
            model_name='country',
            name='strategy_and_investment',
            field=models.PositiveSmallIntegerField(blank=True, choices=[(1, 'Phase 1'), (2, 'Phase 2'), (3, 'Phase 3'), (4, 'Phase 4'), (5, 'Phase 5')], null=True),
        ),
        migrations.AddField(
            model_name='country',
            name='total_population',
            field=models.DecimalField(blank=True, decimal_places=2, max_digits=7, null=True, verbose_name='Total population in Millions'),
        ),
        migrations.AddField(
            model_name='country',
            name='workforce',
            field=models.PositiveSmallIntegerField(blank=True, choices=[(1, 'Phase 1'), (2, 'Phase 2'), (3, 'Phase 3'), (4, 'Phase 4'), (5, 'Phase 5')], null=True),
        ),
        migrations.AddField(
            model_name='architectureroadmapdocument',
            name='country',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='documents', to='country.Country'),
        ),
    ]
