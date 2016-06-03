from rest_framework import serializers
from rest_auth.serializers import TokenSerializer
from rest_auth.models import TokenModel

from project.models import Project
from .models import UserProfile, Organisation


class ProfileTokenSerializer(TokenSerializer):
    """
    Retrieves the token and userprofile of a given user after log in.
    """
    userprofile = serializers.SerializerMethodField("is_userprofile")

    class Meta:
        model = TokenModel
        fields = ("key", "userprofile",)

    @staticmethod
    def is_userprofile(obj):
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


class UserProfileWithGroupsSerializer(serializers.ModelSerializer):
    member = serializers.SerializerMethodField()
    viewer = serializers.SerializerMethodField()
    organisation_name = serializers.SerializerMethodField()

    class Meta:
        model = UserProfile

    @staticmethod
    def get_organisation_name(obj):
        return obj.organisation.name

    @staticmethod
    def get_member(obj):
        return Project.projects.by_member(obj.user).values_list('id', flat=True)

    @staticmethod
    def get_viewer(obj):
        return Project.projects.by_viewer(obj.user).values_list('id', flat=True)


class OrganisationSerializer(serializers.ModelSerializer):

    class Meta:
        model = Organisation
        fields = ("id", "name",)
