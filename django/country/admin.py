from django.contrib import admin

from .models import Country, Donor

# This has to stay here to use the proper celery instance with the djcelery_email package
import scheduler.celery  # noqa


@admin.register(Country)
class CountryAdmin(admin.ModelAdmin):
    list_display = ('name', 'code', 'project_approval')
    ordering = ('name',)
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
