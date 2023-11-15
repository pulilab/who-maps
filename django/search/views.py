from collections import OrderedDict

from django.core.paginator import Paginator
from django.utils.functional import cached_property

from rest_framework import filters, mixins
from rest_framework.exceptions import ValidationError
from rest_framework.pagination import PageNumberPagination
from rest_framework.response import Response
from rest_framework.viewsets import GenericViewSet

from country.models import Donor, Country
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
        "project__data__stages",
    )
    list_values = (
        "project_id",
        "project__name",
        "organisation_id",
        "country_id",
        "project__data__geographic_scope",
        "project__data__implementation_overview",
        "project__data__start_date",
        "project__data__end_date",
        "project__data__contact_name",
        "project__data__contact_email",
        "project__data__implementing_partners",
        "project__data__software",
        "project__data__dhis",
        "project__data__health_focus_areas",
        "project__data__hsc_challenges",
        "project__data__services_and_application_types",
        "project__data__his_bucket",
        "country__region",
        "project__data__government_investor",
        "project__data__zero_cost",
        "project__data__codebase_accessible",
        "project__data__is_customizable",
        "project__data__free_replication",
        "project__data__osi_licenses",
        "project__data__repository",
        "project__data__mobile_application",
        "project__data__wiki",
        "project__data__interoperability_standards",
        "project__data__coverage",
        "project__data__coverage_second_level",
        "project__data__national_level_deployment",
        "donors",
        "project__approval__approved",
        "project__data__stages",
    )
    filter_backends = (filters.OrderingFilter,)
    ordering_fields = ('project__name', 'organisation__name', 'country__name', 'country__region',
                       'project__data__government_investor', )
    ordering = ('project_id',)
    pagination_class = ResultsSetPagination

    def get_serializer_class(self):
        if getattr(self, 'swagger_fake_view', False):  # pragma: no cover
            return ListResultSerializer

    def get_queryset(self):
        if getattr(self, "swagger_fake_view", False):  # pragma: no cover
            # queryset just for schema generation metadata
            # as per https://github.com/axnsan12/drf-yasg/issues/333#issuecomment-474883875
            return ProjectSearch.objects.none()

        return ProjectSearch.objects.exclude(project__public_id='')\
            .select_related('project', 'project__approval', 'organisation', 'country', 'donor')

    def list(self, request, *args, **kwargs):
        """
        Search in projects, works by the following query params:

        ** SEARCH PARAMETERS **

        `q` search term eg: q=test  
        `in` search in [optional, defaults to all: in=name&in=org&in=country&in=overview&in=loc&in=partner&in=donor]  

        ** FILTER PARAMETERS **

        `country` eg: country=1&country=2  
        `sw` eg: sw=1&sw=2  
        `dhi` eg: dhi=1&dhi=2  
        `hfa` eg: hfa=1&hfa=2  
        `hsc` eg: hsc=1&hsc=2  
        `his` eg: his=1&his=2  
        `region` eg: region=3  
        `gov` gov=0 (for false), gov=1&gov=2 (for true values, since there's two types of true)  
        `donor` eg: donor=1&donor=2  
        `approved` eg: approved=0 (for not approved), approved=1 (for approved)  
        `stage` eg: stage=1&stage=2

        ** FOUND IN FEATURE **

        `found` include if present (defaults to exclude)  

        ** TYPE AND ORDERING **

        `type` map | list (defaults to map) [eg: type=map]  
        `ordering` project__name | organisation__name | country__name | 
                   project__data__government_investor | country__region | 
                   project__modified  

        ** PAGINATION **

        `page` 1...n | last (will show the last page no matter the number)  
        `page_size` eg: 20  

        ** VIEW AS **

        `view_as` donor | country  
        """

        results = {}
        search_fields = set()
        donor = country = None

        query_params = request.query_params
        list_values = list(self.list_values)
        map_values = list(self.map_values)

        qs = self.get_queryset()

        search_term = query_params.get('q')
        view_as = query_params.get('view_as')

        if view_as and view_as == 'donor':
            if not request.user.is_authenticated:
                raise ValidationError("You must be authenticated for viewing as.")

            donor_list = query_params.getlist('donor')
            if not donor_list:
                raise ValidationError("No donor selected for view as.")
            elif len(donor_list) > 1:
                raise ValidationError("View as can only work with one donor selected.")

            try:
                donor = Donor.objects.get(id=int(donor_list[0]))
            except (Donor.DoesNotExist, ValueError):
                raise ValidationError("No such donor.")

            if request.user.is_superuser or donor.user_in_groups(request.user.userprofile):
                list_values.append('project__data__donor_custom_answers')
                list_values.append('project__data__donor_custom_answers_private')
            else:
                raise ValidationError("No access to donor.")

        elif view_as and view_as == 'country':
            if not request.user.is_authenticated:
                raise ValidationError("You must be authenticated for viewing as.")

            country_list = query_params.getlist('country')
            if not country_list:
                raise ValidationError("No country selected for view as.")
            elif len(country_list) > 1:
                raise ValidationError("View as can only work with one country selected.")

            try:
                country = Country.objects.get(id=int(country_list[0]))
            except (Country.DoesNotExist, ValueError):
                raise ValidationError("No such country.")

            if request.user.is_superuser or country.user_in_groups(request.user.userprofile):
                list_values.append('project__data__country_custom_answers')
                list_values.append('project__data__country_custom_answers_private')
            else:
                raise ValidationError("No access to country.")
        elif view_as:
            raise ValidationError("You can only view as country or donor.")

        if search_term:
            if len(search_term) < 2:
                raise ValidationError("Search term must be at least two characters long.")

            search_in = query_params.getlist('in')
            qs = self.search(queryset=qs, search_term=search_term, search_in=search_in)
            if 'found' in query_params:
                results.update(found_in=self.found_in(queryset=qs, search_term=search_term))

        qs = self.filter(queryset=qs, query_params=query_params)
        qs = self.filter_queryset(qs)

        results_type = 'list' if query_params.get('type') == 'list' else 'map'
        if results_type == 'list':
            page = self.paginate_queryset(qs.values(*list_values))
            data = ListResultSerializer(page, many=True, context={"donor": donor, "country": country}).data
        else:
            page = self.paginate_queryset(qs.values(*map_values))
            data = MapResultSerializer(page, many=True).data

        results.update(projects=data, type=results_type, search_term=search_term, search_in=search_fields)
        return self.get_paginated_response(results)
