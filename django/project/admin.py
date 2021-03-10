from adminsortable2.admin import SortableAdminMixin
from django.contrib import admin
from django.contrib.admin import SimpleListFilter
from django.db.models import Q
from django.utils.html import mark_safe
from core.admin import AllObjectsAdmin
from country.models import Country
from .models import TechnologyPlatform, InteroperabilityLink, DigitalStrategy, HealthFocusArea, \
    HealthCategory, Licence, InteroperabilityStandard, HISBucket, HSCChallenge, Project, HSCGroup, \
    ProjectImportV2, ImportRow, Stage

from reversion.admin import VersionAdmin

# This has to stay here to use the proper celery instance with the djcelery_email package
import scheduler.celery # noqa


def approve(modeladmin, request, queryset):
    for obj in queryset:
        obj.state = TechnologyPlatform.APPROVED
        obj.save()


approve.short_description = "Approve selected items"


def decline(modeladmin, request, queryset):
    for obj in queryset:
        obj.state = TechnologyPlatform.DECLINED
        obj.save()


decline.short_description = "Decline selected items"


class SoftwareStateFilter(SimpleListFilter):
    title = 'State'

    parameter_name = 'state'

    def lookups(self, request, model_admin):
        return (TechnologyPlatform.APPROVED, TechnologyPlatform.SOFTWARE_STATES[0][1]), \
               (TechnologyPlatform.PENDING, TechnologyPlatform.SOFTWARE_STATES[1][1]), \
               (TechnologyPlatform.DECLINED, TechnologyPlatform.SOFTWARE_STATES[2][1])

    def choices(self, cl):  # pragma: no cover
        for lookup, title in self.lookup_choices:
            try:
                selected = int(self.value()) == lookup
            except TypeError:
                selected = None

            yield {
                'selected': selected,
                'query_string': cl.get_query_string({
                    self.parameter_name: lookup,
                }, []),
                'display': title,
            }

    def queryset(self, request, queryset):
        if self.value() is None:
            self.used_parameters[self.parameter_name] = TechnologyPlatform.PENDING
        return queryset.filter(state=self.value())


class TechnologyPlatformAdmin(AllObjectsAdmin):
    list_display = [
        'name', 'state', 'added_by'
    ]
    list_filter = [SoftwareStateFilter]
    actions = (approve, decline)


class InteroperabilityLinkAdmin(AllObjectsAdmin):
    list_display = [
        'pre',
        'name',
    ]


class DigitalStrategyAdmin(AllObjectsAdmin):
    list_display = [
        '__str__'
    ]


class HealthFocusAreaAdmin(AllObjectsAdmin):
    pass


class HealthCategoryAdmin(AllObjectsAdmin):
    pass


class LicenceAdmin(AllObjectsAdmin):
    pass


class InteroperabilityStandardAdmin(AllObjectsAdmin):
    pass


class HISBucketAdmin(AllObjectsAdmin):
    pass


class HSCGroupAdmin(AllObjectsAdmin):
    pass


class HSCChallengeAdmin(AllObjectsAdmin):
    pass


class ProjectAdmin(AllObjectsAdmin, VersionAdmin):
    list_display = ['__str__', 'created', 'get_country', 'get_team', 'get_published', 'is_active']
    readonly_fields = ['name', 'team', 'viewers', 'link', 'odk_etag', 'odk_id', 'odk_extra_data', 'draft', 'data', 'public_id', 'metadata']
    fields = ['is_active', 'name', 'team', 'viewers', 'link', 'odk_etag', 'odk_id', 'odk_extra_data', 'draft', 'data', 'public_id', 'metadata']
    search_fields = ['name']

    def get_country(self, obj):
        return obj.get_country() if obj.public_id else obj.get_country(draft_mode=True)
    get_country.short_description = "Country"

    def get_team(self, obj):
        return ", ".join([str(p) for p in obj.team.all()])
    get_team.short_description = 'Team members'

    def get_published(self, obj):
        return True if obj.public_id else False
    get_published.short_description = "Is published?"
    get_published.boolean = True

    def link(self, obj):
        if obj.id is None:
            return '-'
        version = 'publish' if obj.public_id else 'draft'
        return mark_safe("<a target='_blank' href='/app/{}/edit-project/{}/'>See project</a>"
                         .format(obj.id, version))

    def get_queryset(self, request):
        qs = super(ProjectAdmin, self).get_queryset(request)
        if not request.user.is_superuser:
            country_id_qs = Country.objects.filter(users=request.user.userprofile).values_list('id', flat=True)
            qs = qs.filter(Q(data__country__contained_by=list(country_id_qs)) |
                           Q(draft__country__contained_by=list(country_id_qs)))
        return qs

    def has_add_permission(self, request):
        return False


class ImportRowInline(admin.StackedInline):
    model = ImportRow
    readonly_fields = ('data',)


class ProjectImportV2Admin(admin.ModelAdmin):
    inlines = (ImportRowInline,)


class StageAdmin(SortableAdminMixin, admin.ModelAdmin):
    pass


admin.site.register(TechnologyPlatform, TechnologyPlatformAdmin)
admin.site.register(InteroperabilityLink, InteroperabilityLinkAdmin)
admin.site.register(DigitalStrategy, DigitalStrategyAdmin)
admin.site.register(HealthFocusArea, HealthFocusAreaAdmin)
admin.site.register(HealthCategory, HealthCategoryAdmin)
admin.site.register(Licence, LicenceAdmin)
admin.site.register(InteroperabilityStandard, InteroperabilityStandardAdmin)
admin.site.register(HISBucket, HISBucketAdmin)
admin.site.register(HSCGroup, HSCGroupAdmin)
admin.site.register(HSCChallenge, HSCChallengeAdmin)
admin.site.register(ProjectImportV2, ProjectImportV2Admin)
admin.site.register(Project, ProjectAdmin)
admin.site.register(Stage, StageAdmin)
