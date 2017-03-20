import functools
import json
import csv

from django.db import transaction
from django.http import HttpResponse, Http404
from django.forms.models import model_to_dict
from django.shortcuts import get_object_or_404, render_to_response
from django.template import RequestContext
from django.contrib.auth.models import User
from django.core.exceptions import ObjectDoesNotExist
from rest_framework import status
from rest_framework.mixins import RetrieveModelMixin
from rest_framework.viewsets import ViewSet, GenericViewSet
from rest_framework.response import Response
from rest_framework.authentication import TokenAuthentication
from rest_framework.decorators import api_view, authentication_classes
from rest_framework.decorators import permission_classes
from rest_framework.permissions import IsAuthenticated

from hss import hss_data
from core.views import TokenAuthMixin, TeamTokenAuthMixin, get_object_or_400
from user.models import UserProfile, Organisation
from hss.models import HSS
from toolkit.models import Toolkit, ToolkitVersion
from toolkit.toolkit_data import toolkit_default
from country.models import Country

from .permissions import InTeamOrReadOnly
from .serializers import ProjectSerializer, ProjectModelSerializer, ProjectGroupListSerializer, \
    ProjectGroupUpdateSerializer, ProjectFilterSerializer
from .models import Project, File, CoverageVersion
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
            "geographic_scope": p.data.get('geographic_scope'),
            "technology_platforms": p.data.get('technology_platforms'),
            "interventions": p.hss_set.first().get_interventions_list(),
            "continuum": p.hss_set.first().get_continuum_list(),
            "constraints": p.hss_set.first().get_constraints_list(),
            "applications": p.hss_set.first().get_applications_list(),
        }], projects, [])

        return Response(result_list)

    @staticmethod
    def project_structure(request):
        countries = Country.objects.values('id', 'name')
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


def create_from_file(request):
    if request.method == 'GET':
        return render_to_response(
            "project/create_from_file.html",
            context_instance=RequestContext(request))
    if request.method == 'POST':
        projects_file = request.FILES.get("file", None)
        if not projects_file:
            return render_to_response(
                "project/create_from_file.html",
                {"errors": ["Please select a file to upload."]},
                context_instance=RequestContext(request)
            )
        data = StringIO(projects_file.read().decode())
        try:
            projects_data = json.loads(data.read())
        except ValueError as e:
            return render_to_response(
                "project/create_from_file.html",
                {"errors": ["Malformed JSON file: {}".format(e)]},
                context_instance=RequestContext(request)
            )
        else:
            imported = []
            failed = []
            for project_item in projects_data:
                country = Country.objects.get_object_or_none(name=project_item["country"])
                if not country:
                    failed.append("Importing '{}' is failed: No such country: {}"
                                    .format(project_item["name"], project_item["country"]))
                    continue
                project_item["country"] = country.id
                organisation = Organisation.objects.get_object_or_none(name=project_item["organisation"])
                if not organisation:
                    failed.append("Importing '{}' is failed: No such organisation: {}"
                                    .format(project_item["name"], project_item["organisation"]))
                    continue
                project_item["organisation"] = organisation.id
                owner = project_item.pop("owner")
                try:
                    user = User.objects.get(email=owner)
                except ObjectDoesNotExist:
                    failed.append("Importing '{}' is failed: No such user: {}"
                                    .format(project_item["name"], owner))
                    continue
                data_serializer = ProjectSerializer(data=project_item)
                model_serializer = ProjectModelSerializer(data={"name": project_item["name"]})
                model_valid = model_serializer.is_valid()
                data_valid = data_serializer.is_valid()
                if model_valid and data_valid:
                    project = Project(name=project_item["name"], data=project_item)
                    project.save()
                    project.team.add(user.userprofile)
                    # Add default HSS structure for the new project.
                    HSS.objects.create(project_id=project.id, data=hss_default)
                    # Add default Toolkit structure for the new project.
                    Toolkit.objects.create(project_id=project.id, data=toolkit_default)
                    imported.append(project.name)
                else:
                    failed.append("Importing '{}' is failed: {}{}"
                                    .format(project_item["name"], data_serializer.errors, model_serializer.errors))
            return render_to_response(
                "project/create_from_file.html",
                {"imported": imported, "failed": failed},
                context_instance=RequestContext(request)
            )


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


class CSVExportViewSet(TeamTokenAuthMixin, ViewSet):

    def create(self, request):
        """
        Creates CSV file out of a list of project IDs
        """
        if not request.data or not isinstance(request.data, list):
            return HttpResponse()

        projects = Project.objects.filter(id__in=request.data)

        results = [[
            p.name,
            Country.get_name_by_id(p.data.get('country')),
            p.data.get('implementation_dates'),
            Organisation.get_name_by_id(p.data.get('organisation')),
            ", ".join(p.data.get('donors')),
            p.data.get('implementing_partners'),
            ", ".join(p.hss_set.first().get_interventions_list()),
            " - ".join((p.data.get('contact_name'), p.data.get('contact_email'))),
            p.data.get('implementation_overview')
        ] for p in projects]

        response = HttpResponse(content_type='text/csv')
        response['Content-Disposition'] = 'attachment; filename="csv.csv"'

        writer = csv.writer(response)

        # HEADER
        writer.writerow(['Name', 'Country', 'Date', 'Organisation Name', 'Donors', "Implementing Partners",
                         "mHealth Interventions", "Point of Contact",
                         "Overview of digital health implementation", "Geographical coverage"])

        # PROJECTS
        [writer.writerow([field for field in project]) for project in results]

        return response
