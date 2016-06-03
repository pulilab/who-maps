from rest_framework import status
from rest_framework.mixins import CreateModelMixin, RetrieveModelMixin, UpdateModelMixin
from rest_framework.viewsets import ModelViewSet, GenericViewSet
from rest_framework.response import Response
from rest_auth.models import TokenModel
from rest_framework_expiring_authtoken.views import ObtainExpiringAuthToken

from core.views import TokenAuthMixin
from .serializers import UserProfileSerializer, OrganisationSerializer, UserProfileWithGroupsSerializer
from .models import UserProfile, Organisation


class UserProfileViewSet(TokenAuthMixin, CreateModelMixin, RetrieveModelMixin, UpdateModelMixin, GenericViewSet):

    queryset = UserProfile.objects.all()
    serializer_class = UserProfileSerializer

    def create(self, request, *args, **kwargs):
        """
        Creates a new UserProfile object for the current User.
        """
        # If user already has a profile, don't do anything
        if hasattr(request.user, 'userprofile'):
            return Response(status=status.HTTP_200_OK)

        serializer = self.get_serializer(data=request.data)
        # Add the current user's ID to the data.
        serializer.initial_data.update({"user": request.user.id})
        if serializer.is_valid():
            # Save the entity.
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = UserProfileWithGroupsSerializer(instance)
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
        return response


class OrganisationViewSet(TokenAuthMixin, ModelViewSet):
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
