from django.utils.translation import ugettext_lazy as _


toolkit_default = [
    {
        "axis": str(_("AXIS 1. GROUNDWORK")),
        "axis_score": 0,
        "axis_completion": 0,
        "domains": [
            {
                "domain": str(_("DOMAIN 1: PARAMETERS OF SCALE")),
                "domain_max": 2,
                "domain_sum": 0,
                "domain_percentage": 0,
                "domain_completion": 0,
                "questions": [
                    {
                        "question": "1-1",
                        "question_max": 2,
                        "question_sum": 0,
                        "answers": [None],
                    }
                ]
            },
            {
                "domain": str(_("DOMAIN 2: CONTEXTUAL ENVIRONMENT")),
                "domain_max": 22,
                "domain_sum": 0,
                "domain_percentage": 0,
                "domain_completion": 0,
                "questions": [
                    {
                        "question": "2-1",
                        "question_max": 6,
                        "question_sum": 0,
                        "answers": [None,None,None]
                    },
                    {
                        "question": "2-2",
                        "question_max": 8,
                        "question_sum": 0,
                        "answers": [None,None,None,None]
                    },
                    {
                        "question": "2-3",
                        "question_max": 8,
                        "question_sum": 0,
                        "answers": [None,None,None,None]
                    },
                ]
            },
            {
                "domain": str(_("DOMAIN 3: SCIENTIFIC BASIS")),
                "domain_max": 30,
                "domain_sum": 0,
                "domain_percentage": 0,
                "domain_completion": 0,
                "questions": [
                    {
                        "question": "3-1a",
                        "question_max": 8,
                        "question_sum": 0,
                        "answers": [None,None,None,None]
                    },
                    {
                        "question": "3-1b",
                        "question_max": 4,
                        "question_sum": 0,
                        "answers": [None,None]
                    },
                    {
                        "question": "3-2",
                        "question_max": 18,
                        "question_sum": 0,
                        "answers": [None,None,None,None,None,None]
                    },
                ]
            }
        ]
    },
    {
        "axis": str(_("AXIS 2. PARTNERSHIPS")),
        "axis_score": 0,
        "axis_completion": 0,
        "domains": [
            {
                "domain": str(_("DOMAIN 4: STRATEGIC ENGAGEMENT")),
                "domain_max": 48,
                "domain_sum": 0,
                "domain_percentage": 0,
                "domain_completion": 0,
                "questions": [
                    {
                        "question": "4-1a",
                        "question_max": 9,
                        "question_sum": 0,
                        "answers": [None,None,None],
                    },
                    {
                        "question": "4-1b",
                        "question_max": 27,
                        "question_sum": 0,
                        "answers": [None,None,None,None,None,None,None,None,None]
                    },
                    {
                        "question": "4-2",
                        "question_max": 12,
                        "question_sum": 0,
                        "answers": [None,None,None,None],
                    }
                ]
            },
            {
                "domain": str(_("DOMAIN 5: PARTNERSHIP SUSTAINABILITY")),
                "domain_max": 50,
                "domain_sum": 0,
                "domain_percentage": 0,
                "domain_completion": 0,
                "questions": [
                    {
                        "question": "5-1a",
                        "question_max": 9,
                        "question_sum": 0,
                        "answers": [None,None,None]
                    },
                    {
                        "question": "5-1b",
                        "question_max": 10,
                        "question_sum": 0,
                        "answers": [None,None,None,None,None]
                    },
                    {
                        "question": "5-1c",
                        "question_max": 10,
                        "question_sum": 0,
                        "answers": [None,None,None,None,None]
                    },
                    {
                        "question": "5-2a",
                        "question_max": 12,
                        "question_sum": 0,
                        "answers": [None,None,None,None]
                    },
                    {
                        "question": "5-2b",
                        "question_max": 9,
                        "question_sum": 0,
                        "answers": [None,None,None]
                    },
                ]
            }
        ]
    },
    {
        "axis": str(_("AXIS 3. FINANCIAL HEALTH")),
        "axis_score": 0,
        "axis_completion": 0,
        "domains": [
            {
                "domain": str(_("DOMAIN 6: FINANCIAL MANAGEMENT")),
                "domain_max": 45,
                "domain_sum": 0,
                "domain_percentage": 0,
                "domain_completion": 0,
                "questions": [
                    {
                        "question": "6-1",
                        "question_max": 18,
                        "question_sum": 0,
                        "answers": [None,None,None,None,None,None],
                    },
                    {
                        "question": "6-2",
                        "question_max": 6,
                        "question_sum": 0,
                        "answers": [None,None]
                    },                    {
                        "question": "6-3",
                        "question_max": 9,
                        "question_sum": 0,
                        "answers": [None,None,None]
                    },
                    {
                        "question": "6-4",
                        "question_max": 12,
                        "question_sum": 0,
                        "answers": [None,None,None,None],
                    }
                ]
            },
            {
                "domain": str(_("DOMAIN 7: FINANCIAL MODEL")),
                "domain_max": 36,
                "domain_sum": 0,
                "domain_percentage": 0,
                "domain_completion": 0,
                "questions": [
                    {
                        "question": "7-1",
                        "question_max": 12,
                        "question_sum": 0,
                        "answers": [None,None,None,None]
                    },
                    {
                        "question": "7-2",
                        "question_max": 12,
                        "question_sum": 0,
                        "answers": [None,None,None,None]
                    },
                    {
                        "question": "7-3",
                        "question_max": 12,
                        "question_sum": 0,
                        "answers": [None,None,None,None]
                    }
                ]
            }
        ]
    },
    {
        "axis": str(_("AXIS 4. TECHNOLOGY & ARCHITECTURE")),
        "axis_score": 0,
        "axis_completion": 0,
        "domains": [
            {
                "domain": str(_("DOMAIN 8: DATA")),
                "domain_max": 43,
                "domain_sum": 0,
                "domain_percentage": 0,
                "domain_completion": 0,
                "questions": [
                    {
                        "question": "8-1",
                        "question_max": 9,
                        "question_sum": 0,
                        "answers": [None,None,None],
                    },
                    {
                        "question": "8-2",
                        "question_max": 18,
                        "question_sum": 0,
                        "answers": [None,None,None,None,None,None]
                    },                    {
                        "question": "8-3a",
                        "question_max": 12,
                        "question_sum": 0,
                        "answers": [None,None,None,None]
                    },
                    {
                        "question": "8-3b",
                        "question_max": 6,
                        "question_sum": 0,
                        "answers": [None,None],
                    }
                ]
            },
            {
                "domain": str(_("DOMAIN 9: INTEROPERABILITY")),
                "domain_max": 18,
                "domain_sum": 0,
                "domain_percentage": 0,
                "domain_completion": 0,
                "questions": [
                    {
                        "question": "9-1",
                        "question_max": 9,
                        "question_sum": 0,
                        "answers": [None,None,None]
                    },
                    {
                        "question": "9-2",
                        "question_max": 9,
                        "question_sum": 0,
                        "answers": [None,None,None]
                    }
                ]
            },
            {
                "domain": str(_("DOMAIN 10: ADAPTABILITY")),
                "domain_max": 30,
                "domain_sum": 0,
                "domain_percentage": 0,
                "domain_completion": 0,
                "questions": [
                    {
                        "question": "10-1",
                        "question_max": 12,
                        "question_sum": 0,
                        "answers": [None,None,None,None]
                    },
                    {
                        "question": "10-2",
                        "question_max": 9,
                        "question_sum": 0,
                        "answers": [None,None,None]
                    },
                    {
                        "question": "10-3",
                        "question_max": 6,
                        "question_sum": 0,
                        "answers": [None,None]
                    }
                ]
            }
        ]
    },
    {
        "axis": str(_("AXIS 5. OPERATIONS")),
        "axis_score": 0,
        "axis_completion": 0,
        "domains": [
            {
                "domain": str(_("DOMAIN 11: PERSONNEL")),
                "domain_max": 33,
                "domain_sum": 0,
                "domain_percentage": 0,
                "domain_completion": 0,
                "questions": [
                    {
                        "question": "11-1",
                        "question_max": 21,
                        "question_sum": 0,
                        "answers": [None,None,None,None,None,None,None],
                    },
                    {
                        "question": "11-2",
                        "question_max": 12,
                        "question_sum": 0,
                        "answers": [None,None,None,None]
                    }
                ]
            },
            {
                "domain": str(_("DOMAIN 12: TRAINING AND SUPPORT")),
                "domain_max": 45,
                "domain_sum": 0,
                "domain_percentage": 0,
                "domain_completion": 0,
                "questions": [
                    {
                        "question": "12-1a",
                        "question_max": 15,
                        "question_sum": 0,
                        "answers": [None,None,None,None,None]
                    },
                    {
                        "question": "12-1b",
                        "question_max": 12,
                        "question_sum": 0,
                        "answers": [None,None,None,None]
                    },
                    {
                        "question": "12-2",
                        "question_max": 9,
                        "question_sum": 0,
                        "answers": [None,None,None]
                    },
                    {
                        "question": "12-3",
                        "question_max": 9,
                        "question_sum": 0,
                        "answers": [None,None,None]
                    }
                ]
            },
            {
                "domain": str(_("DOMAIN 13: OUTREACH AND SENSITIZATION")),
                "domain_max": 15,
                "domain_sum": 0,
                "domain_percentage": 0,
                "domain_completion": 0,
                "questions": [
                    {
                        "question": "13-1",
                        "question_max": 9,
                        "question_sum": 0,
                        "answers": [None,None,None],
                    },
                    {
                        "question": "13-2",
                        "question_max": 6,
                        "question_sum": 0,
                        "answers": [None,None]
                    }
                ]
            },
            {
                "domain": str(_("DOMAIN 14: CONTINGENCY PLANNING")),
                "domain_max": 18,
                "domain_sum": 0,
                "domain_percentage": 0,
                "domain_completion": 0,
                "questions": [
                    {
                        "question": "14-1",
                        "question_max": 9,
                        "question_sum": 0,
                        "answers": [None,None,None],
                    },
                    {
                        "question": "14-2",
                        "question_max": 9,
                        "question_sum": 0,
                        "answers": [None,None,None]
                    }
                ]
            },
        ]
    },
    {
        "axis": str(_("AXIS 6. MONITORING & EVALUATION")),
        "axis_score": 0,
        "axis_completion": 0,
        "domains": [
            {
                "domain": str(_("DOMAIN 15: PROCESS MONITORING")),
                "domain_max": 25,
                "domain_sum": 0,
                "domain_percentage": 0,
                "domain_completion": 0,
                "questions": [
                    {
                        "question": "15-1a",
                        "question_max": 4,
                        "question_sum": 0,
                        "answers": [None,None],
                    },
                    {
                        "question": "15-1b",
                        "question_max": 9,
                        "question_sum": 0,
                        "answers": [None,None,None]
                    },
                    {
                        "question": "15-2",
                        "question_max": 12,
                        "question_sum": 0,
                        "answers": [None,None,None,None]
                    }
                ]
            },
            {
                "domain": str(_("DOMAIN 16: EVALUATION RESEARCH")),
                "domain_max": 66,
                "domain_sum": 0,
                "domain_percentage": 0,
                "domain_completion": 0,
                "questions": [
                    {
                        "question": "16-1a",
                        "question_max": 6,
                        "question_sum": 0,
                        "answers": [None,None,None]
                    },
                    {
                        "question": "16-1b",
                        "question_max": 9,
                        "question_sum": 0,
                        "answers": [None,None,None]
                    },
                    {
                        "question": "16-1c",
                        "question_max": 6,
                        "question_sum": 0,
                        "answers": [None,None]
                    },
                    {
                        "question": "16-2a",
                        "question_max": 12,
                        "question_sum": 0,
                        "answers": [None,None,None,None]
                    },
                    {
                        "question": "16-2b",
                        "question_max": 12,
                        "question_sum": 0,
                        "answers": [None,None,None,None]
                    },
                    {
                        "question": "16-2c",
                        "question_max": 15,
                        "question_sum": 0,
                        "answers": [None,None,None,None,None]
                    },
                    {
                        "question": "16-3",
                        "question_max": 6,
                        "question_sum": 0,
                        "answers": [None,None]
                    }
                ]
            }
        ]
    }
]
