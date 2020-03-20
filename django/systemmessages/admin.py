from django.conf import settings
from django.contrib import admin

from systemmessages.models import SystemMessage


@admin.register(SystemMessage)
class SystemMessageAdmin(admin.ModelAdmin):
    list_display = ('id', 'created', 'receiver_type', 'receivers_number', 'subject')

    def has_delete_permission(self, request, obj=None):
        return False

    def get_readonly_fields(self, request, obj=None):
        if obj:
            languages = dict(settings.LANGUAGES).keys()
            language_fields = [f'subject_{lang}' for lang in languages] + \
                              [f'message_{lang}' for lang in languages]
            return ['message', 'receiver_type', 'receivers_number', 'subject'] + language_fields
        else:
            return ['receivers_number']
