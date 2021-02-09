from rest_framework.views import APIView
from rest_framework.response import Response
from project.models import Project
from country.models import Country
from user.models import User, UserProfile
from django.db.models import Q, F, IntegerField
from django.db.models import Count

from django.contrib.postgres.fields.jsonb import KeyTextTransform
from django.db.models.functions import Cast
from django.db.models import QuerySet
import operator
from functools import reduce
from django.shortcuts import get_object_or_404
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated
from datetime import datetime
from core.views import Http400
from django.utils.timezone import make_aware


class ApiAuthMixin(object):
    """
    Mixin class for defining permission and authentication settings on API views.
    """
    authentication_classes = (TokenAuthentication,)
    permission_classes = (IsAuthenticated,)


class ProjectKPIsView(ApiAuthMixin, APIView):
    """
    View to retrieve project KPIs

    Requires token authentication.

    Allowed filters:

    * `countryCode`: country code (for example: UK)
    * `modified`: modified date (for example: 2020-10-31
    """
    queryset = Project.objects \
        .annotate(published_country_id=Cast(KeyTextTransform('country', 'data'), output_field=IntegerField())) \
        .annotate(draft_country_id=Cast(KeyTextTransform('country', 'draft'), output_field=IntegerField()))

    obsolete_project_markers = {
        'test',
        'demo',
        'delete'
    }

    def get_queryset(self):
        """
        Retrieves Project objects, filtered by filter term(s) if present,
        for generating the response.
        """
        country_code = self.request.query_params.get('countryCode')
        date_str = self.request.query_params.get('modified')

        qs = self.queryset

        if country_code:
            country = get_object_or_404(Country.objects.all(), code=country_code)
            qs = qs.filter(Q(draft_country_id=country.pk) | Q(published_country_id=country.pk))

        if date_str:
            try:
                date = make_aware(datetime.strptime(date_str, "%Y-%m-%d"))
            except ValueError:  # pragma: no cover
                raise Http400("modified date needs to be in this format: YYYY-MM-DD")
            qs = qs.filter(modified__gte=date)

        return qs

    def _to_representation(self, qs: QuerySet):
        data = dict()
        data['total'] = qs.count()
        data['draft'] = qs.draft_only().count()
        data['published'] = data['total'] - data['draft']

        # name must be unique and data filled in order to be publishable
        data['publishable'] = qs.draft_only().filter(data__isnull=False).distinct('name').count()
        data['deletable'] = qs.filter(
            reduce(operator.or_, (Q(name__contains=x) for x in self.obsolete_project_markers))).count()
        data['duplicates'] = qs.values('name', 'id').annotate(Count('name')).order_by(). \
            filter(name__count__gt=1).count()
        return data

    def get(self, request, *args, **kwargs):
        """
        Return user KPIs.
        """
        return Response(self._to_representation(self.get_queryset()))


class UserKPIsView(ApiAuthMixin, APIView):
    """
    View to retrieve user KPIs

    Requires token authentication.

    Allowed filters:

    * `countryCode`: country code (for example: UK)
    * `lastLogin`: filter for users who logged in after this date (for example:
    """
    queryset = User.objects.filter(userprofile__isnull=False)

    def get_queryset(self):
        """
        Retrieves User objects, filtered by filter term(s) if present,
        for generating the response.
        """
        country_code = self.request.query_params.get('countryCode')
        date_str = self.request.query_params.get('lastLogin')

        qs = self.queryset

        if country_code:
            country = get_object_or_404(Country.objects.all(), code=country_code)
            qs = qs.filter(userprofile__country=country)

        if date_str:
            try:
                date = make_aware(datetime.strptime(date_str, "%Y-%m-%d"))
            except ValueError:  # pragma: no cover
                raise Http400("Modified date needs to be in this format: YYYY-MM-DD")
            qs = qs.filter(last_login__gte=date)
        qs = qs.annotate(account_type=F('userprofile__account_type')). \
            values('account_type').annotate(Count("id")).order_by()
        return qs

    def _to_representation(self, qs: QuerySet):
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
