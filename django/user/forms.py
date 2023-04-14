from allauth.account.utils import user_pk_to_url_str
from django.contrib.auth.forms import PasswordResetForm

from core.utils import send_mail_wrapper


class PasswordHTMLEmailResetForm(PasswordResetForm):
    def send_mail(self, subject_template_name, email_template_name,
                  context, from_email, to_email, html_email_template_name=None):

        """ WORKAROUND:
            https://github.com/iMerica/dj-rest-auth/issues/269
            https://github.com/iMerica/dj-rest-auth/issues/299
        Using PasswordResetForm from django not from Allauth, so if we want to decode the uid and token with Allauth
        we need to encode the uid with Allauth uid encode.
        """
        context['uid'] = user_pk_to_url_str(context['user'])

        send_mail_wrapper(email_type="password_reset",
                          subject="Your Digital Health Atlas password has been reset",
                          to=to_email,
                          language=context['user'].userprofile.language,
                          context=context)
