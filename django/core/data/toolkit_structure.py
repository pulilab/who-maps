from django.utils.translation import ugettext_lazy as _

TOOLKIT_STRUCTURE = [
    {'domains': [
        {'id': 1,
         'sub_text': _('The articulation of the basic features of the scaling-up process, including the endgame '
                       'strategy, which will guide decision-making in other arenas'),
         'questions': [
             {'id': '1-1',
              'text': _('Have the overall goals for scaling up been articulated?'),
              'choices': [
                  {'label': _('No'),
                   'points': 0},
                  {'label': _('Yes'),
                   'points': 2}
              ],
              'answerTemplate': [
                  '1-1-3'
              ]}]
         },
        {'id': 2,
         'sub_text': _('The assessment of the environmental elements that may facilitate or impede implementation of '
                       'mHealth in the setting or settings targeted for scaling up'),
         'questions': [
             {'id': '2-1',
              'text': _('Has the policy environment in the local setting(s), where scaling up will take place, '
                        'been assessed?'),
              'choices': [
                  {'label': _('No'),
                   'points': 0},
                  {'label': _('Yes'),
                   'points': 2}
              ],
              'answerTemplate': [
                  '2-1-1',
                  '2-1-2',
                  '2-1-3'
              ]},
             {'id': '2-2',
              'text': 'Has the technical environment in the local setting(s), where scaling up will take '
                      'place, been assessed?',
              'choices': [
                  {'label': _('No'),
                   'points': 0},
                  {'label': _('Yes'),
                   'points': 2}
              ],
              'answerTemplate': [
                  '2-2-1',
                  '2-2-2',
                  '2-2-3',
                  '2-2-4'
              ]},
             {'id': '2-3',
              'text': 'Has the mHealth landscape in the local setting(s), where scaling up will take place, '
                      'been assessed? ',
              'choices': [
                  {'label': _('No'),
                   'points': 0},
                  {'label': _('Yes'),
                   'points': 2}
              ],
              'answerTemplate': [
                  '2-3-1',
                  '2-3-2',
                  '2-3-3',
                  '2-3-4'
              ]}]
         },
        {'id': 3,
         'sub_text': 'The assessment of general and context-specific evidence supporting the innovation, in order to '
                     'identify whether there is a need for additional evaluation activities prior to scaling up '
                     'further',
         'questions': [
             {'id': '3-1a',
              'text': 'Has sufficient evidence been gathered or previously produced in support of the mHealth product?',
              'choices': [
                  {'label': _('No'),
                   'points': 0},
                  {'label': _('Yes'),
                   'points': 2}
              ],
              'answerTemplate': [
                  '3-1a-1',
                  '3-1a-2',
                  '3-1a-3',
                  '3-1a-4'
              ]},
             {'id': '3-1b',
              'text': ' Have the key components of the product’s strategy (or health purpose) been validated?',
              'choices': [
                  {'label': _('No'),
                   'points': 0},
                  {'label': _('Yes'),
                   'points': 2}
              ],
              'answerTemplate': [
                  '3-1b-1',
                  '3-1b-2'
              ]},
             {'id': '3-2',
              'text': 'Has the product’s appropriateness in the local setting(s) been demonstrated?',
              'choices': [
                  {'label': _('No'),
                   'points': 0},
                  {'label': _('In progress'),
                   'points': 1},
                  {'label': _('Performed'),
                   'points': 2},
                  {'label': _('Documented'),
                   'points': 3}
              ],
              'answerTemplate': [
                  '3-2-1',
                  '3-2-2',
                  '3-2-3',
                  '3-2-4',
                  '3-2-5',
                  '3-2-6'
              ]}
         ]}
    ]},

    {'domains': [
        {'id': 4,
         'sub_text': 'The development of partnerships with external groups that contribute the skill sets, expertise, '
                     'services and/or other essential components needed for scaling up',
         'questions': [
             {'id': '4-1a',
              'text': 'Have the types of collaboration that will be necessary during the scaling-up process been '
                      'determined?',
              'choices': [
                  {'label': _('No'),
                   'points': 0},
                  {'label': _('In progress'),
                   'points': 1},
                  {'label': _('Performed'),
                   'points': 2},
                  {'label': _('Documented'),
                   'points': 3}
              ],
              'answerTemplate': [
                  '4-1a-1',
                  '4-1a-2',
                  '4-1a-3'
              ]},
             {'id': '4-1b',
              'text': 'Have relationships been developed with partners/vendors that fulfil the following needs, as '
                      'appropriate?',
              'choices': [
                  {'label': _('No'),
                   'points': 0},
                  {'label': _('Identified'),
                   'points': 1},
                  {'label': _('Informal Partnerships'),
                   'points': 2},
                  {'label': _('Formal partner with agreement'),
                   'points': 3},
                  {'label': _('N/A'),
                   'points': -1}
              ],
              'answerTemplate': [
                  '4-1b-1',
                  '4-1b-2',
                  '4-1b-3',
                  '4-1b-4',
                  '4-1b-5',
                  '4-1b-6',
                  '4-1b-7',
                  '4-1b-8',
                  '4-1b-9'
              ]},
             {'id': '4-2',
              'text': 'Has the value of the mHealth product been communicated to partners?',
              'choices': [
                  {'label': _('No'),
                   'points': 0},
                  {'label': _('In progress'),
                   'points': 1},
                  {'label': _('Performed'),
                   'points': 2},
                  {'label': _('Documented'),
                   'points': 3}
              ],
              'answerTemplate': [
                  '4-2-1',
                  '4-2-2',
                  '4-2-3',
                  '4-2-4'
              ]}
         ]},
        {'id': 5,
         'sub_text': 'The establishment of mechanisms will help to sustain partnerships as new challenges emerge '
                     'during scaling up',
         'questions': [
             {'id': '5-1a',
              'text': 'Have specific champions been fostered and developed among core partners, as needed?',
              'choices': [
                  {'label': _('No'),
                   'points': 0},
                  {'label': _('In progress'),
                   'points': 1},
                  {'label': _('Performed'),
                   'points': 2},
                  {'label': _('Documented'),
                   'points': 3}
              ],
              'answerTemplate': [
                  '5-1a-1',
                  '5-1a-2',
                  '5-1a-3'
              ]},
             {'id': '5-1b',
              'text': 'For one of the champions identified in SAQ 5-1a, does he/she have the capacity necessary to '
                      'advocate for the mHealth product?',
              'choices': [
                  {'label': _('No'),
                   'points': 0},
                  {'label': _('Yes'),
                   'points': 2}
              ],
              'answerTemplate': [
                  '5-1b-1',
                  '5-1b-2',
                  '5-1b-3',
                  '5-1b-4',
                  '5-1b-5'
              ]},
             {'id': '5-1c',
              'text': 'For a second champion identified in the previous question, does he/she have the capacity '
                      'necessary to advocate for the mHealth product?',
              'choices': [
                  {'label': _('No'),
                   'points': 0},
                  {'label': _('Yes'),
                   'points': 2}
              ],
              'answerTemplate': [
                  '5-1c-1',
                  '5-1c-2',
                  '5-1c-3',
                  '5-1c-4',
                  '5-1c-5'
              ]},
             {'id': '5-2a',
              'text': 'Have mechanisms for inclusive planning been established with partners?',
              'choices': [
                  {'label': _('No'),
                   'points': 0},
                  {'label': _('In progress'),
                   'points': 1},
                  {'label': _('Performed'),
                   'points': 2},
                  {'label': _('Documented'),
                   'points': 3}
              ],
              'answerTemplate': [
                  '5-2a-1',
                  '5-2a-2',
                  '5-2a-3',
                  '5-2a-4'
              ]},
             {'id': '5-2b',
              'text': 'Has a common understanding of the key components of the scaling-up process been established '
                      'with core partners?',
              'choices': [
                  {'label': _('No'),
                   'points': 0},
                  {'label': _('In progress'),
                   'points': 1},
                  {'label': _('Performed'),
                   'points': 2},
                  {'label': _('Documented'),
                   'points': 3}
              ],
              'answerTemplate': [
                  '5-2b-1',
                  '5-2b-2',
                  '5-2b-3'
              ]}
         ]}
    ]},

    {'domains': [
        {'id': 6,
         'sub_text': 'The understanding, assessment and projection of costs that will be associated with scaling up '
                     'the mHealth product',
         'questions': [
             {'id': '6-1',
              'text': 'Is there a solid understanding of the costs, from a programme perspective, to execute the '
                      'project at its current scale?',
              'choices': [
                  {'label': _('No'),
                   'points': 0},
                  {'label': _('In progress'),
                   'points': 1},
                  {'label': _('Performed'),
                   'points': 2},
                  {'label': _('Documented'),
                   'points': 3}
              ],
              'answerTemplate': [
                  '6-1-1',
                  '6-1-2',
                  '6-1-3',
                  '6-1-4',
                  '6-1-5',
                  '6-1-6'
              ]},
             {'id': '6-2',
              'text': 'Is there a solid understanding of the cost (if any) to the end-user or programme beneficiaries?',
              'choices': [
                  {'label': _('No'),
                   'points': 0},
                  {'label': _('In progress'),
                   'points': 1},
                  {'label': _('Performed'),
                   'points': 2},
                  {'label': _('Documented'),
                   'points': 3}
              ],
              'answerTemplate': [
                  '6-2-1',
                  '6-2-2'
              ]},
             {'id': '6-3',
              'text': ' Is there a solid understanding of the cost (if any) to the health system? ',
              'choices': [
                  {'label': _('No'),
                   'points': 0},
                  {'label': _('In progress'),
                   'points': 1},
                  {'label': _('Performed'),
                   'points': 2},
                  {'label': _('Documented'),
                   'points': 3}
              ],
              'answerTemplate': [
                  '6-3-1',
                  '6-3-2',
                  '6-3-3'
              ]},
             {'id': '6-4',
              'text': 'Have the potential economic costs for scaling up the mHealth project been forecasted?',
              'choices': [
                  {'label': _('No'),
                   'points': 0},
                  {'label': _('In progress'),
                   'points': 1},
                  {'label': _('Performed'),
                   'points': 2},
                  {'label': _('Documented'),
                   'points': 3}
              ],
              'answerTemplate': [
                  '6-4-1',
                  '6-4-2',
                  '6-4-3',
                  '6-4-4'
              ]}
         ]},
        {'id': 7,
         'sub_text': 'The analysis of the value proposition for each stakeholder and the identification of revenue '
                     'streams capable of sustaining project activities',
         'questions': [
             {'id': '7-1',
              'text': 'Has the value that the mHealth product delivers to stakeholders, as compared to existing '
                      'alternatives, been demonstrated?',
              'choices': [
                  {'label': _('No'),
                   'points': 0},
                  {'label': _('In progress'),
                   'points': 1},
                  {'label': _('Performed'),
                   'points': 2},
                  {'label': _('Documented'),
                   'points': 3}
              ],
              'answerTemplate': [
                  '7-1-1',
                  '7-1-2',
                  '7-1-3',
                  '7-1-4'
              ]},
             {'id': '7-2',
              'text': 'Has a comprehensive and logical business plan been developed to guide project operations and '
                      'resource mobilization?',
              'choices': [
                  {'label': _('No'),
                   'points': 0},
                  {'label': _('In progress'),
                   'points': 1},
                  {'label': _('Performed'),
                   'points': 2},
                  {'label': _('Documented'),
                   'points': 3}
              ],
              'answerTemplate': [
                  '7-2-1',
                  '7-2-2',
                  '7-2-3',
                  '7-2-4'
              ]},
             {'id': '7-3',
              'text': 'Have strategic choices been made regarding partners who offer sustainable funding for scaling '
                      'up?',
              'choices': [
                  {'label': _('No'),
                   'points': 0},
                  {'label': _('In progress'),
                   'points': 1},
                  {'label': _('Performed'),
                   'points': 2},
                  {'label': _('Documented'),
                   'points': 3}
              ],
              'answerTemplate': [
                  '7-3-1',
                  '7-3-2',
                  '7-3-3',
                  '7-3-4'
              ]}
         ]}
    ]},

    {'domains': [
        {'id': 8,
         'sub_text': 'Efforts to ensure that a number of elements of the mHealth technology and system are appropriate '
                     'to data needs throughout all stages of the scaling-up process, including access, transmission, '
                     'storage and security',
         'questions': [
             {'id': '8-1',
              'text': 'Does the application have features that aim to improve data accessibility and quality?',
              'choices': [
                  {'label': _('No'),
                   'points': 0},
                  {'label': _('Yes'),
                   'points': 1},
                  {'label': _('Documented'),
                   'points': 3}
              ],
              'answerTemplate': [
                  '8-1-1',
                  '8-1-2',
                  '8-1-3'
              ]},
             {'id': '8-2',
              'text': 'Is the data centre (server and connectivity) appropriate for supporting increases in data flow, '
                      'processing and storage during scaling up?',
              'choices': [
                  {'label': _('No'),
                   'points': 0},
                  {'label': _('Yes'),
                   'points': 1},
                  {'label': _('Documented'),
                   'points': 3}
              ],
              'answerTemplate': [
                  '8-2-1',
                  '8-2-2',
                  '8-2-3',
                  '8-2-4',
                  '8-2-5',
                  '8-2-6'
              ]},
             {'id': '8-3a',
              'text': 'Does the system include provisions for minimizing risk and maximizing data security?',
              'choices': [
                  {'label': _('No'),
                   'points': 0},
                  {'label': _('Yes'),
                   'points': 1},
                  {'label': _('Documented'),
                   'points': 3}
              ],
              'answerTemplate': [
                  '8-3a-1',
                  '8-3a-2',
                  '8-3a-3',
                  '8-3a-4'
              ]},
             {'id': '8-3b',
              'text': 'Do components of the system adhere to relevant government standards and policies for data '
                      'security and privacy?',
              'choices': [
                  {'label': _('No'),
                   'points': 0},
                  {'label': _('Yes'),
                   'points': 1},
                  {'label': _('Documented'),
                   'points': 3}
              ],
              'answerTemplate': [
                  '8-3b-1',
                  '8-3b-2'
              ]}
         ]},
        {'id': 9,
         'sub_text': 'The technology’s ability to work with other information systems and services within and across '
                     'organizations',
         'questions': [
             {'id': '9-1',
              'text': 'Have you taken steps to facilitate interoperability with relevant information systems and '
                      'applications/software?',
              'choices': [
                  {'label': _('No'),
                   'points': 0},
                  {'label': _('In progress'),
                   'points': 1},
                  {'label': _('Performed'),
                   'points': 2},
                  {'label': _('Documented'),
                   'points': 3}
              ],
              'answerTemplate': [
                  '9-1-1',
                  '9-1-2',
                  '9-1-3'
              ]},
             {'id': '9-2',
              'text': 'Have you achieved interoperability with information systems based on adherence to relevant data '
                      'standards?',
              'choices': [
                  {'label': _('No'),
                   'points': 0},
                  {'label': _('In progress'),
                   'points': 1},
                  {'label': _('Performed'),
                   'points': 2},
                  {'label': _('Interoperability Demostrated'),
                   'points': 3}
              ],
              'answerTemplate': [
                  '9-2-1',
                  '9-2-2',
                  '9-2-3'
              ]}
         ]},
        {'id': 10,
         'sub_text': 'The extent to which various components of the product are able to accommodate improvements and '
                     'changes as needs shift throughout the scaling-up process',
         'questions': [
             {'id': '10-1',
              'text': 'Can the technology be adapted to meet emerging needs during scaling up?',
              'choices': [
                  {'label': _('No'),
                   'points': 0},
                  {'label': _('In progress'),
                   'points': 1},
                  {'label': _('Performed'),
                   'points': 2},
                  {'label': _('Documented'),
                   'points': 3}
              ],
              'answerTemplate': [
                  '10-1-1',
                  '10-1-2',
                  '10-1-3',
                  '10-1-4'
              ]},
             {'id': '10-2',
              'text': 'Can the product’s content be adapted for new user groups and/or settings during scaling up?',
              'choices': [
                  {'label': _('No'),
                   'points': 0},
                  {'label': _('In progress'),
                   'points': 1},
                  {'label': _('Performed'),
                   'points': 2},
                  {'label': _('Documented'),
                   'points': 3}
              ],
              'answerTemplate': [
                  '10-2-1',
                  '10-2-2',
                  '10-2-3'
              ]},
             {'id': '10-3',
              'text': 'Have you taken steps to facilitate the transferability of the product with different kinds of '
                      'hardware/systems?',
              'choices': [
                  {'label': _('No'),
                   'points': 0},
                  {'label': _('In progress'),
                   'points': 1},
                  {'label': _('Performed'),
                   'points': 2},
                  {'label': _('Documented'),
                   'points': 3}
              ],
              'answerTemplate': [
                  '10-3-1',
                  '10-3-2'
              ]}
         ]}
    ]},

    {'domains': [
        {'id': 11,
         'sub_text': 'Considerations surrounding the restructuring and expansion of human resources, including project '
                     'team members (staff and health workers) and leadership positions',
         'questions': [
             {'id': '11-1',
              'text': 'Are appropriate mechanisms in place to allow the project to adapt to changing human resource '
                      'needs?',
              'choices': [
                  {'label': _('No'),
                   'points': 0},
                  {'label': _('In progress'),
                   'points': 1},
                  {'label': _('Performed'),
                   'points': 2},
                  {'label': _('Documented'),
                   'points': 3}
              ],
              'answerTemplate': [
                  '11-1-1',
                  '11-1-2',
                  '11-1-3',
                  '11-1-4',
                  '11-1-5',
                  '11-1-6',
                  '11-1-7'
              ]},
             {'id': '11-2',
              'text': 'Have the key leadership positions required to guide scaling up and support operations been '
                      'filled?',
              'choices': [
                  {'label': _('No'),
                   'points': 0},
                  {'label': _('In progress'),
                   'points': 1},
                  {'label': _('Performed'),
                   'points': 2},
                  {'label': _('Documented'),
                   'points': 3}
              ],
              'answerTemplate': [
                  '11-2-1',
                  '11-2-2',
                  '11-2-3',
                  '11-2-4'
              ]}
         ]},
        {'id': 12,
         'sub_text': 'The availability of appropriate training activities to ensure that users have the necessary '
                     'skills and capacity required to support scaling up, and the presence of reliable assistance and '
                     'supervisory structures to address emerging issues while scaling up',
         'questions': [
             {'id': '12-1a',
              'text': 'Have training programmes for end-users and secondary users of the product been developed?',
              'choices': [
                  {'label': _('No'),
                   'points': 0},
                  {'label': _('In progress'),
                   'points': 1},
                  {'label': _('Performed'),
                   'points': 2},
                  {'label': _('Documented'),
                   'points': 3},
                  {'label': _('N/A'),
                   'points': -1}
              ],
              'answerTemplate': [
                  '12-1a-1',
                  '12-1a-2',
                  '12-1a-3',
                  '12-1a-4',
                  '12-1a-5'
              ],
              'forbiddenChoices': {
                  '12-1a-1': -1,
                  '12-1a-2': -1
              }},
             {'id': '12-1b',
              'text': 'Are the tools developed for end-users and secondary users appropriate?',
              'choices': [
                  {'label': _('No'),
                   'points': 0},
                  {'label': _('In progress'),
                   'points': 1},
                  {'label': _('Performed'),
                   'points': 2},
                  {'label': _('Documented'),
                   'points': 3}
              ],
              'answerTemplate': [
                  '12-1b-1',
                  '12-1b-2',
                  '12-1b-3',
                  '12-1b-4'
              ]},
             {'id': '12-2',
              'text': 'Has a structure been established for providing ongoing supervision for end-users during and '
                      'after their adoption of the product?',
              'choices': [
                  {'label': _('No'),
                   'points': 0},
                  {'label': _('In progress'),
                   'points': 1},
                  {'label': _('Performed'),
                   'points': 2},
                  {'label': _('Documented'),
                   'points': 3}
              ],
              'answerTemplate': [
                  '12-2-1',
                  '12-2-2',
                  '12-2-3'
              ]},
             {'id': '12-3',
              'text': 'Have efforts been made to ensure that adequate user and technical support systems are in place?',
              'choices': [
                  {'label': _('No'),
                   'points': 0},
                  {'label': _('In progress'),
                   'points': 1},
                  {'label': _('Performed'),
                   'points': 2},
                  {'label': _('Documented'),
                   'points': 3}
              ],
              'answerTemplate': [
                  '12-3-1',
                  '12-3-2',
                  '12-3-3'
              ]}
         ]},
        {'id': 13,
         'sub_text': 'Efforts to orient key stakeholder groups and raise awareness in targeted communities in order to '
                     'promote wider acceptance of the mHealth product and its scaling up',
         'questions': [
             {'id': '13-1',
              'text': 'Have procedures and strategies for orienting key stakeholders to the mHealth product been '
                      'developed?',
              'choices': [
                  {'label': _('No'),
                   'points': 0},
                  {'label': _('In progress'),
                   'points': 1},
                  {'label': _('Performed'),
                   'points': 2},
                  {'label': _('Documented'),
                   'points': 3}
              ],
              'answerTemplate': [
                  '13-1-1',
                  '13-1-2',
                  '13-1-3'
              ]},
             {'id': '13-2',
              'text': 'Has community mobilization been undertaken with the communities that will be served by scaling '
                      'up the mHealth product?',
              'choices': [
                  {'label': _('No'),
                   'points': 0},
                  {'label': _('In progress'),
                   'points': 1},
                  {'label': _('Performed'),
                   'points': 2},
                  {'label': _('Documented'),
                   'points': 3}
              ],
              'answerTemplate': [
                  '13-2-1',
                  '13-2-2'
              ]}
         ]},
        {'id': 14,
         'sub_text': 'Considerations and guidelines surrounding operational procedures to maintain the continuity of '
                     'use of the product in light of technical and programmatic obstacles',
         'questions': [
             {'id': '14-1',
              'text': 'Have procedures been developed for addressing technical constraints (such as those identified '
                      'in Factor 2-2)?',
              'choices': [
                  {'label': _('No'),
                   'points': 0},
                  {'label': _('In progress'),
                   'points': 1},
                  {'label': _('Performed'),
                   'points': 2},
                  {'label': _('Documented'),
                   'points': 3}
              ],
              'answerTemplate': [
                  '14-1-1',
                  '14-1-2',
                  '14-1-3'
              ]},
             {'id': '14-2',
              'text': 'Have procedures been developed for retaining mobile devices in a health worker setting?',
              'choices': [
                  {'label': _('No'),
                   'points': 0},
                  {'label': _('In progress'),
                   'points': 1},
                  {'label': _('Performed'),
                   'points': 2},
                  {'label': _('Documented'),
                   'points': 3}
              ],
              'answerTemplate': [
                  '14-2-1',
                  '14-2-2',
                  '14-2-3'
              ]}
         ]}
    ]},

    {'domains': [
        {'id': 15,
         'sub_text': 'The routine monitoring of implementation fidelity and use of the product, and the use of these '
                     'data for the purposes of continuous improvement',
         'questions': [
             {'id': '15-1a',
              'text': 'Have appropriate resources been allocated to support ongoing monitoring of implementation '
                      'throughout all stages of scaling up?',
              'choices': [
                  {'label': _('No'),
                   'points': 0},
                  {'label': _('Yes'),
                   'points': 2}
              ],
              'answerTemplate': [
                  '15-1a-1',
                  '15-1a-2'
              ]},
             {'id': '15-1b',
              'text': 'Have processes and tools been developed for monitoring implementation and programme fidelity?',
              'choices': [
                  {'label': _('No'),
                   'points': 0},
                  {'label': _('In progress'),
                   'points': 1},
                  {'label': _('Performed'),
                   'points': 2},
                  {'label': _('Documented'),
                   'points': 3}
              ],
              'answerTemplate': [
                  '15-1b-1',
                  '15-1b-2',
                  '15-1b-3'
              ]},
             {'id': '15-2',
              'text': 'Have processes and tools been developed to allow for data analysis and optimization of '
                      'implementation?',
              'choices': [
                  {'label': _('No'),
                   'points': 0},
                  {'label': _('In progress'),
                   'points': 1},
                  {'label': _('Performed'),
                   'points': 2},
                  {'label': _('Documented'),
                   'points': 3}
              ],
              'answerTemplate': [
                  '15-2-1',
                  '15-2-2',
                  '15-2-3',
                  '15-2-4'
              ]}
         ]},
        {'id': 16,
         'sub_text': 'Process in place to assess the product’s effects in relation to the health system, health '
                     'services and/or individuals’ health status, using rigorous and systematic research methods',
         'questions': [
             {'id': '16-1a',
              'text': 'Have appropriate resources been allocated to support evaluation research?',
              'choices': [
                  {'label': _('No'),
                   'points': 0},
                  {'label': _('Yes'),
                   'points': 2}
              ],
              'answerTemplate': [
                  '16-1a-1',
                  '16-1a-2',
                  '16-1a-3'
              ]},
             {'id': '16-1b',
              'text': 'Has the foundation been laid for conducting relevant evaluation research using appropriate '
                      'methods?',
              'choices': [
                  {'label': _('No'),
                   'points': 0},
                  {'label': _('In progress'),
                   'points': 1},
                  {'label': _('Performed'),
                   'points': 2},
                  {'label': _('Documented'),
                   'points': 3}
              ],
              'answerTemplate': [
                  '16-1b-1',
                  '16-1b-2',
                  '16-1b-3'
              ]},
             {'id': '16-1c',
              'text': 'Are data streams available for supporting evaluation research activities?',
              'choices': [
                  {'label': _('No'),
                   'points': 0},
                  {'label': _('In progress'),
                   'points': 1},
                  {'label': _('Performed'),
                   'points': 2},
                  {'label': _('Documented'),
                   'points': 3}
              ],
              'answerTemplate': [
                  '16-1c-1',
                  '16-1c-2'
              ]},
             {'id': '16-2a',
              'text': 'Have the types of evidence that will be demonstrated at various levels of the health sector, '
                      'and by key stakeholders, been articulated?',
              'choices': [
                  {'label': _('No'),
                   'points': 0},
                  {'label': _('In progress'),
                   'points': 1},
                  {'label': _('Performed'),
                   'points': 2},
                  {'label': _('Documented'),
                   'points': 3}
              ],
              'answerTemplate': [
                  '16-2a-1',
                  '16-2a-2',
                  '16-2a-3',
                  '16-2a-4'
              ]},
             {'id': '16-2b',
              'text': 'For each of the outcomes specified in 16-2a, have the key components of the evaluation process '
                      'been defined?',
              'choices': [
                  {'label': _('No'),
                   'points': 0},
                  {'label': _('In progress'),
                   'points': 1},
                  {'label': _('Performed'),
                   'points': 2},
                  {'label': _('Documented'),
                   'points': 3}
              ],
              'answerTemplate': [
                  '16-2b-1',
                  '16-2b-2',
                  '16-2b-3',
                  '16-2b-4'
              ]},
             {'id': '16-2c',
              'text': 'Has data collection been carried out to support the following evidence claims?',
              'choices': [
                  {'label': _('No'),
                   'points': 0},
                  {'label': _('In progress'),
                   'points': 1},
                  {'label': _('Performed'),
                   'points': 2},
                  {'label': _('Documented'),
                   'points': 3}
              ],
              'answerTemplate': [
                  '16-2c-1',
                  '16-2c-2',
                  '16-2c-3',
                  '16-2c-4',
                  '16-2c-5'
              ]},
             {'id': '16-3',
              'text': 'Have the means of dissemination of evaluation results been defined?',
              'choices': [
                  {'label': _('No'),
                   'points': 0},
                  {'label': _('In progress'),
                   'points': 1},
                  {'label': _('Performed'),
                   'points': 2},
                  {'label': _('Documented'),
                   'points': 3}
              ],
              'answerTemplate': [
                  '16-3-1',
                  '16-3-2'
              ]}
         ]}
    ]}
]
