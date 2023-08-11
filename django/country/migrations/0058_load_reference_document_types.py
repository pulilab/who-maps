# Generated by Django 4.2.3 on 2023-08-11 11:35

from django.db import migrations


def load_reference_document_types(apps, schema_editor):
    ReferenceDocumentType = apps.get_model('country', 'ReferenceDocumentType')

    types = [(412, "Framework"), (55, "Guideline"),
             (333, "Laws and regulations"), (1179, "Monitoring and Evaluation (M&E)"),
             (563, "Operational plan"), (56, "Policy"),
             (411, "Report"), (1167, "Roadmap"),
             (1166, "Standard"), (57, "Strategy")]

    for external_id, name in types:
        ReferenceDocumentType.objects.create(name=name, name_en=name, external_id=external_id)


class Migration(migrations.Migration):

    dependencies = [
        ('country', '0057_referencedocumenttype_name_ar_and_more'),
    ]

    operations = [
        migrations.RunPython(load_reference_document_types)
    ]
