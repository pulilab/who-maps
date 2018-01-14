from __future__ import unicode_literals

from modeltranslation.translator import register, TranslationOptions
from .models import Country


@register(Country)
class CountryTranslationOptions(TranslationOptions):
    fields = ('name',)
    empty_values = {'name': None}
