import copy
import functools
import csv

from django.db import transaction
from django.http import HttpResponse
from rest_framework import status
from rest_framework.mixins import RetrieveModelMixin
from rest_framework.validators import UniqueValidator
from rest_framework.viewsets import ViewSet, GenericViewSet
from rest_framework.response import Response
from core.views import TokenAuthMixin, TeamTokenAuthMixin, get_object_or_400
from user.models import Organisation
from toolkit.models import Toolkit, ToolkitVersion
from toolkit.toolkit_data import toolkit_default
from country.models import Country, CountryField

from .serializers import ProjectSerializer, ProjectGroupListSerializer, \
    ProjectGroupUpdateSerializer, ProjectDraftSerializer
from .models import Project, CoverageVersion, InteroperabilityLink, TechnologyPlatform, DigitalStrategy, \
    ProjectDraft
from .project_data import project_structure


class ProjectPublicViewSet(ViewSet):

    @staticmethod
    def by_district(request, country_id):
        """
        Retrieves list of projects by district
        """

        # TODO: this is very very suboptimal, should switch to mongodb aggregate framework

        projects = Project.objects.filter(data__country=int(country_id))

        # get district names
        district_names = set()

        def district_name_finder(projects):
            for project in projects:
                for district in project.data.get('coverage'):
                    district_names.add(district.get('district'))

        district_name_finder(projects)

        # build project list by districts
        result_dict = {name: [] for name in district_names}

        def filter_project_by_district_name(districts, projects):
            for district_name in districts:
                for project in projects:
                    for district in project.data.get('coverage'):
                        if district.get('district') == district_name:
                            result_dict[district_name].append({
                                "id": project.id,
                                "name": project.name,
                                "organisation": Organisation.get_name_by_id(project.data.get('organisation'))
                            })

        filter_project_by_district_name(district_names, projects)

        return Response(result_dict)

    @staticmethod
    def list_all(request, *args, **kwargs):
        """
        Retrieves list of projects (optionally by country)
        """
        projects = Project.objects.all()  # lazy QuerySet

        if kwargs.get("country_id"):
            projects = projects.filter(data__country=int(kwargs.get("country_id")))

        result_list = functools.reduce(lambda acc, p: acc + [{
            "id": p.id,
            "uuid": p.public_id,
            "name": p.name,
            "organisation": p.data.get('organisation'),
            "organisation_name": Organisation.get_name_by_id(p.data.get('organisation')),
            "donors": p.data.get('donors'),
            "country": p.data.get('country'),
            "country_name": Country.get_name_by_id(p.data.get('country')),
            "contact_name": p.data.get('contact_name'),
            "contact_email": p.data.get('contact_email'),
            "implementation_overview": p.data.get('implementation_overview'),
            "implementing_partners": p.data.get('implementing_partners'),
            "implementation_dates": p.data.get('implementation_dates'),
            "health_focus_areas": p.data.get('health_focus_areas'),
            "hsc_challenges": p.data.get('hsc_challenges'),
            "his_bucket": p.data.get('his_bucket'),
            "geographic_scope": p.data.get('geographic_scope'),
            "platforms": p.data.get('platforms'),
        }], projects, [])

        return Response(result_list)

    @staticmethod
    def project_structure(request):
        project_structure['interoperability_links'] = [{'pre': x.pre, 'name': x.name} for x in InteroperabilityLink.objects.all()]
        project_structure['technology_platforms'] = [x.name for x in TechnologyPlatform.objects.all()]
        strategies = []

        system = {'name': 'System', 'subGroups': []}
        system_parents = DigitalStrategy.objects.filter(group='System', parent=None)
        for parent in system_parents.all():
            sub = {'name': parent.name, 'strategies': [x.name for x in parent.strategies.all()]}
            system['subGroups'].append(sub)
        strategies.append(system)

        client = {'name': 'Client', 'subGroups': []}
        client_parents = DigitalStrategy.objects.filter(group='Client', parent=None)
        for parent in client_parents.all():
            sub = {'name': parent.name, 'strategies': [x.name for x in parent.strategies.all()]}
            system['subGroups'].append(sub)
        strategies.append(client)

        provider = {'name': 'Provider', 'subGroups': []}
        provider_parents = DigitalStrategy.objects.filter(group='Provider', parent=None)
        for parent in provider_parents.all():
            sub = {'name': parent.name, 'strategies': [x.name for x in parent.strategies.all()]}
            system['subGroups'].append(sub)
        strategies.append(provider)

        project_structure['strategies'] = strategies
        return Response(project_structure)

    @staticmethod
    def project_structure_export(request):
        project_structure_export = {}
        project_structure_export['interoperability_links'] = [{'id': x.id, 'name': x.name} for x in InteroperabilityLink.objects.all()]
        project_structure_export['technology_platforms'] = [{'id': x.id, 'name': x.name} for x in TechnologyPlatform.objects.all()]
        project_structure_export['digital_strategies'] = [{'id': x.id, 'name': x.name} for x in DigitalStrategy.objects.all()]

        return Response(project_structure_export)


def _serialize_project(project, data):
    schema = CountryField.objects.get_schema(project.country.id)
    answers = CountryField.objects.get_answers(country_id=project.country.id, project_id=project.id)
    country_fields = []

    for field in schema:
        found = answers.filter(question=field.question, type=field.type).first()
        if found:
            country_fields.append(found)
    org_name = project.get_organisation().name if project.get_organisation() else ''
    approved = project.approval.approved if hasattr(project, 'approval') else None
    data.update(id=project.id, name=project.name, organisation_name=org_name,
                public_id=project.public_id, country_name=project.country.name, approved=approved,
                fields=[field.to_representation() for field in country_fields])
    return data


class ProjectListViewSet(TokenAuthMixin, ViewSet):

    def list(self, request, *args, **kwargs):
        """
        Retrieves list of projects user's projects.
        """
        data = []
        projects = Project.projects.member_of(request.user)
        project_drafts = ProjectDraft.projects.member_of(request.user).filter(project__isnull=True)

        for project in projects:
            published = _serialize_project(project, project.data)
            draft = _serialize_project(project.project_draft, project.project_draft.data) if hasattr(project, 'project_draft') else None
            data.append({'published': published, 'draft': draft})

        for project_draft in project_drafts:
            draft = _serialize_project(project_draft, project_draft.data)
            data.append({'published': None, 'draft': draft})

        return Response(data)


class ProjectBaseViewSet(TeamTokenAuthMixin, ViewSet):

    def get_permissions(self):
        if self.action == "retrieve":
            return []  # Retrieve needs a bit more complex filtering based on user permission
        else:
            return super(ProjectBaseViewSet, self).get_permissions()

    def _get_permission_based_data(self, project):
        is_member = False
        if not self.request.user.is_authenticated():  # ANON
            data = project.get_anon_data()
        else:
            is_member = project.is_member(self.request.user)
            is_admin = project.is_admin(self.request.user)
            if is_member or is_admin:  # MEMBER or Country Admin
                data = project.get_member_data()
            else:  # LOGGED IN
                data = project.get_non_member_data()

        if is_member:
            last_version = CoverageVersion.objects.filter(project_id=project.id).order_by("-version").first()
            if last_version:
                data.update(last_version=last_version.version)
                data.update(last_version_date=last_version.modified)

        return data

    def _get_project_data(self, project, project_draft):
        project_data = None
        project_draft_data = None
        # Published project
        if project:
            project_data_permission = self._get_permission_based_data(project)
            project_data = _serialize_project(project, project_data_permission)
        # Draft project
        if project_draft:
            project_draft_data = _serialize_project(project_draft, project_draft.get_member_data())
        return Response({'draft': project_draft_data, 'published': project_data})

    def _create_project(self, klass, data_serializer, **kwargs):
        project_data = copy.copy(data_serializer.validated_data)
        project_data.pop('name', None)
        project = klass.projects.create(name=data_serializer.validated_data["name"], data=project_data, **kwargs)
        project.team.add(self.request.user.userprofile)
        data = dict(data_serializer.validated_data)
        country_name = project.country.name if project.country else None
        org_name = project.get_organisation().name if project.get_organisation() else ''
        data.update(dict(id=project.id, public_id=project.public_id, country_name=country_name,
                         organisation_name=org_name))
        return project, data

    def _update_project(self, project, data_serializer):
        data_serializer.fields.get('name').validators = \
            [v for v in data_serializer.fields.get('name').validators if not isinstance(v, UniqueValidator)]
        data_serializer.fields.get('name').validators\
            .append(UniqueValidator(queryset=project.__class__.objects.all().exclude(id=project.id)))
        self.check_object_permissions(self.request, project)
        data_serializer.is_valid(raise_exception=True)

        project_data = copy.copy(data_serializer.validated_data)
        project.name = project_data["name"]
        project_data.pop('name', None)
        project.data = project_data
        project.save()
        country_name = project.country.name if project.country else None
        org_name = project.get_organisation().name if project.get_organisation() else ''
        data_serializer.validated_data.update(dict(id=project.id, public_id=project.public_id,
                                                   country_name=country_name, organisation_name=org_name))
        return data_serializer.validated_data


class ProjectCRUDViewSet(ProjectBaseViewSet):

    def create(self, request, *args, **kwargs):
        """
        Creates a project.
        """
        data_serializer = ProjectSerializer(data=request.data)
        data_serializer.is_valid(raise_exception=True)
        project, data = self._create_project(Project, data_serializer)
        # Add default Toolkit structure for the new project.
        Toolkit.objects.create(project_id=project.id, data=toolkit_default)
        # Remove project draft
        ProjectDraft.objects.filter(id=data_serializer.validated_data.get('project_draft', None)).delete()
        return Response(data, status=status.HTTP_201_CREATED)

    def retrieve(self, request, *args, **kwargs):
        """
        Retrieves a project.
        """
        project = get_object_or_400(Project, "No such project", id=kwargs.get("pk"))
        project_draft = project.project_draft if hasattr(project, 'project_draft') else None
        return self._get_project_data(project, project_draft)

    @transaction.atomic
    def update(self, request, *args, **kwargs):
        """
        Updates a project.
        """
        data_serializer = ProjectSerializer(data=request.data)
        project = get_object_or_400(Project, select_for_update=True, error_message="No such project", id=kwargs["pk"])
        data = self._update_project(project, data_serializer)
        return Response(data, status=status.HTTP_200_OK)


class ProjectDraftCRUDViewSet(ProjectBaseViewSet):

    def create(self, request, *args, **kwargs):
        """
        Creates a draft project.
        """
        data_serializer = ProjectDraftSerializer(data=request.data)
        data_serializer.is_valid(raise_exception=True)
        _, data = self._create_project(ProjectDraft, data_serializer, project_id=data_serializer.validated_data["project"])
        return Response(data, status=status.HTTP_201_CREATED)

    def retrieve(self, request, *args, **kwargs):
        """
        Retrieves a draft project.
        """
        project_draft = get_object_or_400(ProjectDraft, "No such project", id=kwargs.get("pk"))
        project = project_draft.project if hasattr(project_draft, 'project') else None
        return self._get_project_data(project, project_draft)

    @transaction.atomic
    def update(self, request, *args, **kwargs):
        """
        Updates a draft project.
        """
        data_serializer = ProjectDraftSerializer(data=request.data)
        project = get_object_or_400(ProjectDraft, select_for_update=True, error_message="No such project", id=kwargs["pk"])
        data = self._update_project(project, data_serializer)
        return Response(data, status=status.HTTP_200_OK)


class ProjectGroupViewSet(TeamTokenAuthMixin, RetrieveModelMixin, GenericViewSet):
    queryset = Project.objects.all()
    serializer_class = ProjectGroupListSerializer

    @transaction.atomic
    def update(self, request, *args, **kwargs):
        instance = get_object_or_400(Project, select_for_update=True, error_message="No such project", id=kwargs["pk"])
        self.check_object_permissions(self.request, instance)
        serializer = ProjectGroupUpdateSerializer(instance, data=request.data)
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

        last_cov_ver = CoverageVersion.objects.filter(project_id=project_id).order_by("-version").first()
        if not last_cov_ver:
            # No versions yet.
            new_version = 1
        else:
            new_version = last_cov_ver.version + 1

        current_cov = project.data["coverage"]
        current_cov += [project.data.get('national_level_deployment', {})]

        new_cov_ver = CoverageVersion(
                            project_id=project_id,
                            version=new_version,
                            data=current_cov)
        new_cov_ver.save()

        # Make a new version from current toolkit.
        last_toolkit_ver = ToolkitVersion.objects.filter(project_id=project_id).order_by("-version").first()
        if not last_toolkit_ver:
            # No versions yet.
            new_version = 1
        else:
            new_version = last_toolkit_ver.version + 1
        current_toolkit = get_object_or_400(Toolkit, "No such Toolkit", project_id=project_id).data
        new_toolkit_ver = ToolkitVersion(
                            project_id=project_id,
                            version=new_version,
                            data=current_toolkit)
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


class CSVExportViewSet(TeamTokenAuthMixin, ViewSet):

    def create(self, request):
        """
        Creates CSV file out of a list of project IDs
        """
        if not request.data or not isinstance(request.data, list):
            return HttpResponse(status=status.HTTP_404_NOT_FOUND)

        projects = Project.objects.filter(id__in=request.data)

        results = [[
            p.name,
            p.public_id,
            Country.get_name_by_id(p.data.get('country')),
            p.data.get('implementation_dates'),
            p.data.get('start_date'),
            p.data.get('end_date'),
            Organisation.get_name_by_id(p.data.get('organisation')),
            ", ".join(p.data.get('donors')),
            ", ".join(p.data.get('implementing_partners', [])),
            " - ".join((p.data.get('contact_name'), p.data.get('contact_email'))),
            p.data.get('implementation_overview'),
            p.data.get('geographic_scope'),
            ", ".join(p.data.get('health_focus_areas', [])),
            ", ".join([s['name'] for s in p.data.get('platforms', [])]),
            ", ".join(p.data.get('hsc_challenges', [])),
            ", ".join(p.data.get('his_bucket', [])),
            "Yes" if p.data.get('government_approved') else "No",
            p.data.get('government_investor'),
            ", ".join(p.data.get('licenses', [])),
            p.data.get('repository'),
            p.data.get('mobile_application'),
            p.data.get('wiki'),
            ", ".join(p.data.get('interoperability_standards', [])),

        ] for p in projects]

        response = HttpResponse(content_type='text/csv')
        response['Content-Disposition'] = 'attachment; filename="csv.csv"'

        writer = csv.writer(response)

        # HEADER
        writer.writerow(['Name', 'UUID', 'Country', 'Implementation Date', 'Start Date', 'End Date', 'Organisation Name',
                         'Donors', "Implementing Partners", "Point of Contact",
                         "Overview of digital health implementation", "Geographical scope",
                         "Health Focus Areas", "Software", 'Health System Challenges',
                         'Health Information System Support', 'Government Approved', 'Government Investor',
                         'Licenses', 'Repository', 'Mobile Application', 'Wiki', 'Interoperability Standards'])

        # PROJECTS
        [writer.writerow([field for field in project]) for project in results]

        return response
