from allauth.account.adapter import DefaultAccountAdapter
from django.conf import settings
from django.contrib.sites.models import Site

# This has to stay here to use the proper celery instance with the djcelery_email package
import scheduler.celery # noqa


class DefaultAccountAdapterCustom(DefaultAccountAdapter):
    ACTIVATE_BASE_URL = 'http://' + Site.objects.get(id=settings.SITE_ID).domain + '/'

    def send_mail(self, template_prefix, email, context):
        context['activate_url'] = self.ACTIVATE_BASE_URL + \
            'email-confirmation/' + context['key']
        msg = self.render_mail(template_prefix, email, context)
        msg.send()
