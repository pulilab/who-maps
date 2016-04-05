from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.authentication import TokenAuthentication
from rest_framework.decorators import api_view, authentication_classes
from rest_framework.decorators import permission_classes
from rest_framework.permissions import IsAuthenticated

from core.views import TokenAuthMixin
from .hss_data import interventions, applications, taxonomies, continuum
from .models import HSS
from . import serializers


class BubbleView(TokenAuthMixin, generics.CreateAPIView):
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

    def create(self, request, *args, **kwargs):
        """
        Overrides create to insert and update Bubbles.
        """
        serializer = self.get_serializer(data=request.data, many=True)
        if serializer.is_valid():
            # Check if there's a project for the ID.
            project_id = kwargs.get("project_id", None)
            hss = HSS.objects.get_object_or_none(project=project_id)
            if not hss:
                return Response({"details": "No such project."}, status=status.HTTP_400_BAD_REQUEST)
            # Check each bubble in the update request, insert if not exists,
            # update if exists.
            for bubble_update in serializer.validated_data:
                bubble_update = dict(bubble_update)
                filter_data = [{
                    "app_id": bubble_update["app_id"],
                    "subapp_id": bubble_update["subapp_id"],
                    "column_id": bubble_update["column_id"]}]
                bubble_exists = HSS.objects.get_object_or_none(data__applications__contains=filter_data)
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


class ContinuumView(TokenAuthMixin, generics.CreateAPIView):
    serializer_class = serializers.ContinuumSerializer

    def create(self, request, *args, **kwargs):
        """
        Overrides create to insert and update Continuum.
        """
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            # Check if there's a project for the ID.
            project_id = kwargs.get("project_id", None)
            hss = HSS.objects.get_object_or_none(project=project_id)
            if not hss:
                return Response({"details": "No such project."}, status=status.HTTP_400_BAD_REQUEST)
            hss.data["continuum"][serializer.validated_data["column_id"]] = dict(serializer.validated_data)
            hss.save()
            return Response(serializer.data)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ConstraintView(TokenAuthMixin, generics.CreateAPIView):
    serializer_class = serializers.ConstraintSerializer

    def create(self, request, *args, **kwargs):
        """
        Overrides create to insert and update Constraints.
        """
        serializer = self.get_serializer(data=request.data, many=True)
        if serializer.is_valid():
            # Check if there's a project for the ID.
            project_id = kwargs.get("project_id", None)
            hss = HSS.objects.get_object_or_none(project=project_id)
            if not hss:
                return Response({"details": "No such project."}, status=status.HTTP_400_BAD_REQUEST)
            # Check each constraint in the update request, insert if not exists,
            # update if exists.
            for constraint_update in serializer.validated_data:
                constraint_update = dict(constraint_update)
                filter_data = [{"name": constraint_update["name"]}]
                constraint_exists = HSS.objects.get_object_or_none(data__constraints__contains=filter_data)
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


class InterventionView(TokenAuthMixin, generics.CreateAPIView):
    serializer_class = serializers.InterventionSerializer

    def create(self, request, *args, **kwargs):
        """
        Overrides create to insert and update Interventions.
        """
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            # Check if there's a project for the ID.
            project_id = kwargs.get("project_id", None)
            hss = HSS.objects.get_object_or_none(project=project_id)
            if not hss:
                return Response({"details": "No such project."}, status=status.HTTP_400_BAD_REQUEST)
            # Update the column with the intervention.
            hss.data["interventions"][serializer.validated_data["column_id"]] = dict(serializer.validated_data)
            hss.save()
            return Response(serializer.data)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class TaxonomyView(TokenAuthMixin, generics.CreateAPIView):
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

    def create(self, request, *args, **kwargs):
        """
        Overrides create to insert and update Taxonomies.
        """
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            # Check if there's a project for the ID.
            project_id = kwargs.get("project_id", None)
            hss = HSS.objects.get_object_or_none(project=project_id)
            if not hss:
                return Response({"details": "No such project."}, status=status.HTTP_400_BAD_REQUEST)
            tax_update = dict(serializer.validated_data)
            # Check the constraint in the update request, insert if not exists,
            # update if exists.
            filter_data = [{
                "app_id": tax_update["app_id"],
                "subapp_id": tax_update["subapp_id"]}]
            tax_exists = HSS.objects.get_object_or_none(data__taxonomies__contains=filter_data)
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
@authentication_classes((TokenAuthentication,))
@permission_classes((IsAuthenticated,))
def hss_data(request, project_id):
    """
    Retrieves HSS data based on project_id.

    Args:
        project_id: ID for the given project.

    Returns:
        json: All the HSS data for the given project in JSON.
    """
    hss = HSS.objects.get_object_or_none(project=project_id)
    if not hss:
        return Response({"details": "No such project."}, status=status.HTTP_400_BAD_REQUEST)
    return Response(hss.data)


@api_view(['GET'])
@authentication_classes((TokenAuthentication,))
@permission_classes((IsAuthenticated,))
def hss_structure(request):
    """
    Retrieves HSS structure for setting up the HSS page for e.g. dropdowns,
    application labels, etc.

    Returns:
        json:
    """
    data = {
        "interventions": interventions,
        "applications": applications,
        "taxonomies": taxonomies,
        "continuum": continuum
    }
    return Response(data)
