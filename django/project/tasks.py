from collections import defaultdict
from django.conf import settings
from django.utils.translation import ugettext, override

from django.core import mail, exceptions, validators
from django.template import loader
from django.utils import timezone
from celery.utils.log import get_task_logger
from django.contrib.auth.models import User
from rest_framework.exceptions import ValidationError

from user.models import Organisation
from country.models import Country
from toolkit.models import Toolkit

from .models import Project, ProjectApproval
from .serializers import ProjectDraftSerializer

from toolkit.toolkit_data import toolkit_default

from scheduler.celery import app
import json
import traceback

logger = get_task_logger(__name__)


@app.task(name="send_project_approval_digest")
def send_project_approval_digest():
    countries = Country.objects.exclude(users=None)
    for country in countries:
        if country.project_approval:
            projects_today = Project.objects.filter(data__country=country.id, approval__approved__isnull=True,
                                                    created__day=timezone.now().day)
            projects_earlier = Project.objects.filter(
                data__country=country.id, approval__approved__isnull=True).exclude(id__in=projects_today.values('id'))

            if not projects_today and not projects_earlier:
                return

            html_template = loader.get_template('email/status_report_inline.html')

            email_mapping = defaultdict(list)
            for profile in country.users.all():
                email_mapping[profile.language].append(profile.user.email)

            for language, email_list in email_mapping.items():
                with override(language):
                    subject = ugettext('Projects waiting for your approval')
                    html_message = html_template.render({'projects_today': projects_today,
                                                         'projects_earlier': projects_earlier,
                                                         'language': language})

                mail.send_mail(
                    subject=subject,
                    message='',
                    from_email=settings.FROM_EMAIL,
                    recipient_list=email_list,
                    html_message=html_message)


@app.task(name="sync_from_odk_server")
def sync_from_odk_server():
    default_nld = {
        'clients': 0,
        'facilities': 0,
        'health_workers': 0
    }

    def uuid_parser(value):
        return value.replace('uuid:', '')

    def escaped_int_converter(value):
        return int(value.replace("'", ''))

    def list_parser(list):
        return json.loads(list)

    def string_to_list(text):
        return text.split(',')

    def first_level_converter(value, type, project):
        if type == 'name':
            project['name'] = value
        elif type == 'organization':
            try:
                project['organisation'] = escaped_int_converter(value)
            except ValueError:
                (org, success) = Organisation.objects.get_or_create(name=value)
                project['organisation'] = org.id
        elif 'platforms' in type:
                platforms = project.get('platforms', [])
                project['platforms'] = platforms + [{'id': escaped_int_converter(value)}]
        elif type == 'clients':
            nld = project.get('national_level_deployment', dict(default_nld))
            nld['clients'] = escaped_int_converter(value)
            project['national_level_deployment'] = nld
        elif type == 'facilities':
            nld = project.get('national_level_deployment', dict(default_nld))
            nld['facilities'] = escaped_int_converter(value)
            project['national_level_deployment'] = nld
        elif type == 'health_workers':
            nld = project.get('national_level_deployment', dict(default_nld))
            nld['health_workers'] = escaped_int_converter(value)
            project['national_level_deployment'] = nld
        elif type == 'contact_email':
            project['contact_email'] = value
        elif type == 'contact_name':
            project['contact_name'] = value
        elif type == 'donors':
            project['donors'] = string_to_list(value)
        elif type == 'end_date':
            project['end_date'] = value
        elif type == 'geographic_scope':
            project['geographic_scope'] = value
        elif type == 'government_investor':
            project['government_investor'] = escaped_int_converter(value)
        elif type == 'health_focus_areas':
            as_list = list_parser(value)
            project['health_focus_areas'] = list(map(lambda s: escaped_int_converter(s), as_list))
        elif type == 'health_information_systems':
            as_list = list_parser(value)
            project['his_bucket'] = list(map(lambda s: escaped_int_converter(s), as_list))
        elif type == 'health_system_challenges':
            as_list = list_parser(value)
            project['hsc_challenges'] = list(map(lambda s: escaped_int_converter(s), as_list))
        elif type == 'implementation_dates':
            project['implementation_dates'] = value
        elif type == 'implementation_overview':
            project['implementation_overview'] = value
        elif type == 'implementing_partners':
            project['implementing_partners'] = string_to_list(value)
        elif type == 'licenses':
            as_list = list_parser(value)
            project['licenses'] = list(map(lambda s: escaped_int_converter(s), as_list))
        elif type == 'mobile_application':
            project['mobile_application'] = value
        elif type == 'repository':
            project['repository'] = value
        elif type == 'start_date':
            project['start_date'] = value
        elif type == 'wiki':
            project['wiki'] = value

    def second_level_converter(value, type, project):
        if 'dhi' in type:
            index = int(type.replace('dhi', '')) - 1
            platform = project['platforms'][index]
            if platform:
                as_list = list_parser(value)
                platform['strategies'] = list(map(lambda s: escaped_int_converter(s), as_list))

    def odk_columns_parser(columns):
        project = dict()
        for column in columns:
            type = column.get('column', None)
            value = column.get('value', None)
            if type and value:
                try:
                    first_level_converter(value, type, project)
                except Exception:
                    traceback.print_exc()

        for column in columns:
            type = column.get('column', None)
            value = column.get('value', None)
            if type and value:
                try:
                    second_level_converter(value, type, project)
                except IndexError:
                    print('{} has invalid / missing value: {}'.format(type, value))
                except Exception:
                    traceback.print_exc()
        return project

    def parse_odk_data(row, odk_etag, odk_id, odk_extra_data):
        p = odk_columns_parser(row.get('orderedColumns'))
        p['odk_etag'] = odk_etag
        p['odk_id'] = odk_id
        p['odk_extra_data'] = odk_extra_data
        return p

    def new_or_updated_serializer(data, existing=None):
        if existing:
            return ProjectDraftSerializer(existing, data=data, context={'preserve_etag': True})
        else:
            return ProjectDraftSerializer(data=data)

    def serialize_and_save(row, odk_etag, odk_id, odk_extra_data, existing, user_email):
        parsed = parse_odk_data(row, odk_etag, odk_id, odk_extra_data)
        serialized = new_or_updated_serializer(parsed, existing)
        try:
            if not serialized.is_valid():
                for error in serialized.errors:
                    parsed.pop(error, None)
                serialized = new_or_updated_serializer(parsed, existing)
                serialized.is_valid(raise_exception=True)
            if(existing):
                serialized.save()
            else:
                u = User.objects.get(email=user_email)
                project = serialized.save(owner=u.userprofile)
                project.post_save_initializations(Toolkit)

        except exceptions.ObjectDoesNotExist:
            print('No user with following email: {}'.format(user_email))
        except ValidationError:
            print('Validation error on project: {}'.format(odk_id))
            print(serialized.errors)

    def save_or_update_project(row, user_email, odk_etag, odk_id, odk_extra_data):
        existing = None
        try:
            existing = Project.objects.get(odk_id=odk_id)
        except exceptions.ObjectDoesNotExist:
            pass
        if not existing:
            serialize_and_save(row, odk_etag, odk_id, odk_extra_data, None, user_email)
        elif existing.odk_etag and existing.odk_etag != odk_etag:
            serialize_and_save(row, odk_etag, odk_id, odk_extra_data, existing, None)
        else:
            print('present, same version: nothing to do ')

    with open('project/static-json/odk.json') as odk_file:
        rows = json.load(odk_file)
        for row in rows:
            odk_etag = uuid_parser(row.get('rowETag'))
            odk_id = uuid_parser(row.get('id'))
            savepoint_type = row.get('savepointType', 'INCOMPLETE')
            deleted = row.get('deleted', True)
            user_email = row.get('createUser', None)
            odk_extra_data = {
                'create_user': user_email,
                'last_update_user': row.get('lastUpdateUser', None),
                'locale': row.get('locale', None),
                'savepoint_timestamp': row.get('savepointTimestamp', None),
                'savepoint_creator': row.get('savepointCreator', None),
                'filterScope': row.get('filterScope', None)
            }
            if savepoint_type.lower() == 'complete' and deleted != 'true':
                save_or_update_project(row, user_email, odk_etag, odk_id, odk_extra_data)
            else:
                print('row either incomplete or deleted: {}'.format(odk_id))
