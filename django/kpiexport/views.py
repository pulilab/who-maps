from country.models import Country
from django.shortcuts import get_object_or_404
from datetime import datetime, timedelta
from core.views import TokenAuthMixin
from kpiexport.models import AuditLogUsers
from kpiexport.serializers import AuditLogUserSerializer
from rest_framework.viewsets import GenericViewSet
from rest_framework.mixins import ListModelMixin
from rest_framework import filters


class KPIFilterBackend(filters.BaseFilterBackend):
    @staticmethod
    def _parse_date_str(date_str: str) -> datetime.date:
        date = datetime.strptime(date_str, '%Y-%m')
        return date.date()

    def filter_queryset(self, request, queryset, view):
        """
        Does general filtering for all KPI APIs
        """
        country_id = request.query_params.get('country')
        investor_id = request.query_params.get('investor')
        date_from_str = request.query_params.get('from')
        date_to_str = request.query_params.get('to')

        if country_id:
            country = get_object_or_404(Country, pk=int(country_id))
            queryset = queryset.filter(country=country)
        else:  # Filter for 'global' country
            country = get_object_or_404(Country, name='Global')
            queryset = queryset.filter(country=country)
        if investor_id:
            queryset = queryset.filter(data__has_key=investor_id)
        if date_from_str:
            date_from = self._parse_date_str(date_from_str)
        else:
            date_from = (datetime.today() - timedelta(days=365)).date()
        if date_to_str:
            date_to = self._parse_date_str(date_to_str)
            queryset = queryset.filter(date__lte=date_to)

        queryset = queryset.filter(date__gte=date_from)
        return queryset


class UserKPIsViewSet(TokenAuthMixin, ListModelMixin, GenericViewSet):
    """
    View to retrieve user KPIs

    Requires token authentication.

    Allowed filters:

    * `country`: country ID
    * `from`: YYYY-MM format, beginning of the sample
    * `to`: YYYY-MM format, ending of the sample

    By default, results are sent from the past year
    """
    serializer_class = AuditLogUserSerializer
    filter_backends = [KPIFilterBackend]
    filter_fields = ('country', 'investor', 'from', 'to')
    queryset = AuditLogUsers.objects.all()
