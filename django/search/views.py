from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view
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


class SearchView(generics.ListAPIView):
    queryset = ProjectSearch.objects.all()
    serializer_class = SearchSerializer
    filter_backends = (filters.OrderingFilter,)
    ordering_fields = ('project_name', 'contact_name')