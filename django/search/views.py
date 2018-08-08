from rest_framework import filters, mixins
from rest_framework.response import Response
from rest_framework.viewsets import GenericViewSet

from .models import ProjectSearch


class SearchViewSet(mixins.ListModelMixin, GenericViewSet):
    queryset = ProjectSearch.objects.all()
    # filter_backends = (filters.OrderingFilter,)
    # ordering_fields = ('project_name', 'contact_name')

    def get(self, request, *args, **kwargs):
        queryset = ProjectSearch.search(self.get_queryset())

        queryset = self.filter_queryset(queryset)

        page = self.paginate_queryset(queryset)

        data = {}  # TODO: make this

        if page is not None:
            return self.get_paginated_response(data)

        return Response(data)