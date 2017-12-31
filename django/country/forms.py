from __future__ import unicode_literals

from django import forms
from django.core.exceptions import ValidationError
from django.utils.translation import ugettext

from core.admin.widgets import NoneReadOnlyAdminArrayField
from .models import CountryField


class CountryFieldAdminForm(forms.ModelForm):
    class Meta:
        model = CountryField
        fields = ('type', 'question', 'options', 'required')

    def clean(self):
        if 'type' in self.cleaned_data:
            obj_type = self.cleaned_data['type']
        else:
            obj_type = self.instance.type

        if obj_type in [4, 5] and not self.cleaned_data.get('options'):
            raise ValidationError(ugettext('Options is a required field'))
        return super(CountryFieldAdminForm, self).clean()


class CountryFieldAdminFormNoneReadOnlyOptions(CountryFieldAdminForm):
    options = NoneReadOnlyAdminArrayField(base_field=forms.CharField(), required=False)
