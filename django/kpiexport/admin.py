from django.contrib import admin
from .models import AuditLogTokens, AuditLogProjectStatus, AuditLogProjectStages, AuditLogUsers

from django.conf import settings
from rangefilter.filters import DateRangeFilter


class TestingOnlyAdmin(admin.ModelAdmin):
    def has_add_permission(self, request, obj=None):
        return False

    def has_delete_permission(self, request, obj=None):
        return settings.ENVIRONMENT_NAME != 'PRODUCTION'

    def has_change_permission(self, request, obj=None):
        return settings.ENVIRONMENT_NAME != 'PRODUCTION'


@admin.register(AuditLogUsers)
class AuditLogUsersAdmin(TestingOnlyAdmin):
    list_display = [
        'date', 'modified', 'country', 'registered', 'active'
    ]
    list_filter = (('date', DateRangeFilter), 'country')


@admin.register(AuditLogTokens)
class AuditLogTokensAdmin(TestingOnlyAdmin):
    list_display = [
        'date', 'modified', 'country', 'tokens'
    ]
    list_filter = (('date', DateRangeFilter), 'country')


@admin.register(AuditLogProjectStatus)
class AuditLogProjectStatusAdmin(TestingOnlyAdmin):
    list_display = [
        'date', 'modified', 'country', 'published', 'ready_to_publish', 'unpublished', 'to_delete', 'draft', 'growth'
    ]
    list_filter = (('date', DateRangeFilter), 'country')


@admin.register(AuditLogProjectStages)
class AuditLogProjectStagesAdmin(TestingOnlyAdmin):
    list_display = [
        'date', 'modified', 'country', 'stages',
    ]
    list_filter = (('date', DateRangeFilter), 'country')
