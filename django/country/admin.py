from django.conf import settings
from django.contrib import admin
from django.forms import ModelForm
from gfklookupwidget.widgets import GfkLookupWidget

from core.admin import AllObjectsAdmin
from .models import Country, Donor

# This has to stay here to use the proper celery instance with the djcelery_email package
import scheduler.celery  # noqa


@admin.register(Country)
class CountryAdmin(AllObjectsAdmin):
    list_display = ('name', 'code', 'region', 'project_approval')
    ordering = ('name',)
    readonly_fields = ('code', 'name')

    def get_queryset(self, request):
        return self.model.objects.all()

    def get_list_display(self, request):
        list_display = list(super(AllObjectsAdmin, self).get_list_display(request))
        language_fields = ['is_translated_{}'.format(l[0]) for l in settings.LANGUAGES]
        return list_display + language_fields

    def get_fields(self, request, obj=None):
        fields = super(CountryAdmin, self).get_fields(request, obj)
        return list(self.readonly_fields) + [f for f in fields if f not in ['name', 'code', 'map_data',
                                                                            'users', 'admins', 'super_admins',
                                                                            'lat', 'lon', 'map_activated_on']]

    def has_add_permission(self, request):  # pragma: no cover
        return False

    def has_delete_permission(self, request, obj=None):  # pragma: no cover
        return False


class DonorForm(ModelForm):
    class Meta(object):
        model = Donor
        fields = ('name', 'code', 'content_type', 'object_id')
        widgets = {
            'object_id': GfkLookupWidget(
                content_type_field_name='content_type',
                parent_field=Donor._meta.get_field('content_type'),
            )
        }


@admin.register(Donor)
class DonorAdmin(admin.ModelAdmin):
    list_display = ('name', 'code', 'content_object')

    form = DonorForm
