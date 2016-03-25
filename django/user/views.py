from rest_framework import status
from rest_framework.viewsets import ModelViewSet
from rest_framework.response import Response
from rest_auth.models import TokenModel
from rest_framework_expiring_authtoken.views import ObtainExpiringAuthToken

from core.views import TokenAuthMixin
from .serializers import UserProfileSerializer
from .models import UserProfile


class UserProfileViewSet(TokenAuthMixin, ModelViewSet):

    queryset = UserProfile.objects.all()
    serializer_class = UserProfileSerializer

    def get_queryset(self):
        """
        Retrieves UserProfile objects, filtered by current user id.
        """
        # On list requests, retrieve only the current user's profile.
        return UserProfile.objects.filter(user=self.request.user.id)

    def create(self, request):
        """
        Creates a new UserProfile object for the current User.
        """
        serializer = self.get_serializer(data=request.data)
        # Add the current user's ID to the data.
        serializer.initial_data.update({"user": request.user.id})
        if serializer.is_valid():
            # Save the entity.
            user = serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ExpiringAuthTokenWithUserProfile(ObtainExpiringAuthToken):

    def post(self, request):
        """
        Decorate the login/token retrieval response with userprofile information.
        """
        response = super(ExpiringAuthTokenWithUserProfile, self).post(request)
        if hasattr(response, "data") and "token" in response.data.keys():
            authtoken = TokenModel.objects.get(key=response.data.get("token"))
            userprofile = UserProfile.objects.get_object_or_none(user=authtoken.user)
            response.data.update(userprofile=True if userprofile else False)
        return response
