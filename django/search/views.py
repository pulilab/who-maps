import logging

from rest_framework import filters, mixins
from rest_framework.response import Response
from rest_framework.viewsets import GenericViewSet

from search.serializers import MapResultSerializer, ListResultSerializer
from .models import ProjectSearch


class SearchViewSet(mixins.ListModelMixin, GenericViewSet):
    queryset = ProjectSearch.objects.all().select_related('project', 'project__approval', 'organisation', 'country')
    search = ProjectSearch.search
    filter = ProjectSearch.filter
    found_in = ProjectSearch.found_in
    map_values = (
        "project_id",
        "project__name",
        "organisation_id",
        "country_id",
        "project__data__coverage",
        "project__data__national_level_deployment",
        "project__data__government_investor",
        "project__approval__approved",
    )
    list_values = (
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
        # "country__region",
        "project__data__government_investor",
        "project__data__donors",  # TODO: will be refactored
        "project__approval__approved"
    )
    filter_backends = (filters.OrderingFilter,)
    ordering_fields = ('project__name', 'country__name', 'project__data__government_investor', )  # TODO: add country__region

    def get_serializer_class(self):
        return None

    def list(self, request, *args, **kwargs):
        """
        Search in projects, works by the following query params:
        q: search term
        in: search in [optional, defaults to all: in=name&in=org&in=country&in=overview&in=loc&in=partner&in=donor]
        country: eg: country=1&country=2
        sw: eg: sw=1&sw=2
        dhi: eg: dhi=1&dhi=2
        hfa: eg: hfa=1&hfa=2
        hsc: eg: hsc=1&hsc=2
        his: eg: his=1&his=2
        region: eg: region=3
        gov: gov=0 (for false), gov=1&gov=2 (for true values, since there's two types of true)
        donor: ???
        approved: approved=0 (for not approved), approved=1 (for approved)
        found: include | anything else won't include (defaults to exclude)
        type: map | list (defaults to map)
        """
        results = {}
        search_fields = set()
        query_params = request.query_params

        qs = self.get_queryset()
        qs = self.filter_queryset(qs)

        search_term = query_params.get('q')

        if search_term:
            search_in = query_params.getlist('in')
            qs = self.search(queryset=qs, search_term=search_term, search_in=search_in)
            if query_params.get('found') == 'include':
                results.update(found_in=self.found_in(queryset=qs, search_term=search_term))

        qs = self.filter(queryset=qs, query_params=query_params)

        if query_params.get('type') == 'list':
            data = ListResultSerializer(qs.values(*self.list_values), many=True).data
        else:
            data = MapResultSerializer(qs.values(*self.map_values), many=True).data
        results.update(projects=data, search_term=search_term, search_in=search_fields)

        # page = self.paginate_queryset(qs)
        # if page is not None:
        #     return self.get_paginated_response(data)

        return Response(results)
