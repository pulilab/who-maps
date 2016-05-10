from django.db import transaction
from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.authentication import TokenAuthentication
from rest_framework.decorators import api_view, authentication_classes
from rest_framework.decorators import permission_classes
from rest_framework.permissions import IsAuthenticated

from core.views import TokenAuthMixin, get_object_or_400
from .models import Toolkit
from . import serializers


class ScoreView(TokenAuthMixin, generics.CreateAPIView):
    serializer_class = serializers.ScoreSerializer

    @transaction.atomic
    def create(self, request, *args, **kwargs):
        """
        Overrides create to insert and update Scores.
        """
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            # Check if there's a project for the ID.
            project_id = kwargs.get("project_id", None)
            toolkit = get_object_or_400(Toolkit, select_for_update=True, error_message="No such project.", project=project_id)
            try:
                # Update the scores.
                toolkit.update_score(**serializer.validated_data)
            except IndexError:
                # Wrong index somewhere in the chain.
                return Response({"details": "No such answer."}, status=status.HTTP_400_BAD_REQUEST)
            else:
                return Response(serializer.data)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
@authentication_classes((TokenAuthentication,))
@permission_classes((IsAuthenticated,))
def get_toolkit_data(request, project_id):
    """
    Retrieves Toolkit data based on project_id.

    Args:
        project_id: ID for the given project.

    Returns:
        json: All the Toolkit data for the given project in JSON.
    """
    toolkit = get_object_or_400(Toolkit, "No such project.", project=project_id)
    return Response(toolkit.data)
