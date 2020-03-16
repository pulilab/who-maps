from django.contrib import admin

from systemmessages.models import SystemMessage


@admin.register(SystemMessage)
class SystemMessageAdmin(admin.ModelAdmin):
    list_display = ('id', 'created', 'receiver_type', 'receivers_number', 'subject')
    readonly_fields = ('receivers_number',)
