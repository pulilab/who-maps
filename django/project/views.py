import json
from django.http import HttpResponse, Http404
from django.shortcuts import render
from django.db.models import Q

from rest_framework import status
from rest_framework.viewsets import ModelViewSet
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser

from core.views import TokenAuthMixin
from user.models import UserProfile
from hss.models import HSS
from hss.hss_data import hss_default
from toolkit.models import Toolkit
from toolkit.toolkit_data import toolkit_default
from .serializers import ProjectListRetrieveSerializer, ProjectCreateUpdateSerializer
from .models import Project, Strategy, Technology, Pipeline, Application
from .models import Report, Publication


def template_project_detail(request, project_id=None):
    """
    View for providing temaplte HTML for create/edit project. Fills out form
    options that is stored in the database.
    """
    if project_id:
        project = Project.objects.get_object_or_none(pk=project_id)
        if not project:
            return HttpResponse("No such project.", status=400)
        else:
            strategy_options = Strategy.objects.filter(Q(project_specific=False) | Q(id__in=project.strategy.all()))
            technology_options = Technology.objects.filter(Q(project_specific=False) | Q(id__in=project.technology.all()))
            pipeline_options = Pipeline.objects.filter(Q(project_specific=False) | Q(id__in=project.pipeline.all()))
    else:
        strategy_options = Strategy.objects.filter(Q(project_specific=False))
        technology_options = Technology.objects.filter(Q(project_specific=False))
        pipeline_options = Pipeline.objects.filter(Q(project_specific=False))

    application_options = Application.objects.all()

    data = {
        "strategy_options": strategy_options,
        "technology_options": technology_options,
        "pipeline_options": pipeline_options,
        "application_options": application_options
    }
    return render(request, "project/project-detail.html", {"data": data})


def get_publication(request, pk):
    """
    View for retrieving publication file.
    """
    if request.method == 'GET':
        publication = Publication.objects.get_object_or_none(id=pk)
        if publication:
            return HttpResponse(content=publication.file, content_type="application/pdf")
        else:
            return HttpResponse("No such item.", status=400)


def get_report(request, pk):
    """
    View for retrieving publication file.
    """
    if request.method == 'GET':
        report = Report.objects.get_object_or_none(id=pk)
        if report:
            return HttpResponse(content=report.file, content_type="application/pdf")
        else:
            return HttpResponse("No such item.", status=400)


def create_project_files(request, pk):
    """
    Enables to upload files for publications and reports.

    Args:
        pk: id of the project the artifacts belong to.
    """
    if request.method == "POST":
        if pk:
            project = Project.objects.get_object_or_none(pk=pk)
            if not project:
                return HttpResponse("No such project.", status=400)
            else:
                # Get and store binary files for publications and reports.
                for key, value in request.FILES.items():
                    if "publication" in key:
                        Publication.objects.create(project_id=project.id, filename=value.name, file=value.read())
                    elif "report" in key:
                        Report.objects.create(project_id=project.id, filename=value.name, file=value.read())
                return HttpResponse()


class ProjectViewSet(TokenAuthMixin, ModelViewSet):
    queryset = Project.objects.all()
    serializer_class = ProjectListRetrieveSerializer

    def get_serializer_class(self):
        if self.action == "list" or self.action == "retrieve":
            return ProjectListRetrieveSerializer
        if self.action == "create" or self.action == "update":
            return ProjectCreateUpdateSerializer

    def get_queryset(self):
        """
        Returns the queryset filtered by User.

        Returns:
            QuerysSet
        """
        user_id = self.request.user.id
        user_profile = UserProfile.objects.get(user_id=user_id)
        return Project.objects.filter(organisation=user_profile.organisation)

    def update(self, request, *args, **kwargs):
        """
        Overridden update() method so that it can handle "other" fields,
        and publications, reports as well.
        """
        serializer = self.get_serializer(self.get_object(), data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def create(self, request):
        """
        Overridden create() method so that it can handle "other" fields,
        and publications, reports as well.
        """
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            print(serializer.validated_data.get("coverage_update", "none"))
            serializer.save()
            # Add default HSS structure for the new project.
            HSS.objects.create(project_id=serializer.data.get("id"), data=hss_default)
            # Add default Toolkit structure for the new project.
            Toolkit.objects.create(project_id=serializer.data.get("id"), data=toolkit_default)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
