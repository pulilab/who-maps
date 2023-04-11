from allauth.account.models import EmailAddress, EmailConfirmation
from allauth.socialaccount.models import SocialAccount, SocialToken, SocialApp
from django.conf import settings
from django.contrib import admin
from django.contrib.auth import get_user_model
from django.contrib.auth.admin import UserAdmin
from django.contrib.auth.models import User
from django.contrib.auth.forms import AuthenticationForm
from django.forms.widgets import MediaDefiningClass
from modeltranslation.translator import translator
from import_export.fields import Field
from import_export import resources
from import_export.admin import ExportActionMixin

from project.models import Project
from user.models import UserProfile


class UserResource(resources.ModelResource):  # pragma: no cover
    title = Field(column_name='Title')
    name = Field(column_name='Name')
    account_type = Field(column_name='Account type')
    organization = Field(column_name='Organization')
    country = Field(column_name='Country')
    donor = Field(column_name='Donor')
    language = Field(column_name='Language')
    last_login = Field(column_name='Last login date')
    date_joined = Field(column_name='Date joined')
    projects_where_team_member = Field(column_name='Projects where team member')
    projects_where_viewer = Field(column_name='Projects where viewer')

    class Meta:
        model = User
        fields = export_order = ('id', 'title', 'name', 'email', 'account_type', 'organization', 'country', 'donor',
                                 'language', 'last_login', 'date_joined', 'is_active', 'is_staff', 'is_superuser',
                                 'projects_where_team_member', 'projects_where_viewer')

    def dehydrate_projects_where_viewer(self, user: User):
        return Project.objects.filter(viewers=user.userprofile).count() if hasattr(user, 'userprofile') else 0

    def dehydrate_projects_where_team_member(self, user: User):
        return Project.objects.filter(team=user.userprofile).count() if hasattr(user, 'userprofile') else 0

    def dehydrate_last_login(self, user: User):
        if user.last_login == user.date_joined:
            return 'Never'
        return user.last_login.date() if user.last_login else '-'

    def dehydrate_date_joined(self, user: User):
        return user.date_joined.date() if user.date_joined else '-'

    def dehydrate_name(self, user: User):
        return user.userprofile.name if hasattr(user, 'userprofile') else '-'

    def dehydrate_title(self, user: User):
        return user.userprofile.title if hasattr(user, 'userprofile') else '-'

    def dehydrate_account_type(self, user: User):
        account_types = {x[0]: x[1] for x in UserProfile.ACCOUNT_TYPE_CHOICES}
        return account_types[user.userprofile.account_type] if hasattr(user, 'userprofile') else '-'

    def dehydrate_organization(self, user: User):
        return user.userprofile.organisation.name \
            if hasattr(user, 'userprofile') and user.userprofile.organisation else '-'

    def dehydrate_country(self, user: User):
        return user.userprofile.country.name if hasattr(user, 'userprofile') and user.userprofile.country else '-'

    def dehydrate_donor(self, user: User):
        return user.userprofile.donor.name if hasattr(user, 'userprofile') and user.userprofile.donor else '-'

    def dehydrate_language(self, user: User):
        return user.userprofile.language if hasattr(user, 'userprofile') else '-'


class UserProfileInline(admin.StackedInline):
    model = UserProfile
    can_delete = False


class CustomUserAdmin(ExportActionMixin, UserAdmin):
    list_display = ('userprofile', 'email', 'name', 'country', 'type', 'organisation', 'is_staff', 'is_superuser',
                    'last_login', 'date_joined')
    search_fields = ('userprofile__name', 'email', 'userprofile__country__name', 'userprofile__organisation__name')
    inlines = (UserProfileInline,)
    resource_class = UserResource

    def name(self, obj):
        return obj.userprofile.name

    name.allow_tags = True
    name.admin_order_field = 'userprofile__name'

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
        return super(CustomUserAdmin, self).get_list_filter(request) + ('userprofile__account_type',)

    def get_form(self, request, obj=None, **kwargs):
        self.fieldsets[0][1]["fields"] = ('password',)
        self.fieldsets[1][1]["fields"] = ('email',)
        self.fieldsets[2][1]["fields"] = ('is_active', 'is_staff', 'is_superuser', 'groups')
        form = super(CustomUserAdmin, self).get_form(request, obj, **kwargs)
        return form

    def get_readonly_fields(self, request, obj=None):
        if request and request.user and not request.user.is_superuser:
            return 'password', 'is_active', 'is_staff', 'is_superuser', 'groups', 'last_login', 'date_joined'
        return super().get_readonly_fields(request, obj)


class CustomAuthenticationForm(AuthenticationForm):
    def __init__(self, request=None, *args, **kwargs):  # pragma: no cover
        self.request = request
        self.user_cache = None
        super(AuthenticationForm, self).__init__(*args, **kwargs)

        UserModel = get_user_model()
        self.username_field = UserModel._meta.get_field(UserModel.USERNAME_FIELD)
        if self.fields['username'].label is None:
            self.fields['username'].label = "Email"


class MultiLevelAdminMeta(MediaDefiningClass):
    """
    Metaclass for classes that can have media definitions.
    """
    def __new__(mcs, name, bases, attrs):
        new_class = super(MultiLevelAdminMeta, mcs).__new__(mcs, name, bases, attrs)

        def get_translated_function(language):
            def translated(self, obj):
                translated = True
                for field_name in translator.get_options_for_model(self.model).get_field_names():
                    translated &= bool(getattr(obj, '{}_{}'.format(field_name, language)))
                return translated
            translated.short_description = 'Translated {}'.format(language.upper())
            translated.boolean = True
            return translated

        for language_code, language_name in settings.LANGUAGES:
            setattr(new_class, 'is_translated_{}'.format(language_code), get_translated_function(language_code))

        return new_class


class AllObjectsAdmin(admin.ModelAdmin, metaclass=MultiLevelAdminMeta):
    def get_queryset(self, request):
        return self.model.all_objects.all()

    def get_list_display(self, request):
        list_display = list(super(AllObjectsAdmin, self).get_list_display(request))
        if 'is_active' in list_display:
            return list_display

        language_fields = ['is_translated_{}'.format(l[0]) for l in settings.LANGUAGES]
        return list_display + ['is_active'] + language_fields


admin.site.login_form = CustomAuthenticationForm
admin.site.unregister(User)
admin.site.register(User, CustomUserAdmin)
admin.site.unregister(EmailAddress)
admin.site.unregister(EmailConfirmation)
admin.site.unregister(SocialAccount)
admin.site.unregister(SocialToken)
admin.site.unregister(SocialApp)
