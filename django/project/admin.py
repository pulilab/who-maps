from django.contrib import admin

from core.admin import AllObjectsAdmin
from .models import TechnologyPlatform, InteroperabilityLink, DigitalStrategy, HealthFocusArea, HealthCategory


class TechnologyPlatformAdmin(AllObjectsAdmin):
    list_display = ['name',]


class InteroperabilityLinkAdmin(AllObjectsAdmin):
    list_display = ['pre', 'name',]


class DigitalStrategyAdmin(AllObjectsAdmin):
    list_display = ['__str__',]


admin.site.register(TechnologyPlatform, TechnologyPlatformAdmin)
admin.site.register(InteroperabilityLink, InteroperabilityLinkAdmin)
admin.site.register(DigitalStrategy, DigitalStrategyAdmin)
admin.site.register(HealthFocusArea)
admin.site.register(HealthCategory)
