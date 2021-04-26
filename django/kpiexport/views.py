from rest_framework.views import APIView
from rest_framework.response import Response
from project.models import Project
from country.models import Country, Donor
from user.models import User, UserProfile
from django.db.models import Q, F, IntegerField
from django.db.models import Count

from django.contrib.postgres.fields.jsonb import KeyTextTransform
from django.db.models.functions import Cast
from django.db.models import QuerySet
import operator
from functools import reduce
from django.shortcuts import get_object_or_404
from user.authentication import BearerTokenAuthentication
from rest_framework.permissions import IsAuthenticated
from datetime import datetime, timedelta
from core.views import Http400
from django.utils.timezone import make_aware
from core.views import TokenAuthMixin
from kpiexport.models import AuditLogUsers


class KPIFilterMixin(object):
    @staticmethod
    def _parse_date_str(date_str: str) -> datetime.date:
        date = datetime.strptime(date_str, '%Y-%m')
        return date.date()

    def get_queryset(self):
        """
        Does general filtering for all KPI APIs
        """
        country_id = self.request.query_params.get('country')
        investor_id = self.request.query_params.get('investor')
        date_from_str = self.request.query_params.get('from')
        date_to_str = self.request.query_params.get('to')

        if country_id:
            country = get_object_or_404(Country, "Country ID is invalid", pk=country_id)
            self.queryset = self.queryset.filter(country=country)
        if investor_id:
            investor = get_object_or_404(Donor, "Donor ID is invalid", pk=investor_id)
            self.queryset = self.queryset.filter(data__investor=investor)
        if date_from_str:
            date_from = self._parse_date_str(date_from_str)
        else:
            date_from = (datetime.today() - timedelta(days=365)).date()
        if date_to_str:
            date_to = self._parse_date_str(date_to_str)
            self.queryset = self.queryset.filter(date__lte=date_to)

        self.queryset = self.queryset.filter(date__gte=date_from)
        return self.queryset


class UserKPIsView(KPIFilterMixin, TokenAuthMixin, APIView):
    """
    View to retrieve user KPIs

    Requires token authentication.

    Allowed filters:

    * `country`: country ID
    * `from`: YYYY-MM format, beginning of the sample
    * `to`: YYYY-MM format, ending of the sample

    By default, results are sent from the past year
    """
    queryset = AuditLogUsers.objects.all()

    def _to_representation(self, qs: QuerySet):
        import ipdb
        ipdb.set_trace()

        # convert account type to humanly-readable strings
        account_types = {x: y for x, y in UserProfile.ACCOUNT_TYPE_CHOICES}
        account_types[None] = 'Unknown'
        data = dict()
        qs = self.get_queryset()

        data = {str(account_types[x['account_type']]): x['id__count'] for x in qs}
        return data

    def get(self, request, *args, **kwargs):
        """
        Return user KPIs.
        """
        return Response(self._to_representation(self.get_queryset()))
