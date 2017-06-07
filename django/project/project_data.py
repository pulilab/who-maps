


project_structure = {
        "strategies": [
            {
                "name": "Client",
                "subGroups": [
                    {
                        "name": "Targeted client communication",
                        "strategies": [
                            "Transmit targeted health event alerts to specific population group(s)",
                            "Transmit targeted health information and promotion content  to a client based on health or demographic characteristics",
                            "Transmit targeted health information and promotion content to a client based on  clinical care plan",
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
                            "Classify disease codes",
                            "Identify and record cause of death"
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
        ],
        "technology_platforms": [
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

        ],
        "licenses": [
            "Public domain",
            "Non protective free and open source software (e.g. Apache)",
            "Protective free and open source software",
            "Freemium",
            "Proprietary"
        ],
        "applications": [
            "Client education and behavior change communication",
            "Sensors point-of-care diagnostics",
            "Registries and vital events tracking",
            "Data collection and reporting",
            "Electronic health records",
            "Electronic decision support (e.g. protocols, algorithms, checklists)",
            "Provider-to-provider communication (e.g. user group, consultations)",
            "Provider work planning and scheduling",
            "Human resource management",
            "Supply chain management",
            "Financial transactions and incentives"
        ],
        "health_focus_areas": [
            "Child health",
            "Family Planning",
            "HIV/AIDS",
            "Infectious Diseases",
            "Malaria and other vector-borne diseases",
            "Maternal health",
            "Newborn heath",
            "Non Communicable Diseases",
            "Nutrition/Food Security",
            "Parasitic diseases",
            "Primary Care",
            "Sexual and Reproductive Health",
            "Tuberculosis",
            "Violence",
            "Water, Sanitation, and Hygiene"
        ],
        "interoperability_links": [
            {"pre": "Yes, links to a ", "name": "client registry"},
            {"pre": "Yes, links to ", "name": "Health Management Information System"},
            {"pre": "Yes, links to a ", "name": "health worker registry"},
            {"pre": "Yes, links to ", "name": "Logistics Management and Supply Chain Information System (LMIS)"},
            {"pre": "Yes, links to ", "name": "digital laboratory information system"},
            {"pre": "Yes, links to a ", "name": "facility registry"},
            {"pre": "Yes, links to a ", "name": "Shared Health Record"},
            {"pre": "Yes, links to a ", "name": "Terminology Service"},
        ],
        "interoperability_standards": [
            "ADX - Aggregate Data Exchange",
            "ATNA - Audit Trail and Node Authentication",
            "BPPC - Basic Patient Privacy Consents",
            "CDA - Clinical Document Architecture",
            "CSD - Care Services Discovery",
            "DICOM",
            "GS1",
            "HL7 v2",
            "HL7 v3",
            "mACM - Mobile Alert Communication Management",
            "MHD - Mobile Access to Health Documents",
            "PIX or PIXm - (Mobile) Patient Identifier Cross Reference",
            "PDQ or PDQm - (Mobile) Patient Demographics Query",
            "SDMX - Statistical Data and Metadata Exchange",
            "XDS - Cross-Enterprise Document Sharing",
            "XUA - Cross-Enterprise User Assertion",
            "HL7 FHIR",
            "SVS - Sharing Value Sets",
            "GML Geography Markup Language",
            "XForms",
            "SNOMED",
            "ICD-10",
            "ISO 3166",
            "ISCO 08",
            "ISCO 88",
            "LOINC",
            "RxNORM",
            "CIEL"

        ],
        "his_bucket": [
            "Census, population information & data warehouse",
            "Civil Registration and Vital Statistics",
            "Client applications",
            "Client communication system",
            "Clinical terminology and classifications",
            "Community Information System",
            "EHR and health information repositories",
            "Electronic Medical Record",
            "Emergency response system",
            "Facility Management Information System",
            "Geographic Information Systems",
            "Health finance and insurance",
            "Health Management Information System",
            "Human Resource Information System",
            "Identification registries and directories",
            "Knowledge Management",
            "Laboratory and Diagnostic System",
            "Learning and Training System",
            "Logistics Management Information System",
            "Pharmacy System",
            "Public health and disease surveillance",
            "Research information system",
            "Data interchange interoperability and accessibility",
            "Environmental monitoring systems",
        ],
        "hsc_challenges": [
            {
                "name": "Information",
                "challenges": [
                    "Lack of population denominator",
                    "Delayed reporting of events",
                    "Lack of quality/reliable data",
                    "Communication roadblocks",
                    "Lack of access to information or data",
                    "Insufficient utilization of data and information",
                    "Lack of unique identifiers"
                ]
            },
            {
                "name": "Availability",
                "challenges": [
                    "Insufficient supply of commodities",
                    "Insufficient supply of services",
                    "Insufficient supply of equipment",
                    "Insufficient supply of qualified health workers",
                ]
            },
            {
                "name": "Quality",
                "challenges": [
                    "Poor patient experience",
                    "Insufficient health worker competence",
                    "Low quality of health commodities",
                    "Insufficient continuity of care",
                    "Insufficient supportive supervision",
                    "Poor adherence to guidelines"
                ]
            },
            {
                "name": "Acceptability",
                "challenges": [
                    "Lack of alignment with local norms",
                    "Not addressing individual beliefs and practices",
                ]
            },
            {
                "name": "Utilization",
                "challenges": [
                    "Low demand for services",
                    "Geographic inaccessibility",
                    "Low adherence to treatments",
                    "Loss to follow-up",
                ]
            },
            {
                "name": "Efficiency",
                "challenges": [
                    "Inadequate workflow management",
                    "Lack of inappropriate referrals",
                    "Poor planning and coordination",
                    "Delayed provision of care",
                    "Inadequate access to transportation",
                    "Inadequate prioritization of clients",
                ]
            }
        ],
        "interventions": [
            {"name": "Contraceptives", "interventions": []},
            {"name": "TB", "interventions": []},
            {"name": "Sexually Transmitted Infections", "interventions": []},
            {"name": "HIV/AIDS Prevention and Treatment", "interventions": []},
            {"name": "Diarrheal Diseases", "interventions": []},
            {"name": "Vaccine-Preventable Diseases", "interventions": []},
            {"name": "Malaria", "interventions": []},
            {"name": "Tropical Diseases", "interventions": []},
            {"name": "Helminth Infections and Schistosomiasis", "interventions": []},
            {"name": "Acute Respiratory Infections in Children", "interventions": []},
            {"name": "Maternal and Perinatal Conditions", "interventions": []},
            {"name": "Pregnancy Care", "interventions": []},
            {"name": "Newborn Survival", "interventions": []},
            {"name": "Stunting, Wasting, and Micronutrient Deficiency Disorders", "interventions": []},
            {"name": "Integrated Management of the Sick Child", "interventions": []},
            {"name": "Cancer Control", "interventions": []},
            {"name": "Diabetes", "interventions": []},
            {"name": "Mental disorders", "interventions": [
                "mental health screening",
                "mental health management and treatment"
            ]},
            {"name": "Oral Health", "interventions": [
                "oral health education and promotion",
                "oral health treatment"
            ]},
            {"name": "Unintentional Injuries", "interventions": [
                "road traffic injuries prevention",
                "poisonings",
                "Fall-related injuries",
                "burn-related injuries",
                "drowning"
            ]},
            {"name": "Interpersonal Violence", "interventions": [
                "prevention strategies"
            ]},
            {"name": "Water Supply, Sanitation, and Hygiene Promotion", "interventions": [
                "safer water",
                "hand washing",
                "hygiene education"
            ]},
            {"name": "Indoor Air Pollution", "interventions": [
                "Source of pollution",
                "Improve living environment",
                "User behaviors"
            ]},
            {"name": "Air and Water Pollution", "interventions": [
                "Interventions to Reduce Air Pollution",
                "Interventions to Reduce Water Pollution",
            ]},
            {"name": "Diet and Lifestyle Changes to prevent chronic disease", "interventions": [
                "Avoid smoking",
                "Pursue physical activity",
                "Avoid overweight",
                "Educational Interventions",
                "Worksite Interventions",
                "Interventions by Health Care Providers",
                "Promote Walking and Bicycle Riding",
                "Promoting Healthy Food Choices"
            ]},
            {"name": "Risk from High Blood Pressure, Cholesterol, and Bodyweight", "interventions": [
                "Interventions to Reduce Bodyweight",
                "Healthy diet (low sodium, high potassium",
                "Physical activity",
                "Medications to lower blood pressure"
            ]},
            {"name": "Tobacco Addiction", "interventions": [
                "smoking cessation treatment",
                "reducing exposure to passive tobacco smoke",
                "preventing initiation among youths and young adults"
            ]},
            {"name": "Alcohol", "interventions": [
                "Education sessions and psychosocial counseling",
                "Population-wide measures"
            ]},
            {"name": "Illicit drug use", "interventions": [
                "voluntary treatment",
                "involuntary treatment"
            ]},
            {"name": "Learning and Developmental Disabilities", "interventions": [
                "Primary prevention to control the underlying cause or condition",
                "Preventing an existing illness or injury from progressing to long-term disability",
                "Rehabilitation and special educational services"
            ]},
            {"name": "Loss of Vision and Hearing", "interventions": [
                "Childhood Blindness",
                "Cataract",
                "Trachoma",
                "Onchocerciasis",
                "Hearing loss screening programs",
                "Hearing loss education",
                "Hearing loss surgery",
                "Hearing loss medications",
                "Hearing loss assistive devices"
            ]},
            {"name": "Interventions for Musculoskeletal Conditions", "interventions": [
                "Preventive strategies",
                "Screening",
                "Symptomatic treatments",
                "Rheumitoid Arthritis",
                "Osteoporosis"
            ]},
            {"name": "Pain Control", "interventions": [
                "Opioid treatment",
                "Non-Opioid treatments and strategies"
            ]},
            {"name": "Health of Adolescents and Youth", "interventions": [
                "School - Based Health and Nutrition Programs",
                "Youth Friendly Facilities",
                "Life - skills and health and sexuality education",
                "Peer education",
                "Mass media and community mobilization",
                "Youth development programs",
                "Social marketing",
                "Workplace and private sector programs"
            ]},
            {"name": "Occupational Health", "interventions": [
                "Strategies for Improving Working Conditions",
                "Improvement of Access to Health Care",
                "Surveillance and Reporting"
            ]},
            {"name": "Natural Disaster Mitigation and Relief", "interventions": [
                "Assessment of the Health Situation",
                "Mass Casualties Treatment",
                "Strengthened Surveillance, Prevention, and Control of CommunicableDiseases",
                "Environmental Health",
                "Transparent Management of Donations and Supplies",
                "Coordination of the Humanitarian Health Effort",
                "Emergency Preparedness of the Health Sector",
                "Prevention and Mitigation"
            ]},
            {"name": "Emergency Medical Services", "interventions": [
                "Paramedics",
                "Lay response",
                "Transportation and communication systems",
                "Ambulatory systems"
            ]}
        ]
}
