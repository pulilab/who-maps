from allauth.account.adapter import DefaultAccountAdapter
from django.conf import settings
from django.contrib.sites.models import Site


class DefaultAccountAdapterCustom(DefaultAccountAdapter):
    ACTIVATE_BASE_URL = 'http://' + Site.objects.get(id=settings.SITE_ID).domain + '/'

    def send_mail(self, template_prefix, email, context):
        context['activate_url'] = self.ACTIVATE_BASE_URL + \
            'email-confirmation/' + context['key']
        msg = self.render_mail(template_prefix, email, context)
        msg.send()
