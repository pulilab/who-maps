from django.utils.translation import ugettext_lazy as _


LANDING_PAGE_DEFAULTS = {
    'name': 'WHO',
    'code': 'who',
    'logo': False,
    'cover': '',
    'cover_text': _('The Digital Health Atlas is a WHO global technology registry platform aiming to strengthen the '
                    'value and impact of digital health investments, improve coordination, and facilitate '
                    'institutionalization and scale.'),
    'footer_title': '',
    'permanent_footer': _('The DHA is led by WHO RHR/HRP, for the Health Data Collaborative Working Group on Digital '
                          'Health and Interoperability, with support from USAID, Digital Square, UN Foundation,' 
                          'Johns Hopkins University Global mHealth Initiative, '
                          'mPowering, developed as a global good software in response to the proliferation of '
                          'uncoordinated duplicative investments into digital health.'),
    'footer_text': '',
    'default_partners': [],
    'partner_logos': []
}
