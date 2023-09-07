# Generated by Django 4.2.3 on 2023-08-11 11:33

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('country', '0055_referencedocument'),
    ]

    operations = [
        migrations.CreateModel(
            name='ReferenceDocumentType',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=64)),
                ('external_id', models.IntegerField(verbose_name='Better eHealth ID')),
            ],
        ),
        migrations.RemoveField(
            model_name='referencedocument',
            name='types',
        ),
        migrations.AddField(
            model_name='referencedocument',
            name='document_types',
            field=models.ManyToManyField(to='country.referencedocumenttype'),
        ),
    ]