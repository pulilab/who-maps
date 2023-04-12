from typing import Dict

from rest_framework import serializers
from dj_rest_auth.registration.serializers import RegisterSerializer
from dj_rest_auth.serializers import PasswordResetSerializer, JWTSerializer
from rest_framework.exceptions import ValidationError
from rest_framework.fields import Field as Field
from rest_framework.authtoken.models import Token

from country.models import Country
from project.models import Project
from user.forms import PasswordHTMLEmailResetForm
from .models import UserProfile, Organisation
from django.contrib.auth.models import AnonymousUser


class ProfileJWTSerializer(JWTSerializer):
    """
    Retrieves the token and userprofile of a given user after log in.
    """
    user_profile_id = serializers.SerializerMethodField()
    account_type = serializers.SerializerMethodField()

    @staticmethod
    def get_user_profile_id(obj):
        """
        Checks the UserProfile existence for the given key.
        """
        if hasattr(obj['user'], 'userprofile'):
            return obj['user'].userprofile.id

    @staticmethod
    def get_account_type(obj):
        """
        Checks the UserProfile existence for the given key.
        """
        if hasattr(obj['user'], 'userprofile'):
            return obj['user'].userprofile.account_type


class UserProfileListSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(source='user.email', read_only=True)

    class Meta:
        model = UserProfile
        fields = ('id', 'modified', 'account_type', 'name', 'email', 'organisation')


class UserProfileSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(source='user.email', read_only=True)
    name = serializers.CharField(required=True, allow_blank=False, allow_null=False)
    user = serializers.PrimaryKeyRelatedField(read_only=True, default=serializers.CurrentUserDefault())
    country = serializers.PrimaryKeyRelatedField(queryset=Country.objects.all(), required=True,
                                                 allow_null=False)
    organisation = serializers.PrimaryKeyRelatedField(queryset=Organisation.objects.all(), required=True,
                                                      allow_null=False)
    member = serializers.SerializerMethodField()
    viewer = serializers.SerializerMethodField()
    is_superuser = serializers.SerializerMethodField()
    account_type_approved = serializers.SerializerMethodField()

    class Meta:
        model = UserProfile
        fields = '__all__'

    def get_fields(self) -> Dict[str, Field]:
        fields = super().get_fields()
        if not self.context['request']:  # pragma: no cover
            return fields

        user = self.context['request'].user

        if isinstance(user, AnonymousUser):  # pragma: no cover
            return fields

        account_type = user.userprofile.account_type
        ac_enabled = user.userprofile.account_type_approved
        country_project_approval = True if \
            user.userprofile.country and user.userprofile.country.project_approval else False
        ca = UserProfile.COUNTRY_ADMIN
        sca = UserProfile.SUPER_COUNTRY_ADMIN
        da = UserProfile.DONOR_ADMIN
        sda = UserProfile.SUPER_DONOR_ADMIN

        if account_type not in (ca, sca, da, sda) or not ac_enabled:
            fields.pop('project_updates_notification')

        if account_type not in (ca, sca) or not ac_enabled or not country_project_approval:
            fields.pop('project_approval_request_notification')

        if not user.is_superuser and (account_type not in (ca, sca, da, sda) or not ac_enabled):
            fields.pop('role_request_notification')

        return fields

    @staticmethod
    def get_member(obj):
        return Project.objects.owner_of(obj.user).values_list('id', flat=True)

    @staticmethod
    def get_viewer(obj):
        return Project.objects.viewer_of(obj.user).values_list('id', flat=True)

    @staticmethod
    def get_is_superuser(obj):
        if hasattr(obj, 'user'):
            return obj.user.is_superuser

    @staticmethod
    def get_account_type_approved(obj):
        if obj.account_type == UserProfile.DONOR and obj.donor:
            return obj in obj.donor.users.all()
        elif obj.account_type == UserProfile.DONOR_ADMIN and obj.donor:
            return obj in obj.donor.admins.all()
        elif obj.account_type == UserProfile.SUPER_DONOR_ADMIN and obj.donor:
            return obj in obj.donor.super_admins.all()
        elif obj.account_type == UserProfile.GOVERNMENT and obj.country:
            return obj in obj.country.users.all()
        elif obj.account_type == UserProfile.COUNTRY_ADMIN and obj.country:
            return obj in obj.country.admins.all()
        elif obj.account_type == UserProfile.SUPER_COUNTRY_ADMIN and obj.country:
            return obj in obj.country.super_admins.all()
        return False

    def validate(self, attrs):
        if attrs.get('account_type') in [UserProfile.DONOR, UserProfile.DONOR_ADMIN, UserProfile.SUPER_DONOR_ADMIN]:
            if not attrs.get('donor'):
                raise ValidationError({'donor': 'Donor is required'})
        return attrs


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
    password_reset_form_class = PasswordHTMLEmailResetForm


class TokenSerializer(serializers.ModelSerializer):

    class Meta:
        model = Token
        fields = '__all__'
