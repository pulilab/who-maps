from rest_framework import serializers
from rest_auth.serializers import TokenSerializer
from rest_auth.models import TokenModel

from .models import UserProfile


class ProfileTokenSerializer(TokenSerializer):
    """
    Retrieves the token and userprofile of a given user after log in.
    """
    userprofile = serializers.SerializerMethodField()

    class Meta:
        model = TokenModel
        fields = ("key", "userprofile",)

    def get_userprofile(self, obj):
        """
        Retrieves the UserProfile object for the given key.
        """
        authtoken = TokenModel.objects.get(key=obj)
        userprofile = UserProfile.objects.get_object_or_none(user=authtoken.user)
        if userprofile:
            return True
        else:
            return False


class UserProfileSerializer(serializers.ModelSerializer):
    # user = serializers.Field(source='user.id')

    class Meta:
        model = UserProfile
