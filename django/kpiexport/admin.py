from adminsortable2.admin import SortableAdminMixin
from django.contrib import admin
from django.contrib.admin import SimpleListFilter
from django.db.models import Q
from django.utils.html import mark_safe
from core.admin import AllObjectsAdmin
from country.models import Country
from .models import AuditLogTokens, AuditLogProjectStatus, AuditLogProjectStages, AuditLogUsers

from django.conf import settings

class TechnologyPlatformAdmin(AllObjectsAdmin):
    list_display = [
        'name', 'state', 'added_by'
    ]
    list_filter = [SoftwareStateFilter]
    actions = (approve, decline)

