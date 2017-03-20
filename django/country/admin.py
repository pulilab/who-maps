from django.contrib import admin
from country.models import Country, PartnerLogo


class PartnerLogoInline(admin.TabularInline):
    model = PartnerLogo
    extra = 0


@admin.register(Country)
class CountryAdmin(admin.ModelAdmin):
    list_display = ('name', 'code')
    ordering = ('name',)
    inlines = (PartnerLogoInline, )

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
