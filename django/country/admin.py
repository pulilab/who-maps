from django.contrib import admin
from country.models import Country, PartnerLogo, CountryField


class CountryFieldInline(admin.TabularInline):
    model = CountryField
    verbose_name_plural = "Existing country fields"
    extra = 0
    max_num = 0
    can_delete = False
    fields = ('type', 'question', 'enabled')
    readonly_fields = ('type', 'question')

    def get_queryset(self, request):
        qs = super(CountryFieldInline, self).get_queryset(request)
        qs = qs.filter(project=None)
        return qs


class AddCountryFieldInline(admin.TabularInline):
    model = CountryField
    verbose_name_plural = "Add additional country fields"
    extra = 0
    can_delete = False
    fields = ('type', 'question', 'enabled')

    def get_queryset(self, request):
        return super(AddCountryFieldInline, self).get_queryset(request).none()


class PartnerLogoInline(admin.TabularInline):
    model = PartnerLogo
    extra = 0


@admin.register(Country)
class CountryAdmin(admin.ModelAdmin):
    list_display = ('name', 'code')
    ordering = ('name',)
    inlines = (PartnerLogoInline, AddCountryFieldInline, CountryFieldInline)

    def get_queryset(self, request):
        qs = super(CountryAdmin, self).get_queryset(request)

        if request.user.is_staff and not request.user.is_superuser:
            qs = qs.filter(user__user=request.user)

        return qs

    def get_readonly_fields(self, request, obj=None):
        fields = super(CountryAdmin, self).get_readonly_fields(request, obj)
        if request.user.is_staff and not request.user.is_superuser:
            fields += ('name', 'code', 'user', )
        return fields
