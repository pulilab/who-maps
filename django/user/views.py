from rest_framework.mixins import CreateModelMixin, RetrieveModelMixin, UpdateModelMixin, ListModelMixin
from rest_framework.viewsets import GenericViewSet, ViewSet
from rest_framework.authtoken.models import Token
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from rest_framework import status

from core.views import TokenAuthMixin
from .serializers import UserProfileSerializer, OrganisationSerializer, UserProfileListSerializer, TokenSerializer
from .models import UserProfile, Organisation
from django.contrib.auth.models import User

from django.utils import timezone
from drf_yasg.utils import swagger_auto_schema
from rest_framework_jwt.authentication import JSONWebTokenAuthentication


class UserProfileViewSet(TokenAuthMixin, RetrieveModelMixin, UpdateModelMixin, GenericViewSet):
    queryset = UserProfile.objects.all()
    serializer_class = UserProfileSerializer

    def get_object(self):
        """
        Custom function to update the user's last_login_date data
        """
        if getattr(self, "swagger_fake_view", False):
            # object just for schema generation metadata (when there are no kwargs)
            # as per https://github.com/axnsan12/drf-yasg/issues/333#issuecomment-474883875
            return None
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
        if getattr(self, "swagger_fake_view", False):
            # queryset just for schema generation metadata
            # as per https://github.com/axnsan12/drf-yasg/issues/333#issuecomment-474883875
            return Organisation.objects.none()

        search_term = self.request.query_params.get("name")
        if search_term:
            return Organisation.objects.filter(name__contains=search_term)
        else:
            return Organisation.objects.all()


class TokenViewSet(JSONWebTokenAuthentication, ViewSet):
    """
    Viewset providing functions for authenticated users for creating, retrieving, refreshing and deleting their tokens

    For this menu, both Basic and Token-based authorization works.
    """
    queryset = Token.objects.all()
    serializer_class = TokenSerializer

    @swagger_auto_schema(
        operation_id="token_create",
        security=[{'Token': []}],
        responses={201: TokenSerializer, 200: TokenSerializer}
        )
    def create(self, request, *args, **kwargs):
        """
        Creates a new token for the user (if not existing) and retrieves it
        """
        token, created = Token.objects.get_or_create(user=request.user)
        serializer = TokenSerializer(token)
        return Response(serializer.data, status=status.HTTP_201_CREATED if created else status.HTTP_200_OK)

    @swagger_auto_schema(
        operation_id="token_refresh",
        security=[{'Token': []}],
        responses={201: TokenSerializer}
        )
    def refresh(self, request, *args, **kwargs):
        """
        Deletes existing token and creates a new one
        """
        token = get_object_or_404(Token, user=request.user)
        token.delete()
        new_token = Token.objects.create(user=request.user)
        serializer = TokenSerializer(new_token)
        return Response(serializer.data)

    @swagger_auto_schema(
        operation_id="token_get",
        security=[{'Token': []}],
        responses={200: TokenSerializer}
        )
    def get(self, request, *args, **kwargs):
        """
        Retrieves token associated with request user
        """
        token = get_object_or_404(Token, user=request.user)
        serializer = TokenSerializer(token)
        return Response(serializer.data)

    @swagger_auto_schema(
        operation_id="token_delete",
        security=[{'Token': []}],
        responses={204: []}
        )
    def delete(self, request, *args, **kwargs):
        """
        Deletes token associated with user
        """
        instance = get_object_or_404(Token, user=request.user)
        instance.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
