import functools
import json

from django.db import transaction
from django.http import HttpResponse, Http404
from django.forms.models import model_to_dict
from rest_framework import status
from rest_framework.viewsets import ViewSet
from rest_framework.response import Response
from rest_framework.authentication import TokenAuthentication
from rest_framework.decorators import api_view, authentication_classes
from rest_framework.decorators import permission_classes
from rest_framework.permissions import IsAuthenticated

from core.views import TokenAuthMixin, get_object_or_400
from user.models import UserProfile
from hss.models import HSS
from hss.hss_data import hss_default
from toolkit.models import Toolkit, ToolkitVersion
from toolkit.toolkit_data import toolkit_default
from country.models import Country
from .serializers import ProjectSerializer, ProjectModelSerializer
from .models import Project, File, CoverageVersion, PartnerLogo
from .project_data import project_structure


@api_view(['GET'])
@authentication_classes((TokenAuthentication,))
@permission_classes((IsAuthenticated,))
def get_project_structure(request):
    """
    View for providing form data for create/edit project.
    """
    countries = [dict(id=x.id, name=x.name) for x in Country.objects.all()]
    project_structure.update(countries=countries)
    return Response(project_structure)


class ProjectViewSet(TokenAuthMixin, ViewSet):

    def by_district(self, request, country_id):
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
                                "organisation": project.data.get('organisation')
                            })

        filter_project_by_district_name(district_names, projects)

        return Response(result_dict)

    def list_all(self, request, *args, **kwargs):
        """
        Retrieves list of projects (optionally by country)
        """
        query_filters = []
        result_list = []
        projects = Project.objects.all()  # lazy QuerySet

        if kwargs.get("country_id"):
            projects = projects.filter(data__country=int(kwargs.get("country_id")))

        user_profile = UserProfile.objects.get_object_or_none(user_id=request.user.id)
        if user_profile:
            projects_own = list(projects.filter(data__organisation=user_profile.organisation))
            projects_exclude_own = list(projects.exclude(data__organisation=user_profile.organisation))

            result_list = functools.reduce(lambda acc, p: acc + [{
                "id": p.id,
                "name": p.name,
                "organisation": p.data.get('organisation'),
                "donors": p.data.get('donors'),
                "country": p.data.get('country'),
                "own": True
            }], projects_own, result_list)

            result_list = functools.reduce(lambda acc, p: acc + [{
                "id": p.id,
                "name": p.name,
                "organisation": p.data.get('organisation'),
                "donors": p.data.get('donors'),
                "country": p.data.get('country'),
                "own": False
            }], projects_exclude_own, result_list)

        else:
            # TODO: this won't actually happen right now because of the TokenAuth Mixin, might be needed in the future
            result_list = functools.reduce(lambda acc, p: acc + [{
                "id": p.id,
                "name": p.name,
                "organisation": p.data.get('organisation'),
                "donors": p.data.get('donors'),
                "country": p.data.get('country'),
                "own": False
            }], projects, result_list)

        return Response(result_list)

    def list(self, request, *args, **kwargs):
        """
        Retrieves list of projects.
        """
        user_profile = UserProfile.objects.get(user_id=request.user.id)
        projects = Project.objects.filter(data__organisation=user_profile.organisation).values("id", "name")
        return Response(projects)

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
            project.save()
            # Add default HSS structure for the new project.
            HSS.objects.create(project_id=project.id, data=hss_default)
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
        project = get_object_or_400(Project, "No such project", id=kwargs["pk"])
        data = project.data
        data.update(id=project.id)
        return Response(project.data)

    @transaction.atomic
    def update(self, request, *args, **kwargs):
        """
        Updates a project.
        """
        data_serializer = ProjectSerializer(data=request.data)
        project = get_object_or_400(Project, select_for_update=True, error_message="No such project", id=kwargs["pk"])
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

@api_view(['GET', 'POST'])
@authentication_classes((TokenAuthentication,))
@permission_classes((IsAuthenticated,))
def file_list(request, project_id):
    """
    Enables to upload/list files for publications and reports.

    Args:
        project_id: id of the project the artifacts belong to.
    """
    if request.method == "POST":
        project = get_object_or_400(Project, "No such project.", id=project_id)
        # Get and store binary files for publications and reports.
        files = []
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
    if request.method == "GET":
        files = File.objects.filter(project_id=project_id).values("id", "filename", "type")
        return Response(files)


@api_view(['GET', 'DELETE'])
@authentication_classes((TokenAuthentication,))
@permission_classes((IsAuthenticated,))
def file_detail(request, pk):
    """
    View for retrieving file.
    """
    if request.method == "GET":
        file = get_object_or_400(File, "No such file.", id=pk)
        return HttpResponse(content=file.data, content_type="application/pdf")
    if request.method == "DELETE":
        file = get_object_or_400(File, "No such file.", id=pk)
        file.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


@api_view(['POST'])
@authentication_classes((TokenAuthentication,))
@permission_classes((IsAuthenticated,))
def make_version(request, project_id):
    """
    Makes versions out of Toolkit and coverage data for the project.

    Args:
        project_id: id of the project.
    """
    # Make a new version from current coverage.
    last_cov_ver = CoverageVersion.objects.filter(project_id=project_id).order_by("-version").first()
    if not last_cov_ver:
        # No versions yet.
        new_version = 1
    else:
        new_version = last_cov_ver.version + 1
    current_cov = get_object_or_400(Project, "No such project.", id=project_id).data["coverage"]
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


@api_view(['GET'])
@authentication_classes((TokenAuthentication,))
@permission_classes((IsAuthenticated,))
def get_coverage_versions(request, project_id):
    """
    Retrieves all coverage versions for the given project_id.
    """
    coverage_versions = CoverageVersion.objects.filter(project_id=project_id) \
                            .order_by("version").values("version", "data", "modified")
    return Response(coverage_versions)


@api_view(['GET'])
@authentication_classes((TokenAuthentication,))
@permission_classes((IsAuthenticated,))
def get_toolkit_versions(request, project_id):
    """
    Retrieves all toolkit versions for the given project_id.
    """
    toolkit_versions = ToolkitVersion.objects.filter(project_id=project_id) \
                            .order_by("version").values("version", "data", "modified")
    return Response(toolkit_versions)


class PartnerLogoViewSet(TokenAuthMixin, ViewSet):

    def list(self, request, project_id):
        """
        Retrieves list of partnerlogo ids for a given project.
        """
        project = get_object_or_400(Project, "No such project.", id=project_id)
        return Response([{"data": p.data.url, "id": p.id} for p in PartnerLogo.objects.filter(project_id=project.id)])

    def create(self, request, project_id):
        """
        Creates partnerlogos from the uploaded files.
        """
        project = get_object_or_400(Project, "No such project.", id=project_id)
        logos = []
        # Get and store binary files for partnerlogos.
        for key, value in request.FILES.items():
            logo = PartnerLogo.objects.create(project_id=project.id, type=value.content_type, data=value)
            logos.append({"id": logo.id, "data": logo.data.url})
        return Response(logos)

    def destroy(self, request, pk=None):
        get_object_or_400(PartnerLogo, "No such logo.", id=pk).delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
