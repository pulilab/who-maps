from collections import OrderedDict

from django.core.paginator import Paginator
from django.utils.functional import cached_property

from rest_framework import filters, mixins, status
from rest_framework.pagination import PageNumberPagination
from rest_framework.response import Response
from rest_framework.viewsets import GenericViewSet

from .serializers import MapResultSerializer, ListResultSerializer
from .models import ProjectSearch


class FastCountPaginator(Paginator):
    @cached_property
    def count(self):
        return len(self.object_list)


class ResultsSetPagination(PageNumberPagination):
    page_size = 10
    page_size_query_param = 'page_size'
    max_page_size = 1000
    django_paginator_class = FastCountPaginator

    def get_paginated_response(self, data):
        return Response(OrderedDict([
            ('count', self.page.paginator.count),
            ('next', self.page.next_page_number() if self.page.has_next() else None),
            ('previous', self.page.previous_page_number() if self.page.has_previous() else None),
            ('results', data)
        ]))


class SearchViewSet(mixins.ListModelMixin, GenericViewSet):
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
        "country__region",
        "project__data__government_investor",
        "donors",
        "project__approval__approved"
    )
    filter_backends = (filters.OrderingFilter,)
    ordering_fields = ('project__name', 'organisation__name', 'country__name', 'country__region',
                       'project__data__government_investor', )
    ordering = ('project_id',)
    pagination_class = ResultsSetPagination

    def get_queryset(self):
        return ProjectSearch.objects.exclude(project__public_id='')\
            .select_related('project', 'project__approval', 'organisation', 'country')

    def list(self, request, *args, **kwargs):
        """
        Search in projects, works by the following query params:

        ** SEARCH PARAMETERS **
        q: search term
        in: search in [optional, defaults to all: in=name&in=org&in=country&in=overview&in=loc&in=partner&in=donor]

        ** FILTER PARAMETERS **
        country: eg: country=1&country=2
        sw: eg: sw=1&sw=2
        dhi: eg: dhi=1&dhi=2
        hfa: eg: hfa=1&hfa=2
        hsc: eg: hsc=1&hsc=2
        his: eg: his=1&his=2
        region: eg: region=3
        gov: gov=0 (for false), gov=1&gov=2 (for true values, since there's two types of true)
        donor: TODO: implement
        approved: approved=0 (for not approved), approved=1 (for approved)

        ** FOUND IN FEATURE **
        found: include if present (defaults to exclude)

        ** TYPE AND ORDERING **
        type: map | list (defaults to map)
        ordering: project__name | organisation__name | country__name |
                  project__data__government_investor | country__region

        ** PAGINATION **
        page: 1...n | last (will show the last page no matter the number)
        page_size: eg: 20
        """
        results = {}
        search_fields = set()
        query_params = request.query_params

        qs = self.get_queryset()

        search_term = query_params.get('q')

        if search_term:
            if len(search_term) < 2:
                return Response(data=dict(error="Search term must be at least two characters long"),
                                status=status.HTTP_406_NOT_ACCEPTABLE)

            search_in = query_params.getlist('in')
            qs = self.search(queryset=qs, search_term=search_term, search_in=search_in)
            if 'found' in query_params:
                results.update(found_in=self.found_in(queryset=qs, search_term=search_term))

        qs = self.filter(queryset=qs, query_params=query_params)
        qs = self.filter_queryset(qs)

        results_type = 'list' if query_params.get('type') == 'list' else 'map'
        if results_type == 'list':
            page = self.paginate_queryset(qs.values(*self.list_values))
            data = ListResultSerializer(page, many=True).data
        else:
            page = self.paginate_queryset(qs.values(*self.map_values))
            data = MapResultSerializer(page, many=True).data

        results.update(projects=data, type=results_type, search_term=search_term, search_in=search_fields)
        return self.get_paginated_response(results)
