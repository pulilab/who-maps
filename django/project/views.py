import functools
import json
import operator

from django.db import transaction
from django.http import HttpResponse, Http404
from django.forms.models import model_to_dict
from django.db.models import Q
from rest_framework import status
from rest_framework.mixins import RetrieveModelMixin
from rest_framework.viewsets import ViewSet, GenericViewSet
from rest_framework.response import Response
from rest_framework.authentication import TokenAuthentication
from rest_framework.decorators import api_view, authentication_classes
from rest_framework.decorators import permission_classes
from rest_framework.permissions import IsAuthenticated

import hss.hss_data as hss_data
from core.views import TokenAuthMixin, TeamTokenAuthMixin, get_object_or_400
from user.models import UserProfile, Organisation
from hss.models import HSS
from toolkit.models import Toolkit, ToolkitVersion
from toolkit.toolkit_data import toolkit_default
from country.models import Country

from .permissions import InTeamOrReadOnly
from .serializers import ProjectSerializer, ProjectModelSerializer, ProjectGroupListSerializer, \
    ProjectGroupUpdateSerializer, ProjectFilterSerializer
from .models import Project, File, CoverageVersion, PartnerLogo
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
            "name": p.name,
            "organisation": p.data.get('organisation'),
            "organisation_name": Organisation.get_name_by_id(p.data.get('organisation')),
            "donors": p.data.get('donors'),
            "country": p.data.get('country'),
            "contact_name": p.data.get('contact_name'),
            "contact_email": p.data.get('contact_email'),
            "implementation_overview": p.data.get('implementation_overview'),
            "implementing_partners": p.data.get('implementing_partners'),
            "implementation_dates": p.data.get('implementation_dates'),
            "geographic_scope": p.data.get('geographic_coverage'),
            "intervention_areas": p.data.get('intervention_areas'),
            "technology_platforms": p.data.get('technology_platforms'),
            "interventions": p.hss_set.first().get_interventions_list(),
            "continuum": p.hss_set.first().get_continuum_list(),
            "constraints": p.hss_set.first().get_constraints_list(),
            "applications": p.hss_set.first().get_applications_list(),
        }], projects, [])

        return Response(result_list)

    @staticmethod
    def project_structure(request):
        countries = [dict(id=x.id, name=x.name) for x in Country.objects.all()]
        project_structure.update(countries=countries)
        return Response(project_structure)


class ProjectListViewSet(TokenAuthMixin, ViewSet):

    def list(self, request, *args, **kwargs):
        """
        Retrieves list of projects user's projects.
        """
        return Response(Project.projects.member_of(request.user).values("id", "name"))


class ProjectCRUDViewSet(TeamTokenAuthMixin, ViewSet):

    def get_permissions(self):
        if self.action == "retrieve":
            return []  # Retrieve needs a bit more complex filtering based on user permission
        else:
            return super(ProjectCRUDViewSet, self).get_permissions()

    def create(self, request, *args, **kwargs):
        """
        Creates a project.
        """
        data_serializer = ProjectSerializer(data=request.data)
        model_serializer = ProjectModelSerializer(data={"name": data_serializer.initial_data["name"]})
        model_valid = model_serializer.is_valid()
        data_valid = data_serializer.is_valid()
        if model_valid and data_valid:
            project = Project.objects.create(name=data_serializer.data["name"], data=data_serializer.data)
            project.team.add(request.user.userprofile)
            # Add default HSS structure for the new project.
            HSS.objects.create(project_id=project.id, data=hss_data.hss_default)
            # Add default Toolkit structure for the new project.
            Toolkit.objects.create(project_id=project.id, data=toolkit_default)
            data = dict(data_serializer.data)
            data.update(id=project.id)
            return Response(data, status=status.HTTP_201_CREATED)
        else:
            errors = {
                "model": model_serializer.errors,
                "json": data_serializer.errors
            }
            return Response(errors, status=status.HTTP_400_BAD_REQUEST)

    def retrieve(self, request, *args, **kwargs):
        """
        Retrieves a project.
        """
        is_member = False
        project = get_object_or_400(Project, "No such project", id=kwargs.get("pk"))

        if not request.user.is_authenticated():  # ANON
            data = project.get_anon_data()
        else:
            is_member = project.is_member(request.user)
            if is_member:  # MEMBER
                data = project.get_member_data()
            else:  # LOGGED IN
                data = project.get_non_member_data()

        if is_member:
            last_version = CoverageVersion.objects.filter(project_id=project.id).order_by("-version").first()
            if last_version:
                data.update(last_version=last_version.version)
                data.update(last_version_date=last_version.modified)

        data.update(id=project.id)
        data.update(organisation_name=project.get_organisation().name)
        data.update(public_id=project.public_id)
        return Response(project.data)

    @transaction.atomic
    def update(self, request, *args, **kwargs):
        """
        Updates a project.
        """
        data_serializer = ProjectSerializer(data=request.data)
        project = get_object_or_400(Project, select_for_update=True, error_message="No such project", id=kwargs["pk"])
        self.check_object_permissions(request, project)
        model_serializer = ProjectModelSerializer(instance=project, data={"name": data_serializer.initial_data["name"]})
        model_valid = model_serializer.is_valid()
        data_valid = data_serializer.is_valid()
        if model_valid and data_valid:
            project.name = data_serializer.validated_data["name"]
            project.data = data_serializer.validated_data
            project.save()
            return Response(data_serializer.data, status=status.HTTP_200_OK)
        else:
            errors = {
                "model": model_serializer.errors,
                "json": data_serializer.errors
            }
            return Response(errors, status=status.HTTP_400_BAD_REQUEST)


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
        current_cov += project.data.get('national_level_deployment', [])

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
        return Response(status=status.HTTP_201_CREATED)

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


class PartnerLogoListViewSet(ViewSet):

    def list(self, request, project_id):
        """
        Retrieves list of partnerlogo ids for a given project.
        """
        project = get_object_or_400(Project, "No such project.", id=project_id)
        return Response([{"data": p.data.url, "id": p.id} for p in PartnerLogo.objects.filter(project_id=project.id)])


class PartnerLogoViewSet(TeamTokenAuthMixin, ViewSet):

    def create(self, request, project_id):
        """
        Creates partnerlogos from the uploaded files.
        """
        project = get_object_or_400(Project, "No such project.", id=project_id)
        self.check_object_permissions(self.request, project)

        logos = []
        # Get and store binary files for partnerlogos.
        for key, value in request.FILES.items():
            logo = PartnerLogo.objects.create(project_id=project.id, type=value.content_type, data=value)
            logos.append({"id": logo.id, "data": logo.data.url})
        return Response(logos)

    def destroy(self, request, pk=None):
        partner_logo = get_object_or_400(PartnerLogo, "No such logo.", id=pk)
        self.check_object_permissions(self.request, partner_logo.project)
        partner_logo.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class FileListViewSet(ViewSet):

    def list(self, request, project_id):
        files = File.objects.filter(project_id=project_id).values("id", "filename", "type")
        return Response(files)


class FilePostViewSet(TeamTokenAuthMixin, ViewSet):

    def create(self, request, project_id):
        project = get_object_or_400(Project, "No such project.", id=project_id)
        self.check_object_permissions(self.request, project)

        # Get and store binary files for publications and reports.
        files = []
        file_type = None
        for key, value in request.FILES.items():
            if "publication" in key:
                file_type = "publication"
            elif "report" in key:
                file_type = "report"
            instance = File.objects.create(
                                        project_id=project.id,
                                        type=file_type,
                                        filename=value.name,
                                        data=value.read())
            files.append(model_to_dict(instance, fields=["id", "type", "filename"]))
        return Response(files)


class FileDetailViewSet(ViewSet):

    def retrieve(self, request, pk):
        file = get_object_or_400(File, "No such file.", id=pk)
        return HttpResponse(content=file.data, content_type="application/pdf")


class FileDeleteViewSet(TeamTokenAuthMixin, ViewSet):

    def destroy(self, request, pk):
        file = get_object_or_400(File, "No such file.", id=pk)
        self.check_object_permissions(self.request, file.project)
        file.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
