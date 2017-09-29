# -*- coding: utf-8 -*-
# Generated by Django 1.10.6 on 2017-09-21 15:45
from __future__ import unicode_literals

from django.db import migrations

digital_strategies = [
    {
        "name": "Client",
        "subGroups": [
            {
                "name": "Targeted client communication",
                "strategies": [
                    "Transmit targeted health event alerts to specific population group(s)",
                    "Transmit targeted health information and promotion content to a client based on a clinical care plan or health/demographic characteristics",
                    "Transmit targeted alerts and reminders to a client"
                ]
            },
            {
                "name": "Untargeted client communication",
                "strategies": [
                    "Transmit untargeted health promotion content to entire population",
                    "Transmit untargeted health event alerts to entire population"
                ]
            },
            {
                "name": "Client to client communication",
                "strategies": [
                    "Peer group for clients"
                ]
            },
            {
                "name": "Client to provider telemedicine",
                "strategies": [
                    "Consultations between remote client and health worker or helpline",
                    "Remote monitoring of client health or diagnostic data by provider",
                    "Transmission of medical data (e.g. images, notes, and videos) from client to provider"
                ]
            },
            {
                "name": "Citizen based reporting",
                "strategies": [
                    "Reporting of health system feedback by clients",
                    "Reporting of public health events by clients"
                ]
            },
            {
                "name": "On demand information services to clients",
                "strategies": [
                    "Client look-up of health information",
                ]
            },
            {
                "name": "Client financial transactions",
                "strategies": [
                    "Transmit or manage out of pocket payments by client",
                    "Transmit or manage vouchers to client for health services",
                    "Transmit or manage incentives to clients for health services"
                ]
            },
            {
                "name": "Personal health tracking",
                "strategies": [
                    "Access by client to own medical records",
                    "Self monitoring of health or diagnostic data by client",
                    "Active data capture by client"
                ]
            }
        ]
    },
    {
        "name": "Provider",
        "subGroups": [
            {
                "name": "Client identification and registration",
                "strategies": [
                    "Verify client unique identity",
                    "Enroll client for health services/clinical care plan"
                ]
            },
            {
                "name": "Client health records",
                "strategies": [
                    "Track client's health and services within a longitudinal care plan",
                    "Manage client's structured records",
                    "Manage client's unstructured clinical records (e.g. notes, images, documents)"
                ]
            },
            {
                "name": "Provider based decision support",
                "strategies": [
                    "Guide through process algorithms according to clinical protocol",
                    "Provide checklist according to clinical protocol",
                    "Screen clients by risk or other health status"
                ]
            },
            {
                "name": "Provider work planning and scheduling",
                "strategies": [
                    "Schedule client appointments based on clinical care plan",
                    "Schedule health worker activities"
                ]
            },
            {
                "name": "Provider to provider communication",
                "strategies": [
                    "Health worker to health worker telemedicine for patient case management ",
                    "Health worker peer group"
                ]
            },
            {
                "name": "Referral coordination",
                "strategies": [
                    "Coordinate emergency response and transport",
                    "Manage referrals between points of service within health sector ",
                    "Manage referrals between health and other sectors (social services, police, justice, economic support schemes)"
                ]
            },
            {
                "name": "Targeted provider communication",
                "strategies": [
                    "Transmit routine news and updates to health workers",
                    "Transmit non-routine public health event alerts to health workers",
                    "Transmit clinical care workflow alerts to health worker",
                    "Provide supervisory and performance feedback"
                ]
            },
            {
                "name": "HW training",
                "strategies": [
                    "Provide training content to health workers ",
                    "Record health worker training information",
                    "Manage health worker license and registration",
                    "Assess health worker capacity "

                ]
            },
            {
                "name": "HR management",
                "strategies": [
                    "List health workforce cadres and related information",
                    "Monitor health worker performance",
                ]
            }
        ]
    },
    {
        "name": "System",
        "subGroups": [
            {
                "name": "Commodity assessment and reporting",
                "strategies": [
                    "Report counterfeit or substandard drugs by clients",
                    "Report adverse drug interactions",
                    "Register licensed drugs and health commodities"
                ]
            },
            {
                "name": "Data collection management and use",
                "strategies": [
                    "Routine health indicator data collection and management",
                    "Non routine data collection and management",
                    "Data storage and aggregation",
                    "Data synthesis and presentations/visualizations of data",
                    "Automated analysis of data to generate new information or predictions on future events"
                ]
            },
            {
                "name": "Prescription management",
                "strategies": [
                    "Transmit prescriptions orders",
                    "Track status of prescription orders",
                    "Track consumption of health commodities"

                ]
            },
            {
                "name": "Equipment and asset management",
                "strategies": [
                    "Monitor status of health equipment",
                    "Track regulation and licensing of medical equipment",
                ]
            },
            {
                "name": "Provider financial transactions",
                "strategies": [
                    "Transmit or manage routine payroll payment to health workers",
                    "Transmit or manage incentives to health workers"
                ]
            },
            {
                "name": "Insurance",
                "strategies": [
                    "Register and verify client insurance membership",
                    "Track insurance billing and claims submission",
                    "Track and manage insurance reimbursement"
                ]
            },
            {
                "name": "Laboratory and diagnostics management",
                "strategies": [
                    "Transmit diagnostics result, or availability of result, to clients",
                    "Transmit diagnostic orders",
                    "Track biological specimens "
                ]
            },
            {
                "name": "CRVS",
                "strategies": [
                    "Notify birth event to health system",
                    "Register birth event within health system",
                    "Certify birth event within health system",
                    "Notify death event to health system",
                    "Register death event within health system",
                    "Certify death event within health system"
                ]
            },
            {
                "name": "Public health event notification",
                "strategies": [
                    "Notification of public health events from point of diagnosis",
                ]
            },
            {
                "name": "Data coding",
                "strategies": [
                    "Parse unstructured data into structured data",
                    "Merge, de-duplicate and curate coded/standardized datasets or terminologies",
                    "Classify disease codes"
                ]
            },
            {
                "name": "Facility management",
                "strategies": [
                    "List health facilities and related information",
                    "Assess health facilities"
                ]
            },
            {
                "name": "Budget and expenditure management",
                "strategies": [
                    "Manage budget and expenditures"
                ]
            },
            {
                "name": "Location mapping",
                "strategies": [
                    "Map location of health facilities",
                    "Map location of health event",
                    "Demarcate of catchment area",
                    "Map location of health workers"
                ]
            }
        ]
    }
]

technology_platforms = [
    "Adobe Forms",
    "Bamboo",
    "Capatricy",
    "Commcare",
    "Crowd Map",
    "Data Winners",
    "DHIS2",
    "emocha",
    "Enketo",
    "Epi Collect",
    "FormHub",
    "Frontline SMS",
    "iFormBuilder",
    "IVR",
    "Kobo",
    "Kookoo",
    "Kujua",
    "Magpi",
    "Motech",
    "Muvuku",
    "ODK",
    "Ona",
    "OpenMRS",
    "OpenSRP",
    "OpenXData",
    "Pendragon",
    "REDcap",
    "RapidSMS",
    "RapidPro",
    "SMS",
    "Survey CTO",
    "Textit",
    "Usahidi",
    "USSD",
    "Voice",
    "HAPI FHIR",
    "OpenLIS",
    "OpenHMIS",
    "GNU Health",
    "OpenLMIS",
    "OpenHIM",
    "HEARTH",
    "Mirth",
    "MOTECH",
    "ResourceMap",
    "GeoNode"
]

interoperability_links = [
    {"pre": "Yes, links to a ", "name": "Client Registry"},
    {"pre": "Yes, links to ", "name": "Health Management Information System (HMIS)"},
    {"pre": "Yes, links to a ", "name": "Health Worker Registry"},
    {"pre": "Yes, links to ", "name": "Logistics Management and Supply Chain Information System (LMIS)"},
    {"pre": "Yes, links to ", "name": "Laboratory Information System"},
    {"pre": "Yes, links to a ", "name": "Facility Registry"},
    {"pre": "Yes, links to a ", "name": "Shared Health Record"},
    {"pre": "Yes, links to a ", "name": "Terminology Service"},
]


def convert_static(apps, schema_editor):
    TechnologyPlatform = apps.get_model('project', 'TechnologyPlatform')
    for platform in technology_platforms:
        TechnologyPlatform.all_objects.create(name=platform)

    InteroperabilityLink = apps.get_model('project', 'InteroperabilityLink')
    for interop in interoperability_links:
        InteroperabilityLink.all_objects.create(pre=interop['pre'], name=interop['name'])

    DigitalStrategy = apps.get_model('project', 'DigitalStrategy')
    for group in digital_strategies:
        for parent in group['subGroups']:
            item = DigitalStrategy.all_objects.create(group=group['name'], name=parent['name'])
            for strat in parent['strategies']:
                DigitalStrategy.all_objects.create(group=group['name'], name=strat, parent=item)


class Migration(migrations.Migration):

    dependencies = [
        ('project', '0020_digitalstrategy_interoperabilitylink_technologyplatform'),
    ]

    operations = [
        migrations.RunPython(convert_static),
    ]
