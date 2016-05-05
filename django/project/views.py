import json

from django.http import HttpResponse, Http404
from django.db.utils import IntegrityError
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
from .serializers import ProjectSerializer
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
        serializer = ProjectSerializer(data=request.data)
        if serializer.is_valid():
            try:
                project = Project.objects.create(name=serializer.data["name"], data=serializer.data)
            except IntegrityError:
                return Response({"details": "A project with this name already exists."}, status=status.HTTP_400_BAD_REQUEST)
            else:
                project.save()
            # Add default HSS structure for the new project.
            HSS.objects.create(project_id=project.id, data=hss_default)
            # Add default Toolkit structure for the new project.
            Toolkit.objects.create(project_id=project.id, data=toolkit_default)
            data = dict(serializer.data)
            data.update(id=project.id)
            return Response(data, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def retrieve(self, request, *args, **kwargs):
        """
        Retrieves a project.
        """
        project = get_object_or_400(Project, "No such project", id=kwargs["pk"])
        data = project.data
        data.update(id=project.id)
        return Response(project.data)

    def update(self, request, *args, **kwargs):
        """
        Updates a project.
        """
        serializer = ProjectSerializer(data=request.data)
        if serializer.is_valid():
            project = get_object_or_400(Project, "No such project", id=kwargs["pk"])
            project.data = serializer.data
            project.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


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
        for key, value in request.FILES.items():
            if "publication" in key:
                file_type = "publication"
            elif "report" in key:
                file_type = "report"
            File.objects.create(project_id=project.id, type=file_type, filename=value.name, data=value.read())
        return HttpResponse()
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

    def list(self, request, *args, **kwargs):
        """
        Retrieves list of partnerlogo ids for a given project.
        """
        project = get_object_or_400(Project, "No such project.", id=kwargs["project_id"])
        partnerlogos = PartnerLogo.objects.filter(project_id=project.id).values("id")
        return Response(partnerlogos)

    def create(self, request, *args, **kwargs):
        """
        Creates partnerlogos from the uploaded files.
        """
        project = get_object_or_400(Project, "No such project.", id=kwargs["project_id"])
        # Get and store binary files for partnerlogos.
        for key, value in request.FILES.items():
            PartnerLogo.objects.create(project_id=project.id, type=value.content_type, data=value.read())
        return Response()

    def retrieve(self, request, *args, **kwargs):
        """
        Retrieves binary file for logo image.
        """
        logo = get_object_or_400(PartnerLogo, "No such logo.", id=kwargs["pk"])
        return HttpResponse(content=logo.data, content_type=logo.type)

    def destroy(self, request, pk=None):
        get_object_or_400(PartnerLogo, "No such logo.", id=pk).delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
