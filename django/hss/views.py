from django.db import transaction
from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view

from core.views import TeamTokenAuthMixin, CheckProjectAccessMixin, get_object_or_400
from rest_framework.viewsets import GenericViewSet
from search.signals import intervention_save
from project.models import Project

from .hss_data import interventions, applications, taxonomies, continuum, target_population
from .models import HSS
from . import serializers


class BubbleView(TeamTokenAuthMixin, CheckProjectAccessMixin, GenericViewSet):
    serializer_class = serializers.BubbleSerializer

    def cmp_bubbles(self, bubble1, bubble2):
        """
        Compares bubbles based on app_id, subapp_id, and column_id, basically
        their position on HSS.

        Args:
            bubble1:
            bubble2:

        Returns:
            bool: True if they are the same position, False if not.
        """
        return bubble1["app_id"] == bubble2["app_id"] \
                and bubble1["subapp_id"] == bubble2["subapp_id"] \
                and bubble1["column_id"] == bubble2["column_id"]

    @transaction.atomic
    def create(self, request, project_id):
        """
        Overrides create to insert and update Bubbles.
        """
        self.check_project_permission(request, project_id)

        serializer = self.get_serializer(data=request.data, many=True)
        if serializer.is_valid():
            hss = get_object_or_400(HSS, select_for_update=True, error_message="No such project.", project=project_id)
            # Check each bubble in the update request, insert if not exists,
            # update if exists.
            for bubble_update in serializer.validated_data:
                bubble_update = dict(bubble_update)
                filter_data = [{
                    "app_id": bubble_update["app_id"],
                    "subapp_id": bubble_update["subapp_id"],
                    "column_id": bubble_update["column_id"]}]
                bubble_exists = HSS.objects.get_object_or_none(project_id=project_id, data__applications__contains=filter_data)
                if bubble_exists:
                    # Search for the given bubble, and update.
                    for i, bubble in enumerate(hss.data["applications"]):
                        if self.cmp_bubbles(bubble_update, bubble):
                            hss.data["applications"][i] = bubble_update
                else:
                    # Insert new.
                    hss.data["applications"].append(bubble_update)
                hss.save()
            return Response(serializer.data)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ContinuumView(TeamTokenAuthMixin, CheckProjectAccessMixin, GenericViewSet):
    serializer_class = serializers.ContinuumSerializer

    @transaction.atomic
    def create(self, request, project_id):
        """
        Overrides create to insert and update Continuum.
        """
        self.check_project_permission(request, project_id)

        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            # Check if there's a project for the ID.
            hss = get_object_or_400(HSS, select_for_update=True, error_message="No such project.", project=project_id)
            hss.data["continuum"][serializer.validated_data["column_id"]].update(**serializer.validated_data)
            hss.save()
            return Response(serializer.data)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ConstraintView(TeamTokenAuthMixin, CheckProjectAccessMixin, GenericViewSet):
    serializer_class = serializers.ConstraintSerializer

    @transaction.atomic
    def create(self, request, project_id):
        """
        Overrides create to insert and update Constraints.
        """
        self.check_project_permission(request, project_id)

        serializer = self.get_serializer(data=request.data, many=True)
        if serializer.is_valid():
            # Check if there's a project for the ID.
            hss = get_object_or_400(HSS, select_for_update=True, error_message="No such project.", project=project_id)
            # Check each constraint in the update request, insert if not exists,
            # update if exists.
            for constraint_update in serializer.validated_data:
                constraint_update = dict(constraint_update)
                filter_data = [{"name": constraint_update["name"]}]
                constraint_exists = HSS.objects.get_object_or_none(project_id=project_id, data__constraints__contains=filter_data)
                if constraint_exists:
                    # Search for the given constraint, and update.
                    for i, constraint in enumerate(hss.data["constraints"]):
                        if constraint_update["name"] == constraint["name"]:
                            hss.data["constraints"][i] = constraint_update
                else:
                    # Insert new.
                    hss.data["constraints"].append(constraint_update)
            hss.save()
            return Response(serializer.data)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class InterventionView(TeamTokenAuthMixin, CheckProjectAccessMixin, GenericViewSet):
    serializer_class = serializers.InterventionSerializer

    @transaction.atomic
    def create(self, request, project_id):
        """
        Overrides create to insert and update Interventions.
        """
        self.check_project_permission(request, project_id)

        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            # Check if there's a project for the ID.
            hss = get_object_or_400(HSS, select_for_update=True, error_message="No such project.", project=project_id)
            # Update the column with the intervention.
            hss.data["interventions"][serializer.validated_data["column_id"]] = dict(serializer.validated_data)
            hss.save()
            intervention_save.send(sender=InterventionView, instance=hss)
            return Response(serializer.data)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class AgeRangeView(TeamTokenAuthMixin, CheckProjectAccessMixin, GenericViewSet):
    serializer_class = serializers.AgeRangeSerializer

    @transaction.atomic
    def create(self, request, project_id):
        """
        Overrides create to insert and update Age range.
        """
        self.check_project_permission(request, project_id)

        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            # Check if there's a project for the ID.
            hss = get_object_or_400(HSS, select_for_update=True, error_message="No such project.", project=project_id)
            # Update the column with the intervention.
            hss.data["age_ranges"][serializer.validated_data["column_id"]] = dict(serializer.validated_data)
            hss.save()
            return Response(serializer.data)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class TaxonomyView(TeamTokenAuthMixin, CheckProjectAccessMixin, GenericViewSet):
    serializer_class = serializers.TaxonomySerializer

    def cmp_taxonomies(self, tax1, tax2):
        """
        Compares taxonomies based on app_id, subapp_id, basically
        their position on HSS.

        Args:
            tax1:
            tax2:

        Returns:
            bool: True if they are the same position, False if not.
        """
        return tax1["app_id"] == tax2["app_id"] \
                and tax1["subapp_id"] == tax2["subapp_id"]

    @transaction.atomic
    def create(self, request, project_id):
        """
        Overrides create to insert and update Taxonomies.
        """
        self.check_project_permission(request, project_id)

        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            # Check if there's a project for the ID.
            hss = get_object_or_400(HSS, select_for_update=True, error_message="No such project.", project=project_id)
            tax_update = dict(serializer.validated_data)
            # Check the constraint in the update request, insert if not exists,
            # update if exists.
            filter_data = [{
                "app_id": tax_update["app_id"],
                "subapp_id": tax_update["subapp_id"]}]
            tax_exists = HSS.objects.get_object_or_none(project_id=project_id, data__taxonomies__contains=filter_data)
            if tax_exists:
                # Search for the given taxonomy, and update.
                for i, tax in enumerate(hss.data["taxonomies"]):
                    if self.cmp_taxonomies(tax_update, tax):
                        hss.data["taxonomies"][i] = tax_update
            else:
                # Insert new.
                hss.data["taxonomies"].append(tax_update)
            hss.save()
            return Response(serializer.data)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
def hss_data(request, project_id):
    """
    Retrieves HSS data based on project_id.

    Args:
        project_id: ID for the given project.

    Returns:
        json: All the HSS data for the given project in JSON.
    """
    hss = get_object_or_400(HSS, "No such project.", project=project_id)
    return Response(hss.data)


@api_view(['GET'])
def hss_structure(request):
    """
    Retrieves HSS structure for setting up the HSS page for e.g. dropdowns,
    application labels, etc.

    Returns:
        json:
    """
    data = {
        "interventions": interventions,
        "target_population": target_population,
        "applications": applications,
        "taxonomies": taxonomies,
        "continuum": continuum
    }
    return Response(data)
