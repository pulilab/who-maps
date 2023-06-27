from django.db import models
from django.db.models import Sum, F, Func, Value, Case, When
from django.db.models.fields.json import KT
from django.db.models.functions import Cast, JSONObject
from django.db.models.lookups import GreaterThan
from rest_framework.response import Response

from country.models import Country
from django.shortcuts import get_object_or_404
from datetime import datetime, timedelta
from core.views import TokenAuthMixin
from kpiexport.models import AuditLogUsers, AuditLogTokens, AuditLogProjectStatus, AuditLogProjectStages, \
    AuditLogDataStandards, AuditLogHealthCategories, AuditLogHFA
from rest_framework.viewsets import GenericViewSet
from rest_framework.mixins import ListModelMixin
from rest_framework import filters
from rest_framework.permissions import IsAuthenticated, AllowAny


class GeneralKPIViewSet(ListModelMixin, GenericViewSet):
    fields = []

    @staticmethod
    def _get_object_keys(queryset, func_arguments):
        if len(func_arguments) == 1:
            selector_func = func_arguments[0]
        else:
            selector_func = Func(*func_arguments, function='jsonb_extract_path', output_field=models.JSONField())
        object_keys_queryset = queryset.annotate(keys=Func(selector_func, function='jsonb_object_keys')).values('keys')
        return set(object_key['keys'] for object_key in object_keys_queryset)

    def _count_dict_values(self, queryset, field, sum_by_date, investor_id=None):
        if investor_id:
            func_arguments = [F("data"), Value(investor_id)]
        else:
            func_arguments = [F(field['field_name'])]

        if nested_key := field.get('nested_key'):
            func_arguments.append(Value(str(nested_key)))

        object_keys = self._get_object_keys(queryset, func_arguments)
        object_counter = {}

        for key in object_keys:
            object_counter[str(key)] = \
                Func(
                    Func(*(func_arguments + [Value(str(key))]),
                         function='jsonb_extract_path',
                         output_field=models.JSONField()),
                    function='jsonb_array_length',
                    output_field=models.IntegerField())

        if sum_by_date:
            object_counter = {key: Sum(value) for (key, value) in object_counter.items()}

        return JSONObject(**object_counter)

    def _generate_bool_values(self, queryset, field, sum_by_date, investor_id=None):
        if investor_id:
            func_arguments = [F("data"), Value(investor_id)]
        else:
            func_arguments = [F(field['field_name'])]

        object_keys = self._get_object_keys(queryset, func_arguments)
        object_bool_values = {}

        for key in object_keys:
            selector_func = Func(*(func_arguments + [Value(str(key))]), function='jsonb_extract_path',
                                 output_field=models.JSONField())
            inner_object_keys_queryset = queryset.annotate(
                keys=Func(selector_func, function='jsonb_object_keys')).values('keys')
            inner_object_keys = set(object_key['keys'] for object_key in inner_object_keys_queryset)
            inner_dict = {}
            for inner_key in inner_object_keys:
                length_of_values = \
                    Func(
                        Func(*(func_arguments + [Value(str(key)), Value(str(inner_key))]),
                             function='jsonb_extract_path',
                             output_field=models.JSONField()),
                        function='jsonb_array_length')
                if sum_by_date:
                    length_of_values = Sum(length_of_values)

                inner_dict[str(inner_key)] = Case(
                    When(GreaterThan(length_of_values, 0), then=Value(True)),
                    default=Value(False),
                    output_field=models.BooleanField()
                )

            object_bool_values[str(key)] = JSONObject(**inner_dict)

        return JSONObject(**object_bool_values)

    def prepare_queryset(self, request, queryset, fields: list):
        """
        fields<List>:
            {
                field_name: <field_name>
                field_data_name: <field_data_name>
                count_list_values: <bool>
                count_dict_values: <bool>
                bool_values: <bool>
                nested_key: <key>
            }
        """
        region_enabled = int(request.query_params.get('region')) in [reg[0] for reg in Country.REGIONS] \
            if request.query_params.get('region') else False

        if investor_id := request.query_params.get('investor'):
            queryset = queryset.values('date')  # GROUP BY DATE
            query_kwargs = {}
            for field in fields:
                if region_enabled:
                    if field.get('count_list_values'):
                        query_kwargs[field["field_name"]] = Sum(Func(F(
                            f'data__{investor_id}__{field["field_data_name"]}'),
                            function='jsonb_array_length', output_field=models.IntegerField()))
                    elif field.get('count_dict_values'):
                        query_kwargs[field["field_name"]] = self._count_dict_values(
                            queryset, field, region_enabled, investor_id)
                    elif field.get('bool_values'):
                        query_kwargs[field["field_name"]] = self._generate_bool_values(
                            queryset, field, region_enabled, investor_id)
                    else:
                        query_kwargs[field["field_name"]] = Sum(Cast(KT(
                            f'data__{investor_id}__{field["field_data_name"]}'), models.IntegerField()))
                else:
                    if field.get('count_list_values'):
                        query_kwargs[field["field_name"]] = Func(F(
                            f'data__{investor_id}__{field["field_data_name"]}'),
                            function='jsonb_array_length', output_field=models.IntegerField())
                    elif field.get('count_dict_values'):
                        query_kwargs[field["field_name"]] = self._count_dict_values(
                            queryset, field, region_enabled, investor_id)
                    elif field.get('bool_values'):
                        query_kwargs[field["field_name"]] = self._generate_bool_values(
                            queryset, field, region_enabled, investor_id)
                    else:
                        query_kwargs[field["field_name"]] = Cast(KT(
                            f'data__{investor_id}__{field["field_data_name"]}'), models.IntegerField())
            queryset = queryset.annotate(**query_kwargs)
        else:
            query_kwargs = {}
            values_fields = ['date']
            for field in fields:
                if region_enabled:
                    if field.get('count_list_values'):
                        query_kwargs[field["field_name"]] = Sum(Func(F(field["field_name"]), function='CARDINALITY'))
                    elif field.get('count_dict_values'):  # pragma: no cover
                        query_kwargs[field["field_name"]] = self._count_dict_values(queryset, field, region_enabled)
                    elif field.get('bool_values'):  # pragma: no cover
                        query_kwargs[field["field_name"]] = self._generate_bool_values(queryset, field, region_enabled)
                    else:
                        query_kwargs[field["field_name"]] = Sum(field["field_name"])
                else:
                    if field.get('count_list_values'):
                        query_kwargs[field["field_name"]] = Func(F(field["field_name"]), function='CARDINALITY')
                    elif field.get('count_dict_values'):
                        query_kwargs[field["field_name"]] = self._count_dict_values(queryset, field, region_enabled)
                    elif field.get('bool_values'):
                        query_kwargs[field["field_name"]] = self._generate_bool_values(queryset, field, region_enabled)
                    else:
                        values_fields.append(field["field_name"])
            queryset = queryset.defer('data').values(*values_fields).annotate(**query_kwargs)

        return queryset

    def get_fields(self):
        return self.fields

    def list(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset())
        queryset = self.prepare_queryset(request, queryset, self.get_fields())
        return Response(queryset)


class KPIFilterBackend(filters.BaseFilterBackend):
    @staticmethod
    def _parse_date_str(date_str: str) -> datetime.date:
        date = datetime.strptime(date_str, '%Y-%m')
        return date.date()

    def filter_queryset(self, request, queryset, view):
        """
        Does general filtering for all KPI APIs
        """
        region_id = request.query_params.get('region')
        country_id = request.query_params.get('country')
        investor_id = request.query_params.get('investor')
        date_from_str = request.query_params.get('from')
        date_to_str = request.query_params.get('to')

        if country_id:
            country = get_object_or_404(Country, pk=int(country_id))
            queryset = queryset.filter(country=country)
        elif region_id:
            queryset = queryset.filter(country__region=region_id)
        else:  # If there's no country filter, return with global data by default
            queryset = queryset.filter(country=None)
        if investor_id:
            queryset = queryset.filter(data__has_key=investor_id)
        if date_from_str:
            date_from = self._parse_date_str(date_from_str)
        else:
            date_from = (datetime.today() - timedelta(days=365)).date()
        if date_to_str:
            date_to = self._parse_date_str(date_to_str)
            queryset = queryset.filter(date__lte=date_to)

        queryset = queryset.filter(date__gte=date_from).order_by('date')
        return queryset


class UserKPIsViewSet(TokenAuthMixin, GeneralKPIViewSet):
    """
    View to retrieve user KPIs

    Requires token authentication.

    Allowed filters:

    * `region`: country ID, example: 0
    * `country`: country ID, example: 1 (default: Global)
    * `investor`: investor ID, example: 2 (default: None). If set, response will be detailed
    * `from`: YYYY-MM format, beginning of the sample (default: 1 year ago)
    * `to`: YYYY-MM format, ending of the sample (default: last month)
    * `detailed`: if set to true, detailed donor-based data will be returned

    """
    permission_classes = (IsAuthenticated,)
    filter_backends = [KPIFilterBackend]
    filter_fields = ('region', 'country', 'investor', 'from', 'to')
    queryset = AuditLogUsers.objects.all()
    fields = [
        dict(field_name='active', field_data_name='total__active'),
        dict(field_name='registered', field_data_name='total__registered'),
    ]


class TokenKPIsViewSet(TokenAuthMixin, GeneralKPIViewSet):
    """
    View to retrieve user KPIs

    Requires token authentication.

    Allowed filters:

    * `region`: country ID, example: 0
    * `country`: country ID, example: 1 (default: Global)
    * `investor`: investor ID, example: 2 (default: None). If set, response will be detailed
    * `from`: YYYY-MM format, beginning of the sample (default: 1 year ago)
    * `to`: YYYY-MM format, ending of the sample (default: last month)
    * `detailed`: if set to true, detailed donor-based data will be returned

    """
    permission_classes = (IsAuthenticated,)
    filter_backends = [KPIFilterBackend]
    filter_fields = ('region', 'country', 'investor', 'from', 'to')
    queryset = AuditLogTokens.objects.all()
    fields = [
        dict(field_name='tokens', field_data_name='total')
    ]


class ProjectStatusKPIsViewSet(TokenAuthMixin, GeneralKPIViewSet):
    """
    View to retrieve project status KPIs

    Requires token authentication.

    Allowed filters:

    * `region`: country ID, example: 0
    * `country`: country ID, example: 1 (default: Global)
    * `investor`: investor ID, example: 2 (default: None). If set, response will be detailed
    * `from`: YYYY-MM format, beginning of the sample (default: 1 year ago)
    * `to`: YYYY-MM format, ending of the sample (default: last month)
    * `detailed`: if set to true, detailed donor-based data will be returned

    """
    permission_classes = (AllowAny,)
    filter_backends = [KPIFilterBackend]
    filter_fields = ('region', 'country', 'investor', 'from', 'to')
    queryset = AuditLogProjectStatus.objects.all()
    fields = [
        dict(field_name='published', field_data_name='published', count_list_values=True),
        dict(field_name='unpublished', field_data_name='unpublished', count_list_values=True),
        dict(field_name='archived', field_data_name='archived', count_list_values=True),
        dict(field_name='ready_to_publish', field_data_name='ready_to_publish', count_list_values=True),
        dict(field_name='to_delete', field_data_name='to_delete', count_list_values=True),
        dict(field_name='draft', field_data_name='draft', count_list_values=True),
        dict(field_name='growth', field_data_name='growth'),
    ]


class ProjectStagesKPIsViewSet(TokenAuthMixin, GeneralKPIViewSet):
    """
    View to retrieve project stage KPIs

    Requires token authentication.

    Allowed filters:

    * `region`: country ID, example: 0
    * `country`: country ID, example: 1 (default: Global)
    * `investor`: investor ID, example: 2 (default: None). If set, response will be detailed
    * `from`: YYYY-MM format, beginning of the sample (default: 1 year ago)
    * `to`: YYYY-MM format, ending of the sample (default: last month)
    * `detailed`: if set to true, detailed donor-based data will be returned

    """
    permission_classes = (AllowAny,)
    filter_backends = [KPIFilterBackend]
    filter_fields = ('region', 'country', 'investor', 'from', 'to')
    queryset = AuditLogProjectStages.objects.all()
    fields = [
        dict(field_name='stages', field_data_name='', count_dict_values=True),
    ]


class DataStandardsKPIsViewSet(TokenAuthMixin, GeneralKPIViewSet):
    """
    View to retrieve data standards KPIs

    Requires token authentication.

    Allowed filters:

    * `region`: country ID, example: 0
    * `country`: country ID, example: 1 (default: Global)
    * `investor`: investor ID, example: 2 (default: None). If set, response will be detailed
    * `from`: YYYY-MM format, beginning of the sample (default: 1 year ago)
    * `to`: YYYY-MM format, ending of the sample (default: last month)
    * `detailed`: if set to true, detailed donor-based data will be returned

    """
    permission_classes = (AllowAny,)
    filter_backends = [KPIFilterBackend]
    filter_fields = ('region', 'country', 'investor', 'from', 'to')
    queryset = AuditLogDataStandards.objects.all()
    fields = [
        dict(field_name='standards', field_data_name='', count_dict_values=True),
    ]


class HealthCategoriesKPIsViewSet(TokenAuthMixin, GeneralKPIViewSet):
    """
    View to retrieve health categories KPIs

    Requires token authentication.

    Allowed filters:

    * `region`: country ID, example: 0
    * `country`: country ID, example: 1 (default: Global)
    * `investor`: investor ID, example: 2 (default: None). If set, response will be detailed
    * `from`: YYYY-MM format, beginning of the sample (default: 1 year ago)
    * `to`: YYYY-MM format, ending of the sample (default: last month)
    * `detailed`: if set to true, detailed donor-based data will be returned

    """
    permission_classes = (AllowAny,)
    filter_backends = [KPIFilterBackend]
    filter_fields = ('region', 'country', 'investor', 'from', 'to')
    queryset = AuditLogHealthCategories.objects.all()
    fields = [
        dict(field_name='categories', field_data_name='', count_dict_values=True),
    ]


class HFAByCategoryKPIsViewSet(TokenAuthMixin, GeneralKPIViewSet):
    """
    View to retrieve HFAs by a health category KPIs

    Requires token authentication.

    Allowed filters:

    * `region`: country ID, example: 0
    * `country`: country ID, example: 1 (default: Global)
    * `investor`: investor ID, example: 2 (default: None). If set, response will be detailed
    * `from`: YYYY-MM format, beginning of the sample (default: 1 year ago)
    * `to`: YYYY-MM format, ending of the sample (default: last month)
    * `detailed`: if set to true, detailed donor-based data will be returned

    """
    permission_classes = (AllowAny,)
    filter_backends = [KPIFilterBackend]
    filter_fields = ('region', 'country', 'investor', 'from', 'to')
    queryset = AuditLogHFA.objects.all()

    def get_fields(self):
        return [
            dict(field_name='hfa', field_data_name='', count_dict_values=True,
                 nested_key=self.kwargs.get('category_id')),
        ]


class HFAKPIsViewSet(TokenAuthMixin, GeneralKPIViewSet):
    """
    View to retrieve HFA KPIs

    Requires token authentication.

    Allowed filters:

    * `region`: country ID, example: 0
    * `country`: country ID, example: 1 (default: Global)
    * `investor`: investor ID, example: 2 (default: None). If set, response will be detailed
    * `from`: YYYY-MM format, beginning of the sample (default: 1 year ago)
    * `to`: YYYY-MM format, ending of the sample (default: last month)
    * `detailed`: if set to true, detailed donor-based data will be returned

    """
    permission_classes = (AllowAny,)
    filter_backends = [KPIFilterBackend]
    filter_fields = ('region', 'country', 'investor', 'from', 'to')
    queryset = AuditLogHFA.objects.all()
    fields = [
        dict(field_name='hfa', field_data_name='', bool_values=True),
    ]
