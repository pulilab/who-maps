
// Predefined things
// *****************

export const interventionsLib = {

    // Data-fragments with rowheader-like approach
    'Community': ['Birth notification', 'Routine immunizations'],

    '1st level': ['Postnatal care for mother and child'],

    'Referral': [],

    'Key supplies & commodities': [],

    // All the real ones from the 13. page of the .pdf pr. column
    '0': [
        'Safe sex',
        'Family planning',
        'Birth spacing',
        'Infertility',
        'Sexual and domestic violence',
        'HIV/AIDS',
        'Generalized epidemics',
        'STIs, except HIV/AIDs',
        'Cancer',
        'Key supplies and commodities'
    ],
    '1': [
        'Safe sex',
        'Family planning',
        'Birth spacing',
        'Infertility',
        'Sexual and domestic violence',
        'HIV/AIDS',
        'Generalized epidemics',
        'STIs, except HIV/AIDs',
        'Cancer',
        'Key supplies and commodities'
    ],
    '2': [
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
        'Key supplies and commodities'
    ],
    '3': [
        'Transportation',
        'Skilled attendance at birth',
        'Labor and delivery care',
        'Immediate care of newborn',
        'Immediate postpartum care',
        'Obstetric complications',
        'HIV/AIDS',
        'PMTCT',
        'Key supplies and commodities'
    ],
    '4': [
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
        'Key supplies and commodities'
    ],
    '5': [
        'Exclusive breastfeeding',
        'Childhood illnesses',
        'Malaria',
        'Immunizations',
        'Growth monitoring and Nutrition',
        'PMTCT',
        'Micronutrient supplementation',
        'Key supplies and commodities'
    ],
    '6': [
        'Childhood illnesses',
        'Malaria',
        'Growth monitoring and Nutrition',
        'PMTCT',
        'Micronutrient supplementation',
        'Key supplies and commodities'
    ]
};

export const applicationsLib = [
    {
        'id': '1',
        'name': 'Client education and bahevior change communication',
        'subApplications': {
            '1a': 'Health and Education of promotion',
            '1b': 'Hotlines and information services',
            '1c': 'Appointment remainders',
            '1d': 'Treatment adherence',
            '1e': 'Mass messaging campaigns'
        }
    },
    {
        'id': '2',
        'name': 'Point of care diagnostics',
        'subApplications': {
            '2a': 'Device diagnostics',
            '2b': 'Sensors'

        }
    },
    {
        'id': '3',
        'name': 'Client Information Systems',
        'subApplications': {
            '2a': 'Electronic health records',
            '2b': 'Registries',
            '2c': 'Vital events tracking',
            '2d': 'Enumeration'
        }
    },
    {
        'id': '4',
        'name': 'Data Collection and Reporting',
        'subApplications': {
            '4a': 'Service delivery statistics',
            '4b': 'Household surveys',
            '4c': 'Surveillance',
            '4d': 'Report Generation'
        }
    },
    {
        'id': '5',
        'name': 'Service Delivery',
        'subApplications': {
            '5a': 'Electronic decision support',
            '5b': 'Provider-to-provider communication',
            '5c': 'Remote client-to-provider consultations (Telemedicine)'
        }
    },
    {
        'id': '6',
        'name': 'Provider work planning and scheduling',
        'subApplications': {
        }
    },
    {
        'id': '7',
        'name': 'Provider training and education',
        'subApplications': {
        }
    },
    {
        'id': '8',
        'name': 'Human resource management',
        'subApplications': {
            '8a': 'Supportive supervision',
            '8b': 'Constituent feedback on service quality'
        }
    },
    {
        'id': '9',
        'name': 'Supply management',
        'subApplications': {
            '9a': 'Cold chain management',
            '9b': 'Stock out prevention',
            '9c': 'Counterfeit prevention',
            '9d': 'Maintenance of equipment',
            '9e': 'Commodity tracking / replenishment'
        }
    },
    {
        'id': '10',
        'name': 'Financial transactions and incentives',
        'subApplications': {
            '10a': 'Payment for Services',
            '10b': 'Conditional cash transfers',
            '10c': 'Savings Accounts',
            '10d': 'Insurance',
            '10e': 'Performance-based incentives'
        }
    }
];

export const taxonomyLib = {
    'Information': {
        icon: 'info',
        values: [
            'Lack of population enumeration',
            'Delayed reporting of events',
            'Quality / unreliability of data',
            'Communication roadblock',
            'Access to information or data'
        ]
    },
    'Availability': {
        icon: 'check',
        values: [
            'Supply of commodities',
            'Supply of services',
            'Supply of equipment',
            'Diversity of treatment options'
        ]
    },
    'Quality': {
        icon: 'star',
        values: [
            'Quality of care',
            'Health worker competence',
            'Quality of commodity',
            'Health worker motivation',
            'Continuity of care',
            'Supportive supervision'
        ]
    },
    'Acceptability': {
        icon: 'accessibility',
        values: [
            'Alignment with local norms',
            'Addressing individual beliefs and practices',
            'Stigma'
        ]
    },
    'Utilization': {
        icon: 'pan_tool',
        values: [
            'Demand for services',
            'Geographic inaccessibility',
            'Low adherence to treatments',
            'Loss to follow up'
        ]
    },
    'Efficiency': {
        icon: 'trending_up',
        values: [
            'Workflow management',
            'Effective resource allocation',
            'Unnecessary referrals / transportation',
            'Planning and coordination',
            'Timeliness of care'
        ]
    },
    'Cost': {
        icon: 'monetization_on',
        values: [
            'Expenses related to commodity production',
            'Expenses related to commodity supply',
            'Expenses related to commodity disbursement',
            'Expenses related to service delivery',
            'Client-side expenses'
        ]
    }
};

// Bindable things
// ***************

export const hss = [
    {
        'id': 'column0',
        'mother': {
            'title': 'Adolenscence',
            'span': 1,
            'activated': false
        },
        'child': {
            'title': null,
            'span': 1,
            'activated': false
        },
        'interventions': {
        },
        'applications': {
        }
    },
    {
        'id': 'column1',
        'mother': {
            'title': 'Before Pregnancy',
            'span': 1,
            'activated': false
        },
        'child': {
            'title': null,
            'span': 1,
            'activated': false
        },
        'interventions': {
        },
        'applications': {
        }
    },
    {
        'id': 'column2',
        'mother': {
            'title': 'Pregnancy',
            'span': 1,
            'activated': false
        },
        'child': {
            'title': null,
            'span': 1,
            'activated': false
        },
        'interventions': {
        },
        'applications': {
        }
    },
    {
        'id': 'column3',
        'mother': {
            'title': 'Birth',
            'span': 1,
            'activated': true
        },
        'child': {
            'title': null,
            'span': 1,
            'activated': false
        },
        'interventions': {
            'Community': 0
        },
        'applications': {
            '3': {
                'data': 'Digital registration of newborns enumerate infants in need of vaccination services',
                'span': 3
            },
            '8a': {
                'data': 'Notification system send SMS alerts to vaccine workers of new births in catchment area.',
                'span': 2
            }
        }
    },
    {
        'id': 'column4',
        'mother': {
            'title': 'Postpartum Mother',
            'span': 1,
            'activated': true
        },
        'child': {
            'title': 'Postnatal Newborn',
            'span': 1,
            'activated': true
        },
        'interventions': {
            'Community': 1,
            '1st level': 0
        },
        'applications': {
            '1': {
                'data': 'Voice-based reminders about upcoming vaccinations sent to infant\'s caregivers',
                'span': 2
            },
            '4': {
                'data': 'Supervisors view vaccination coverage data to monitor disctrict-wise parformance',
                'span': 2
            },
            '5': {
                'data': 'Digital forms maintain up-to-date vaccination record for child',
                'span': 2
            },
            '8b': {
                'data': 'Lists enable health workers to connect caregivers to ensure timely infant vaccination',
                'span': 2
            }
        }
    },
    {
        'id': 'column5',
        'titleMother': 'Maternal Health',
        'titleChild': 'Infancy',
        'mother': {
            'title': 'Maternal Health',
            'span': 2,
            'activated': true
        },
        'child': {
            'title': 'Infancy',
            'span': 1,
            'activated': true
        },
        'interventions': {
            'Community': 1
        },
        'applications': {
        }
    },
    {
        'id': 'column6',
        'mother': {
        },
        'child': {
            'title': 'Childhood',
            'span': 1,
            'activated': true
        },
        'interventions': {
        },
        'applications': {
        }
    }

];

export const taxonomy = {
    '1': [
        { 'Utilization': 0 },
        { 'Utilization': 3 }
    ],
    '3': [
        { 'Information': 0 }
    ],
    '4': [
        { 'Information': 1 },
        { 'Quality': 5 }
    ],
    '5': [
        { 'Information': 4 },
        { 'Quality': 4 }
    ],
    '8a': [
        { 'Quality': 0 },
        { 'Efficiency': 4 }
    ]
};

export const projectScale = `Lorem ipsum dolor sit amet,
 consectetur adipiscing elit. Donec eros lacus,
 posuere sed elit egestas, dapibus egestas nulla.
 Suspendisse non tellus tellus.`;

export const partnerLogoUrls = [
    'http://celebrityhockeyclassics.com/wp-content/uploads/Logo-Placeholder.png',
    'https://d13yacurqjgara.cloudfront.net/users/3813/screenshots/285235/screen_shot_2011-10-05_at_10.54.15_am.png',
    'http://www.abbotts.net.au/sites/live.abbotts.devshop.abbotts.net.au/files/field/logo/client-logo-placeholder_4.jpg',
    'http://twistedems.com/cms/wp-content/uploads/2016/02/client-logo-placeholder-300x115.jpg'
];
