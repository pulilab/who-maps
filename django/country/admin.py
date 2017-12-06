from django.conf import settings
from django.core import mail, urlresolvers
from django.contrib import admin
from django.template import loader
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
        return super(CountryFieldInline, self).get_queryset(request).filter(schema=True)


class AddCountryFieldInline(admin.TabularInline):
    model = CountryField
    verbose_name_plural = "Add additional country fields"
    extra = 0
    can_delete = False
    fields = ('type', 'question')

    def get_queryset(self, request):
        return super(AddCountryFieldInline, self).get_queryset(request).none()


class PartnerLogoInline(admin.TabularInline):
    model = PartnerLogo
    extra = 0
    max_num = 2


@admin.register(Country)
class CountryAdmin(admin.ModelAdmin):
    list_display = ('name', 'code', 'project_approval')
    ordering = ('name',)
    inlines = (PartnerLogoInline, AddCountryFieldInline, CountryFieldInline)
    filter_horizontal = ('users',)

    def get_queryset(self, request):
        qs = super(CountryAdmin, self).get_queryset(request)

        if request.user.is_staff and not request.user.is_superuser:
            qs = qs.filter(users__user=request.user)

        return qs

    def get_readonly_fields(self, request, obj=None):
        fields = super(CountryAdmin, self).get_readonly_fields(request, obj)
        if request.user.is_staff and not request.user.is_superuser:
            fields += (
                'name',
                'code',
                'user',
            )
        return fields

    def save_model(self, request, obj, form, change):
        super(CountryAdmin, self).save_model(request, obj, form, change)
        if change and 'user' in form.changed_data and obj.user:
            self._notify_user(obj)

    @staticmethod
    def _notify_user(country):
        html_template = loader.get_template("email/country_admin.html")
        change_url = urlresolvers.reverse('admin:country_country_change', args=(country.id,))
        html_message = html_template.render({'change_url': change_url, 'country_name': country.name})

        mail.send_mail(
            subject="You have been selected as the Country Admin for {}".format(country.name),
            message="",
            from_email=settings.FROM_EMAIL,
            recipient_list=[country.user.user.email],
            html_message=html_message,
            fail_silently=True)
