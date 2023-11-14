import copy

from django.db import transaction
from django.shortcuts import get_object_or_404
from django_filters.rest_framework import DjangoFilterBackend
from drf_yasg.utils import swagger_auto_schema
from taggit.models import Tag

from rest_framework import status, filters
from rest_framework.exceptions import ValidationError, NotAuthenticated, PermissionDenied
from rest_framework.mixins import RetrieveModelMixin, ListModelMixin, UpdateModelMixin, CreateModelMixin, \
    DestroyModelMixin
from rest_framework.serializers import BaseSerializer
from rest_framework.validators import UniqueValidator
from rest_framework.viewsets import ViewSet, GenericViewSet
from rest_framework.response import Response
from rest_framework_simplejwt.authentication import JWTAuthentication

from core.views import TokenAuthMixin, TeamTokenAuthMixin, TeamCollectionTokenAuthMixin, CollectionTokenAuthMixin, \
    get_object_or_400, CollectionAuthenticatedMixin
from country.permissions import CountryAdminOnly
from project.cache import cache_structure
from project.models import HSCGroup, ProjectApproval, ProjectImportV2, ImportRow, Stage, ProjectVersion, OSILicence
from project.permissions import InCountryAdminForApproval, IsOwnerShipModifiable, \
    CountryAdminTeamCollectionOwnerOrReadOnly
from search.views import ResultsSetPagination
from toolkit.models import Toolkit, ToolkitVersion
from country.models import Country, Donor, ReferenceDocumentType
from .tasks import notify_superusers_about_new_pending_software
from user.models import Organisation

from .serializers import ProjectDraftSerializer, ProjectGroupSerializer, ProjectPublishedSerializer, \
    MapProjectCountrySerializer, CountryCustomAnswerSerializer, DonorCustomAnswerSerializer, \
    ProjectApprovalSerializer, ProjectImportV2Serializer, ImportRowSerializer, TechnologyPlatformCreateSerializer, \
    TerminologySerializer, CollectionInputSerializer, ExternalProjectPublishSerializer, \
    ExternalProjectDraftSerializer, CollectionOutputSerializer, CollectionInputSwaggerSerializer, \
    CollectionListSerializer, ProjectImportV2ListSerializer, ExternalProjectResponseSerializer

from .models import Project, CoverageVersion, InteroperabilityLink, TechnologyPlatform, DigitalStrategy, \
    HealthCategory, InteroperabilityStandard, HISBucket, HSCChallenge, Collection

from django.conf import settings
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from user.authentication import BearerTokenAuthentication

from who_maps.throttle import ExternalAPIUserRateThrottle, ExternalAPIAnonRateThrottle


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
                challenges=[{'id': c['id'], 'challenge': c['name'], 'description': c['description']}
                            for c in HSCChallenge.objects.filter(group__id=group['id']).values(
                        'id', 'name', 'description')]
            ))

        interoperability_standards = []
        for cat_id, cat_name in InteroperabilityStandard.Categories.choices:
            interoperability_standards.append(dict(
                name=cat_name,
                standards=InteroperabilityStandard.objects.filter(category=cat_id).values('id', 'name', 'description')
            ))

        return dict(
            interoperability_links=InteroperabilityLink.objects.values('id', 'pre', 'name'),
            technology_platforms=TechnologyPlatform.objects.exclude(state=TechnologyPlatform.DECLINED).values(
                'id', 'name', 'state'),
            osi_licenses=OSILicence.objects.values('id', 'name'),
            his_bucket=HISBucket.objects.values('id', 'name'),
            interoperability_standards=interoperability_standards,
            health_focus_areas=health_focus_areas,
            hsc_challenges=hsc_challenges,
            strategies=strategies,
            stages=Stage.objects.values('id', 'name', 'tooltip', 'order'),
            tags=Tag.objects.values('id', 'name'),  # TODO: invalidate on new Tag
            reference_document_types=ReferenceDocumentType.objects.values('id', 'name')
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


class ProjectListViewSet(TeamTokenAuthMixin, ViewSet):
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


class ProjectAdminListViewSet(TokenAuthMixin, GenericViewSet):
    permission_classes = (IsAuthenticated, CountryAdminOnly)
    pagination_class = ResultsSetPagination
    filter_backends = [filters.SearchFilter, DjangoFilterBackend]
    search_fields = ['name', 'team__name', 'team__user__email']
    queryset = Project.objects.all()

    def get_queryset(self):
        return super().get_queryset().by_country(self.request.user.userprofile.country)

    def list(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset())

        data = []
        page = self.paginate_queryset(queryset)
        for project in page:
            published = project.to_representation()
            draft = project.to_representation(draft_mode=True)
            data.append(project.to_response_dict(published=published, draft=draft))
        return self.get_paginated_response(data)


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
            if project.is_published:
                data = project.get_anon_data()
            else:
                raise NotAuthenticated()
        else:  # LOGGED IN
            is_member = project.is_member(self.request.user)
            is_country_user_or_admin = project.is_country_user_or_admin(self.request.user)
            if is_member or is_country_user_or_admin or self.request.user.is_superuser:
                data = project.get_member_data()
                draft = project.get_member_draft()
            elif project.is_published:
                data = project.get_non_member_data()
            else:
                raise PermissionDenied()

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


class ProjectPublishViewSet(TeamTokenAuthMixin, ViewSet):
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

        # if Organisation is coming as a string
        if request.data['project'].get('organisation'):
            project_org = request.data['project'].get('organisation')
            org_id = Organisation.get_or_create_insensitive(project_org)
            request.data['project']['organisation'] = str(org_id)

        data_serializer = ProjectPublishedSerializer(project, data=request.data['project'])

        data_serializer.fields.get('name').validators = \
            [v for v in data_serializer.fields.get('name').validators if not isinstance(v, UniqueValidator)]
        data_serializer.fields.get('name').validators \
            .append(UniqueValidator(queryset=project.__class__.objects.all().exclude(id=project.id), lookup='iexact'))

        self.check_object_permissions(request, project)
        data_serializer.is_valid()
        if data_serializer.errors:
            errors['project'] = data_serializer.errors

        if country.country_questions.exists() and 'country_custom_answers' in request.data:
            country_answers = CountryCustomAnswerSerializer(data=request.data['country_custom_answers'], many=True,
                                                            context=dict(
                                                                question_queryset=country.country_questions,
                                                                is_draft=False))

            if not country_answers.is_valid():
                errors['country_custom_answers'] = country_answers.errors

        for donor_id in data_serializer.validated_data.get('donors', []):
            donor = Donor.objects.get(id=donor_id)
            if donor and donor.donor_questions.exists() and 'donor_custom_answers' in request.data and \
                    str(donor_id) in request.data['donor_custom_answers']:
                """
                Donor answers are no longer mandatory but if they exist, they need to be correct"""
                donor_answers = DonorCustomAnswerSerializer(data=request.data['donor_custom_answers'][str(donor_id)],
                                                            many=True,
                                                            context=dict(question_queryset=donor.donor_questions,
                                                                         is_draft=False))
                if donor_answers.is_valid():
                    all_donor_answers.append((donor_id, donor_answers))
                else:
                    errors.setdefault('donor_custom_answers', {})
                    errors['donor_custom_answers'].setdefault(donor_id, {})
                    errors['donor_custom_answers'][donor_id] = donor_answers.errors

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

            if hasattr(request, 'client_code'):
                instance.metadata = dict(from_external=request.client_code)
            instance.save()
            project.refresh_from_db()  # need to do this due to JSONfield

            if project.name != original_data['name'] or project.research != original_data['research'] or \
                    project.data != original_data['data']:
                ProjectVersion.objects.create(project=project, user=request.user.userprofile, name=project.name,
                                              data=project.data, research=project.research, published=True)

        project.reset_approval()

        draft = instance.to_representation(draft_mode=True)
        published = instance.to_representation()
        return Response(instance.to_response_dict(published=published, draft=draft))


class ProjectUnPublishViewSet(TeamTokenAuthMixin, ViewSet):
    @transaction.atomic
    def update(self, request, project_id):
        project = get_object_or_400(Project, select_for_update=True, error_message="No such project", id=project_id)
        project.unpublish()
        data = project.to_representation(draft_mode=True)

        ProjectVersion.objects.create(project=project, user=request.user.userprofile, name=project.name,
                                      data=project.draft, research=project.research, published=False)
        return Response(project.to_response_dict(published={}, draft=data), status=status.HTTP_200_OK)


class ProjectArchiveViewSet(TeamTokenAuthMixin, ViewSet):
    @transaction.atomic
    def update(self, request, project_id):
        project = get_object_or_400(Project, select_for_update=True, error_message="No such project", id=project_id)
        project.archive(profile=request.user.userprofile)
        return Response(status=status.HTTP_200_OK)


class ProjectDraftViewSet(TeamCollectionTokenAuthMixin, ViewSet):
    def create(self, request, country_id):
        """
        Creates a Draft project.
        """
        instance = country_answers = None
        all_donor_answers = []
        errors = {}

        if 'project' not in request.data:
            raise ValidationError({'project': 'Project data is missing'})

        country = get_object_or_400(Country, error_message="No such country", id=country_id)

        # if Organisation is coming as a string
        if request.data['project'].get('organisation'):
            project_org = request.data['project'].get('organisation')
            org_id = Organisation.get_or_create_insensitive(project_org)
            request.data['project']['organisation'] = str(org_id)

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
            if donor and donor.donor_questions.exists() and 'donor_custom_answers' in request.data and \
                    str(donor_id) in request.data['donor_custom_answers']:
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

            if hasattr(request, 'client_code'):
                instance.metadata = dict(from_external=request.client_code)
            instance.save()
            # COLLECTIONS - draft project can have an empty team if they are part of a collection
            if 'import_row' in request.data['project']:
                try:
                    collection = Collection.objects.get(project_imports__rows=request.data['project']['import_row'])
                    if collection.add_me_as_editor:  # pragma: no cover
                        instance.team.add(request.user.userprofile)
                except Collection.DoesNotExist:  # pragma: no cover
                    pass
                instance.import_rows.set(ImportRow.objects.filter(id=request.data['project']['import_row']))
            else:
                instance.team.add(request.user.userprofile)

        data = instance.to_representation(draft_mode=True)

        instance.refresh_from_db()

        ProjectVersion.objects.create(project=instance, user=request.user.userprofile, name=instance.name,
                                      data=instance.draft, research=instance.research, published=False)

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

        # if Organisation is coming as a string
        if request.data['project'].get('organisation'):
            project_org = request.data['project'].get('organisation')
            org_id = Organisation.get_or_create_insensitive(project_org)
            request.data['project']['organisation'] = str(org_id)

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
            original_data = {
                'name': project.name,
                'data': copy.deepcopy(project.draft),
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

            # TODO: enable this when we have external API updates
            # if hasattr(request, 'client_code'):
            #     instance.metadata = dict(from_external=request.client_code)
            instance.save()

        draft = instance.to_representation(draft_mode=True)
        published = instance.to_representation()

        instance.refresh_from_db()

        if instance.name != original_data['name'] or instance.research != original_data['research'] or \
                instance.draft != original_data['data']:
            ProjectVersion.objects.create(project=instance, user=request.user.userprofile, name=instance.name,
                                          data=instance.draft, research=instance.research, published=False)

        return Response(instance.to_response_dict(published=published, draft=draft), status=status.HTTP_200_OK)


class ExternalDraftAPI(TeamTokenAuthMixin, ViewSet):
    throttle_classes = [ExternalAPIUserRateThrottle, ExternalAPIAnonRateThrottle]

    @transaction.atomic
    @swagger_auto_schema(
        operation_id="project-draft-external",
        request_body=ExternalProjectDraftSerializer,
        security=[{'Bearer': []}],
        responses={201: ExternalProjectResponseSerializer()}
    )
    def create(self, request, client_code):
        """
        Create *draft* projects from external sources.
        Clients are differentiated by custom endpoints. For most cases, the `/default/` endpoint needs to be used,
        but if the client requires custom handling of some attributes, they can request a custom endpoint via e-mail
        (feature in progress)
        """
        if not settings.EXTERNAL_API_CLIENTS.get(client_code):
            raise ValidationError({'client_code': 'Client code is invalid'})
        else:
            request.client_code = client_code

        return ProjectDraftViewSet().create(request, country_id=request.data.get('project', {}).get('country', 0))


class ExternalPublishAPI(TeamTokenAuthMixin, ViewSet):
    throttle_classes = [ExternalAPIUserRateThrottle, ExternalAPIAnonRateThrottle]

    @transaction.atomic
    @swagger_auto_schema(
        operation_id="project-publish-external",
        request_body=ExternalProjectPublishSerializer,
        security=[{'Bearer': []}],
        responses={201: ExternalProjectResponseSerializer()}
    )
    def create(self, request, client_code):
        """
        Create *Published* projects from external sources.
        Clients are differentiated by custom endpoints. For most cases, the `/default/` endpoint needs to be used,
        but if the client requires custom handling of some attributes, they can request a custom endpoint via e-mail
        (feature in progress)
        """
        if not settings.EXTERNAL_API_CLIENTS.get(client_code):
            raise ValidationError({'client_code': 'Client code is invalid'})
        else:
            request.client_code = client_code

            if client_code == 'xNhlb4':  # DCH only
                if 'project' not in request.data:  # pragma: no cover
                    raise ValidationError({'project': 'Project data is missing'})
                # Donor is required - set to "Other"
                donor, _ = Donor.objects.get_or_create(name='Other', defaults=dict(code="other"))
                request.data['project']['donors'] = [donor.id]

                # Set national_level_deployment to 0, so it can be added later
                request.data['project']['national_level_deployment'] = {"clients": 0, "health_workers": 0,
                                                                        "facilities": 0}

        # To follow procedures, we first save a draft and then publish. This is how it's done on the UI and on the
        # normal API, so we follow these two steps here as well. The original publish API only has an update method.
        draft_response = ProjectDraftViewSet().create(
            request, country_id=request.data.get('project', {}).get('country', 0))

        if draft_response.status_code != status.HTTP_201_CREATED:
            return draft_response
        else:
            publish_response = ProjectPublishViewSet().update(request,
                                                              project_id=draft_response.data['id'],
                                                              country_id=draft_response.data['draft']['country'])

        if publish_response.status_code != status.HTTP_200_OK:
            # As we saved a draft before, we need to roll it back
            transaction.set_rollback(True)
            return publish_response
        else:
            instance = Project.objects.get(id=draft_response.data['id'])

        if client_code == 'xNhlb4':  # DCH only - Add contact_email as team member
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
        published = instance.to_representation()
        return Response(instance.to_response_dict(published=published, draft=draft), status=status.HTTP_201_CREATED)


class ProjectGroupViewSet(TeamCollectionTokenAuthMixin, RetrieveModelMixin, GenericViewSet):
    permission_classes = (IsAuthenticated, CountryAdminTeamCollectionOwnerOrReadOnly)
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


class ProjectImportV2ViewSet(TokenAuthMixin, ListModelMixin, CreateModelMixin, UpdateModelMixin, RetrieveModelMixin,
                             GenericViewSet):
    serializer_class = ProjectImportV2Serializer
    queryset = ProjectImportV2.objects.all()

    # TODO: NEEDS COVER
    def get_queryset(self):  # pragma: no cover
        if getattr(self, "swagger_fake_view", False):
            # queryset just for schema generation metadata
            # as per https://github.com/axnsan12/drf-yasg/issues/333#issuecomment-474883875
            return ProjectImportV2.objects.none()

        return ProjectImportV2.objects.filter(user=self.request.user)

    def get_serializer_class(self):  # pragma: no cover
        if self.action == 'list':
            return ProjectImportV2ListSerializer
        return super().get_serializer_class()


class ImportRowViewSet(TokenAuthMixin, UpdateModelMixin, DestroyModelMixin, GenericViewSet):
    serializer_class = ImportRowSerializer
    queryset = ImportRow.objects.all()

    # TODO: NEEDS COVER
    def get_queryset(self):  # pragma: no cover
        if getattr(self, "swagger_fake_view", False):
            # queryset just for schema generation metadata
            # as per https://github.com/axnsan12/drf-yasg/issues/333#issuecomment-474883875
            return ImportRow.objects.none()
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


class CollectionViewSet(CollectionTokenAuthMixin, CreateModelMixin, RetrieveModelMixin, GenericViewSet):
    lookup_field = 'url'
    queryset = Collection.objects.all()

    def get_serializer_class(self):
        if self.request and self.action in ['update', 'create', 'partial_update'] and \
                self.request.user.is_authenticated:
            return CollectionInputSerializer
        else:
            return CollectionOutputSerializer

    @staticmethod
    def _prepare_data(request):
        data = copy.deepcopy(request.data)
        data['user'] = request.user.pk
        if 'project_import' in data:
            data['project_import']['user'] = request.user.pk
            data['project_import']['country'] = data.get('country', data['project_import'].get('country', None))
            data['project_import']['donor'] = data.get('donor', data['project_import'].get('donor', None))
            data['project_imports'] = [data.pop('project_import')]
        else:
            data['project_imports'] = []
        return data

    @swagger_auto_schema(
        request_body=CollectionInputSwaggerSerializer,
        security=[{'Bearer': []}],
        responses={201: CollectionOutputSerializer, 400: "Bad Request", 403: "Unauthorized"}
    )
    def create(self, request, *args, **kwargs):
        """
        Create a collection object.
        """
        data = request.data
        data = self._prepare_data(request)
        # Modify the data to make it processable by the serializers
        serializer = self.get_serializer(data=data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        output_serializer = CollectionOutputSerializer(instance=serializer.instance)
        return Response(output_serializer.data, status=status.HTTP_201_CREATED, headers=headers)

    def partial_update(self, request, *args, **kwargs):
        instance = self.get_object()
        # Modify the data to make it processable by the serializers
        if 'project_import' in request.data:
            # We do not allow uploading the same xls file
            if instance.project_imports.filter(filename=request.data['project_import']['filename']).count() > 0:
                raise ValidationError(f'Uploading the same file multiple times is not allowed: '
                                      f'"{request.data["project_import"]["filename"]}"')
        data = self._prepare_data(request)

        serializer = self.get_serializer(instance, data=data, partial=True)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)

        if getattr(instance, '_prefetched_objects_cache', None):  # pragma: no cover
            # If 'prefetch_related' has been applied to a queryset, we need to
            # forcibly invalidate the prefetch cache on the instance.
            instance._prefetched_objects_cache = {}

        return Response(serializer.data)

    def perform_update(self, serializer):
        serializer.save()


class CollectionListView(CollectionAuthenticatedMixin, APIView):
    """
    View to list all of an user's Collections.

    * Requires authenticated user
    """
    @swagger_auto_schema(
        security=[{'Token': []}],
        responses={201: CollectionListSerializer(many=True), 403: "Unauthorized"}
    )
    def get(self, request, format=None):
        """
        Return a list of the user's collections.
        """
        collections = Collection.objects.filter(user=request.user)
        serializer = CollectionListSerializer(collections, many=True)
        return Response(serializer.data)


class ProjectImportCheckAvailabilityView(TokenAuthMixin, APIView):
    """
    View to check if name and sheet info is available for the user to import

    _(as a QoL early-warning system)_
    """

    def _check_required(self, request):  # pragma: no cover
        if 'filename' not in request.data:
            raise ValidationError('`filename` is required. Expected: <str>')
        if 'sheet_name' not in request.data:
            raise ValidationError('`sheet_name` is required. Expected: <str>')

    def post(self, request, format=None):
        """
        Returns with the status of availability for the sheet_name, import_name
        """
        self._check_required(request)

        imports = ProjectImportV2.objects.filter(user=request.user)

        result_dict = {
            'available': imports.filter(filename=request.data['filename'],
                                        sheet_name=request.data['sheet_name']).count() == 0
        }

        return Response(result_dict, content_type="application/json")


class ProjectGroupAddmeViewSet(GenericViewSet):
    queryset = Project.objects.all()
    serializer_class = ProjectGroupSerializer
    authentication_classes = (JWTAuthentication, BearerTokenAuthentication)
    permission_classes = (IsAuthenticated, IsOwnerShipModifiable)

    @transaction.atomic
    def update(self, request, *args, **kwargs):
        instance = get_object_or_400(Project, select_for_update=True, error_message="No such project", id=kwargs["pk"])
        self.check_object_permissions(self.request, instance)
        team = list(instance.team.all().values_list('id', flat=True))
        team.append(request.user.userprofile.id)
        data = {'team': team, 'viewers': list(instance.viewers.all().values_list('id', flat=True))}
        serializer = ProjectGroupSerializer(instance, data=data, context=self.get_serializer_context())
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)


class ProjectsInCollectionViewSet(TokenAuthMixin, ViewSet):  # pragma: no cover
    def list(self, request, *args, **kwargs):
        """
        Retrieves list of projects related to a collection
        """
        collection = get_object_or_400(Collection, url=kwargs.get('collection_url'))
        data = {
            'name': collection.name,
            'url': collection.url,
            'projects': []
        }
        project_import_ids = list(collection.project_imports.all().values_list('id', flat=True))
        import_rows = ImportRow.objects.filter(parent__in=project_import_ids)
        for project in Project.objects.filter(import_rows__in=import_rows):
            published = project.to_representation()
            draft = project.to_representation(draft_mode=True)
            project_data = project.to_project_import_table_dict(published_data=published, draft_data=draft)
            data['projects'].append(project_data)
        return Response(data)


class ProjectsInProjectImportViewSet(TokenAuthMixin, ViewSet):  # pragma: no cover

    def list(self, request, *args, **kwargs):
        """
        Retrieves list of projects related to a collection
        """
        data = []
        import_rows = ImportRow.objects.filter(parent__id=kwargs.get('pk'))
        for project in Project.objects.filter(import_rows__in=import_rows):
            published = project.to_representation()
            draft = project.to_representation(draft_mode=True)
            data.append(project.to_project_import_table_dict(published_data=published, draft_data=draft))
        return Response(data)
