import csv
import logging

from django.contrib import admin
from django.contrib.postgres.forms import JSONField
from django import forms
from django.contrib.auth.models import User
from django.core.validators import validate_email
from django.core.exceptions import ValidationError
from django.core import mail
from django.template import loader
from django.conf import settings

from allauth.account.models import EmailAddress
from toolkit.toolkit_data import toolkit_default
from core.admin import AllObjectsAdmin
from country.models import Country
from user.models import UserProfile, Organisation
from toolkit.models import Toolkit
from .models import TechnologyPlatform, InteroperabilityLink, DigitalStrategy, HealthFocusArea, HealthCategory, \
    ProjectImport, Project


class TechnologyPlatformAdmin(AllObjectsAdmin):
    list_display = ['name',]


class InteroperabilityLinkAdmin(AllObjectsAdmin):
    list_display = ['pre', 'name',]


class DigitalStrategyAdmin(AllObjectsAdmin):
    list_display = ['__str__',]


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
        fields = ['project_name', 'owner_name', 'owner_email', 'organisation', 'country', 'description',]


class ProjectImportStatusForm(forms.ModelForm):
    """ Form for third step """

    class Meta:
        model = ProjectImport
        fields = ['status', 'imported', 'failed', 'csv']


class ProjectImportAdmin(admin.ModelAdmin):
    list_display = ['__str__', 'created', 'status']

    def get_queryset(self, request):
        qs = super(ProjectImportAdmin, self).get_queryset(request)
        if not request.user.is_superuser:
            qs = qs.filter(user=request.user)
        return qs

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
        return super().get_form(request, obj, **kwargs)

    def save_model(self, request, obj, form, change):
        self._users_to_notify = {}
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
            obj.refresh_from_db()
            if obj.failed:
                obj.status = False
            else:
                obj.status = True
            obj.save()

            # Notify users
            logging.info(self._users_to_notify)
            self._notify_users()

    def _notify_users(self):
        html_template = loader.get_template('email/import_projects.html')
        for email, data in self._users_to_notify.items():
            html_message = html_template.render({'email': email, 'data': data})
            logging.info(html_message)
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
        # TODO align to new draft system - projects should be drafts
        # Project name
        project_name_col = int(project_import.mapping['project_name'])
        # TODO draft won't need country at creation
        project = Project.objects.create(name=row[project_name_col], data={'country': 1})

        # Organisation
        if project_import.mapping['organisation']:
            organisation_col = int(project_import.mapping['organisation'])
            organisation, _ = Organisation.objects.get_or_create(name=row[organisation_col])
            project.data.update(organisation=organisation.id, organisation_name=organisation.name)
        else:
            organisation = None

        # Country
        if project_import.mapping['country']:
            country_col = int(project_import.mapping['country'])
            country = Country.objects.get(name=row[country_col])
            project.data.update(country=country.id, country_name=country.name)
        else:
            country = None

        # Description
        if project_import.mapping['description']:
            description_col = int(project_import.mapping['description'])
            project.data.update(implementation_overview=row[description_col])

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
        UserProfile.objects.create(account_type=UserProfile.IMPLEMENTER, user=user, name=name, organisation=organisation,
                                   country=country)
        user.refresh_from_db()
        return user, password


admin.site.register(TechnologyPlatform, TechnologyPlatformAdmin)
admin.site.register(InteroperabilityLink, InteroperabilityLinkAdmin)
admin.site.register(DigitalStrategy, DigitalStrategyAdmin)
admin.site.register(HealthFocusArea)
admin.site.register(HealthCategory)
admin.site.register(ProjectImport, ProjectImportAdmin)
