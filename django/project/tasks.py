from collections import defaultdict
from django.conf import settings
from django.utils.translation import ugettext, override

from django.core import mail, exceptions
from django.template import loader
from django.utils import timezone
from celery.utils.log import get_task_logger
from django.contrib.auth.models import User
from rest_framework.exceptions import ValidationError

from user.models import Organisation
from country.models import Country
from toolkit.models import Toolkit

from .models import Project, InteroperabilityLink
from .serializers import ProjectDraftSerializer

from scheduler.celery import app
import json
import traceback
import logging
from datetime import datetime
import requests
from urllib.parse import urljoin

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


@app.task(name="sync_project_from_odk")
def sync_project_from_odk():
    base_url = '{}://{}'.format(settings.ODK_SERVER_PROTOCOL, settings.ODK_SERVER_HOST)
    form_url = '/web-ui/tables/{}/export/JSON/showDeleted/false'.format(settings.ODK_TABLE_NAME)
    login_url = urljoin(base_url, '/web-ui/login')
    import_url = urljoin(base_url, form_url)
    s = requests.Session()
    s.post(login_url, data=settings.ODK_CREDENTIALS)
    res = s.get(import_url)

    interoperability_links = InteroperabilityLink.objects.all()

    def uuid_parser(value):
        return value.replace('uuid:', '')

    def escaped_int_converter(value):
        if isinstance(value, str) and value.startswith("'"):
            value = value.replace("'", '')
        return int(value)

    def list_parser(list):
        return json.loads(list)

    def string_to_list(text):
        return text.split(',')

    def first_level_converter(value, type, project, int_link_collection):
        default_nld = {
            'clients': 0,
            'facilities': 0,
            'health_workers': 0
        }
        if type == 'name':
            project['name'] = value
        elif type == 'organization':
            try:
                project['organisation'] = escaped_int_converter(value)
            except ValueError:
                (org, success) = Organisation.objects.get_or_create(name=value)
                project['organisation'] = org.id
        elif type == 'country':
            project['country'] = escaped_int_converter(value)
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
        elif type == 'interoperability_standards':
            as_list = list_parser(value)
            project['interoperability_standards'] = list(map(lambda s: escaped_int_converter(s), as_list))
        elif 'interoperability_link_' in type and '_url' not in type:
            id = None
            try:
                id = escaped_int_converter(value)
            except ValueError:
                pass
            if id:
                il_obj = next((item for item in int_link_collection if item["id"] == id), None)
                il_obj['selected'] = True
                il_obj['odk_name'] = '{}_url'.format(type)

    def second_level_converter(value, type, project, int_link_collection):
        if 'dhi' in type:
            index = int(type.replace('dhi', '')) - 1
            platform = project['platforms'][index]
            if platform:
                as_list = list_parser(value)
                platform['strategies'] = list(map(lambda s: escaped_int_converter(s), as_list))
        elif 'interoperability_link_' in type and '_url' in type:
            il_obj = next((item for item in int_link_collection if item["odk_name"] == type), None)
            if il_obj:
                il_obj['link'] = value

    def odk_columns_parser(columns):
        int_link_collection = list(map(lambda il: {'id': il.id, 'odk_name': None}, interoperability_links))
        project = dict()
        for column in columns:
            type = column.get('column', None)
            value = column.get('value', None)
            if type and value:
                try:
                    first_level_converter(value, type, project, int_link_collection)
                except Exception:
                    traceback.print_exc()

        for column in columns:
            type = column.get('column', None)
            value = column.get('value', None)
            if type and value:
                try:
                    second_level_converter(value, type, project, int_link_collection)
                except IndexError:
                    logging.log('{} has invalid / missing value: {}'.format(type, value))
                except Exception:
                    traceback.print_exc()

        for int_link_dict in int_link_collection:
            int_link_dict.pop('odk_name', None)
        project['interoperability_links'] = int_link_collection
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
            logging.error('No user with following email: {}'.format(user_email))
        except ValidationError:
            logging.warning('Validation error/s:')
            logging.warning(serialized.errors)

    def save_or_update_project(row, user_email, odk_etag, odk_id, odk_extra_data):
        existing = None
        try:
            existing = Project.objects.get(odk_id=odk_id)
        except exceptions.ObjectDoesNotExist:
            pass
        if not existing:
            logging.error('Does not exist in DHA database: importing')
            serialize_and_save(row, odk_etag, odk_id, odk_extra_data, None, user_email)
        elif existing.odk_etag is None:
            logging.error('Overridden by ui: nothing to do')
        elif existing.odk_etag != odk_etag:
            logging.error('Exist in DHA database, but new version found in ODK: updating')
            serialize_and_save(row, odk_etag, odk_id, odk_extra_data, existing, None)
        else:
            logging.error('Already present and same version: nothing to do')

    def start_sync(rows):
        logging.error('ODK IMPORT TASK START: {}'.format(datetime.now()))
        logging.error('\n')
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
            logging.error('Processing odk_id {} with odk_etag {} START'.format(odk_id, odk_etag))
            if savepoint_type.lower() == 'complete' and deleted != 'true':
                save_or_update_project(row, user_email, odk_etag, odk_id, odk_extra_data)
            else:
                logging.error('Incomplete or deleted: nothing to do')
            logging.error('\n')
        logging.error('ODK IMPORT TASK END: {}'.format(datetime.now()))

    # with open('project/static-json/odk.json') as odk_file:
    #     rows = json.load(odk_file)
    #     start_sync(rows)
    start_sync(res.json())
