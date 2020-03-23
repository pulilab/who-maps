from django.contrib import admin

from systemmessages.models import SystemMessage


@admin.register(SystemMessage)
class SystemMessageAdmin(admin.ModelAdmin):
    list_display = ('id', 'created', 'receiver_type', 'receivers_number', 'subject')
    readonly_fields = ['receivers_number']

    def has_change_permission(self, request, obj=None):
        return False

    def has_delete_permission(self, request, obj=None):
        return False
