# Generated by Django 4.2.3 on 2023-07-12 14:55

import country.models
import country.validators
from django.db import migrations, models
import django.db.models.deletion
import taggit.managers


class Migration(migrations.Migration):

    dependencies = [
        ('user', '0033_set_password_for_invited_users'),
        ('taggit', '0005_auto_20220424_2025'),
        ('country', '0054_delete_architectureroadmapdocument'),
    ]

    operations = [
        migrations.CreateModel(
            name='ReferenceDocument',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created', models.DateTimeField(auto_now_add=True)),
                ('modified', models.DateTimeField(auto_now=True)),
                ('document', models.FileField(null=True, upload_to='documents/', validators=[country.validators.file_size])),
                ('language', models.CharField(choices=[('en', 'English'), ('fr', 'French'), ('es', 'Spanish'), ('pt', 'Portuguese'), ('ar', 'Arabic'), ('cn', 'Chinese'), ('ru', 'Russian'), ('xx', 'Other')])),
                ('title', models.CharField(max_length=128)),
                ('purpose', models.TextField()),
                ('types', country.models.MultiArrayField(base_field=models.CharField(choices=[('412', 'Framework'), ('55', 'Guideline'), ('333', 'Laws and regulations'), ('1179', 'Monitoring and Evaluation (M&E)'), ('563', 'Operational plan'), ('56', 'Policy'), ('411', 'Report'), ('1167', 'Roadmap'), ('1166', 'Standard'), ('57', 'Strategy')]), size=None)),
                ('valid_from', models.DateField()),
                ('valid_until', models.DateField(blank=True, null=True)),
                ('featured', models.BooleanField(default=False)),
                ('author', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='documents', to='user.userprofile')),
                ('country', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='documents', to='country.country')),
                ('tags', taggit.managers.TaggableManager(blank=True, help_text='A comma-separated list of tags.', through='taggit.TaggedItem', to='taggit.Tag', verbose_name='Tags')),
            ],
            options={
                'ordering': ('featured', 'id', 'title'),
            },
        ),
    ]
