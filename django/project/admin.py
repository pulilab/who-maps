from django.contrib import admin
from django.utils.html import mark_safe
from django import forms

from core.admin import AllObjectsAdmin
from .models import TechnologyPlatform, InteroperabilityLink, DigitalStrategy, ProjectApproval


class TechnologyPlatformAdmin(AllObjectsAdmin):
    list_display = ['name',]


class InteroperabilityLinkAdmin(AllObjectsAdmin):
    list_display = ['pre', 'name',]


class DigitalStrategyAdmin(AllObjectsAdmin):
    list_display = ['__str__',]


class ProjectApprovalAdmin(admin.ModelAdmin):
    list_display = ['project', 'user', 'approved', 'reason']
    readonly_fields = ['link']

    def link(self, obj):
        return mark_safe("<a href='/app/project/{}'>See project</a>".format(obj.id))


admin.site.register(TechnologyPlatform, TechnologyPlatformAdmin)
admin.site.register(InteroperabilityLink, InteroperabilityLinkAdmin)
admin.site.register(DigitalStrategy, DigitalStrategyAdmin)
admin.site.register(ProjectApproval, ProjectApprovalAdmin)
