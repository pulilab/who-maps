from adminsortable2.admin import SortableAdminMixin
from django.contrib import admin
from django.contrib.admin import SimpleListFilter
from django.db.models import Q
from django.utils.html import mark_safe
from core.admin import AllObjectsAdmin
from country.models import Country
from .models import AuditLogTokens, AuditLogProjectStatus, AuditLogProjectStages, AuditLogUsers

from django.conf import settings
from django.contrib.admin import DateFieldListFilter
from rangefilter.filters import DateRangeFilter, DateTimeRangeFilter


@admin.register(AuditLogUsers)
class AuditLogUsersAdmin(admin.ModelAdmin):
    list_display = [
        'date', 'country', 'registered', 'active'
    ]
    list_filter = (('date', DateRangeFilter), 'country')
