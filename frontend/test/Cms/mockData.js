const resources = [
  {
    domain: 'Data'
  },
  {
    domain: 'Adaptability'
  },
  {
    domain: 'Scientific Basis'
  }
];
const lessons = [
  {
    domain: 'Data'
  },
  {
    domain: 'Adaptability'
  }
];
const experiences = [
  {
    domain: 'Data'
  },
  {
    domain: 'Data'
  },
  {
    domain: 'Data'
  },
  {
    domain: 'Adaptability'
  },
  {
    domain: 'Scientific Basis'
  },
  {
    domain: 'Financial Model'
  }
];

const randomString = size => {
  const text = [];
  const possible = 'abcdefghijklmnopqrstuvwxyz';

  for (let i = 0; i < size; i++) {
    text.push(possible.charAt(Math.floor(Math.random() * possible.length)));
    if (Math.random() <= 0.25) {
      text.push(' ');
    }
  }

  return text.join('');
};

const randomDate = () => {
  return new Date(+(new Date()) - Math.floor(Math.random() * 10000000000));
};

const addRandomStuff = (item) => {
  const randInteger = Math.floor(Math.random() * 10);
  item.reported = Math.random() < 0.5;
  item.name = randomString(40);
  item.body = randomString(350);
  item.comments = [];
  for (let i = 0; i <= randInteger; i++) {
    const comment = {
      text: randomString(150),
      reported: Math.random() < 0.5,
      date: randomDate(),
      username: randomString(10)
    };
    item.comments.push(comment);
  }
};

experiences.forEach(item => {
  addRandomStuff(item);
  item.date = randomDate();
  item.avatar = Math.random() <= 0.65 ? 'https://unsplash.it/80/' : null;
  item.type = 'experiences';
});
resources.forEach(item => {
  addRandomStuff(item);
  item.type = 'resources';
  item.cover = Math.random() <= 0.65 ? 'https://unsplash.it/120/170/' : null;
});
lessons.forEach(item => {
  addRandomStuff(item);
  item.type = 'lessons';
  item.cover = Math.random() <= 0.65 ? 'https://unsplash.it/120/170/' : null;
});

const scores = [
  {
    'axis': 'AXIS 1. GROUNDWORK',
    'domains': [
      {
        'domain': 'DOMAIN 1: PARAMETERS OF SCALE',
        'questions': [
          {
            'answers': [
              null
            ],
            'question': '1-1',
            'question_max': 2,
            'question_sum': 0
          }
        ],
        'domain_max': 2,
        'domain_sum': 1.3,
        'domain_completion': 0,
        'domain_percentage': 0,
        'id': 1
      },
      {
        'domain': 'DOMAIN 2: CONTEXTUAL ENVIRONMENT',
        'questions': [
          {
            'answers': [
              null,
              null,
              null
            ],
            'question': '2-1',
            'question_max': 6,
            'question_sum': 0
          },
          {
            'answers': [
              null,
              null,
              null,
              null
            ],
            'question': '2-2',
            'question_max': 8,
            'question_sum': 0
          },
          {
            'answers': [
              null,
              null,
              null,
              null
            ],
            'question': '2-3',
            'question_max': 8,
            'question_sum': 0
          }
        ],
        'domain_max': 22,
        'domain_sum': 0,
        'domain_completion': 0,
        'domain_percentage': 0,
        'id:': 2
      },
      {
        'domain': 'DOMAIN 3: SCIENTIFIC BASIS',
        'questions': [
          {
            'answers': [
              null,
              null,
              null,
              null
            ],
            'question': '3-1a',
            'question_max': 8,
            'question_sum': 0
          },
          {
            'answers': [
              null,
              null
            ],
            'question': '3-1b',
            'question_max': 4,
            'question_sum': 0
          },
          {
            'answers': [
              null,
              null,
              null,
              null,
              null,
              null
            ],
            'question': '3-2',
            'question_max': 18,
            'question_sum': 0
          }
        ],
        'domain_max': 30,
        'domain_sum': 0,
        'domain_completion': 0,
        'domain_percentage': 0,
        'id:': 3
      }
    ],
    'axis_score': 0,
    'axis_completion': 0
  },
  {
    'axis': 'AXIS 2. PARTNERSHIPS',
    'domains': [
      {
        'domain': 'DOMAIN 4: STRATEGIC ENGAGEMENT',
        'questions': [
          {
            'answers': [
              null,
              null,
              null
            ],
            'question': '4-1a',
            'question_max': 9,
            'question_sum': 0
          },
          {
            'answers': [
              null,
              null,
              null,
              null,
              null,
              null,
              null,
              null,
              null
            ],
            'question': '4-1b',
            'question_max': 27,
            'question_sum': 0
          },
          {
            'answers': [
              null,
              null,
              null,
              null
            ],
            'question': '4-2',
            'question_max': 12,
            'question_sum': 0
          }
        ],
        'domain_max': 48,
        'domain_sum': 0,
        'domain_completion': 0,
        'domain_percentage': 0,
        'id:': 4
      },
      {
        'domain': 'DOMAIN 5: PARTNERSHIP SUSTAINABILITY',
        'questions': [
          {
            'answers': [
              null,
              null,
              null
            ],
            'question': '5-1a',
            'question_max': 9,
            'question_sum': 0
          },
          {
            'answers': [
              null,
              null,
              null,
              null,
              null
            ],
            'question': '5-1b',
            'question_max': 10,
            'question_sum': 0
          },
          {
            'answers': [
              null,
              null,
              null,
              null,
              null
            ],
            'question': '5-1c',
            'question_max': 10,
            'question_sum': 0
          },
          {
            'answers': [
              null,
              null,
              null,
              null
            ],
            'question': '5-2a',
            'question_max': 12,
            'question_sum': 0
          },
          {
            'answers': [
              null,
              null,
              null
            ],
            'question': '5-2b',
            'question_max': 9,
            'question_sum': 0
          }
        ],
        'domain_max': 50,
        'domain_sum': 0,
        'domain_completion': 0,
        'domain_percentage': 0,
        'id:': 5
      }
    ],
    'axis_score': 0,
    'axis_completion': 0
  },
  {
    'axis': 'AXIS 3. FINANCIAL HEALTH',
    'domains': [
      {
        'domain': 'DOMAIN 6: FINANCIAL MANAGEMENT',
        'questions': [
          {
            'answers': [
              null,
              null,
              null,
              null,
              null,
              null
            ],
            'question': '6-1',
            'question_max': 18,
            'question_sum': 0
          },
          {
            'answers': [
              null,
              null
            ],
            'question': '6-2',
            'question_max': 6,
            'question_sum': 0
          },
          {
            'answers': [
              null,
              null,
              null
            ],
            'question': '6-3',
            'question_max': 9,
            'question_sum': 0
          },
          {
            'answers': [
              null,
              null,
              null,
              null
            ],
            'question': '6-4',
            'question_max': 12,
            'question_sum': 0
          }
        ],
        'domain_max': 45,
        'domain_sum': 0,
        'domain_completion': 0,
        'domain_percentage': 0,
        'id:': 6
      },
      {
        'domain': 'DOMAIN 7: FINANCIAL MODEL',
        'questions': [
          {
            'answers': [
              null,
              null,
              null,
              null
            ],
            'question': '7-1',
            'question_max': 12,
            'question_sum': 0
          },
          {
            'answers': [
              null,
              null,
              null,
              null
            ],
            'question': '7-2',
            'question_max': 12,
            'question_sum': 0
          },
          {
            'answers': [
              null,
              null,
              null,
              null
            ],
            'question': '7-3',
            'question_max': 12,
            'question_sum': 0
          }
        ],
        'domain_max': 36,
        'domain_sum': 0,
        'domain_completion': 0,
        'domain_percentage': 0,
        'id:': 7
      }
    ],
    'axis_score': 0,
    'axis_completion': 0
  },
  {
    'axis': 'AXIS 4. TECHNOLOGY & ARCHITECTURE',
    'domains': [
      {
        'domain': 'DOMAIN 8: DATA',
        'questions': [
          {
            'answers': [
              null,
              null,
              null
            ],
            'question': '8-1',
            'question_max': 9,
            'question_sum': 0
          },
          {
            'answers': [
              null,
              null,
              null,
              null,
              null,
              null
            ],
            'question': '8-2',
            'question_max': 18,
            'question_sum': 0
          },
          {
            'answers': [
              null,
              null,
              null,
              null
            ],
            'question': '8-3a',
            'question_max': 12,
            'question_sum': 0
          },
          {
            'answers': [
              null,
              null
            ],
            'question': '8-3b',
            'question_max': 6,
            'question_sum': 0
          }
        ],
        'domain_max': 43,
        'domain_sum': 0,
        'domain_completion': 0,
        'domain_percentage': 0,
        'id:': 8
      },
      {
        'domain': 'DOMAIN 9: INTEROPERABILITY',
        'questions': [
          {
            'answers': [
              null,
              null,
              null
            ],
            'question': '9-1',
            'question_max': 9,
            'question_sum': 0
          },
          {
            'answers': [
              null,
              null,
              null
            ],
            'question': '9-2',
            'question_max': 9,
            'question_sum': 0
          }
        ],
        'domain_max': 18,
        'domain_sum': 0,
        'domain_completion': 0,
        'domain_percentage': 0,
        'id:': 1
      },
      {
        'domain': 'DOMAIN 10: ADAPTABILITY',
        'questions': [
          {
            'answers': [
              null,
              null,
              null,
              null
            ],
            'question': '10-1',
            'question_max': 12,
            'question_sum': 0
          },
          {
            'answers': [
              null,
              null,
              null
            ],
            'question': '10-2',
            'question_max': 9,
            'question_sum': 0
          },
          {
            'answers': [
              null,
              null
            ],
            'question': '10-3',
            'question_max': 6,
            'question_sum': 0
          }
        ],
        'domain_max': 30,
        'domain_sum': 0,
        'domain_completion': 0,
        'domain_percentage': 0,
        'id:': 9
      }
    ],
    'axis_score': 0,
    'axis_completion': 0
  },
  {
    'axis': 'AXIS 5. OPERATIONS',
    'domains': [
      {
        'domain': 'DOMAIN 11: PERSONNEL',
        'questions': [
          {
            'answers': [
              null,
              null,
              null,
              null,
              null,
              null,
              null
            ],
            'question': '11-1',
            'question_max': 21,
            'question_sum': 0
          },
          {
            'answers': [
              null,
              null,
              null,
              null
            ],
            'question': '11-2',
            'question_max': 12,
            'question_sum': 0
          }
        ],
        'domain_max': 33,
        'domain_sum': 0,
        'domain_completion': 0,
        'domain_percentage': 0,
        'id:': 10
      },
      {
        'domain': 'DOMAIN 12: TRAINING AND SUPPORT',
        'questions': [
          {
            'answers': [
              null,
              null,
              null,
              null,
              null
            ],
            'question': '12-1a',
            'question_max': 15,
            'question_sum': 0
          },
          {
            'answers': [
              null,
              null,
              null,
              null
            ],
            'question': '12-1b',
            'question_max': 12,
            'question_sum': 0
          },
          {
            'answers': [
              null,
              null,
              null
            ],
            'question': '12-2',
            'question_max': 9,
            'question_sum': 0
          },
          {
            'answers': [
              null,
              null,
              null
            ],
            'question': '12-3',
            'question_max': 9,
            'question_sum': 0
          }
        ],
        'domain_max': 45,
        'domain_sum': 0,
        'domain_completion': 0,
        'domain_percentage': 0,
        'id:': 11
      },
      {
        'domain': 'DOMAIN 13: OUTREACH AND SENSITIZATION',
        'questions': [
          {
            'answers': [
              null,
              null,
              null
            ],
            'question': '13-1',
            'question_max': 9,
            'question_sum': 0
          },
          {
            'answers': [
              null,
              null
            ],
            'question': '13-2',
            'question_max': 6,
            'question_sum': 0
          }
        ],
        'domain_max': 15,
        'domain_sum': 0,
        'domain_completion': 0,
        'domain_percentage': 0,
        'id:': 12
      },
      {
        'domain': 'DOMAIN 14: CONTINGENCY PLANNING',
        'questions': [
          {
            'answers': [
              null,
              null,
              null
            ],
            'question': '14-1',
            'question_max': 9,
            'question_sum': 0
          },
          {
            'answers': [
              null,
              null,
              null
            ],
            'question': '14-2',
            'question_max': 9,
            'question_sum': 0
          }
        ],
        'domain_max': 18,
        'domain_sum': 0,
        'domain_completion': 0,
        'domain_percentage': 0,
        'id:': 13
      }
    ],
    'axis_score': 0,
    'axis_completion': 0
  },
  {
    'axis': 'AXIS 6. MONITORING & EVALUATION',
    'domains': [
      {
        'domain': 'DOMAIN 15: PROCESS MONITORING',
        'questions': [
          {
            'answers': [
              null,
              null
            ],
            'question': '15-1a',
            'question_max': 4,
            'question_sum': 0
          },
          {
            'answers': [
              null,
              null,
              null
            ],
            'question': '15-1b',
            'question_max': 9,
            'question_sum': 0
          },
          {
            'answers': [
              null,
              null,
              null,
              null
            ],
            'question': '15-2',
            'question_max': 12,
            'question_sum': 0
          }
        ],
        'domain_max': 25,
        'domain_sum': 0,
        'domain_completion': 0,
        'domain_percentage': 0,
        'id:': 14
      },
      {
        'domain': 'DOMAIN 16: EVALUATION RESEARCH',
        'questions': [
          {
            'answers': [
              null,
              null,
              null
            ],
            'question': '16-1a',
            'question_max': 6,
            'question_sum': 0
          },
          {
            'answers': [
              null,
              null,
              null
            ],
            'question': '16-1b',
            'question_max': 9,
            'question_sum': 0
          },
          {
            'answers': [
              null,
              null
            ],
            'question': '16-1c',
            'question_max': 6,
            'question_sum': 0
          },
          {
            'answers': [
              null,
              null,
              null,
              null
            ],
            'question': '16-2a',
            'question_max': 12,
            'question_sum': 0
          },
          {
            'answers': [
              null,
              null,
              null,
              null
            ],
            'question': '16-2b',
            'question_max': 12,
            'question_sum': 0
          },
          {
            'answers': [
              null,
              null,
              null,
              null,
              null
            ],
            'question': '16-2c',
            'question_max': 15,
            'question_sum': 0
          },
          {
            'answers': [
              null,
              null
            ],
            'question': '16-3',
            'question_max': 6,
            'question_sum': 0
          }
        ],
        'domain_max': 66,
        'domain_sum': 0,
        'domain_completion': 0,
        'domain_percentage': 0,
        'id:': 15
      }
    ],
    'axis_score': 0,
    'axis_completion': 0
  }
];

export {
  resources,
  lessons,
  experiences,
  scores
};
