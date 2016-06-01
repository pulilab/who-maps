from rest_framework import serializers
from rest_auth.serializers import TokenSerializer
from rest_auth.models import TokenModel

from .models import UserProfile, Organisation


class ProfileTokenSerializer(TokenSerializer):
    """
    Retrieves the token and userprofile of a given user after log in.
    """
    userprofile = serializers.SerializerMethodField("is_userprofile")

    class Meta:
        model = TokenModel
        fields = ("key", "userprofile",)

    def is_userprofile(self, obj):
        """
        Checks the UserProfile existence for the given key.
        """
        authtoken = TokenModel.objects.get(key=obj)
        userprofile = UserProfile.objects.get_object_or_none(user=authtoken.user)
        if userprofile:
            return True
        else:
            return False


class UserProfileSerializer(serializers.ModelSerializer):

    class Meta:
        model = UserProfile


class OrganisationSerializer(serializers.ModelSerializer):

    class Meta:
        model = Organisation
        fields = ("id", "name",)
