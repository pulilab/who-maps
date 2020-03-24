from __future__ import unicode_literals

from modeltranslation.translator import register, TranslationOptions

from systemmessages.models import SystemMessage


@register(SystemMessage)
class SystemMessageTranslationOptions(TranslationOptions):
    fields = ('subject', 'message')
