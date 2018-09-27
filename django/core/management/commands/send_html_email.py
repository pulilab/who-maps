from django.core.mail import send_mail
from django.core.management.base import BaseCommand
from django.conf import settings
from django.template import loader, Context

# This has to stay here to use the proper celery instance with the djcelery_email package
import scheduler.celery # noqa


class Command(BaseCommand):
    help = """
    Sends HTML rendered template
    usage: send_html_email <type> <email address>
    eg: send_html_email email_confirmation_signup_message no@pulilab.com
    """

    def add_arguments(self, parser):
        parser.add_argument('type')
        parser.add_argument('email')

    def handle(self, *args, **options):
        self.stdout.write("-- Trying to send an email")
        type = options['type']
        email = options['email']
        html_template = loader.get_template("email/master-inline.html")
        html_message = html_template.render({"type": type})
        send_mail(
            subject="Test HTML templates",
            message="",
            from_email=settings.FROM_EMAIL,
            recipient_list=[email],
            html_message=html_message)

        self.stdout.write("-- Email sent to: %s" % email)
