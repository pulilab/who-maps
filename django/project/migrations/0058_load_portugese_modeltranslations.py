# -*- coding: utf-8 -*-
# Generated by Django 1.10.6 on 2018-01-30 11:38
from __future__ import unicode_literals

from django.db import migrations
from django.core.management import call_command

TECHNOLOGY_PLATFORMS = [
    {
        "model": "project.technologyplatform",
        "pk": 1,
        "fields": {
            "created": "2017-12-01T14:26:49.085Z",
            "modified": "2018-01-22T10:01:22.995Z",
            "is_active": True,
            "name": "Adobe Forms",
            "name_en": "Adobe Forms",
            "name_fr": "",
            "name_es": "",
            "name_pt": "Formul\u00e1rios de Adobe"
        }
    },
    {
        "model": "project.technologyplatform",
        "pk": 2,
        "fields": {
            "created": "2017-12-01T14:26:49.088Z",
            "modified": "2018-01-22T10:07:16.526Z",
            "is_active": True,
            "name": "Bamboo",
            "name_en": "Bamboo",
            "name_fr": "",
            "name_es": "",
            "name_pt": "Bamboo"
        }
    },
    {
        "model": "project.technologyplatform",
        "pk": 3,
        "fields": {
            "created": "2017-12-01T14:26:49.089Z",
            "modified": "2018-01-22T10:10:03.844Z",
            "is_active": True,
            "name": "Capatricy",
            "name_en": "Capatricy",
            "name_fr": "",
            "name_es": "",
            "name_pt": "Capatricy"
        }
    },
    {
        "model": "project.technologyplatform",
        "pk": 4,
        "fields": {
            "created": "2017-12-01T14:26:49.090Z",
            "modified": "2018-01-22T10:10:18.208Z",
            "is_active": True,
            "name": "Commcare",
            "name_en": "Commcare",
            "name_fr": "",
            "name_es": "",
            "name_pt": "Commcare"
        }
    },
    {
        "model": "project.technologyplatform",
        "pk": 5,
        "fields": {
            "created": "2017-12-01T14:26:49.091Z",
            "modified": "2018-01-23T01:47:12.451Z",
            "is_active": True,
            "name": "Crowd Map",
            "name_en": "Crowd Map",
            "name_fr": "",
            "name_es": "",
            "name_pt": "Crowd Map"
        }
    },
    {
        "model": "project.technologyplatform",
        "pk": 6,
        "fields": {
            "created": "2017-12-01T14:26:49.092Z",
            "modified": "2018-01-29T12:29:19.135Z",
            "is_active": True,
            "name": "Data Winners",
            "name_en": "Data Winners",
            "name_fr": "",
            "name_es": "",
            "name_pt": "Vencedores de Dados"
        }
    },
    {
        "model": "project.technologyplatform",
        "pk": 7,
        "fields": {
            "created": "2017-12-01T14:26:49.092Z",
            "modified": "2018-01-23T01:48:00.638Z",
            "is_active": True,
            "name": "DHIS2",
            "name_en": "DHIS2",
            "name_fr": "",
            "name_es": "",
            "name_pt": "DHIS2"
        }
    },
    {
        "model": "project.technologyplatform",
        "pk": 8,
        "fields": {
            "created": "2017-12-01T14:26:49.093Z",
            "modified": "2018-01-23T01:48:17.519Z",
            "is_active": True,
            "name": "emocha",
            "name_en": "emocha",
            "name_fr": "",
            "name_es": "",
            "name_pt": "emocha"
        }
    },
    {
        "model": "project.technologyplatform",
        "pk": 9,
        "fields": {
            "created": "2017-12-01T14:26:49.095Z",
            "modified": "2018-01-23T01:48:39.881Z",
            "is_active": True,
            "name": "Enketo",
            "name_en": "Enketo",
            "name_fr": "",
            "name_es": "",
            "name_pt": "Enketo"
        }
    },
    {
        "model": "project.technologyplatform",
        "pk": 10,
        "fields": {
            "created": "2017-12-01T14:26:49.095Z",
            "modified": "2018-01-23T07:54:40.425Z",
            "is_active": True,
            "name": "Epi Collect",
            "name_en": "Epi Collect",
            "name_fr": "",
            "name_es": "",
            "name_pt": "Epi Collect"
        }
    },
    {
        "model": "project.technologyplatform",
        "pk": 11,
        "fields": {
            "created": "2017-12-01T14:26:49.096Z",
            "modified": "2018-01-26T09:40:01.200Z",
            "is_active": True,
            "name": "FormHub",
            "name_en": "FormHub",
            "name_fr": "",
            "name_es": "",
            "name_pt": "FormHub"
        }
    },
    {
        "model": "project.technologyplatform",
        "pk": 12,
        "fields": {
            "created": "2017-12-01T14:26:49.097Z",
            "modified": "2018-01-29T12:22:17.317Z",
            "is_active": True,
            "name": "Frontline SMS",
            "name_en": "Frontline SMS",
            "name_fr": "",
            "name_es": "",
            "name_pt": "SMS de Alerta"
        }
    },
    {
        "model": "project.technologyplatform",
        "pk": 13,
        "fields": {
            "created": "2017-12-01T14:26:49.098Z",
            "modified": "2018-01-26T09:45:48.698Z",
            "is_active": True,
            "name": "iFormBuilder",
            "name_en": "iFormBuilder",
            "name_fr": "",
            "name_es": "",
            "name_pt": "iFormBuilder"
        }
    },
    {
        "model": "project.technologyplatform",
        "pk": 14,
        "fields": {
            "created": "2017-12-01T14:26:49.099Z",
            "modified": "2018-01-26T09:53:03.172Z",
            "is_active": True,
            "name": "IVR",
            "name_en": "IVR",
            "name_fr": "",
            "name_es": "",
            "name_pt": "IVR"
        }
    },
    {
        "model": "project.technologyplatform",
        "pk": 15,
        "fields": {
            "created": "2017-12-01T14:26:49.100Z",
            "modified": "2018-01-26T09:52:32.413Z",
            "is_active": True,
            "name": "Kobo",
            "name_en": "Kobo",
            "name_fr": "",
            "name_es": "",
            "name_pt": "Kobo"
        }
    },
    {
        "model": "project.technologyplatform",
        "pk": 16,
        "fields": {
            "created": "2017-12-01T14:26:49.100Z",
            "modified": "2018-01-26T09:52:02.291Z",
            "is_active": True,
            "name": "Kookoo",
            "name_en": "Kookoo",
            "name_fr": "",
            "name_es": "",
            "name_pt": "Kookoo"
        }
    },
    {
        "model": "project.technologyplatform",
        "pk": 17,
        "fields": {
            "created": "2017-12-01T14:26:49.101Z",
            "modified": "2018-01-26T09:51:23.734Z",
            "is_active": False,
            "name": "Kujua",
            "name_en": "Kujua",
            "name_fr": "",
            "name_es": "",
            "name_pt": "Kujua"
        }
    },
    {
        "model": "project.technologyplatform",
        "pk": 18,
        "fields": {
            "created": "2017-12-01T14:26:49.103Z",
            "modified": "2018-01-26T09:50:57.358Z",
            "is_active": True,
            "name": "Magpi",
            "name_en": "Magpi",
            "name_fr": "",
            "name_es": "",
            "name_pt": "Magpi"
        }
    },
    {
        "model": "project.technologyplatform",
        "pk": 19,
        "fields": {
            "created": "2017-12-01T14:26:49.103Z",
            "modified": "2018-01-26T09:50:04.433Z",
            "is_active": True,
            "name": "Motech",
            "name_en": "Motech",
            "name_fr": "",
            "name_es": "",
            "name_pt": "Motech"
        }
    },
    {
        "model": "project.technologyplatform",
        "pk": 20,
        "fields": {
            "created": "2017-12-01T14:26:49.104Z",
            "modified": "2018-01-26T09:49:22.477Z",
            "is_active": True,
            "name": "Muvuku",
            "name_en": "Muvuku",
            "name_fr": "",
            "name_es": "",
            "name_pt": "Muvuku"
        }
    },
    {
        "model": "project.technologyplatform",
        "pk": 21,
        "fields": {
            "created": "2017-12-01T14:26:49.105Z",
            "modified": "2018-01-26T09:48:32.259Z",
            "is_active": True,
            "name": "ODK",
            "name_en": "ODK",
            "name_fr": "",
            "name_es": "",
            "name_pt": "ODK"
        }
    },
    {
        "model": "project.technologyplatform",
        "pk": 22,
        "fields": {
            "created": "2017-12-01T14:26:49.106Z",
            "modified": "2018-01-26T09:47:19.206Z",
            "is_active": True,
            "name": "Ona",
            "name_en": "Ona",
            "name_fr": "",
            "name_es": "",
            "name_pt": "Ona"
        }
    },
    {
        "model": "project.technologyplatform",
        "pk": 23,
        "fields": {
            "created": "2017-12-01T14:26:49.107Z",
            "modified": "2018-01-23T01:45:40.425Z",
            "is_active": True,
            "name": "OpenMRS",
            "name_en": "OpenMRS",
            "name_fr": "",
            "name_es": "",
            "name_pt": "OpenMRS"
        }
    },
    {
        "model": "project.technologyplatform",
        "pk": 24,
        "fields": {
            "created": "2017-12-01T14:26:49.107Z",
            "modified": "2018-01-23T01:45:22.911Z",
            "is_active": True,
            "name": "OpenSRP",
            "name_en": "OpenSRP",
            "name_fr": "",
            "name_es": "",
            "name_pt": "OpenSRP"
        }
    },
    {
        "model": "project.technologyplatform",
        "pk": 25,
        "fields": {
            "created": "2017-12-01T14:26:49.108Z",
            "modified": "2018-01-23T01:44:58.966Z",
            "is_active": True,
            "name": "OpenXData",
            "name_en": "OpenXData",
            "name_fr": "",
            "name_es": "",
            "name_pt": "OpenXData"
        }
    },
    {
        "model": "project.technologyplatform",
        "pk": 26,
        "fields": {
            "created": "2017-12-01T14:26:49.109Z",
            "modified": "2018-01-23T01:43:55.170Z",
            "is_active": True,
            "name": "Pendragon",
            "name_en": "Pendragon",
            "name_fr": "",
            "name_es": "",
            "name_pt": "Pendragon"
        }
    },
    {
        "model": "project.technologyplatform",
        "pk": 27,
        "fields": {
            "created": "2017-12-01T14:26:49.110Z",
            "modified": "2018-01-23T01:43:17.409Z",
            "is_active": True,
            "name": "REDcap",
            "name_en": "REDcap",
            "name_fr": "",
            "name_es": "",
            "name_pt": "REDcap"
        }
    },
    {
        "model": "project.technologyplatform",
        "pk": 28,
        "fields": {
            "created": "2017-12-01T14:26:49.111Z",
            "modified": "2018-01-23T01:43:36.715Z",
            "is_active": True,
            "name": "RapidSMS",
            "name_en": "RapidSMS",
            "name_fr": "",
            "name_es": "",
            "name_pt": "RapidSMS"
        }
    },
    {
        "model": "project.technologyplatform",
        "pk": 29,
        "fields": {
            "created": "2017-12-01T14:26:49.112Z",
            "modified": "2018-01-23T01:44:26.635Z",
            "is_active": True,
            "name": "RapidPro",
            "name_en": "RapidPro",
            "name_fr": "",
            "name_es": "",
            "name_pt": "RapidPro"
        }
    },
    {
        "model": "project.technologyplatform",
        "pk": 30,
        "fields": {
            "created": "2017-12-01T14:26:49.112Z",
            "modified": "2018-01-23T01:42:07.121Z",
            "is_active": True,
            "name": "SMS",
            "name_en": "SMS",
            "name_fr": "",
            "name_es": "",
            "name_pt": "SMS"
        }
    },
    {
        "model": "project.technologyplatform",
        "pk": 31,
        "fields": {
            "created": "2017-12-01T14:26:49.113Z",
            "modified": "2018-01-26T09:54:51.248Z",
            "is_active": True,
            "name": "Survey CTO",
            "name_en": "Survey CTO",
            "name_fr": "",
            "name_es": "",
            "name_pt": "Pesquisa CTO"
        }
    },
    {
        "model": "project.technologyplatform",
        "pk": 32,
        "fields": {
            "created": "2017-12-01T14:26:49.114Z",
            "modified": "2018-01-23T01:40:16.890Z",
            "is_active": True,
            "name": "Textit",
            "name_en": "Textit",
            "name_fr": "",
            "name_es": "",
            "name_pt": "Textit"
        }
    },
    {
        "model": "project.technologyplatform",
        "pk": 33,
        "fields": {
            "created": "2017-12-01T14:26:49.115Z",
            "modified": "2018-01-23T01:39:59.848Z",
            "is_active": True,
            "name": "Usahidi",
            "name_en": "Usahidi",
            "name_fr": "",
            "name_es": "",
            "name_pt": "Usahidi"
        }
    },
    {
        "model": "project.technologyplatform",
        "pk": 34,
        "fields": {
            "created": "2017-12-01T14:26:49.116Z",
            "modified": "2018-01-23T01:39:32.569Z",
            "is_active": True,
            "name": "USSD",
            "name_en": "USSD",
            "name_fr": "",
            "name_es": "",
            "name_pt": "USSD"
        }
    },
    {
        "model": "project.technologyplatform",
        "pk": 35,
        "fields": {
            "created": "2017-12-01T14:26:49.117Z",
            "modified": "2018-01-23T01:39:15.386Z",
            "is_active": True,
            "name": "Voice",
            "name_en": "Voice",
            "name_fr": "",
            "name_es": "",
            "name_pt": "Voz"
        }
    },
    {
        "model": "project.technologyplatform",
        "pk": 36,
        "fields": {
            "created": "2017-12-01T14:26:49.117Z",
            "modified": "2018-01-26T09:44:25.798Z",
            "is_active": True,
            "name": "HAPI FHIR",
            "name_en": "HAPI FHIR",
            "name_fr": "",
            "name_es": "",
            "name_pt": "HAPI FHIR"
        }
    },
    {
        "model": "project.technologyplatform",
        "pk": 37,
        "fields": {
            "created": "2017-12-01T14:26:49.119Z",
            "modified": "2018-01-23T01:46:42.077Z",
            "is_active": True,
            "name": "OpenLIS",
            "name_en": "OpenLIS",
            "name_fr": "",
            "name_es": "",
            "name_pt": "OpenLIS"
        }
    },
    {
        "model": "project.technologyplatform",
        "pk": 38,
        "fields": {
            "created": "2017-12-01T14:26:49.120Z",
            "modified": "2018-01-26T09:46:24.036Z",
            "is_active": True,
            "name": "OpenHMIS",
            "name_en": "OpenHMIS",
            "name_fr": "",
            "name_es": "",
            "name_pt": "OpenHMIS"
        }
    },
    {
        "model": "project.technologyplatform",
        "pk": 39,
        "fields": {
            "created": "2017-12-01T14:26:49.120Z",
            "modified": "2018-01-26T09:44:02.001Z",
            "is_active": True,
            "name": "GNU Health",
            "name_en": "GNU Health",
            "name_fr": "",
            "name_es": "",
            "name_pt": "GNU Health"
        }
    },
    {
        "model": "project.technologyplatform",
        "pk": 40,
        "fields": {
            "created": "2017-12-01T14:26:49.121Z",
            "modified": "2018-01-23T01:46:19.585Z",
            "is_active": True,
            "name": "OpenLMIS",
            "name_en": "OpenLMIS",
            "name_fr": "",
            "name_es": "",
            "name_pt": "OpenLMIS"
        }
    },
    {
        "model": "project.technologyplatform",
        "pk": 41,
        "fields": {
            "created": "2017-12-01T14:26:49.122Z",
            "modified": "2018-01-26T09:46:59.002Z",
            "is_active": True,
            "name": "OpenHIM",
            "name_en": "OpenHIM",
            "name_fr": "",
            "name_es": "",
            "name_pt": "OpenHIM"
        }
    },
    {
        "model": "project.technologyplatform",
        "pk": 42,
        "fields": {
            "created": "2017-12-01T14:26:49.123Z",
            "modified": "2018-01-26T09:44:47.716Z",
            "is_active": True,
            "name": "HEARTH",
            "name_en": "HEARTH",
            "name_fr": "",
            "name_es": "",
            "name_pt": "HEARTH"
        }
    },
    {
        "model": "project.technologyplatform",
        "pk": 43,
        "fields": {
            "created": "2017-12-01T14:26:49.124Z",
            "modified": "2018-01-26T09:50:29.628Z",
            "is_active": True,
            "name": "Mirth",
            "name_en": "Mirth",
            "name_fr": "",
            "name_es": "",
            "name_pt": "Mirth"
        }
    },
    {
        "model": "project.technologyplatform",
        "pk": 44,
        "fields": {
            "created": "2017-12-01T14:26:49.124Z",
            "modified": "2018-01-26T09:49:42.327Z",
            "is_active": True,
            "name": "MOTECH",
            "name_en": "MOTECH",
            "name_fr": "",
            "name_es": "",
            "name_pt": "MOTECH"
        }
    },
    {
        "model": "project.technologyplatform",
        "pk": 45,
        "fields": {
            "created": "2017-12-01T14:26:49.125Z",
            "modified": "2018-01-23T01:42:58.423Z",
            "is_active": True,
            "name": "ResourceMap",
            "name_en": "ResourceMap",
            "name_fr": "",
            "name_es": "",
            "name_pt": "ResourceMap"
        }
    },
    {
        "model": "project.technologyplatform",
        "pk": 46,
        "fields": {
            "created": "2017-12-01T14:26:49.126Z",
            "modified": "2018-01-26T09:43:25.459Z",
            "is_active": True,
            "name": "GeoNode",
            "name_en": "GeoNode",
            "name_fr": "",
            "name_es": "",
            "name_pt": "GeoNode"
        }
    },
    {
        "model": "project.technologyplatform",
        "pk": 47,
        "fields": {
            "created": "2017-12-01T14:26:59.819Z",
            "modified": "2018-01-23T01:38:58.553Z",
            "is_active": True,
            "name": "Vumi",
            "name_en": "Vumi",
            "name_fr": "",
            "name_es": "",
            "name_pt": "Vumi"
        }
    },
    {
        "model": "project.technologyplatform",
        "pk": 48,
        "fields": {
            "created": "2017-12-01T14:26:59.823Z",
            "modified": "2018-01-26T09:38:10.327Z",
            "is_active": True,
            "name": "Custom Built from eHA",
            "name_en": "Custom Built from eHA",
            "name_fr": "",
            "name_es": "",
            "name_pt": "Personalizado a partir de eHA"
        }
    },
    {
        "model": "project.technologyplatform",
        "pk": 49,
        "fields": {
            "created": "2017-12-01T14:26:59.826Z",
            "modified": "2018-01-26T09:45:12.759Z",
            "is_active": True,
            "name": "Hoji",
            "name_en": "Hoji",
            "name_fr": "",
            "name_es": "",
            "name_pt": "Hoji"
        }
    }
]

PT_TRANSLATIONS = [
    '2018_01_30__licence_pt.json',
    # '2018_01_30__istandard_pt.json',
    '2018_01_30__ilink_pt.json',
    '2018_01_30__his_pt.json',
    '2018_01_30__hfa_pt.json',
    '2018_01_30__hscgroup_pt.json',
    '2018_01_30__hc_pt.json',
    '2018_01_30__ds_pt.json',
    # '2018_01_30__hscchallange_pt.json'
]


def load_technology_platform_pt_translations(apps, schema_editor):
    TechnologyPlatform = apps.get_model("project", "TechnologyPlatform")
    from operator import itemgetter
    softwares = sorted(TECHNOLOGY_PLATFORMS, key=itemgetter('pk'))

    for software in softwares:
        try:
            software_object = TechnologyPlatform.objects.get(pk=software['pk'])
        except TechnologyPlatform.DoesNotExist:
            TechnologyPlatform.objects.create(
                is_active=software['fields']['is_active'],
                name=software['fields']['name'],
                name_en=software['fields']['name_en'],
                name_fr=software['fields']['name_fr'],
                name_es=software['fields']['name_es'],
                name_pt=software['fields']['name_pt'],
            )
        else:
            software_object.is_active = software['fields']['is_active']
            software_object.name = software['fields']['name']
            software_object.name_en = software['fields']['name_en']
            software_object.name_fr = software['fields']['name_fr']
            software_object.name_es = software['fields']['name_es']
            software_object.name_pt = software['fields']['name_pt']
            software_object.save()


def load_fixture(apps, schema_editor):
    for fixture in PT_TRANSLATIONS:
        call_command('loaddata', fixture)


class Migration(migrations.Migration):

    dependencies = [
        ('project', '0057_auto_20190205_1052')
    ]

    operations = [
        migrations.RunPython(load_technology_platform_pt_translations),
        migrations.RunPython(load_fixture),
    ]
