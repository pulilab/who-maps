
interventions = {
    0: [
        'Safe sex',
        'Family planning',
        'Birth spacing',
        'Infertility',
        'Sexual and domestic violence',
        'HIV/AIDS',
        'Generalized epidemics',
        'STIs, except HIV/AIDs',
        'Cancer',
        'Key supplies and commodities',
        'Infection Prevention Control (IPC)',
        'Surveillance',
        'Contact tracing'
    ],
    1: [
        'Safe sex',
        'Family planning',
        'Birth spacing',
        'Infertility',
        'Sexual and domestic violence',
        'HIV/AIDS',
        'Generalized epidemics',
        'STIs, except HIV/AIDs',
        'Cancer',
        'Key supplies and commodities',
        'Infection Prevention Control (IPC)',
        'Surveillance',
        'Contact tracing'
    ],
    2: [
        'Pregnancy registration',
        'Antenatal care',
        'Nutrition',
        'Safe sex',
        'HIV/AIDS',
        'Smoking/Alcohol use',
        'Malaria',
        'Birth planning',
        'Domestic violence',
        'Pregnancy complications',
        'Immunizations',
        'Key supplies and commodities',
        'Infection Prevention Control (IPC)',
        'Surveillance',
        'Contact tracing'
    ],
    3: [
        'Transportation',
        'Skilled attendance at birth',
        'Labor and delivery care',
        'Immediate care of newborn',
        'Immediate postpartum care',
        'Obstetric complications',
        'HIV/AIDS',
        'PMTCT',
        'Key supplies and commodities',
        'Infection Prevention Control (IPC)',
        'Surveillance',
        'Contact tracing'
    ],
    4: [
        'Postpartum care',
        'Exclusive Breastfeeding',
        'Vital registration',
        'Family planning',
        'Malaria',
        'Depression',
        'Postnatal care',
        'HIV/AIDs',
        'PMTCT',
        'Newborn illnesses',
        'Low birth weight/pre term care',
        'Key supplies and commodities',
        'Infection Prevention Control (IPC)',
        'Surveillance',
        'Contact tracing'
    ],
    5: [
        'Exclusive breastfeeding',
        'Childhood illnesses',
        'Malaria',
        'Immunizations',
        'Growth monitoring and Nutrition',
        'PMTCT',
        'Micronutrient supplementation',
        'Key supplies and commodities',
        'HIV/AIDS',
        'Infection Prevention Control (IPC)',
        'Surveillance',
        'Contact tracing'
    ],
    6: [
        'Childhood illnesses',
        'Malaria',
        'Growth monitoring and Nutrition',
        'PMTCT',
        'Micronutrient supplementation',
        'Key supplies and commodities',
        'HIV/AIDS',
        'Infection Prevention Control (IPC)',
        'Surveillance',
        'Contact tracing'
    ]
}

age_ranges = [
    "Newborn (< 28 days)",
    "Infant (< 12 months)",
    "Early Childhood (1-4 years)",
    "Late Childhood (5-9 years)",
    "Adolescence (10-19 years)",
    "Youth (20-24 years)",
    "Adulthood (25-64 years)",
    "Senior (> 65 years)",
]

special_population = [
    "At risk for a particular disease or infection",
    "Incarcerated",
    "Commercial Sex Workers",
    "Disabled",
    "Drug users",
    "Family as a unit",
    "Immigrant populations",
    "Lesbian, gay, bisexual, and transgender",
    "Men (only)",
    "Especially vulnerable children",
]

applications = [
    {
        'id': 1,
        'name': 'Client education and behaviour change communication',
        'subApplications': {
            1: 'Health and Education of promotion',
            2: 'Hotlines and information services',
            3: 'Appointment remainders',
            4: 'Treatment adherence',
            5: 'Mass messaging campaigns'
        }
    },
    {
        'id': 2,
        'name': 'Point of care diagnostics',
        'subApplications': {
            1: 'Device diagnostics',
            2: 'Sensors'

        }
    },
    {
        'id': 3,
        'name': 'Client Information Systems',
        'subApplications': {
            1: 'Electronic health records',
            2: 'Registries',
            3: 'Vital events tracking',
            4: 'Enumeration'
        }
    },
    {
        'id': 4,
        'name': 'Data Collection and Reporting',
        'subApplications': {
            1: 'Service delivery statistics',
            2: 'Household surveys',
            3: 'Surveillance',
            4: 'Report Generation'
        }
    },
    {
        'id': 5,
        'name': 'Service Delivery',
        'subApplications': {
            1: 'Electronic decision support',
            2: 'Provider-to-provider communication',
            3: 'Remote client-to-provider consultations (Telemedicine)'
        }
    },
    {
        'id': 6,
        'name': 'Provider work planning and scheduling',
        'subApplications': {
            1: 'Provider work planning and scheduling',
        }
    },
    {
        'id': 7,
        'name': 'Provider training and education',
        'subApplications': {
            1: 'Provider training and education',
        }
    },
    {
        'id': 8,
        'name': 'Human resource management',
        'subApplications': {
            1: 'Supportive supervision',
            2: 'Constituent feedback on service quality'
        }
    },
    {
        'id': 9,
        'name': 'Supply management',
        'subApplications': {
            1: 'Cold chain management',
            2: 'Stock out prevention',
            3: 'Counterfeit prevention',
            4: 'Maintenance of equipment',
            5: 'Commodity tracking / replenishment'
        }
    },
    {
        'id': 10,
        'name': 'Financial transactions and incentives',
        'subApplications': {
            1: 'Payment for Services',
            2: 'Conditional cash transfers',
            3: 'Savings Accounts',
            4: 'Insurance',
            5: 'Performance-based incentives'
        }
    }
]

taxonomies = {
    'Information': {
        'icon': 'info',
        'values': [
            'Lack of population enumeration',
            'Delayed reporting of events',
            'Quality / unreliability of data',
            'Communication roadblock',
            'Access to information or data'
        ]
    },
    'Availability': {
        'icon': 'check',
        'values': [
            'Supply of commodities',
            'Supply of services',
            'Supply of equipment',
            'Diversity of treatment options'
        ]
    },
    'Quality': {
        'icon': 'star',
        'values': [
            'Quality of care',
            'Health worker competence',
            'Quality of commodity',
            'Health worker motivation',
            'Continuity of care',
            'Supportive supervision'
        ]
    },
    'Acceptability': {
        'icon': 'accessibility',
        'values': [
            'Alignment with local norms',
            'Addressing individual beliefs and practices',
            'Stigma'
        ]
    },
    'Utilization': {
        'icon': 'pan_tool',
        'values': [
            'Demand for services',
            'Geographic inaccessibility',
            'Low adherence to treatments',
            'Loss to follow up'
        ]
    },
    'Efficiency': {
        'icon': 'trending_up',
        'values': [
            'Workflow management',
            'Effective resource allocation',
            'Unnecessary referrals / transportation',
            'Planning and coordination',
            'Timeliness of care'
        ]
    },
    'Cost': {
        'icon': 'monetization_on',
        'values': [
            'Expenses related to commodity production',
            'Expenses related to commodity supply',
            'Expenses related to commodity disbursement',
            'Expenses related to service delivery',
            'Client-side expenses'
        ]
    }
}

continuum = [
    {
        'id': 0,
        'title': 'Identify target populations',
        'span': 1,
    },
    {
        'id': 1,
        'title': 'Health promotion and intervention',
        'span': 1,
    },
    {
        'id': 2,
        'title': 'Detection and diagnosis',
        'span': 1,
    },
    {
        'id': 3,
        'title': 'Linkage to care',
        'span': 1,
    },
    {
        'id': 4,
        'title': 'Management and quality of care',
        'span': 1,
    },
    {
        'id': 5,
        'title': 'Follow and retention to care',
        'span': 1,
    },
    {
        'id': 6,
        'title': 'Coordination of care',
        'span': 1,
    }
]

hss_default = {
    'continuum': [
        {
            'column_id': 0,
            'state': False,
        },
        {
            'column_id': 1,
            'state': False,
        },
        {
            'column_id': 2,
            'state': False,
        },
        {
            'column_id': 3,
            'state': False,
        },
        {
            'column_id': 4,
            'state': False,
        },
        {
            'column_id': 5,
            'state': False,
        },
        {
            'column_id': 6,
            'state': False,
        },
    ],
    'applications': [
    ],
    'interventions': [
        {
            'column_id': 0,
            'interventions': []
        },
        {
            'column_id': 1,
            'interventions': []
        },
        {
            'column_id': 2,
            'interventions': []
        },
        {
            'column_id': 3,
            'interventions': []
        },
        {
            'column_id': 4,
            'interventions': []
        },
        {
            'column_id': 5,
            'interventions': []
        },
        {
            'column_id': 6,
            'interventions': []
        },
    ],
    'age_ranges': [
        {
            'column_id': 0,
            'age_ranges': []
        },
        {
            'column_id': 1,
            'age_ranges': []
        },
        {
            'column_id': 2,
            'age_ranges': []
        },
        {
            'column_id': 3,
            'age_ranges': []
        },
        {
            'column_id': 4,
            'age_ranges': []
        },
        {
            'column_id': 5,
            'age_ranges': []
        },
        {
            'column_id': 6,
            'age_ranges': []
        },
    ],
    'special_population': [
        {
            'column_id': 0,
            'special_population': []
        },
        {
            'column_id': 1,
            'special_population': []
        },
        {
            'column_id': 2,
            'special_population': []
        },
        {
            'column_id': 3,
            'special_population': []
        },
        {
            'column_id': 4,
            'special_population': []
        },
        {
            'column_id': 5,
            'special_population': []
        },
        {
            'column_id': 6,
            'special_population': []
        },
    ],
    'taxonomies': [
    ],
    'constraints': [
    ]
}
