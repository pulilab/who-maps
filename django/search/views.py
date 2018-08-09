from rest_framework import filters, mixins
from rest_framework.response import Response
from rest_framework.viewsets import GenericViewSet

from .models import ProjectSearch


class SearchViewSet(mixins.ListModelMixin, GenericViewSet):
    queryset = ProjectSearch.objects.all()
    search = ProjectSearch.search
    MAP_VALUES = (
        "project_id",
        "project__name",
        "organisation_id",
        "country_id",
        "project__data__coverage",
        "project__data__national_level_deployment",
        "project__data__government_investor",
        "project__approval__approved",
        # "found_in"  # TODO: compute this
    )
    LIST_VALUES = (
        "project_id",
        "project__name",
        "organisation_id",
        "country_id",
        "project__data__geographic_scope",
        "project__data__implementation_overview",
        "project__data__contact_name",
        "project__data__contact_email",
        "project__data__platforms",
        "project__data__health_focus_areas",
        "project__data__hsc_challenges",
        "project__data__his_bucket",
        "country__region",
        "project__data__government_investor",
        "project__data__donors",  # TODO: will be refactored
        "project__approval__approved"
    )
    # filter_backends = (filters.OrderingFilter,)
    # ordering_fields = ('project_name', 'contact_name')

    def get_serializer_class(self):
        return None

    def list(self, request, *args, **kwargs):
        query_params = request.query_params

        search_term = query_params.get('q')
        search_in = {x.strip() for x in query_params.get('in').split(',')}

        page = self.paginate_queryset(queryset)

        data = {}  # TODO: make this

        if page is not None:
            return self.get_paginated_response(data)

        return Response(data)