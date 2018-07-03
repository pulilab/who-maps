from collections import defaultdict
from django.conf import settings
from django.utils.translation import ugettext, override

from django.core import mail, exceptions
from django.template import loader
from django.utils import timezone
from celery.utils.log import get_task_logger
from django.contrib.auth.models import User

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
    def uuid_parser(value):
        return value.replace('uuid:', '')

    def escaped_int_converter(value):
        return int(value.replace("'", ''))

    def first_level_converter(value, type, project):
        if type == 'name':
            project['name'] = value
        elif type == 'organization':
            project['organisation'] = escaped_int_converter(value)
        elif 'platforms' in type:
                project['platforms'].append({'id': escaped_int_converter(value)})

    def second_level_converter(value, type, project):
        if 'dhi' in type:
            index = int(type.replace('dhi', '')) - 1
            platform = project['platforms'][index]
            if platform:
                platform['strategies'] = list(map(lambda s: escaped_int_converter(s), value))

    def odk_columns_parser(columns):
        project = dict(platforms=[])
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

    def serialize_odk_data(row, odk_etag, odk_id, odk_extra_data, existing):
        p = odk_columns_parser(row.get('orderedColumns'))
        p['odk_etag'] = odk_etag
        p['odk_id'] = odk_id
        p['odk_extra_data'] = odk_extra_data
        if existing:
            return ProjectDraftSerializer(existing, data=p)
        return ProjectDraftSerializer(data=p)

    def save_new_project(serialized_project, email):
        try:
            u = User.objects.get(email=email)
            project = serialized_project.save(owner=u.userprofile)
            Toolkit.objects.get_or_create(project_id=project.id, defaults=dict(data=toolkit_default))
            ProjectApproval.objects.create(project=project)
        except exceptions.ObjectDoesNotExist:
            print('No user with following email: {}'.format(email))

    def serialized_and_save(row, odk_etag, odk_id, odk_extra_data, existing, user_email):
        serialized = serialize_odk_data(row, odk_etag, odk_id, odk_extra_data, existing)
        try:
            serialized.is_valid(raise_exception=True)
            if(existing):
                serialized.save()
            else:
                save_new_project(serialized, user_email)
        except exceptions.ValidationError:
            print('Validation error on project: {}'.format(row))

    def save_or_update_project(row, user_email, odk_etag, odk_id, odk_extra_data):
        existing = None
        try:
            existing = Project.objects.get(odk_id=odk_id)
        except exceptions.ObjectDoesNotExist:
            pass
        if not existing:
            serialized_and_save(row, odk_etag, odk_id, odk_extra_data, None, user_email)
        elif existing.odk_etag and existing.odk_etag != odk_etag:
            serialized_and_save(row, odk_etag, odk_id, odk_extra_data, existing, None)
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
