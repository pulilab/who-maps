from rest_framework import generics, filters
from rest_framework.response import Response
from .models import ProjectSearch


class SearchView(generics.ListAPIView):
    queryset = ProjectSearch.objects.all()
    filter_backends = (filters.OrderingFilter,)
    ordering_fields = ('project_name', 'contact_name')

    def list(self, request, *args, **kwargs):
        queryset = ProjectSearch.search(self.get_queryset())

        queryset = self.filter_queryset(queryset)

        page = self.paginate_queryset(queryset)

        data = {}  # TODO: make this

        if page is not None:
            return self.get_paginated_response(data)

        return Response(data)