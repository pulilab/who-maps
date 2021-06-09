from country.models import Country
from django.shortcuts import get_object_or_404
from datetime import datetime, timedelta
from core.views import TokenAuthMixin
from kpiexport.models import AuditLogUsers, AuditLogTokens, AuditLogProjectStatus, AuditLogProjectStages
from kpiexport.serializers import AuditLogUserDetailedSerializer, AuditLogUserBasicSerializer, \
    AuditLogTokenBasicSerializer, AuditLogTokenDetailedSerializer, AuditLogProjectStatusBasicSerializer, \
    AuditLogProjectStatusDetailedSerializer, AuditLogProjectStagesBasicSerializer, \
    AuditLogProjectStagesDetailedSerializer
from rest_framework.viewsets import GenericViewSet
from rest_framework.mixins import ListModelMixin
from rest_framework import filters
from rest_framework.permissions import IsAuthenticated


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


class UserKPIsViewSet(TokenAuthMixin, ListModelMixin, GenericViewSet):
    """
    View to retrieve user KPIs

    Requires token authentication.

    Allowed filters:

    * `country`: country ID, example: 01 (default: Global)
    * `investor`: investor ID, example: 01 (default: None). If set, response will be detailed
    * `from`: YYYY-MM format, beginning of the sample (default: 1 year ago)
    * `to`: YYYY-MM format, ending of the sample (default: last month)
    * `detailed`: if set to true, detailed donor-based data will be returned

    """
    permission_classes = (IsAuthenticated,)
    filter_backends = [KPIFilterBackend]
    filter_fields = ('country', 'investor', 'from', 'to')
    queryset = AuditLogUsers.objects.all()

    def get_serializer_class(self):
        # TODO: investor filtering this can be made better, but it's currently not required
        if (self.request.query_params.get('detailed') and self.request.query_params.get('detailed') == 'true') or \
                self.request.query_params.get('investor'):

            return AuditLogUserDetailedSerializer
        else:
            return AuditLogUserBasicSerializer


class TokenKPIsViewSet(TokenAuthMixin, ListModelMixin, GenericViewSet):
    """
    View to retrieve user KPIs

    Requires token authentication.

    Allowed filters:

    * `country`: country ID, example: 01 (default: Global)
    * `investor`: investor ID, example: 01 (default: None). If set, response will be detailed
    * `from`: YYYY-MM format, beginning of the sample (default: 1 year ago)
    * `to`: YYYY-MM format, ending of the sample (default: last month)
    * `detailed`: if set to true, detailed donor-based data will be returned

    """
    permission_classes = (IsAuthenticated,)
    filter_backends = [KPIFilterBackend]
    filter_fields = ('country', 'investor', 'from', 'to')
    queryset = AuditLogTokens.objects.all()

    def get_serializer_class(self):
        # TODO: investor filtering this can be made better, but it's currently not required
        if (self.request.query_params.get('detailed') and self.request.query_params.get('detailed') == 'true') or \
                self.request.query_params.get('investor'):

            return AuditLogTokenDetailedSerializer
        else:
            return AuditLogTokenBasicSerializer


class ProjectStatusKPIsViewSet(TokenAuthMixin, ListModelMixin, GenericViewSet):
    """
    View to retrieve project status KPIs

    Requires token authentication.

    Allowed filters:

    * `country`: country ID, example: 01 (default: Global)
    * `investor`: investor ID, example: 01 (default: None). If set, response will be detailed
    * `from`: YYYY-MM format, beginning of the sample (default: 1 year ago)
    * `to`: YYYY-MM format, ending of the sample (default: last month)
    * `detailed`: if set to true, detailed donor-based data will be returned

    """
    permission_classes = (IsAuthenticated,)
    filter_backends = [KPIFilterBackend]
    filter_fields = ('country', 'investor', 'from', 'to')
    queryset = AuditLogProjectStatus.objects.all()

    def get_serializer_class(self):
        # TODO: investor filtering this can be made better, but it's currently not required
        if (self.request.query_params.get('detailed') and self.request.query_params.get('detailed') == 'true') or \
                self.request.query_params.get('investor'):

            return AuditLogProjectStatusDetailedSerializer
        else:
            return AuditLogProjectStatusBasicSerializer

class ProjectStageKPIsViewSet(TokenAuthMixin, ListModelMixin, GenericViewSet):
    """
    View to retrieve project stage KPIs

    Requires token authentication.

    Allowed filters:

    * `country`: country ID, example: 01 (default: Global)
    * `investor`: investor ID, example: 01 (default: None). If set, response will be detailed
    * `from`: YYYY-MM format, beginning of the sample (default: 1 year ago)
    * `to`: YYYY-MM format, ending of the sample (default: last month)
    * `detailed`: if set to true, detailed donor-based data will be returned

    """
    # permission_classes = (IsAuthenticated,)
    filter_backends = [KPIFilterBackend]
    filter_fields = ('country', 'investor', 'from', 'to')
    queryset = AuditLogProjectStages.objects.all()

    def get_serializer_class(self):
        # TODO: investor filtering this can be made better, but it's currently not required
        if (self.request.query_params.get('detailed') and self.request.query_params.get('detailed') == 'true') or \
                self.request.query_params.get('investor'):

            return AuditLogProjectStagesDetailedSerializer
        else:
            return AuditLogProjectStagesBasicSerializer
