import pycountry

from collections import defaultdict
from django.conf import settings
from django.core.mail import send_mail
from django.contrib import admin
from django.core import management
from django.urls import reverse
from django.template import loader
from django.utils.safestring import mark_safe
from django.utils.translation import ugettext, override

from core.admin import ArrayFieldMixin
from .models import Country, CountryField
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
    filter_horizontal = ('users',)
    readonly_fields = ('code', 'name', 'map_download')

    def get_fields(self, request, obj=None):
        fields = super(CountryAdmin, self).get_fields(request, obj)
        return list(self.readonly_fields) + [f for f in fields if f not in ['name', 'code', 'map_data', 'map_download']]

    def map_download(self, obj):
        complete_country = pycountry.countries.get(alpha_2=obj.code)
        #  clikey should be a private value but at the moment is not that
        # important since the quota system is not operative
        url = ("https://wambachers-osm.website/boundaries/exportBoundaries?"
               "cliVersion=1.0&cliKey=a9ea45b5-ab37-4323-8263-767aa5896113&exportFormat=json&exportLayout=single"
               "&exportAreas=land&union=false&from_AL=2&to_AL=6&selected={}").format(complete_country.alpha_3)
        markup = "<a href='{}'> {} map download </a>".format(url, obj.name)
        return mark_safe(markup)

    def get_readonly_fields(self, request, obj=None):
        fields = super(CountryAdmin, self).get_readonly_fields(request, obj)
        if request.user.is_staff and not request.user.is_superuser:
            fields += (
                'users',
            )
        return fields

    def save_model(self, request, obj, form, change):
        super(CountryAdmin, self).save_model(request, obj, form, change)
        if change and 'users' in form.changed_data and obj.users:
            self._notify_user(obj, subject="You have been selected as the Country Admin for {country_name}",
                              template_name="email/added_to_group.html")
        if change and 'map_activated_on' in form.changed_data and obj.users:
            management.call_command('clean_maps', obj.code)
            self._notify_user(obj, subject="A new map for {country_name} has been activated",
                              template_name="email/country_map_activated.html")

    @staticmethod
    def _notify_user(country, subject, template_name):
        html_template = loader.get_template(template_name)
        change_url = reverse('admin:country_country_change', args=(country.id,))

        email_mapping = defaultdict(list)
        for profile in country.users.all():
            email_mapping[profile.language].append(profile.user.email)

        for language, email_list in email_mapping.items():
            with override(language):
                subject = ugettext(subject)
                html_message = html_template.render({'change_url': change_url,
                                                     'country_name': country.name,
                                                     'language': language})

            send_mail(
                subject=subject.format(country_name=country.name),
                message="",
                from_email=settings.FROM_EMAIL,
                recipient_list=email_list,
                html_message=html_message,
                fail_silently=True)

    def has_add_permission(self, request):  # pragma: no cover
        return False

    def has_delete_permission(self, request, obj=None):  # pragma: no cover
        return False


@admin.register(Donor)
class DonorAdmin(admin.ModelAdmin):
    filter_horizontal = ('users', 'admins', 'super_admins')