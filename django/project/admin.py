import csv
from threading import local
from io import StringIO
import urllib.parse

from django.contrib import admin, messages
from django import forms
from django.contrib.admin import SimpleListFilter
from django.contrib.auth.models import User
from django.core.validators import validate_email
from django.core.exceptions import ValidationError
from django.db.models import Q
from django.http import HttpResponse
from django.core import mail
from django.utils.html import mark_safe
from django.template import loader
from django.conf import settings
from django.utils.translation import ugettext, override

from allauth.account.models import EmailAddress
from toolkit.toolkit_data import toolkit_default
from core.admin import AllObjectsAdmin
from country.models import Country
from toolkit.models import Toolkit
from .models import TechnologyPlatform, InteroperabilityLink, DigitalStrategy, HealthFocusArea, \
    HealthCategory, Licence, InteroperabilityStandard, HISBucket, HSCChallenge, ProjectImport, Project, HSCGroup, \
    ProjectApproval
from user.models import UserProfile, Organisation

# This has to stay here to use the proper celery instance with the djcelery_email package
import scheduler.celery # noqa

TLS = local()


class ChangeNotificationMixin(object):
    def save_form(self, request, form, change):
        if change:
            if form.has_changed():
                self.send_changed_notification(form)
        else:
            self.send_created_notification(form)
        return super(ChangeNotificationMixin, self).save_form(request, form, change)

    def send_changed_notification(self, form):
        html_template = loader.get_template('email/data_model_changed.html')

        for profile in UserProfile.objects.all():
            with override(profile.language):
                subject = ugettext('{} - {} was changed').format(form.instance._meta.verbose_name.title(),
                                                                 str(form.instance))
                html_message = html_template.render({'text': subject,
                                                     'language': profile.language})
                self.send_notification_email(profile.user.email, subject, html_message)

    def send_created_notification(self, form):
        html_template = loader.get_template('email/new_data_model_created.html')

        for profile in UserProfile.objects.all():
            with override(profile.language):
                subject = ugettext('New {} was created: {}').format(form.instance._meta.verbose_name,
                                                                    str(form.instance))
                html_message = html_template.render({'text': subject,
                                                     'language': profile.language})

                self.send_notification_email(profile.user.email, subject, html_message)

    def send_notification_email(self, email, subject, html_message):
            mail.send_mail(subject=subject,
                           message='',
                           from_email=settings.FROM_EMAIL,
                           recipient_list=[email],
                           html_message=html_message)


class TechnologyPlatformAdmin(ChangeNotificationMixin, AllObjectsAdmin):
    list_display = [
        'name',
    ]


class InteroperabilityLinkAdmin(ChangeNotificationMixin, AllObjectsAdmin):
    list_display = [
        'pre',
        'name',
    ]


class DigitalStrategyAdmin(ChangeNotificationMixin, AllObjectsAdmin):
    list_display = [
        '__str__'
    ]


class HealthFocusAreaAdmin(ChangeNotificationMixin, AllObjectsAdmin):
    pass


class HealthCategoryAdmin(ChangeNotificationMixin, AllObjectsAdmin):
    pass


class LicenceAdmin(ChangeNotificationMixin, AllObjectsAdmin):
    pass


class InteroperabilityStandardAdmin(ChangeNotificationMixin, AllObjectsAdmin):
    pass


class HISBucketAdmin(ChangeNotificationMixin, AllObjectsAdmin):
    pass


class HSCGroupAdmin(ChangeNotificationMixin, AllObjectsAdmin):
    pass


class HSCChallengeAdmin(ChangeNotificationMixin, AllObjectsAdmin):
    pass


class ApprovalFilter(SimpleListFilter):
    title = 'Status'

    parameter_name = 'approved'

    def lookups(self, request, model_admin):
        return (None, "Waiting for approval"), (True, "Approved"), (False, "Declined")

    def choices(self, cl):  # pragma: no cover
        for lookup, title in self.lookup_choices:
            try:
                selected = self.value() == lookup
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
        return queryset.filter(approved=self.value())


class ProjectApprovalAdmin(admin.ModelAdmin):
    list_filter = (ApprovalFilter,)
    list_display = ['project', 'user', 'approved', 'get_country']
    readonly_fields = ['link', 'user']
    actions = ['export_project_approvals']
    ordering = ['approved', 'created']

    def save_model(self, request, obj, form, change):
        obj.user = request.user.userprofile
        super(ProjectApprovalAdmin, self).save_model(request, obj, form, change)

    def get_country(self, obj):
        return obj.project.get_country()
    get_country.short_description = "Country"

    def link(self, obj):
        if obj.id is None:
            return '-'

        user = TLS.request.user
        query_string = {'token': user.auth_token, 'user_profile_id': user.userprofile.id,
                        'is_superuser': 'true', 'email': user.email}
        return mark_safe("<a target='_blank' href='/app/{}/edit-project/publish/?{}'>See project</a>"
                         .format(obj.project.id, urllib.parse.urlencode(query_string)))

    def get_queryset(self, request):
        qs = super(ProjectApprovalAdmin, self).get_queryset(request)
        if not request.user.is_superuser:
            country_id_qs = Country.objects.filter(users=request.user.userprofile).values_list('id', flat=True)

            no_approval_ids = country_id_qs.filter(project_approval=False)
            if qs.filter(project__data__country__contained_by=list(no_approval_ids)).exists():
                self.message_user(request, ugettext('Some project approvals are hidden due to country configuration. '
                                                    'Check the project approval checkbox on the country admin to make '
                                                    'them visible.'), messages.WARNING)

            approval_required_ids = country_id_qs.filter(project_approval=True)
            qs = qs.filter(project__data__country__contained_by=list(approval_required_ids))
        return qs

    def changeform_view(self, request, *args, **kwargs):
        TLS.request = request
        return super(ProjectApprovalAdmin, self).changeform_view(request, *args, **kwargs)

    def export_project_approvals(self, request, queryset):
        f = StringIO()
        writer = csv.writer(f)
        writer.writerow(['Project name', 'Approved by', 'Status', 'Country', 'Reason'])

        queryset = queryset.select_related('project')
        for project_approval in queryset:
            if project_approval.approved:
                status = ugettext('Approved')
            elif project_approval.approved is None:
                status = ugettext('Pending')
            else:
                status = ugettext('Rejected')

            if project_approval.user:
                user_name = project_approval.user.name
            else:
                user_name = '-'
            country = project_approval.project.get_country() if project_approval.project.public_id \
                else project_approval.project.get_country(draft_mode=True)
            writer.writerow([project_approval.project.name,
                             user_name,
                             status,
                             getattr(country, 'name', '-'),
                             project_approval.reason])

        f.seek(0)
        response = HttpResponse(f, content_type='text/csv')
        response['Content-Disposition'] = 'attachment; filename=project_approval_export.csv'
        return response

    def has_add_permission(self, request):
        return False


def validate_csv_ext(value):
    if not value.name.endswith('.csv'):
        raise forms.ValidationError('Only CSV format is accepted.')


class ProjectImportUploadForm(forms.ModelForm):
    """ Form for first step """
    csv = forms.FileField(validators=[validate_csv_ext])

    class Meta:
        model = ProjectImport
        fields = ['csv']


class ProjectImportFieldMappingForm(forms.ModelForm):
    """ Form for second step """
    project_name = forms.ChoiceField(choices=[])
    owner_name = forms.ChoiceField(choices=[])
    owner_email = forms.ChoiceField(choices=[])
    organisation = forms.ChoiceField(choices=[], required=False)
    country = forms.ChoiceField(choices=[], required=False)
    description = forms.ChoiceField(choices=[], required=False)

    def __init__(self, *args, **kwargs):
        super(ProjectImportFieldMappingForm, self).__init__(*args, **kwargs)
        # Make choices out of uploaded csv's header
        choices = [('', '',)] + [(index, value) for index, value in enumerate(self.instance.headers)]
        for name, field in self.fields.items():
            field.choices = choices
            field.initial = self.instance.mapping[name] if name in self.instance.mapping else ''

    class Meta:
        model = ProjectImport
        fields = ['project_name', 'owner_name', 'owner_email', 'organisation', 'country', 'description']


class ProjectImportStatusForm(forms.ModelForm):
    """ Form for third step """

    class Meta:
        model = ProjectImport
        fields = ['status', 'imported', 'failed', 'csv']


class ProjectImportAdmin(admin.ModelAdmin):
    list_display = ['__str__', 'created', 'status']
    _users_to_notify = {}

    def get_queryset(self, request):
        qs = super(ProjectImportAdmin, self).get_queryset(request)
        return qs.filter(user=request.user)

    def get_form(self, request, obj=None, **kwargs):
        # First step, upload csv
        if not obj:
            kwargs['form'] = ProjectImportUploadForm
            self.readonly_fields = []
        # Second step, map fields
        elif obj.status is None:
            kwargs['form'] = ProjectImportFieldMappingForm
            self.readonly_fields = ['csv']
        # Third step, showing results
        elif obj.status is not None:
            kwargs['form'] = ProjectImportStatusForm
            self.readonly_fields = ['status', 'imported', 'failed', 'csv']
        return super(ProjectImportAdmin, self).get_form(request, obj, **kwargs)

    def save_model(self, request, obj, form, change):
        # Save uploaded CSV and get headers
        if not change:
            obj.user = request.user
            # save the file so that we can read headers
            obj.save()
            with open(obj.csv.path, 'r') as f:
                reader = csv.reader(f)
                obj.headers = next(reader)
            obj.save()
        # Save field mapping and import projects
        elif obj.status is None:
            obj.mapping = form.cleaned_data
            obj.save()
            with open(obj.csv.path, 'r') as f:
                reader = csv.reader(f)
                next(reader)  # skip header
                for line_no, row in enumerate(reader, start=1):  # True line number
                    if self._is_row_valid(row, line_no, obj):
                        self._import_project(row, obj)
            # Set status
            if obj.failed:
                obj.status = False
            else:
                obj.status = True
            obj.save()

            # Notify users
            self._notify_users()

    def _notify_users(self):
        html_template = loader.get_template('email/import_projects.html')
        for email, data in self._users_to_notify.items():
            html_message = html_template.render({'email': email, 'data': data})
            mail.send_mail(
                subject="You were added to imported projects",
                message="",
                from_email=settings.FROM_EMAIL,
                recipient_list=[email],
                html_message=html_message)

    def _is_row_valid(self, row, line_no, project_import):
        valid = True
        # Validate owner email
        owner_email_col = int(project_import.mapping['owner_email'])
        try:
            validate_email(row[owner_email_col])
        except ValidationError as e:
            # Log failure
            project_import.failed += 'Line {}, {}: {}\n'.format(line_no, row[owner_email_col] or '<Empty>', e.message)
            project_import.save()
            valid = False

        # Validate country
        if project_import.mapping['country']:
            country_col = int(project_import.mapping['country'])
            country = Country.objects.get_object_or_none(name=row[country_col])
            if not country:
                project_import.failed += 'Line {}, {}: {}\n'.format(line_no, row[country_col] or '<Empty>',
                                                                    'No such country.')
                project_import.save()
                valid = False

        return valid

    def _import_project(self, row, project_import):
        project_name_col = int(project_import.mapping['project_name'])
        project = Project.objects.create(name=row[project_name_col], draft={'name': row[project_name_col]})

        # Organisation
        if project_import.mapping['organisation']:
            organisation_col = int(project_import.mapping['organisation'])
            organisation, _ = Organisation.objects.get_or_create(name=row[organisation_col])
            project.draft.update(organisation=organisation.id, organisation_name=organisation.name)
        else:
            organisation = None

        # Country
        if project_import.mapping['country']:
            country_col = int(project_import.mapping['country'])
            country = Country.objects.get(name=row[country_col])
            project.draft.update(country=country.id, country_name=country.name)
        else:
            country = None

        # Description
        if project_import.mapping['description']:
            description_col = int(project_import.mapping['description'])
            project.draft.update(implementation_overview=row[description_col])

        # Add user, assign to team
        owner_name_col = int(project_import.mapping['owner_name'])
        owner_email_col = int(project_import.mapping['owner_email'])
        user_qs = User.objects.filter(email=row[owner_email_col])
        user = user_qs.first() if user_qs.exists() else None
        password = None
        if not user:
            user, password = self._create_user(row[owner_email_col], row[owner_name_col], country, organisation)
        project.team.add(user.userprofile)

        # Default Toolkit structure for the new project.
        Toolkit.objects.create(project_id=project.id, data=toolkit_default)
        project.save()

        # Log success
        project_import.imported += '{}\n'.format(project.name)
        project_import.save()

        # Gather notification data
        if user.email in self._users_to_notify:
            self._users_to_notify[user.email]['projects'].append(project)
        else:
            self._users_to_notify[user.email] = {
                'password': password,
                'projects': [project]
            }

    def _create_user(self, email, name, country=None, organisation=None):
        user = User.objects.create(username=email, email=email, is_active=True)
        password = User.objects.make_random_password()
        user.set_password(password)
        user.save()
        EmailAddress.objects.create(user=user, email=email, primary=True, verified=True)
        UserProfile.objects.create(account_type=UserProfile.IMPLEMENTER, user=user, name=name,
                                   organisation=organisation, country=country)
        user.refresh_from_db()
        return user, password


class ProjectAdmin(AllObjectsAdmin):
    list_display = ['__str__', 'created', 'get_country', 'get_team', 'get_published', 'is_active']
    readonly_fields = ['name', 'team', 'viewers', 'link']
    fields = ['is_active', 'name', 'team', 'viewers', 'link']

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

        user = TLS.request.user
        query_string = {'token': user.auth_token, 'user_profile_id': user.userprofile.id,
                        'is_superuser': 'true', 'email': user.email}
        return mark_safe("<a target='_blank' href='/app/{}/edit-project/publish/?{}'>See project</a>"
                         .format(obj.id, urllib.parse.urlencode(query_string)))

    def changeform_view(self, request, *args, **kwargs):
        TLS.request = request
        return super(ProjectAdmin, self).changeform_view(request, *args, **kwargs)

    def get_queryset(self, request):
        qs = super(ProjectAdmin, self).get_queryset(request)
        if not request.user.is_superuser:
            country_id_qs = Country.objects.filter(users=request.user.userprofile).values_list('id', flat=True)
            qs = qs.filter(Q(data__country__contained_by=list(country_id_qs)) |
                           Q(draft__country__contained_by=list(country_id_qs)))
        return qs

    def has_add_permission(self, request):
        return False


admin.site.register(TechnologyPlatform, TechnologyPlatformAdmin)
admin.site.register(InteroperabilityLink, InteroperabilityLinkAdmin)
admin.site.register(DigitalStrategy, DigitalStrategyAdmin)
admin.site.register(ProjectApproval, ProjectApprovalAdmin)
admin.site.register(HealthFocusArea, HealthFocusAreaAdmin)
admin.site.register(HealthCategory, HealthCategoryAdmin)
admin.site.register(Licence, LicenceAdmin)
admin.site.register(InteroperabilityStandard, InteroperabilityStandardAdmin)
admin.site.register(HISBucket, HISBucketAdmin)
admin.site.register(HSCGroup, HSCGroupAdmin)
admin.site.register(HSCChallenge, HSCChallengeAdmin)
admin.site.register(ProjectImport, ProjectImportAdmin)
admin.site.register(Project, ProjectAdmin)
