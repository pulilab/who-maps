from rest_framework.decorators import action
from rest_framework.exceptions import ValidationError
from rest_framework.mixins import CreateModelMixin, RetrieveModelMixin, UpdateModelMixin, ListModelMixin
from rest_framework.request import Request
from rest_framework.viewsets import GenericViewSet, ViewSet
from rest_framework.authtoken.models import Token
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from rest_framework import status
from rest_framework_simplejwt.authentication import JWTAuthentication

from core.views import TokenAuthMixin
from .serializers import UserProfileSerializer, OrganisationSerializer, UserProfileListSerializer, TokenSerializer
from .models import UserProfile, Organisation
from django.contrib.auth.models import User

from django.utils import timezone
from drf_yasg.utils import swagger_auto_schema
from who_maps.throttle import ExternalAPIUserRateThrottle, ExternalAPIAnonRateThrottle
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from user.authentication import BearerTokenAuthentication


class UserProfileViewSet(TokenAuthMixin, RetrieveModelMixin, UpdateModelMixin, GenericViewSet):
    queryset = UserProfile.objects.all()
    serializer_class = UserProfileSerializer

    def get_object(self):
        """
        Custom function to update the user's last_login_date data
        """
        if getattr(self, "swagger_fake_view", False):  # pragma: no cover
            # object just for schema generation metadata (when there are no kwargs)
            # as per https://github.com/axnsan12/drf-yasg/issues/333#issuecomment-474883875
            return None
        if self.request.user and self.request.user.id:
            User.objects.filter(id=self.request.user.id).update(last_login=timezone.now())
        return super().get_object()

    @action(methods=['get'], detail=False)
    def me(self, request: Request) -> Response:
        if hasattr(request.user, 'userprofile'):
            profile = request.user.userprofile
            serializer = UserProfileSerializer(profile, context=dict(request=request))
            data = dict(serializer.data)

            return Response(data=data, status=status.HTTP_200_OK)
        else:
            raise ValidationError({"user_profile": "UserProfile doesn't exist"})


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
        if getattr(self, "swagger_fake_view", False):  # pragma: no cover
            # queryset just for schema generation metadata
            # as per https://github.com/axnsan12/drf-yasg/issues/333#issuecomment-474883875
            return Organisation.objects.none()

        search_term = self.request.query_params.get("name")
        if search_term:
            return Organisation.objects.filter(name__contains=search_term)
        else:
            return Organisation.objects.all()


class TokenViewSet(JWTAuthentication, ViewSet):
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


class TokenCheckView(APIView):
    """
    APIView to check if token information is valid
    """
    authentication_classes = (BearerTokenAuthentication,)
    permission_classes = (IsAuthenticated,)
    throttle_classes = [ExternalAPIUserRateThrottle, ExternalAPIAnonRateThrottle]

    @swagger_auto_schema(
        operation_id="token_validate",
        security=[{'Bearer': []}],
        responses={200: TokenSerializer, 403: "Unauthorized", 404: "Not found"}
        )
    def get(self, request, *args, **kwargs):
        token = get_object_or_404(Token, user=request.user)
        serializer = TokenSerializer(token)
        return Response(serializer.data)
