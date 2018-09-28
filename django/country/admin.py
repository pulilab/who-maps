from django.contrib import admin

from core.admin import ArrayFieldMixin
from .models import Country, CountryField, Donor
from .forms import CountryFieldAdminForm, CountryFieldAdminFormNoneReadOnlyOptions

# This has to stay here to use the proper celery instance with the djcelery_email package
import scheduler.celery  # noqa


class CountryFieldInline(admin.TabularInline):
    model = CountryField
    form = CountryFieldAdminFormNoneReadOnlyOptions
    verbose_name_plural = "Existing country fields"
    extra = 0
    max_num = 0
    can_delete = False
    fields = ('type', 'question', 'options', 'required', 'enabled')
    readonly_fields = ('type', 'question')

    def get_queryset(self, request):
        return super(CountryFieldInline, self).get_queryset(request).filter(schema=True)


class AddCountryFieldInline(ArrayFieldMixin, admin.TabularInline):
    model = CountryField
    form = CountryFieldAdminForm
    verbose_name_plural = "Add country fields"
    extra = 0
    fields = ('type', 'question', 'options', 'required')

    def get_queryset(self, request):
        return super(AddCountryFieldInline, self).get_queryset(request).none()


@admin.register(Country)
class CountryAdmin(admin.ModelAdmin):
    list_display = ('name', 'code', 'project_approval')
    ordering = ('name',)
    inlines = (AddCountryFieldInline, CountryFieldInline)
    filter_horizontal = ('users', 'admins', 'super_admins')
    readonly_fields = ('code', 'name')

    def get_fields(self, request, obj=None):
        fields = super(CountryAdmin, self).get_fields(request, obj)
        return list(self.readonly_fields) + [f for f in fields if f not in ['name', 'code', 'map_data']]

    def has_add_permission(self, request):  # pragma: no cover
        return False

    def has_delete_permission(self, request, obj=None):  # pragma: no cover
        return False


@admin.register(Donor)
class DonorAdmin(admin.ModelAdmin):
    fields = list_display = ('name', 'code')
