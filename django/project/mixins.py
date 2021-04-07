import copy
from random import randint

from collections import OrderedDict
from django.db.models import QuerySet
from rest_framework.exceptions import ValidationError

from core.views import get_object_or_400

from country.models import Country, Donor
from user.models import Organisation
from .models import Project

from .serializers import ProjectDraftSerializer, ProjectPublishedSerializer, ProjectGroupSerializer
from django.conf import settings


class CheckRequiredMixin:
    @staticmethod
    def check_required(queryset: QuerySet, answers: OrderedDict):
        required_ids = set(queryset.filter(required=True).values_list('id', flat=True))
        present_ids = {answer['question_id'] for answer in answers}
        missing_ids = required_ids - present_ids
        if missing_ids:
            return {i: ['This field is required'] for i in missing_ids}


class ExternalAPIMixin:
    """
    Mixin to provide the common functions required by APIs open external clients
    """

    def parse_data(self, request, client_code, publish=False):
        """
        Function to parse the input parameters
        """
        if 'project' not in request.data:  # pragma: no cover
            raise ValidationError({'project': 'Project data is missing'})

        instance = None
        errors = {}

        country = get_object_or_400(Country, error_message="No such country",
                                    id=request.data['project'].get('country'))

        project_data = copy.deepcopy(request.data['project'])

        # WORKAROUND 1: project names must be unique, so check if they are clashing and randomize to help
        project_name = project_data.get('name')
        if project_name and Project.objects.filter(name=project_name).exists():
            project_name = f"{project_name} {randint(1, 100)}"
            project_data['name'] = project_name

        # WORKAROUND 2: organisation coming as a string, we need to check for Organisation objects
        if publish or project_data.get('organisation'):
            project_org = project_data.get('organisation')
            org, _ = Organisation.objects.get_or_create(name=project_org)
            project_data['organisation'] = str(org.id)

        # WORKAROUND 3: auto choose "Other" as an investor
        donor, created = Donor.objects.get_or_create(name='Other', defaults=dict(code="other"))
        project_data['donors'] = [donor.id]
        # WORKAROUND 4: set national_level_deployment to 0, so it can be added later
        project_data['national_level_deployment'] = {"clients": 0, "health_workers": 0, "facilities": 0}

        # TODO: validate UTC date
        if publish:
            data_serializer = ProjectPublishedSerializer(data=project_data)
        else:
            data_serializer = ProjectDraftSerializer(data=project_data)

        data_serializer.is_valid()

        if data_serializer.errors:
            errors['project'] = data_serializer.errors
        else:
            instance = data_serializer.save()

        if errors:
            return errors, False
        else:
            instance.save()
            instance.metadata = dict(from_external=client_code)
            if publish:
                instance.make_public_id(country.id)
                instance.save(update_fields=['metadata', 'public_id'])
            instance.team.add(request.user.userprofile)

            # TODO: WA5 is for DCH only
            # WORKAROUND 5: Add contact_email as team member
            group_data = {
                "team": [request.user.userprofile.id],
                "viewers": [],
                "new_team_emails": [instance.data['contact_email']] if publish else [instance.draft['contact_email']],
                "new_viewer_emails": []
            }
            pg_serializer = ProjectGroupSerializer(instance=instance, data=group_data, context=dict(request=request))
            pg_serializer.is_valid()
            pg_serializer.save()

        draft = instance.to_representation(draft_mode=True)
        published = instance.to_representation() if publish else {}
        return instance.to_response_dict(published=published, draft=draft), True
