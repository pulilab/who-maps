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


class CheckRequiredMixin:
    def check_required(self, queryset: QuerySet, answers: OrderedDict):
        required_ids = set(queryset.filter(required=True).values_list('id', flat=True))
        present_ids = {answer['question_id'] for answer in answers}
        missing_ids = required_ids - present_ids
        if missing_ids:
            return {i: ['This field is required'] for i in missing_ids}


class ExternalAPIMixin:
    """
    Mixin to provide the common functions required by APIs open external clients
    """
    def parse_data(self, request, publish=False):
        """
        Function to parse the input parameters
        """
        instance = None
        errors = {}

        if 'project' not in request.data:  # pragma: no cover
            raise ValidationError({'project': 'Project data is missing'})
        if 'name' not in request.data['project']:  # pragma: no cover
            raise ValidationError({'project': 'Name is missing'})
        if 'country' not in request.data['project']:  # pragma: no cover
            raise ValidationError({'country': 'Country is missing'})
        if 'donors' not in request.data['project']:  # pragma: no cover
            raise ValidationError({'donors': 'Donors are missing'})

        country = get_object_or_400(Country, error_message="No such country", id=request.data['project']['country'])

        project_data = copy.deepcopy(request.data['project'])

        # WORKAROUND 1: project names must be unique, so check if they are clashing and randomize to help
        project_name = project_data.get('name')
        if project_name and Project.objects.filter(name=project_name).exists():
            project_name = f"{project_name} {randint(1, 100)}"
            project_data['name'] = project_name

        # WORKAROUND 2: organisation coming as a string, we need to check for Organisation objects
        project_org = project_data.get('organisation')
        org, _ = Organisation.objects.get_or_create(name=project_org)
        project_data['organisation'] = str(org.id)

        # WORKAROUND 3: auto create donors
        donors = list()

        for donor_data in project_data['donors']:
            # TODO: Exception handling?
            donor, _ = Donor.objects.get_or_create(name=donor_data['name'], defaults=dict(code=donor_data['code']))
            donors.append(donor.id)
        project_data['donors'] = donors
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
            # TODO: Maybe check which external party is using the API?
            instance.metadata = dict(from_external=True)
            if publish:
                instance.make_public_id(country.id)
                instance.save(update_fields=['metadata', 'public_id'])
            instance.team.add(request.user.userprofile)

            # WORKAROUND 5: add contact_email as team member
            group_data = {
                "team": [request.user.userprofile.id],
                "viewers": [],
                "new_team_emails": [instance.data['contact_email']],
                "new_viewer_emails": []
            }
            pg_serializer = ProjectGroupSerializer(instance=instance, data=group_data, context=dict(request=request))
            pg_serializer.is_valid()
            pg_serializer.save()

        draft = instance.to_representation(draft_mode=True)
        published = instance.to_representation() if publish else {}
        return instance.to_response_dict(published=published, draft=draft), True
