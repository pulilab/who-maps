from django.conf import settings
from django.contrib.auth.models import User
from django.contrib.sites.shortcuts import get_current_site
from rest_framework import status
from rest_framework.mixins import CreateModelMixin, RetrieveModelMixin, UpdateModelMixin, ListModelMixin
from rest_framework.response import Response
from rest_framework.viewsets import GenericViewSet, ViewSet

from core.views import TokenAuthMixin
from country.models import Country
from .serializers import UserProfileSerializer, OrganisationSerializer, UserProfileListSerializer
from .models import UserProfile, Organisation


class UserProfileViewSet(TokenAuthMixin, RetrieveModelMixin, UpdateModelMixin, GenericViewSet):
    queryset = UserProfile.objects.all()
    serializer_class = UserProfileSerializer


class UserProfileListViewSet(TokenAuthMixin, ListModelMixin, GenericViewSet):
    queryset = UserProfile.objects.select_related('user', 'organisation').only('id', 'modified', 'account_type',
                                                                               'name', 'user__email', 'organisation')
    serializer_class = UserProfileListSerializer


class OrganisationViewSet(TokenAuthMixin, CreateModelMixin, ListModelMixin, RetrieveModelMixin, GenericViewSet):
    queryset = Organisation.objects.all()
    serializer_class = OrganisationSerializer

    def get_queryset(self):
        """
        Retrieves Organisation objects, filtered by search term if present,
        for autocomplete of organisation fields.
        """
        search_term = self.request.query_params.get("name")
        if search_term:
            return Organisation.objects.filter(name__contains=search_term)
        else:
            return Organisation.objects.all()


class CypressTestViewSet(ViewSet):

    def create_test_data_for_cypress(self, request):
        site = get_current_site(request)
        protocol = 'https' if not settings.DEBUG else 'http'
        domain = 'localhost:3000' if site.id == 1 else 'localhost'

        user_pass = 'puli1234'
        country, _ = Country.objects.get_or_create(code='HU', name='Hungary')
        org, _ = Organisation.objects.get_or_create(name='Cypress Org')
        test_user, _ = User.objects.get_or_create(
            first_name='Cypress',
            last_name='User',
            email='cypress_user@example.com',
            username='test_cypress_normal_user',
        )
        test_user.set_password(user_pass)
        test_user.save()

        profile, _ = UserProfile.objects.get_or_create(
            name='Cypress User',
            user=test_user,
            country=country,
            organisation=org,
            project_updates_notification=False,
            daily_toolkit_digest_notification=False,
            project_approval_request_notification=False,
            role_request_notification=False,
        )
        data = {
            'url': f'{protocol}://{domain}/',
            'test_user': test_user.email,
            'org': org.name,
            'country': country.name,
        }
        return Response(status=status.HTTP_200_OK, data=data)
