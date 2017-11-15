from django.contrib import admin
from django.utils.html import mark_safe

from core.admin import AllObjectsAdmin
from country.models import Country
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
        return mark_safe("<a href='/app/{}/edit-project'>See project</a>".format(obj.id))

    def get_queryset(self, request):
        qs = super(ProjectApprovalAdmin, self).get_queryset(request)
        if not request.user.is_superuser:
            country_ids = Country.objects.filter(user=request.user.userprofile).values_list('id', flat=True)
            qs = qs.filter(project__data__country__contained_by=list(country_ids))
        return qs


admin.site.register(TechnologyPlatform, TechnologyPlatformAdmin)
admin.site.register(InteroperabilityLink, InteroperabilityLinkAdmin)
admin.site.register(DigitalStrategy, DigitalStrategyAdmin)
admin.site.register(ProjectApproval, ProjectApprovalAdmin)
