from rest_framework import serializers
from rest_auth.registration.serializers import RegisterSerializer
from rest_auth.serializers import TokenSerializer, PasswordResetSerializer
from rest_auth.models import TokenModel

from project.models import Project
from .models import UserProfile, Organisation


class ProfileTokenSerializer(TokenSerializer):
    """
    Retrieves the token and userprofile of a given user after log in.
    """
    user_profile_id = serializers.SerializerMethodField()
    account_type = serializers.SerializerMethodField()

    class Meta:
        model = TokenModel
        fields = ("key", "user_profile_id", "account_type")

    @staticmethod
    def get_user_profile_id(obj):
        """
        Checks the UserProfile existence for the given key.
        """
        if hasattr(obj.user, 'userprofile'):
            return obj.user.userprofile.id

    @staticmethod
    def get_account_type(obj):
        """
        Checks the UserProfile existence for the given key.
        """
        if hasattr(obj.user, 'userprofile'):
            return obj.user.userprofile.account_type


class UserProfileSerializer(serializers.ModelSerializer):
    organisation_name = serializers.SerializerMethodField()

    class Meta:
        model = UserProfile
        fields = ("id", "name", "country", "account_type", "organisation", "user", "created", "organisation_name")

    @staticmethod
    def get_organisation_name(obj):
        return obj.organisation.name if obj.organisation else None


class UserProfileWithGroupsSerializer(serializers.ModelSerializer):
    member = serializers.SerializerMethodField()
    viewer = serializers.SerializerMethodField()
    organisation_name = serializers.SerializerMethodField()

    class Meta:
        model = UserProfile

    @staticmethod
    def get_organisation_name(obj):
        return obj.organisation.name if obj.organisation else None

    @staticmethod
    def get_member(obj):
        return Project.projects.owner_of(obj.user).values_list('id', flat=True)

    @staticmethod
    def get_viewer(obj):
        return Project.projects.viewer_of(obj.user).values_list('id', flat=True)


class OrganisationSerializer(serializers.ModelSerializer):

    class Meta:
        model = Organisation
        fields = '__all__'


class RegisterWithProfileSerializer(RegisterSerializer):

    def custom_signup(self, request, user):
        if not hasattr(user, 'userprofile'):
            account_type = request.POST.get('account_type', request.data.get('account_type', 'I'))
            UserProfile.objects.create(user=user, account_type=account_type)


class PasswordResetHTMLEmailSerializer(PasswordResetSerializer):
    """
    Serializer for requesting a password reset e-mail.
    """

    def get_email_options(self):
        """ Override this method to change default e-mail options
        """
        return {'html_email_template_name': 'registration/password_reset_html_email.html'}
