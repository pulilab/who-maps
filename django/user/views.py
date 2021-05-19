from rest_framework.mixins import CreateModelMixin, RetrieveModelMixin, UpdateModelMixin, ListModelMixin
from rest_framework.viewsets import GenericViewSet

from core.views import TokenAuthMixin
from .serializers import UserProfileSerializer, OrganisationSerializer, UserProfileListSerializer
from .models import UserProfile, Organisation
from django.contrib.auth.models import User

from django.utils import timezone


class UserProfileViewSet(TokenAuthMixin, RetrieveModelMixin, UpdateModelMixin, GenericViewSet):
    queryset = UserProfile.objects.all()
    serializer_class = UserProfileSerializer

    def get_object(self):
        """
        Custom function to update the user's last_login_date data
        """
        if self.request.user and self.request.user.id:
            User.objects.filter(id=self.request.user.id).update(last_login=timezone.now())
        return super().get_object()


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
