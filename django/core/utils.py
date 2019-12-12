from typing import Dict, Union, List
from django.conf import settings
from django.core.mail import send_mail
from django.template import loader
from django.utils.translation import override, ugettext


def send_mail_wrapper(subject: str, email_type: str,
                      to: Union[str, List[str]], language: str,
                      context: Dict = None) -> None:
