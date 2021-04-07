import copy
from random import randint

from django.db import transaction
from django.shortcuts import get_object_or_404
from drf_yasg.utils import swagger_auto_schema
from rest_framework import status
from rest_framework.exceptions import ValidationError
from rest_framework.mixins import RetrieveModelMixin, ListModelMixin, UpdateModelMixin, CreateModelMixin, \
    DestroyModelMixin
from rest_framework.permissions import IsAuthenticated
from rest_framework.serializers import BaseSerializer
from rest_framework.validators import UniqueValidator
from rest_framework.viewsets import ViewSet, GenericViewSet
from rest_framework.response import Response
from core.views import TokenAuthMixin, TeamTokenAuthMixin, get_object_or_400
from project.cache import cache_structure
from project.models import HSCGroup, ProjectApproval, ProjectImportV2, ImportRow, Stage, ProjectVersion
from project.permissions import InCountryAdminForApproval
from toolkit.models import Toolkit, ToolkitVersion
from country.models import Country, Donor
from .tasks import notify_superusers_about_new_pending_software
from user.models import Organisation

from .serializers import ProjectDraftSerializer, ProjectGroupSerializer, ProjectPublishedSerializer, \
    MapProjectCountrySerializer, CountryCustomAnswerSerializer, DonorCustomAnswerSerializer, \
    ProjectApprovalSerializer, ProjectImportV2Serializer, ImportRowSerializer, TechnologyPlatformCreateSerializer, \
    TerminologySerializer, ExternalProjectPublishSerializer, ExternalProjectDraftSerializer
from .models import Project, CoverageVersion, InteroperabilityLink, TechnologyPlatform, DigitalStrategy, \
    HealthCategory, Licence, InteroperabilityStandard, HISBucket, HSCChallenge

from .mixins import CheckRequiredMixin
from django.conf import settings

from rest_framework.throttling import ScopedRateThrottle


class ProjectPublicViewSet(ViewSet):

    @swagger_auto_schema(operation_id="project-structure", responses={200: TerminologySerializer})
    def project_structure(self, request):
        return Response(self._get_project_structure())

    @cache_structure
    def _get_project_structure(self):
        strategies = []
        for group, group_name in DigitalStrategy.GROUP_CHOICES:
            sub_groups = []
            for parent in DigitalStrategy.objects.filter(group=group, parent=None).all():
                sub_groups.append(dict(
                    id=parent.id,
                    name=parent.name,
                    strategies=parent.strategies.filter(is_active=True).values('id', 'name')
                ))
            strategies.append(dict(
                name=group_name,
                subGroups=sub_groups
            ))

        health_focus_areas = []
        for category in HealthCategory.objects.all():
            health_focus_areas.append(dict(
                id=category.id,
                name=category.name,
                health_focus_areas=category.health_focus_areas.filter(is_active=True).values('id', 'name', 'donors')
            ))

        hsc_challenges = []
        for group in HSCGroup.objects.values('id', 'name'):
            hsc_challenges.append(dict(
                name=group['name'],
                challenges=[{'id': c['id'], 'challenge': c['name']}
                            for c in HSCChallenge.objects.filter(group__id=group['id']).values('id', 'name')]
            ))

        return dict(
            interoperability_links=InteroperabilityLink.objects.values('id', 'pre', 'name'),
            technology_platforms=TechnologyPlatform.objects.exclude(state=TechnologyPlatform.DECLINED)
                                                   .values('id', 'name', 'state'),
            licenses=Licence.objects.values('id', 'name'),
            interoperability_standards=InteroperabilityStandard.objects.values('id', 'name'),
            his_bucket=HISBucket.objects.values('id', 'name'),
            health_focus_areas=health_focus_areas,
            hsc_challenges=hsc_challenges,
            strategies=strategies,
            stages=Stage.objects.values('id', 'name', 'tooltip', 'order'),
        )

    @staticmethod
    def project_structure_export(request):
        """
        Used to sync objects to "Implementation Toolkit"
        """
        return Response(dict(
            technology_platforms=TechnologyPlatform.objects.values('id', 'name'),
            digital_strategies=DigitalStrategy.objects.filter(parent=None).values('id', 'name')
        ))


class ProjectListViewSet(TokenAuthMixin, ViewSet):
    def list(self, request, *args, **kwargs):
        """
        Retrieves list of projects user's projects.
        """
        data = []
        for project in Project.objects.member_of(request.user):
            published = project.to_representation()
            draft = project.to_representation(draft_mode=True)
            data.append(project.to_response_dict(published=published, draft=draft))

        return Response(data)


class ProjectRetrieveViewSet(TeamTokenAuthMixin, ViewSet):
    lookup_fields = ("pk", "public_id")

    def get_permissions(self):
        if self.action == "retrieve":
            return []  # Retrieve needs a bit more complex filtering based on user permission
        else:
            return super(ProjectRetrieveViewSet, self).get_permissions()

    def _get_permission_based_data(self, project):
        draft = None

        if not self.request.user.is_authenticated:  # ANON
            data = project.get_anon_data()
        else:  # LOGGED IN
            is_member = project.is_member(self.request.user)
            is_country_user_or_admin = project.is_country_user_or_admin(self.request.user)
            if is_member or is_country_user_or_admin or self.request.user.is_superuser:
                data = project.get_member_data()
                draft = project.get_member_draft()
            else:
                data = project.get_non_member_data()

        if draft:
            draft = project.to_representation(data=draft, draft_mode=True)
        published = project.to_representation(data=data)

        return project.to_response_dict(published=published, draft=draft)

    def retrieve(self, request, *args, **kwargs):
        """
        Retrieves a project.
        """
        filter = {}
        for field in self.lookup_fields:
            if self.kwargs.get(field):
                filter[field] = self.kwargs[field]
        project = get_object_or_404(Project, **filter)

        return Response(self._get_permission_based_data(project))


class ProjectPublishViewSet(CheckRequiredMixin, TeamTokenAuthMixin, ViewSet):
    @transaction.atomic
    def update(self, request, project_id, country_id):
        """
        Publish a project
        Takes project data and custom question-answers in one go.
        """
        project = get_object_or_400(Project, select_for_update=True, error_message="No such project", id=project_id)
        country = get_object_or_400(Country, error_message="No such country", id=country_id)

        country_answers = None
        all_donor_answers = []
        errors = {}

        if 'project' not in request.data:
            raise ValidationError({'project': 'Project data is missing'})

        data_serializer = ProjectPublishedSerializer(project, data=request.data['project'])

        data_serializer.fields.get('name').validators = \
            [v for v in data_serializer.fields.get('name').validators if not isinstance(v, UniqueValidator)]
        data_serializer.fields.get('name').validators \
            .append(UniqueValidator(queryset=project.__class__.objects.all().exclude(id=project.id)))

        self.check_object_permissions(self.request, project)
        data_serializer.is_valid()
        if data_serializer.errors:
            errors['project'] = data_serializer.errors

        if country.country_questions.exists():
            if 'country_custom_answers' not in request.data:
                raise ValidationError({'non_field_errors': 'Country answers are missing'})
            else:
                country_answers = CountryCustomAnswerSerializer(data=request.data['country_custom_answers'], many=True,
                                                                context=dict(
                                                                    question_queryset=country.country_questions,
                                                                    is_draft=False))

                if country_answers.is_valid():
                    required_errors = self.check_required(country.country_questions, country_answers.validated_data)
                    if required_errors:
                        errors['country_custom_answers'] = required_errors
                else:
                    errors['country_custom_answers'] = country_answers.errors

        for donor_id in data_serializer.validated_data.get('donors', []):
            donor = Donor.objects.get(id=donor_id)
            if donor and donor.donor_questions.exists():
                if 'donor_custom_answers' not in request.data:
                    raise ValidationError({'non_field_errors': 'Donor answers are missing'})
                if str(donor_id) not in request.data['donor_custom_answers']:
                    raise ValidationError({'non_field_errors': 'Donor answers are missing'})
                donor_answers = DonorCustomAnswerSerializer(data=request.data['donor_custom_answers'][str(donor_id)],
                                                            many=True,
                                                            context=dict(question_queryset=donor.donor_questions,
                                                                         is_draft=False))

                if not donor_answers.is_valid():
                    errors.setdefault('donor_custom_answers', {})
                    errors['donor_custom_answers'].setdefault(donor_id, {})
                    errors['donor_custom_answers'][donor_id] = donor_answers.errors
                else:
                    required_errors = self.check_required(donor.donor_questions, donor_answers.validated_data)
                    if required_errors:
                        errors.setdefault('donor_custom_answers', {})
                        errors['donor_custom_answers'].setdefault(donor_id, {})
                        errors['donor_custom_answers'][donor_id] = required_errors
                    else:
                        all_donor_answers.append((donor_id, donor_answers))

        if errors:
            return Response(errors, status=status.HTTP_400_BAD_REQUEST)
        else:
            original_data = {
                'name': project.name,
                'data': copy.deepcopy(project.data),
                'research': project.research
            }

            instance = data_serializer.save()
            if country_answers:
                country_answers.context['project'] = instance
                instance = country_answers.save()
            for donor_id, donor_answers in all_donor_answers:
                donor_answers.context['project'] = instance
                donor_answers.context['donor_id'] = donor_id
                instance = donor_answers.save()

            instance.save()
            project.refresh_from_db()  # need to do this due to JSONfield

            if project.name != original_data['name'] or project.research != original_data['research'] or \
                    project.data != original_data['data']:
                ProjectVersion.objects.create(project=project, user=request.user.userprofile, name=project.name,
                                              data=project.data, research=project.research)

        project.reset_approval()

        draft = instance.to_representation(draft_mode=True)
        published = instance.to_representation()
        return Response(instance.to_response_dict(published=published, draft=draft))


class ProjectUnPublishViewSet(CheckRequiredMixin, TeamTokenAuthMixin, ViewSet):
    @transaction.atomic
    def update(self, request, project_id):
        project = get_object_or_400(Project, select_for_update=True, error_message="No such project", id=project_id)
        project.unpublish()
        data = project.to_representation(draft_mode=True)
        return Response(project.to_response_dict(published={}, draft=data), status=status.HTTP_200_OK)


class ProjectDraftViewSet(TeamTokenAuthMixin, ViewSet):
    def create(self, request, country_id):
        """
        Creates a Draft project.
        """
        country = get_object_or_400(Country, error_message="No such country", id=country_id)

        instance = country_answers = None
        all_donor_answers = []
        errors = {}

        if 'project' not in request.data:
            raise ValidationError({'project': 'Project data is missing'})

        data_serializer = ProjectDraftSerializer(data=request.data['project'])
        data_serializer.is_valid()

        if data_serializer.errors:
            errors['project'] = data_serializer.errors
        else:
            instance = data_serializer.save()

        if country.country_questions.exists():
            if 'country_custom_answers' not in request.data:
                raise ValidationError({'non_field_errors': 'Country answers are missing'})
            else:
                country_answers = CountryCustomAnswerSerializer(data=request.data['country_custom_answers'], many=True,
                                                                context=dict(
                                                                    question_queryset=country.country_questions,
                                                                    is_draft=True))

                if not country_answers.is_valid():
                    errors['country_custom_answers'] = country_answers.errors

        for donor_id in data_serializer.validated_data.get('donors', []):
            donor = Donor.objects.filter(id=donor_id).first()
            if donor and donor.donor_questions.exists():
                if 'donor_custom_answers' not in request.data:
                    raise ValidationError({'non_field_errors': 'Donor answers are missing'})
                if str(donor_id) not in request.data['donor_custom_answers']:
                    raise ValidationError({'non_field_errors': 'Donor answers are missing'})
                donor_answers = DonorCustomAnswerSerializer(data=request.data['donor_custom_answers'][str(donor_id)],
                                                            many=True,
                                                            context=dict(question_queryset=donor.donor_questions,
                                                                         is_draft=True))

                if not donor_answers.is_valid():
                    errors.setdefault('donor_custom_answers', {})
                    errors['donor_custom_answers'].setdefault(donor_id, {})
                    errors['donor_custom_answers'][donor_id] = donor_answers.errors
                else:
                    all_donor_answers.append((donor_id, donor_answers))

        if errors:
            return Response(errors, status=status.HTTP_400_BAD_REQUEST)
        else:
            if country_answers:
                country_answers.context['project'] = instance
                instance = country_answers.save()
            for donor_id, donor_answers in all_donor_answers:
                donor_answers.context['project'] = instance
                donor_answers.context['donor_id'] = donor_id
                instance = donor_answers.save()
            instance.save()
            instance.team.add(request.user.userprofile)

        data = instance.to_representation(draft_mode=True)
        return Response(instance.to_response_dict(published={}, draft=data), status=status.HTTP_201_CREATED)

    @transaction.atomic
    def update(self, request, project_id, country_id):
        """
        Updates a draft project.
        """
        project = get_object_or_400(Project, select_for_update=True, error_message="No such project", id=project_id)
        country = get_object_or_400(Country, error_message="No such country", id=country_id)

        country_answers = None
        all_donor_answers = []
        errors = {}

        if 'project' not in request.data:
            raise ValidationError({'project': 'Project data is missing'})

        data_serializer = ProjectDraftSerializer(project, data=request.data['project'])
        self.check_object_permissions(self.request, project)
        data_serializer.is_valid()
        if data_serializer.errors:
            errors['project'] = data_serializer.errors

        if country.country_questions.exists():
            if 'country_custom_answers' not in request.data:
                raise ValidationError({'non_field_errors': 'Country answers are missing'})
            else:
                country_answers = CountryCustomAnswerSerializer(data=request.data['country_custom_answers'], many=True,
                                                                context=dict(
                                                                    question_queryset=country.country_questions,
                                                                    is_draft=True))

                if not country_answers.is_valid():
                    errors['country_custom_answers'] = country_answers.errors

        for donor_id in data_serializer.validated_data.get('donors', []):
            donor = Donor.objects.get(id=donor_id)
            if donor and donor.donor_questions.exists():
                if 'donor_custom_answers' not in request.data:
                    raise ValidationError({'non_field_errors': 'Donor answers are missing'})
                if str(donor_id) not in request.data['donor_custom_answers']:
                    raise ValidationError({'non_field_errors': 'Donor answers are missing'})

                donor_answers = DonorCustomAnswerSerializer(data=request.data['donor_custom_answers'][str(donor_id)],
                                                            many=True,
                                                            context=dict(question_queryset=donor.donor_questions,
                                                                         is_draft=True))

                if not donor_answers.is_valid():
                    errors.setdefault('donor_custom_answers', {})
                    errors['donor_custom_answers'].setdefault(donor_id, {})
                    errors['donor_custom_answers'][donor_id] = donor_answers.errors
                else:
                    all_donor_answers.append((donor_id, donor_answers))

        if errors:
            return Response(errors, status=status.HTTP_400_BAD_REQUEST)
        else:
            instance = data_serializer.save()
            if country_answers:
                country_answers.context['project'] = instance
                instance = country_answers.save()
            for donor_id, donor_answers in all_donor_answers:
                donor_answers.context['project'] = instance
                donor_answers.context['donor_id'] = donor_id
                instance = donor_answers.save()
            instance.save()

        draft = instance.to_representation(draft_mode=True)
        published = instance.to_representation()
        return Response(instance.to_response_dict(published=published, draft=draft), status=status.HTTP_200_OK)


class ExternalDraftAPI(TeamTokenAuthMixin, ViewSet):
    throttle_classes = (ScopedRateThrottle, )
    throttle_scope = 'external_api'

    @transaction.atomic
    @swagger_auto_schema(
        operation_id="project-draft-external",
        request_body=ExternalProjectDraftSerializer,
        responses={201: ProjectDraftSerializer}
        )
    def create(self, request, client_code):
        """
        Create *draft* projects from external sources.
        Alterations from internal API are:
        - project names must be unique, so check if they are clashing and randomize to help
        - organisation is coming as a string, we need to check for Organisation objects
        - donor (Investor) is by default set to "Other"
        - required country questions are not checked
        - national_level_deployment is set to 0 (can be added later)
        - contact email is automatically added as team member
        """
        # If client code is used, it needs to be correct
        if client_code and not settings.EXTERNAL_API_CLIENTS.get(client_code):
            raise ValidationError({'client_code': 'Client code is invalid'})

        if not request.data.get('project'):
            raise ValidationError({'project': 'Project data is missing'})

        # Project name needs to be unique
        project_name = request.data['project'].get('name')
        if Project.objects.filter(name=project_name).exists():  # pragma: no cover
            request.data['project']['name'] = f"{project_name} {randint(1, 100)}"

        # Organisation is coming as a string (and is optional)
        if request.data['project'].get('organisation'):
            project_org = request.data['project'].get('organisation')
            org, _ = Organisation.objects.get_or_create(name=project_org)
            request.data['project']['organisation'] = str(org.id)
        # Donor is required - set to "Other"
        donor, _ = Donor.objects.get_or_create(name='Other', defaults=dict(code="other"))
        request.data['project']['donors'] = [donor.id]

        # Set national_level_deployment to 0, so it can be added later
        request.data['project']['national_level_deployment'] = {"clients": 0, "health_workers": 0, "facilities": 0}

        data_serializer = ProjectDraftSerializer(data=request.data['project'])
        data_serializer.is_valid(raise_exception=True)
        instance = data_serializer.save()
        instance.metadata = dict(from_external=client_code)
        instance.save()  # REST FW does not call save for these serializers by default, so we have to do it here
        instance.team.add(request.user.userprofile)

        return Response(instance.to_representation(draft_mode=True), status=status.HTTP_201_CREATED)


class ExternalPublishAPI(TeamTokenAuthMixin, ViewSet):
    throttle_classes = (ScopedRateThrottle, )
    throttle_scope = 'external_api'

    @transaction.atomic
    @swagger_auto_schema(
        operation_id="project-publish-external",
        request_body=ExternalProjectPublishSerializer,
        responses={201: ProjectPublishedSerializer}
    )
    def create(self, request, client_code):
        """
        Create *Published* projects from external sources.
        Alterations from internal API are:
        - project names must be unique, so check if they are clashing and randomize to help
        - organisation is coming as a string, we need to check for Organisation objects
        - donor (Investor) is by default set to "Other"
        - required country questions are not checked
        - national_level_deployment is set to 0 (can be added later)
        - contact email is automatically added as team member
        """
        # If client code is used, it needs to be correct
        if client_code and not settings.EXTERNAL_API_CLIENTS.get(client_code):
            raise ValidationError({'client_code': 'Client code is invalid'})

        if not request.data.get('project'):
            raise ValidationError({'project': 'Project data is missing'})  # pragma: no cover
        country = get_object_or_400(Country, error_message="No such country", id=request.data['project'].get('country'))

        # Project name needs to be unique
        project_name = request.data['project'].get('name')
        if Project.objects.filter(name=project_name).exists():
            request.data['project']['name'] = f"{project_name} {randint(1, 100)}"

        # Organisation is coming as a string (and is optional)
        if request.data['project'].get('organisation'):
            project_org = request.data['project'].get('organisation')
            org, _ = Organisation.objects.get_or_create(name=project_org)
            request.data['project']['organisation'] = str(org.id)
        # Donor is required - set to "Other"
        donor, _ = Donor.objects.get_or_create(name='Other', defaults=dict(code="other"))
        request.data['project']['donors'] = [donor.id]

        # Set national_level_deployment to 0, so it can be added later
        request.data['project']['national_level_deployment'] = {"clients": 0, "health_workers": 0, "facilities": 0}

        data_serializer = ProjectPublishedSerializer(data=request.data['project'])
        data_serializer.is_valid(raise_exception=True)
        instance = data_serializer.save()
        instance.metadata = dict(from_external=client_code)
        instance.save()  # REST FW does not call save for these serializers by default, so we have to do it here
        instance.make_public_id(country.id)
        instance.save(update_fields=['public_id'])
        instance.team.add(request.user.userprofile)

        # DCH only - Add contact_email as team member
        if client_code == 'xNhlb4':
            group_data = {
                "team": [request.user.userprofile.id],
                "viewers": [],
                "new_team_emails": [instance.data['contact_email']],
                "new_viewer_emails": []
            }
            pg_serializer = ProjectGroupSerializer(instance=instance, data=group_data, context=dict(request=request))
            pg_serializer.is_valid()
            pg_serializer.save()

        # create changelog
        ProjectVersion.objects.create(project=instance, user=request.user.userprofile, name=instance.name,
                                      data=instance.data, research=instance.research)
        return Response(instance.to_representation(draft_mode=True), status=status.HTTP_201_CREATED)


class ProjectGroupViewSet(TeamTokenAuthMixin, RetrieveModelMixin, GenericViewSet):
    queryset = Project.objects.all()
    serializer_class = ProjectGroupSerializer

    @transaction.atomic
    def update(self, request, *args, **kwargs):
        instance = get_object_or_400(Project, select_for_update=True, error_message="No such project", id=kwargs["pk"])
        self.check_object_permissions(self.request, instance)
        serializer = ProjectGroupSerializer(instance, data=request.data, context=self.get_serializer_context())
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)


class ProjectVersionViewSet(TeamTokenAuthMixin, ViewSet):
    def create(self, request, project_id):
        """
        Makes versions out of Toolkit and coverage data for the project.
        """
        project = get_object_or_400(Project, "No such project.", id=project_id)
        self.check_object_permissions(request, project)

        if not project.public_id:
            return Response(status=status.HTTP_406_NOT_ACCEPTABLE)

        last_cov_ver = CoverageVersion.objects.filter(project_id=project_id).order_by("-version").first()
        if not last_cov_ver:
            # No versions yet.
            new_version = 1
        else:
            new_version = last_cov_ver.version + 1

        current_cov = project.data.get("coverage", [])
        current_cov += [project.data.get('national_level_deployment', {})]

        new_cov_ver = CoverageVersion(project_id=project_id, version=new_version, data=current_cov)
        new_cov_ver.save()

        # Make a new version from current toolkit.
        last_toolkit_ver = ToolkitVersion.objects.filter(project_id=project_id).order_by("-version").first()
        if not last_toolkit_ver:
            # No versions yet.
            new_version = 1
        else:
            new_version = last_toolkit_ver.version + 1
        current_toolkit = get_object_or_400(Toolkit, "No such Toolkit", project_id=project_id).data
        new_toolkit_ver = ToolkitVersion(project_id=project_id, version=new_version, data=current_toolkit)
        new_toolkit_ver.save()
        data = {
            "coverage": {
                "last_version": new_cov_ver.version,
                "last_version_date": new_cov_ver.modified
            },
            "toolkit": {
                "last_version": new_toolkit_ver.version,
                "last_version_date": new_toolkit_ver.modified
            }
        }
        return Response(data, status=status.HTTP_201_CREATED)

    def toolkit_versions(self, request, project_id):
        """
        Retrieves all toolkit versions for the given project_id.
        """
        project = get_object_or_400(Project, "No such project.", id=project_id)
        self.check_object_permissions(request, project)

        toolkit_versions = ToolkitVersion.objects.filter(project_id=project_id) \
            .order_by("version").values("version", "data", "modified")
        return Response(toolkit_versions)

    def coverage_versions(self, request, project_id):
        """
        Retrieves all coverage versions for the given project_id.
        """
        coverage_versions = CoverageVersion.objects.filter(project_id=project_id) \
            .order_by("version").values("version", "data", "modified")
        return Response(coverage_versions)


class MapProjectCountryViewSet(ListModelMixin, GenericViewSet):
    queryset = Project.objects.published_only()
    serializer_class = MapProjectCountrySerializer


class ProjectApprovalViewSet(TokenAuthMixin, UpdateModelMixin, GenericViewSet):
    permission_classes = (IsAuthenticated, InCountryAdminForApproval)
    serializer_class = ProjectApprovalSerializer
    queryset = ProjectApproval.objects.all() \
        .select_related('project', 'project__search', 'project__search__country').exclude(project__public_id='')

    def list(self, request, country_id):
        queryset = self.filter_queryset(self.get_queryset().filter(project__search__country=country_id))
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)


class ProjectImportV2ViewSet(TokenAuthMixin, CreateModelMixin, UpdateModelMixin, RetrieveModelMixin, ListModelMixin,
                             GenericViewSet):
    serializer_class = ProjectImportV2Serializer
    queryset = ProjectImportV2.objects.all()

    # TODO: NEEDS COVER
    def get_queryset(self):  # pragma: no cover
        return ProjectImportV2.objects.filter(user=self.request.user)


class ImportRowViewSet(TokenAuthMixin, UpdateModelMixin, DestroyModelMixin, GenericViewSet):
    serializer_class = ImportRowSerializer
    queryset = ImportRow.objects.all()

    # TODO: NEEDS COVER
    def get_queryset(self):  # pragma: no cover
        return ImportRow.objects.filter(parent__user=self.request.user)


class TechnologyPlatformRequestViewSet(CreateModelMixin, GenericViewSet):
    queryset = TechnologyPlatform.objects.all()
    serializer_class = TechnologyPlatformCreateSerializer
    permission_classes = (IsAuthenticated,)

    def perform_create(self, serializer: BaseSerializer) -> None:
        # state should be 'pending' if the API performs the creation
        serializer.validated_data['state'] = TechnologyPlatform.PENDING
        # added_by should be the request's user's profile
        serializer.validated_data['added_by'] = self.request.user.userprofile
        super().perform_create(serializer)
        notify_superusers_about_new_pending_software.apply_async((serializer.instance.id,))
