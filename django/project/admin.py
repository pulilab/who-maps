from django.contrib import admin

from core.admin import AllObjectsAdmin
from .models import TechnologyPlatform, InteroperabilityStandard, DigitalStrategy


class TechnologyPlatformAdmin(AllObjectsAdmin):
    list_display = ['name',]


class InteroperabilityStandardAdmin(AllObjectsAdmin):
    list_display = ['name',]


class DigitalStrategyAdmin(AllObjectsAdmin):
    list_display = ['__str__',]


admin.site.register(TechnologyPlatform, TechnologyPlatformAdmin)
admin.site.register(InteroperabilityStandard, InteroperabilityStandardAdmin)
admin.site.register(DigitalStrategy, DigitalStrategyAdmin)
