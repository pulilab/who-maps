import json
from django.http import HttpResponse, Http404
from django.shortcuts import render
from django.db.models import Q

from rest_framework import status
from rest_framework.viewsets import ModelViewSet
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser

from core.views import TokenAuthMixin
from .serializers import ProjectSerializer
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
    serializer_class = ProjectSerializer
    parser_classes = (MultiPartParser, FormParser)

    def _prepare_serializer(self, request):
        def pop_or_empty(key):
            """
            Boilerplate code for handling KeyError in case of dict.pop().

            Args:
                key (string): The key we need to pop.

            Returns:
                list: empty list on KeyError, otherwise the result of pop()
            """
            try:
                return self.serializer.initial_data.pop(key)
            except KeyError:
                return []

        # Get "other" fields from the POST data.
        strategy_other = pop_or_empty("strategy_other")
        technology_other = pop_or_empty("technology_other")
        pipeline_other = pop_or_empty("pipeline_other")

        # Get new publications and reports.
        publications_new = pop_or_empty("publications_new")
        reports_new = pop_or_empty("reports_new")

        # Get deleted publications and reports.
        publications_deleted = pop_or_empty("publications_deleted")
        reports_deleted = pop_or_empty("reports_deleted")

        if self.serializer.is_valid():
            # Create the "other" fields in the database,
            # and put back their ID to the original POST data.
            for name in strategy_other:
                item = Strategy.objects.create(name=name, project_specific=True)
                self.serializer.validated_data["strategy"].append(item.id)

            for name in technology_other:
                item = Technology.objects.create(name=name, project_specific=True)
                self.serializer.validated_data["technology"].append(item.id)

            for name in pipeline_other:
                item = Pipeline.objects.create(name=name, project_specific=True)
                self.serializer.validated_data["pipeline"].append(item.id)

            project = self.serializer.save()

            # Store new publications and reports.
            for item in publications_new:
                Publication.objects.create(project_id=project.id, url=item)

            for item in reports_new:
                Report.objects.create(project_id=project.id, url=item)

            # Delete removed publications and reports.
            Publication.objects.filter(project_id=project.id, id__in=publications_deleted).delete()
            Report.objects.filter(project_id=project.id, id__in=reports_deleted).delete()

            return True
        else:
            return False

    def update(self, request, *args, **kwargs):
        """
        Overridden update() method so that it can handle "other" fields,
        and publications, reports as well.
        """
        instance = self.get_object()
        self.serializer = self.get_serializer(instance, data=request.data)
        if self._prepare_serializer(request):
            return Response(self.serializer.data)
        else:
            return Response(self.serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def create(self, request):
        """
        Overridden create() method so that it can handle "other" fields,
        and publications, reports as well.
        """
        self.serializer = self.get_serializer(data=request.data)
        if self._prepare_serializer(request):
            return Response(self.serializer.data, status=status.HTTP_201_CREATED)
        else:
            return Response(self.serializer.errors, status=status.HTTP_400_BAD_REQUEST)
