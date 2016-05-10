from rest_framework import status
from rest_framework.response import Response
from rest_framework.authentication import TokenAuthentication
from rest_framework.decorators import api_view, authentication_classes
from rest_framework.decorators import permission_classes
from rest_framework.permissions import IsAuthenticated

from project.models import Project
from .models import ProjectSearch
from .serializers import SearchSerializer


@api_view(['POST'])
def search_project(request):
    """
    View for providing search functionality for projects.
    """
    serializer = SearchSerializer(data=request.data)
    if serializer.is_valid():
        results = ProjectSearch.search(**serializer.validated_data)
        return Response(results)
    else:
        return Response(data=serializer.errors, status=status.HTTP_400_BAD_REQUEST)
