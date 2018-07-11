from rest_framework.mixins import CreateModelMixin, RetrieveModelMixin, UpdateModelMixin, ListModelMixin
from rest_framework.viewsets import GenericViewSet
from rest_framework.response import Response
from rest_auth.models import TokenModel
from drf_expiring_tokens.views import ObtainExpiringAuthToken

from core.views import TokenAuthMixin
from .serializers import UserProfileSerializer, OrganisationSerializer, UserProfileWithGroupsSerializer
from .models import UserProfile, Organisation


class UserProfileViewSet(TokenAuthMixin, ListModelMixin, RetrieveModelMixin, UpdateModelMixin, GenericViewSet):

    queryset = UserProfile.objects.all()
    serializer_class = UserProfileSerializer

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = UserProfileWithGroupsSerializer(instance)
        return Response(serializer.data)

    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data)
        if not serializer.initial_data.get('user'):
            serializer.initial_data.update({"user": request.user.id})
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)


class ExpiringAuthTokenWithUserProfile(ObtainExpiringAuthToken):
    def post(self, request):
        """
        Decorate the login/token retrieval response with userprofile information.
        """
        response = super(ExpiringAuthTokenWithUserProfile, self).post(request)
        if hasattr(response, "data") and "token" in response.data.keys():
            authtoken = TokenModel.objects.get(key=response.data.get("token"))
            user_profile = UserProfile.objects.get_object_or_none(user=authtoken.user)
            response.data.update(user_profile_id=user_profile.id if user_profile else None)
            response.data.update(account_type=user_profile.account_type if user_profile else None)
            response.data.update(is_superuser=user_profile.user.is_superuser)
        return response


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
