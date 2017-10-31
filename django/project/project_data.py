from django.utils.translation import ugettext_lazy as ugettext_lazy


_ = lambda x: str(ugettext_lazy(x))

project_structure = {
    "strategies": [
        {
            "name": _("Client"),
            "subGroups": [
                {
                    "name": _("Targeted client communication"),
                    "strategies": [
                        _("Transmit targeted health event alerts to specific population group(s)"),
                        _("Transmit targeted health information and promotion content to a client based on a clinical care plan or health/demographic characteristics"),
                        _("Transmit targeted alerts and reminders to a client")
                    ]
                },
                {
                    "name": _("Untargeted client communication"),
                    "strategies": [
                        _("Transmit untargeted health promotion content to entire population"),
                        _("Transmit untargeted health event alerts to entire population")
                    ]
                },
                {
                    "name": _("Client to client communication"),
                    "strategies": [
                        _("Peer group for clients")
                    ]
                },
                {
                    "name": _("Client to provider telemedicine"),
                    "strategies": [
                        _("Consultations between remote client and health worker or helpline"),
                        _("Remote monitoring of client health or diagnostic data by provider"),
                        _("Transmission of medical data (e.g. images, notes, and videos) from client to provider")
                    ]
                },
                {
                    "name": _("Citizen based reporting"),
                    "strategies": [
                        _("Reporting of health system feedback by clients"),
                        _("Reporting of public health events by clients")
                    ]
                },
                {
                    "name": _("On demand information services to clients"),
                    "strategies": [
                        _("Client look-up of health information"),
                    ]
                },
                {
                    "name": _("Client financial transactions"),
                    "strategies": [
                        _("Transmit or manage out of pocket payments by client"),
                        _("Transmit or manage vouchers to client for health services"),
                        _("Transmit or manage incentives to clients for health services")
                    ]
                },
                {
                    "name": _("Personal health tracking"),
                    "strategies": [
                        _("Access by client to own medical records"),
                        _("Self monitoring of health or diagnostic data by client"),
                        _("Active data capture by client")
                    ]
                }
            ]
        },
        {
            "name": _("Provider"),
            "subGroups": [
                {
                    "name": _("Client identification and registration"),
                    "strategies": [
                        _("Verify client unique identity"),
                        _("Enroll client for health services/clinical care plan")
                    ]
                },
                {
                    "name": _("Client health records"),
                    "strategies": [
                        _("Track client's health and services within a longitudinal care plan"),
                        _("Manage client's structured records"),
                        _("Manage client's unstructured clinical records (e.g. notes, images, documents)")
                    ]
                },
                {
                    "name": _("Provider based decision support"),
                    "strategies": [
                        _("Guide through process algorithms according to clinical protocol"),
                        _("Provide checklist according to clinical protocol"),
                        _("Screen clients by risk or other health status")
                    ]
                },
                {
                    "name": _("Provider work planning and scheduling"),
                    "strategies": [
                        _("Schedule client appointments based on clinical care plan"),
                        _("Schedule health worker activities")
                    ]
                },
                {
                    "name": _("Provider to provider communication"),
                    "strategies": [
                        _("Health worker to health worker telemedicine for patient case management "),
                        _("Health worker peer group")
                    ]
                },
                {
                    "name": _("Referral coordination"),
                    "strategies": [
                        _("Coordinate emergency response and transport"),
                        _("Manage referrals between points of service within health sector "),
                        _("Manage referrals between health and other sectors (social services, police, justice, economic support schemes)")
                    ]
                },
                {
                    "name": _("Targeted provider communication"),
                    "strategies": [
                        _("Transmit routine news and updates to health workers"),
                        _("Transmit non-routine public health event alerts to health workers"),
                        _("Transmit clinical care workflow alerts to health worker"),
                        _("Provide supervisory and performance feedback")
                    ]
                },
                {
                    "name": _("HW training"),
                    "strategies": [
                        _("Provide training content to health workers "),
                        _("Record health worker training information"),
                        _("Manage health worker license and registration"),
                        _("Assess health worker capacity ")

                    ]
                },
                {
                    "name": _("HR management"),
                    "strategies": [
                        _("List health workforce cadres and related information"),
                        _("Monitor health worker performance"),
                    ]
                }
            ]
        },
        {
            "name": _("System"),
            "subGroups": [
                {
                    "name": _("Commodity assessment and reporting"),
                    "strategies": [
                        _("Report counterfeit or substandard drugs by clients"),
                        _("Report adverse drug interactions"),
                        _("Register licensed drugs and health commodities")
                    ]
                },
                {
                    "name": _("Data collection management and use"),
                    "strategies": [
                        _("Routine health indicator data collection and management"),
                        _("Non routine data collection and management"),
                        _("Data storage and aggregation"),
                        _("Data synthesis and presentations/visualizations of data"),
                        _("Automated analysis of data to generate new information or predictions on future events")
                    ]
                },
                {
                    "name": _("Prescription management"),
                    "strategies": [
                        _("Transmit prescriptions orders"),
                        _("Track status of prescription orders"),
                        _("Track consumption of health commodities")

                    ]
                },
                {
                    "name": _("Equipment and asset management"),
                    "strategies": [
                        _("Monitor status of health equipment"),
                        _("Track regulation and licensing of medical equipment"),
                    ]
                },
                {
                    "name": _("Provider financial transactions"),
                    "strategies": [
                        _("Transmit or manage routine payroll payment to health workers"),
                        _("Transmit or manage incentives to health workers")
                    ]
                },
                {
                    "name": _("Insurance"),
                    "strategies": [
                        _("Register and verify client insurance membership"),
                        _("Track insurance billing and claims submission"),
                        _("Track and manage insurance reimbursement")
                    ]
                },
                {
                    "name": _("Laboratory and diagnostics management"),
                    "strategies": [
                        _("Transmit diagnostics result, or availability of result, to clients"),
                        _("Transmit diagnostic orders"),
                        _("Track biological specimens ")
                    ]
                },
                {
                    "name": _("CRVS"),
                    "strategies": [
                        _("Notify birth event to health system"),
                        _("Register birth event within health system"),
                        _("Certify birth event within health system"),
                        _("Notify death event to health system"),
                        _("Register death event within health system"),
                        _("Certify death event within health system")
                    ]
                },
                {
                    "name": _("Public health event notification"),
                    "strategies": [
                        _("Notification of public health events from point of diagnosis"),
                    ]
                },
                {
                    "name": _("Data coding"),
                    "strategies": [
                        _("Parse unstructured data into structured data"),
                        _("Merge, de-duplicate and curate coded/standardized datasets or terminologies"),
                        _("Classify disease codes")
                    ]
                },
                {
                    "name": _("Facility management"),
                    "strategies": [
                        _("List health facilities and related information"),
                        _("Assess health facilities")
                    ]
                },
                {
                    "name": _("Budget and expenditure management"),
                    "strategies": [
                        _("Manage budget and expenditures")
                    ]
                },
                {
                    "name": _("Location mapping"),
                    "strategies": [
                        _("Map location of health facilities"),
                        _("Map location of health event"),
                        _("Demarcate of catchment area"),
                        _("Map location of health workers")
                    ]
                }
            ]
        }
    ],
    "technology_platforms": [
        _("Adobe Forms"),
        _("Bamboo"),
        _("Capatricy"),
        _("Commcare"),
        _("Crowd Map"),
        _("Data Winners"),
        _("DHIS2"),
        _("emocha"),
        _("Enketo"),
        _("Epi Collect"),
        _("FormHub"),
        _("Frontline SMS"),
        _("iFormBuilder"),
        _("IVR"),
        _("Kobo"),
        _("Kookoo"),
        _("Kujua"),
        _("Magpi"),
        _("Motech"),
        _("Muvuku"),
        _("ODK"),
        _("Ona"),
        _("OpenMRS"),
        _("OpenSRP"),
        _("OpenXData"),
        _("Pendragon"),
        _("REDcap"),
        _("RapidSMS"),
        _("RapidPro"),
        _("SMS"),
        _("Survey CTO"),
        _("Textit"),
        _("Usahidi"),
        _("USSD"),
        _("Voice"),
        _("HAPI FHIR"),
        _("OpenLIS"),
        _("OpenHMIS"),
        _("GNU Health"),
        _("OpenLMIS"),
        _("OpenHIM"),
        _("HEARTH"),
        _("Mirth"),
        _("MOTECH"),
        _("ResourceMap"),
        _("GeoNode")
    ],
    "licenses": [
        _("Public domain"),
        _("Non protective free and open source software (e.g. Apache)"),
        _("Protective free and open source software"),
        _("Freemium"),
        _("Proprietary")
    ],
    "applications": [
        _("Client education and behavior change communication"),
        _("Sensors point-of-care diagnostics"),
        _("Registries and vital events tracking"),
        _("Data collection and reporting"),
        _("Electronic health records"),
        _("Electronic decision support (e.g. protocols, algorithms, checklists)"),
        _("Provider-to-provider communication (e.g. user group, consultations)"),
        _("Provider work planning and scheduling"),
        _("Human resource management"),
        _("Supply chain management"),
        _("Financial transactions and incentives")
    ],
    "interoperability_links": [
        {"pre": _("Yes, links to a "), "name": _("Client Registry")},
        {"pre": _("Yes, links to "), "name": _("Health Management Information System (HMIS)")},
        {"pre": _("Yes, links to a "), "name": _("Health Worker Registry")},
        {"pre": _("Yes, links to "), "name": _("Logistics Management and Supply Chain Information System (LMIS)")},
        {"pre": _("Yes, links to "), "name": _("Laboratory Information System")},
        {"pre": _("Yes, links to a "), "name": _("Facility Registry")},
        {"pre": _("Yes, links to a "), "name": _("Shared Health Record")},
        {"pre": _("Yes, links to a "), "name": _("Terminology Service")},
    ],
    "interoperability_standards": [
        _("ADX - Aggregate Data Exchange"),
        _("ATNA - Audit Trail and Node Authentication"),
        _("BPPC - Basic Patient Privacy Consents"),
        _("CDA - Clinical Document Architecture"),
        _("CSD - Care Services Discovery"),
        _("DICOM"),
        _("GS1"),
        _("HL7 v2"),
        _("HL7 v3"),
        _("mACM - Mobile Alert Communication Management"),
        _("MHD - Mobile Access to Health Documents"),
        _("PIX or PIXm - (Mobile) Patient Identifier Cross Reference"),
        _("PDQ or PDQm - (Mobile) Patient Demographics Query"),
        _("SDMX - Statistical Data and Metadata Exchange"),
        _("XDS - Cross-Enterprise Document Sharing"),
        _("XUA - Cross-Enterprise User Assertion"),
        _("HL7 FHIR"),
        _("SVS - Sharing Value Sets"),
        _("GML Geography Markup Language"),
        _("XForms"),
        _("SNOMED"),
        _("ICD-10"),
        _("ISO 3166"),
        _("ISCO 08"),
        _("ISCO 88"),
        _("LOINC"),
        _("RxNORM"),
        _("CIEL")

    ],
    "his_bucket": [
        _("Census, population information & data warehouse"),
        _("Civil Registration and Vital Statistics"),
        _("Client applications"),
        _("Client communication system"),
        _("Clinical terminology and classifications"),
        _("Community Information System"),
        _("EHR and health information repositories"),
        _("Electronic Medical Record"),
        _("Emergency response system"),
        _("Facility Management Information System"),
        _("Geographic Information Systems"),
        _("Health finance and insurance"),
        _("Health Management Information System"),
        _("Human Resource Information System"),
        _("Identification registries and directories"),
        _("Knowledge Management"),
        _("Laboratory and Diagnostic System"),
        _("Learning and Training System"),
        _("Logistics Management Information System"),
        _("Pharmacy System"),
        _("Public health and disease surveillance"),
        _("Research information system"),
        _("Data interchange interoperability and accessibility"),
        _("Environmental monitoring systems"),
    ],
    "hsc_challenges": [
        {
            "name": _("Information"),
            "challenges": [
                _("Lack of population denominator"),
                _("Delayed reporting of events"),
                _("Lack of quality/reliable data"),
                _("Communication roadblocks"),
                _("Lack of access to information or data"),
                _("Insufficient utilization of data and information"),
                _("Lack of unique identifiers")
            ]
        },
        {
            "name": _("Availability"),
            "challenges": [
                _("Insufficient supply of commodities"),
                _("Insufficient supply of services"),
                _("Insufficient supply of equipment"),
                _("Insufficient supply of qualified health workers"),
            ]
        },
        {
            "name": _("Quality"),
            "challenges": [
                _("Poor patient experience"),
                _("Insufficient health worker competence"),
                _("Low quality of health commodities"),
                _("Insufficient continuity of care"),
                _("Insufficient supportive supervision"),
                _("Poor adherence to guidelines")
            ]
        },
        {
            "name": _("Acceptability"),
            "challenges": [
                _("Lack of alignment with local norms"),
                _("Not addressing individual beliefs and practices"),
            ]
        },
        {
            "name": _("Utilization"),
            "challenges": [
                _("Low demand for services"),
                _("Geographic inaccessibility"),
                _("Low adherence to treatments"),
                _("Loss to follow-up"),
            ]
        },
        {
            "name": _("Efficiency"),
            "challenges": [
                _("Inadequate workflow management"),
                _("Lack of inappropriate referrals"),
                _("Poor planning and coordination"),
                _("Delayed provision of care"),
                _("Inadequate access to transportation"),
                _("Inadequate prioritization of clients"),
            ]
        }
    ],
    "health_focus_areas": [
        {
            "name": _("Red Group"),
            "subGroups": [
                {"name": _("TB"), "health_focus_areas": [_("TB: preventing infection"),
                                                      _("TB: stopping progression from infection to active disease"),
                                                      _("TB: treating active disease")]},
                {"name": _("Sexually Transmitted Infections"), "health_focus_areas": [_("STI: Preventing Acquisition"),
                                                                                   _("STI: Preventing Transmission"),
                                                                                   _("STI: Preventing Complications")]},
                {"name": _("HIV/AIDS Prevention and Treatment"), "health_focus_areas": [_("HIV: testing and diagnosis"),
                                                                                     _("HIV: Palliative Care"),
                                                                                     _("HIV: Prevention, Treatment of opportunistic infections"),
                                                                                     _("HIV: Antiretroviral therapy"),
                                                                                     _("HIV: Prevention")]},
                {"name": _("Diarrheal Diseases"), "health_focus_areas": [_("Diarrheal Dis: Breastfeeding promotion"),
                                                                      _("Diarrheal Dis: Water supply and sanitation improvement"),
                                                                      _("Diarrheal Dis: Oral rehydration therapy"),
                                                                      _("Diarrheal Dis: Zinc")]},
                {"name": _("Vaccine-Preventable Diseases"), "health_focus_areas": [_("Vaccine: national immunization program"),
                                                                                _("Vaccine: fixed facility"),
                                                                                _("Vaccine: campaign"),
                                                                                _("Vaccine: mobile"),
                                                                                _("Vaccine: outreach")]},
                {"name": _("Malaria"), "health_focus_areas": [_("Malaria: Prompt access to effective treatment"),
                                                           _("Malaria: Provision of Insecticide treated nets"),
                                                           _("Malaria: Prevention and control of malaria in pregnant women"),
                                                           _("Malaria: Epidemic and emergency response"),
                                                           _("Malaria: Malaria vaccine"),
                                                           _("Malaria: Malaria prophylaxis treatment"),
                                                           _("Malaria: Residual spraying")]},
                {"name": _("Tropical Diseases"), "health_focus_areas": [_("Chagas Disease"),
                                                                     _("Lymphatic Filariasis"),
                                                                     _("Onchocerciasis"),
                                                                     _("Leprosy"), _("Dengue"), _("Leishmaniasis"), _("African Trypanosomiasis")]},
                {"name": _("Helminth Infections and Schistosomiasis"), _("health_focus_areas"): [_("Helminth: Anthelmintic Drug Treatment"),
                                                                                           _("Helminth: Improved Sanitation"),
                                                                                           _("Helminth: Health Education")]},
                {"name": _("Acute Respiratory Infections in Children"), "health_focus_areas": [_("ARI: vaccines"),
                                                                                            _("ARI: case management")]},
                {"name": _("Pregnancy, Maternal and Perinatal Conditions"), "health_focus_areas": [ _("Pregnancy: Fertility behaviour change"),
                                                                                                 _("Pregnancy: Infertility"),
                                                                                                 _("Pregnancy: Preconception care"),
                                                                                                 _("Pregnancy: Miscarriage"),
                                                                                                 _("Pregnancy: Abortion care"),
                                                                                                 _("Pregnancy: Male involvement"),
                                                                                                 _("Pregnancy: Immunizations"),
                                                                                                 _("Pregnancy: Malaria prevention"),
                                                                                                 _("Pregnancy: Hypertension and NCD screening"),
                                                                                                 _("Maternal: Fertility behavior change"),
                                                                                                 _("Maternal: Nutritional Interventions"),
                                                                                                 _("Maternal: Routine prenatal care at the primary level"),
                                                                                                 _("Maternal: Delivery care at the primary level"),
                                                                                                 _("Maternal: Postpartum care"),
                                                                                                 _("Maternal: Postabortion care"),
                                                                                                 _("Maternal: CEmOC package at the secondary level"),
                                                                                                 _("Maternal: Mental health screening")]},
                {"name": _("Newborn"), "health_focus_areas": [_("Newborn: Prepregnancy health and nutrition"),
                                                           _("Newborn: Counseling and preparation for newborn care and breastfeeding"),
                                                           _("Newborn: Emergency preparedness"),
                                                           _("Newborn: Clean delivery at community level"),
                                                           _("Newborn: Simple early newborn care at community level"),
                                                           _("Newborn: Healthy home care including breastfeeding promotion, hygienic cord and skin care, thermal care, promotion of demand for quality care Newborn: Extra care of small babies and case management of pneumonia"),
                                                           _("Newborn: Prenatal care package"),
                                                           _("Newborn: Postnatal care to support healthy practices"),
                                                           _("Newborn: Early detection and referral of complications"),
                                                           _("Newborn: Skilled obstetric and immediate newborn care including resuscitation"),
                                                           _("Newborn: Emergency obstetric care to manage complications such as obstructed labor and hemorrhage"),
                                                           _("Newborn: Emergency newborn care for illness, especially sepsis management"),
                                                           _("Newborn: Extra care of very low birth weight babies including kangaroo mother care")]},
                {"name": _("Stunting, Wasting, and Micronutrient Deficiency Disorders"), "health_focus_areas": [_("Nutrition: Promotion of Optimal Feeding of Infants and Young Children"),
                                                                                                             _("Nutrition: Vitamin A deficiency"),
                                                                                                             _("Nutrition: Iron deficiency"),
                                                                                                             _("Nutrition: Zinc deficiency"),
                                                                                                             _("Nutrition: Growth monitoring and counselling")]},
                {"name": _("Cancer Control"), "health_focus_areas": [_("Cancer: Immunizations (e.g., HBV, HPV)"),
                                                                  _("Cancer: Tobacco Control"),
                                                                  _("Cancer: Alcohol Control"),
                                                                  _("Cancer: Dietary and Related Interventions"),
                                                                  _("Cancer: Pharmacological Interventions"),
                                                                  _("Cancer: Cancer Screening"),
                                                                  _("Cancer: Cancer Treatment and Palliative Care")]},
            ]
        },
        {
            "name": _("Blue group"),
            "subGroups": [
                {"name": _("Diabetes"), "health_focus_areas": [_("Diabetes: prevention"),
                                                            _("Diabetes: screening"),
                                                            _("Diabetes: management")]},
                {"name": _("Mental disorders"), "health_focus_areas": [_("Mental health screening"),
                                                                    _("Mental health management and treatment")
                                                                    ]},
                {"name": _("Neurological Disorders"), "health_focus_areas": [_("Neurological Disorder Interventions")]},
                {"name": _("Cardiovascular disease"), "health_focus_areas": [_("CVD Prevention"),
                                                                          _("CVD Treatment"),
                                                                          _("Long-Term Management of Existing Vascular Disease")]},
                {"name": _("Respiratory Diseases of Adults"), "health_focus_areas": [_("Interventions for asthma"),
                                                                                  _("Interventions for COPD"),
                                                                                  _("Interventions for pneumonia and influenza")]},
                {"name": _("Diseases of the Kidney and the Urinary System"), "health_focus_areas": [_("Hypertension interventions"),
                                                                                                 _("Kidney and urinary tract Screening")]},
                {"name": _("Skin disease"), "health_focus_areas": [_("Skin disease Interventions")]},
                {"name": _("Oral Health"), "health_focus_areas": [_("Oral health education and promotion"),
                                                               _("Oral health treatment")]},
                {"name": _("Unintentional Injuries"), "health_focus_areas": [_("Road traffic injuries prevention"),
                                                                          _("Poisonings"),
                                                                          _("Fall-related injuries"),
                                                                          _("Burn-related injuries"),
                                                                          _("Drowning")]},
                {"name": _("Interpersonal Violence"), "health_focus_areas": [_("Interpersonal violence: Prevention Strategies"),
                                                                          _("Interpersonal violence: Interventions")]},
            ]
        },
        {
            "name": _("Green group"),
            "subGroups": [
                {"name": _("Water Supply, Sanitation, and Hygiene Promotion"), "health_focus_areas": [_("WASH: Safer Water"),
                                                                                                   _("WASH: Hand Washing"),
                                                                                                   _("WASH: Hygiene Education")
                                                                                                   ]},
                {"name": _("Indoor Air Pollution"), "health_focus_areas": [_("Indoor pollution: Source of pollution"),
                                                                        _("Indoor pollution: Improve living environment"),
                                                                        _("Indoor pollution: User behaviors")]},
                {"name": _("Outdoor Air and Water Pollution"), "health_focus_areas": [_("Outdoor: Interventions to Reduce Air Pollution"),
                                                                                   _("Outdoor: Interventions to Reduce Water Pollution")]},
                {"name": _("Diet and Lifestyle Changes to prevent chronic disease"), "health_focus_areas": [_("Lifestyle: Avoid smoking"),
                                                                                                         _("Lifestyle: Pursue physical activity"),
                                                                                                         _("Lifestyle: Avoid overweight"),
                                                                                                         _("Lifestyle: Educational Interventions"),
                                                                                                         _("Lifestyle: Worksite Interventions"),
                                                                                                         _("Lifestyle: Interventions by Health Care Providers"),
                                                                                                         _("Lifestyle: Promote Walking and Bicycle Riding"),
                                                                                                         _("Lifestyle: Promoting Healthy Food Choices")]},
                {"name": _("Risk from High Blood Pressure, Cholesterol, and Bodyweight"), "health_focus_areas": [_("Risk: Interventions to Reduce Bodyweight"),
                                                                                                              _("Risk: Healthy diet (low sodium, high potassium"),
                                                                                                              _("Risk: Physical activity"),
                                                                                                              _("Risk: Medications to lower blood pressure")]},
                {"name": _("Tobacco Addiction"), "health_focus_areas": [_("Tobacco: Smoking cessation treatment"),
                                                                     _("Tobacco: Reducing exposure to passive tobacco smoke"),
                                                                     _("Tobacco: Preventing initiation among youths and young adults")
                                                                     ]},
                {"name": _("Alcohol"), "health_focus_areas": [_("Alcohol: Education sessions and psychosocial counseling"),
                                                           _("Alcohol: Population-wide measures")
                                                           ]},
                {"name": _("Illicit drug use"), "health_focus_areas": [_("Illicit drug: Prevention including education"),
                                                                    _("Illicit drug: Voluntary Treatment"),
                                                                    _("Illicit drug: Involuntary Treatment")
                                                                    ]}
            ]
        },
        {
            "name": _("Orange Group"),
            "subGroups": [
                {"name": _("Learning and Developmental Disabilities"), "health_focus_areas": [_("Learning Disability: Primary prevention to control the underlying cause or condition"),
                                                                                           _("Learning Disability: Preventing an existing illness or injury from progressing to long-term disability"),
                                                                                           _("Learning Disability: Rehabilitation and special educational services")]},
                {"name": _("Loss of Vision and Hearing"), "health_focus_areas": [_("Childhood Blindness"),
                                                                              _("Cataract interventions"),
                                                                              _("Trachoma interventions"),
                                                                              _("Onchocerciasis interventions"),
                                                                              _("Hearing loss screening programs"),
                                                                              _("Hearing loss education"),
                                                                              _("Hearing loss surgery"),
                                                                              _("Hearing loss medications"),
                                                                              _("Hearing loss assistive devices")]},
                {"name": _("Interventions for Musculoskeletal Conditions"), "health_focus_areas": [_("Musculoskeletal: Preventive strategies"),
                                                                                                _("Musculoskeletal: Screening"),
                                                                                                _("Musculoskeletal: Symptomatic treatments"),
                                                                                                _("Musculoskeletal: Rheumitoid Arthritis"),
                                                                                                _("Musculoskeletal: Osteoporosis")]},
                {"name": _("Pain Control"), "health_focus_areas": [_("Pain: Opioid treatment"),
                                                                _("Pain: Non-Opioid treatments and strategies")]},
            ]
        },
        {
            "name": _("Group bordeaux"),
            "subGroups": [
                {"name": _("Contraceptives"), "health_focus_areas": [_("Counseling"),
                                                                  _("Permanent and Long-Term Methods"),
                                                                  _("Temporary Methods"), _("Emergency Contraception"),
                                                                  _("Social Marketing")]},
                {"name": _("Health of Adolescents and Youth"), "health_focus_areas": [_("School - Based Health and Nutrition Programs"),
                                                                                   _("Youth Friendly Facilities"),
                                                                                   _("Life - skills and health and sexuality education"),
                                                                                   _("Peer education"),
                                                                                   _("Mass media and community mobilization"),
                                                                                   _("Youth development programs"),
                                                                                   _("Social marketing"),
                                                                                   _("Workplace and private sector programs")
                                                                                   ]},
                {"name": _("Integrated Management of the Sick Child (integrated approaches to diarrhea, malaria, pneumonia, measles, other severe infections, and malnutrition)"),
                 "health_focus_areas": [_("IMNCI: Improve Health Worker Performance (assess signs and symptoms, classify illness, and provide appropriate treatment and education)"),
                                        _("IMNCI: Improve Health Systems (improve drug availability, effective supervision, referral services, and health information systems)"),
                                        _("IMNCI: Improve Family and Community Practices (prevent illness, home treatment of infections, improve care-seeking practices and compliance with treatment)")]},
                {"name": _("Occupational Health"), "health_focus_areas": [_("Occupational: Strategies for Improving Working Conditions"),
                                                                       _("Occupational: Improvement of Access to Health Care"),
                                                                       _("Occupational: Surveillance and Reporting")]},
                {"name": _("Natural Disaster Mitigation and Relief"), "health_focus_areas": [_("Disaster: Assessment of the Health Situation"),
                                                                                          _("Disaster: Mass Casualties Treatment"),
                                                                                          _("Disaster: Strengthened Surveillance, Prevention, and Control of CommunicableDiseases"),
                                                                                          _("Disaster: Environmental Health"),
                                                                                          _("Disaster: Transparent Management of Donations and Supplies"),
                                                                                          _("Disaster: Coordination of the Humanitarian Health Effort"),
                                                                                          _("Disaster: Emergency Preparedness of the Health Sector"),
                                                                                          _("Disaster: Prevention and Mitigation")]},
                {"name": _("Emergency Medical Services"), "health_focus_areas": [_("EMS: Paramedics"),
                                                                              _("EMS: Lay response"),
                                                                              _("EMS: Transportation and communication systems"),
                                                                              _("EMS: Ambulatory systems")]}
            ]
        }
    ]
}
