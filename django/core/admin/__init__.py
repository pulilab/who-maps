from allauth.account.models import EmailAddress, EmailConfirmation
from allauth.socialaccount.models import SocialAccount, SocialToken, SocialApp
from django.contrib import admin
from django.contrib.auth import get_user_model
from django.contrib.auth.admin import UserAdmin
from django.contrib.auth.models import User
from django.contrib.sites.models import Site
from django.contrib.auth.forms import AuthenticationForm
from django.contrib.postgres.fields.array import ArrayField
from rest_framework.authtoken.models import Token

from user.models import UserProfile
from .widgets import AdminArrayField


class UserProfileInline(admin.StackedInline):
    model = UserProfile
    can_delete = False


class CustomUserAdmin(UserAdmin):
    list_display = ('userprofile', 'country', 'type', 'organisation', 'is_staff', 'is_superuser')
    search_fields = ('userprofile__name', 'email', 'userprofile__country', 'userprofile__organisation__name')
    inlines = (UserProfileInline,)

    def country(self, obj):
        return obj.userprofile.country

    country.allow_tags = True

    def type(self, obj):
        return obj.userprofile.get_account_type_display()

    type.allow_tags = True
    type.short_description = "Account Type"

    def organisation(self, obj):
        return obj.userprofile.organisation

    organisation.allow_tags = True

    def get_list_filter(self, request):
        return super(CustomUserAdmin, self).get_list_filter(request) + (('userprofile__account_type'),)

    def get_form(self, request, obj=None, **kwargs):
        self.fieldsets[0][1]["fields"] = ('password',)
        self.fieldsets[1][1]["fields"] = ('email',)
        self.fieldsets[2][1]["fields"] = ('is_active', 'is_staff', 'is_superuser', 'groups')
        form = super(CustomUserAdmin, self).get_form(request, obj, **kwargs)
        return form


class CustomAuthenticationForm(AuthenticationForm):
    def __init__(self, request=None, *args, **kwargs):  # pragma: no cover
        self.request = request
        self.user_cache = None
        super(AuthenticationForm, self).__init__(*args, **kwargs)

        UserModel = get_user_model()
        self.username_field = UserModel._meta.get_field(UserModel.USERNAME_FIELD)
        if self.fields['username'].label is None:
            self.fields['username'].label = "Email"


class AllObjectsAdmin(admin.ModelAdmin):
    def get_queryset(self, request):
        return self.model.all_objects.all()

    def get_list_display(self, request):
        list_display = list(super(AllObjectsAdmin, self).get_list_display(request))
        if 'is_active' in list_display:
            return list_display
        return list_display + ['is_active', 'translated']

    def translated(self, obj):
        return all([obj.name_en, obj.name_fr, obj.name_es, obj.name_pt])
    translated.short_description = "Translated"
    translated.boolean = True


class ArrayFieldMixin(object):
    formfield_overrides = {ArrayField: {'form_class': AdminArrayField}}

    class Media:
        js = ('arrayfield.js',)


admin.site.login_form = CustomAuthenticationForm
admin.site.unregister(User)
admin.site.register(User, CustomUserAdmin)
admin.site.unregister(EmailAddress)
admin.site.unregister(EmailConfirmation)
admin.site.unregister(SocialAccount)
admin.site.unregister(SocialToken)
admin.site.unregister(SocialApp)
admin.site.unregister(Site)
admin.site.unregister(Token)
