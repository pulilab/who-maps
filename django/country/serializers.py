from django.conf import settings
from django.core import management
from django.utils.dateformat import format
from django.utils.translation import gettext
from django.db.transaction import atomic
from rest_framework import serializers
from rest_framework.exceptions import ValidationError
from taggit.serializers import (TagListSerializerField,
                                TaggitSerializer)
from core.utils import send_mail_wrapper

from user.models import UserProfile
from .models import Country, Donor, PartnerLogo, DonorPartnerLogo, MapFile, \
    DonorCustomQuestion, CountryCustomQuestion, CustomQuestion, ReferenceDocument


class OptionsValidatorMixin:
    def validate_options_for_choice_fields(self, value):
        if not len(value) > 0:
            raise ValidationError({'options': 'Ensure options field has at least 1 elements.'})

    def validate(self, attrs):
        if attrs.get('type', CustomQuestion.TEXT) in (CustomQuestion.SINGLE, CustomQuestion.MULTI):
            self.validate_options_for_choice_fields(attrs.get('options', ''))
        return attrs


class CountryCustomQuestionSerializer(OptionsValidatorMixin, serializers.ModelSerializer):
    class Meta:
        model = CountryCustomQuestion
        fields = "__all__"


class DonorCustomQuestionSerializer(OptionsValidatorMixin, serializers.ModelSerializer):
    class Meta:
        model = DonorCustomQuestion
        fields = "__all__"


class PartnerLogoSerializer(serializers.ModelSerializer):
    class Meta:
        model = PartnerLogo
        fields = ("id", "country", "image", "image_url",)
        read_only_fields = ("image_url",)


class DonorPartnerLogoSerializer(serializers.ModelSerializer):
    class Meta:
        model = DonorPartnerLogo
        fields = ("id", "donor", "image", "image_url",)
        read_only_fields = ("image_url",)


class UserProfileSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(source='user.email')

    class Meta:
        model = UserProfile
        fields = ('id', 'email', 'name')


class MapFileSerializer(serializers.ModelSerializer):
    class Meta:
        model = MapFile
        fields = ('id', 'country', 'map_file',)


class AtomicUpdate:
    @atomic
    def update(self, instance, validated_data):
        # Select for update to avoid race conditions caused by partial update
        # https://github.com/encode/django-rest-framework/issues/4675
        instance = self.Meta.model.objects.select_for_update().get(pk=instance.id)
        # perform update
        return super().update(instance, validated_data)


class CountryImageSerializer(AtomicUpdate, serializers.ModelSerializer):
    class Meta:
        model = Country
        fields = ('id', 'logo', 'logo_url', 'cover', 'cover_url')
        read_only_fields = ('logo_url', "cover_url")


class DonorImageSerializer(AtomicUpdate, serializers.ModelSerializer):
    class Meta:
        model = Donor
        fields = ('id', 'logo', 'logo_url', 'cover', 'cover_url')
        read_only_fields = ('logo_url', "cover_url")


class UpdateAdminMixin:
    @atomic
    def update(self, instance, validated_data):
        # keep original lists for comparison
        original_users = set(instance.users.all().only('id'))
        original_admins = set(instance.admins.all().only('id'))
        original_super_admins = set(instance.super_admins.all().only('id'))

        # Select for update to avoid race conditions caused by partial update
        # https://github.com/encode/django-rest-framework/issues/4675
        instance = self.Meta.model.objects.select_for_update().get(pk=instance.id)
        # perform update
        instance = super().update(instance, validated_data)

        # figure out the new entities
        new_users = set(instance.users.all().only('id')) - original_users
        new_admins = set(instance.admins.all().only('id')) - original_admins
        new_super_admins = set(instance.super_admins.all().only('id')) - original_super_admins

        # remove new additions from any other user group
        if new_users:
            instance.admins.remove(*new_users)
            instance.super_admins.remove(*new_users)
            self.notify_users(new_users, instance, gettext('Viewer'))

        if new_admins:
            instance.users.remove(*new_admins)
            instance.super_admins.remove(*new_admins)
            self.notify_users(new_admins, instance, gettext('Admin'))

        if new_super_admins:
            instance.users.remove(*new_super_admins)
            instance.admins.remove(*new_super_admins)
            self.notify_users(new_super_admins, instance, gettext('System Admin'))

        return instance

    def notify_users(self, user_profiles, instance, group):
        for profile in user_profiles:
            subject = "Notification: You have been selected as {} for {}".format(group, instance.name)
            model_name = self.Meta.model.__name__.lower()
            context = {
                'group': group,
                'full_name': profile.name,
                '{}_name'.format(model_name): instance.name
            }
            send_mail_wrapper(subject=subject,
                              email_type='{}_admin'.format(model_name),
                              to=profile.user.email,
                              language=profile.language,
                              context=context)


GDHI_FIELDS = ("total_population", "gni_per_capita", "life_expectancy", "health_expenditure",
               "leadership_and_governance", "strategy_and_investment", "legislation_policy_compliance", "workforce",
               "standards_and_interoperability", "infrastructure", "services_and_applications")

ENABLE_WIDGET_FIELDS = ("gdhi_enabled", "road_map_enabled")

COUNTRY_FIELDS = ("id", "name", "code", "logo", "logo_url", "cover", "cover_url", "cover_text", "footer_title",
                  "footer_text", "partner_logos", "project_approval", "map_data", "map_version", "map_files",
                  "map_activated_on", "country_questions", "lat", "lon", "alpha_3_code", "documents", "is_global")
READ_ONLY_COUNTRY_FIELDS = ("name", "code", "logo", "logo_url", "cover", "cover_url", "map_version", "map_files",
                            "map_activated_on", "country_questions", "lat", "lon", "alpha_3_code",
                            "documents", "is_global")
COUNTRY_ADMIN_FIELDS = ('user_requests', 'admin_requests', 'super_admin_requests',)
READ_ONLY_COUNTRY_ADMIN_FIELDS = ("cover_text", "footer_title", "footer_text", "partner_logos", "project_approval",)


class ReferenceDocumentSerializer(TaggitSerializer, serializers.ModelSerializer):
    document = serializers.FileField(use_url=False)
    size = serializers.SerializerMethodField()
    tags = TagListSerializerField()
    author = UserProfileSerializer(many=False, read_only=True)

    class Meta:
        model = ReferenceDocument
        fields = '__all__'

    @staticmethod
    def get_size(obj):
        return obj.document.size if obj.document else None

    @staticmethod
    def validate_document(value):
        if value.size > settings.MAX_ROAD_MAP_DOCUMENT_UPLOAD_SIZE:
            max_size_in_mb = round(settings.MAX_ROAD_MAP_DOCUMENT_UPLOAD_SIZE / 1024 / 1024)
            raise ValidationError(f'The file exceeds the maximum allowed size: {max_size_in_mb} MB.')

        if not value.name.lower().endswith(settings.VALID_ROAD_MAP_DOCUMENT_FILE_TYPES):
            msg = ", ".join(settings.VALID_ROAD_MAP_DOCUMENT_FILE_TYPES)
            raise ValidationError(f'Invalid file type. Allowed formats: {msg}')
        return value


class SuperAdminCountrySerializer(UpdateAdminMixin, serializers.ModelSerializer):
    partner_logos = PartnerLogoSerializer(many=True, read_only=True)
    documents = serializers.SerializerMethodField()
    country_questions = serializers.SerializerMethodField()
    map_version = serializers.SerializerMethodField()
    map_files = MapFileSerializer(many=True, read_only=True)
    user_requests = serializers.SerializerMethodField()
    admin_requests = serializers.SerializerMethodField()
    super_admin_requests = serializers.SerializerMethodField()

    class Meta:
        model = Country
        fields = COUNTRY_FIELDS + COUNTRY_ADMIN_FIELDS + ('users', 'admins', 'super_admins',) + ENABLE_WIDGET_FIELDS
        read_only_fields = READ_ONLY_COUNTRY_FIELDS + COUNTRY_ADMIN_FIELDS

    def update(self, instance, validated_data):
        map_changed = 'map_data' in validated_data and instance.map_data != validated_data['map_data']
        instance = super().update(instance, validated_data)
        if map_changed:
            management.call_command('clean_maps', instance.code)
        return instance

    def get_map_version(self, obj):
        if obj.map_activated_on:
            return format(obj.map_activated_on, 'U')
        return 0

    def get_user_requests(self, obj):
        # figure out not yet assigned users
        data = UserProfile.objects.filter(country_id=obj.id, account_type=UserProfile.GOVERNMENT) \
            .difference(obj.users.all())
        return UserProfileSerializer(data, many=True).data

    def get_admin_requests(self, obj):
        # figure out not yet assigned users
        data = UserProfile.objects.filter(country_id=obj.id, account_type=UserProfile.COUNTRY_ADMIN) \
            .difference(obj.admins.all())
        return UserProfileSerializer(data, many=True).data

    def get_super_admin_requests(self, obj):
        # figure out not yet assigned users
        data = UserProfile.objects.filter(country_id=obj.id, account_type=UserProfile.SUPER_COUNTRY_ADMIN) \
            .difference(obj.super_admins.all())
        return UserProfileSerializer(data, many=True).data

    def get_country_questions(self, obj):
        queryset = CountryCustomQuestion.objects.filter(country_id=obj.id)
        return CountryCustomQuestionSerializer(queryset, many=True, read_only=True).data

    @staticmethod
    def get_documents(obj):
        queryset = ReferenceDocument.objects.filter(country_id=obj.id)
        return ReferenceDocumentSerializer(queryset, many=True, read_only=True).data


class AdminCountrySerializer(SuperAdminCountrySerializer):
    class Meta(SuperAdminCountrySerializer.Meta):
        fields = COUNTRY_FIELDS + COUNTRY_ADMIN_FIELDS + ('users', 'admins', 'super_admins',) + ENABLE_WIDGET_FIELDS
        read_only_fields = READ_ONLY_COUNTRY_ADMIN_FIELDS + READ_ONLY_COUNTRY_FIELDS + COUNTRY_ADMIN_FIELDS \
            + ('super_admins',) + ENABLE_WIDGET_FIELDS


class CountrySerializer(SuperAdminCountrySerializer):
    class Meta(SuperAdminCountrySerializer.Meta):
        fields = COUNTRY_FIELDS + ENABLE_WIDGET_FIELDS
        read_only_fields = READ_ONLY_COUNTRY_FIELDS + ENABLE_WIDGET_FIELDS


class CountryLandingSerializer(SuperAdminCountrySerializer):
    class Meta(SuperAdminCountrySerializer.Meta):
        fields = COUNTRY_FIELDS + GDHI_FIELDS + ENABLE_WIDGET_FIELDS
        read_only_fields = READ_ONLY_COUNTRY_FIELDS + GDHI_FIELDS + ENABLE_WIDGET_FIELDS


class CountryListSerializer(serializers.ModelSerializer):
    class Meta:
        model = Country
        fields = ('id', 'name', 'code', 'lat', 'lon', 'is_global')


DONOR_FIELDS = ("id", "name", "code", "logo", "logo_url", "cover", "cover_url", "cover_text", "footer_title",
                "footer_text", "partner_logos", "donor_questions")
READ_ONLY_DONOR_FIELDS = ("logo_url", "cover_url", "logo", "cover", "name", "code", "donor_questions")
DONOR_ADMIN_FIELDS = ('user_requests', 'admin_requests', 'super_admin_requests',)
READ_ONLY_DONOR_ADMIN_FIELDS = ("cover_text", "footer_title", "footer_text", "partner_logos",)


class SuperAdminDonorSerializer(UpdateAdminMixin, serializers.ModelSerializer):
    partner_logos = DonorPartnerLogoSerializer(many=True, read_only=True)
    donor_questions = serializers.SerializerMethodField()
    user_requests = serializers.SerializerMethodField()
    admin_requests = serializers.SerializerMethodField()
    super_admin_requests = serializers.SerializerMethodField()

    class Meta:
        model = Donor
        fields = DONOR_FIELDS + DONOR_ADMIN_FIELDS + ('users', 'admins', 'super_admins',)
        read_only_fields = READ_ONLY_DONOR_FIELDS + DONOR_ADMIN_FIELDS

    def get_user_requests(self, obj):
        # figure out not yet assigned users
        data = UserProfile.objects.filter(donor_id=obj.id, account_type=UserProfile.DONOR) \
            .difference(obj.users.all())
        return UserProfileSerializer(data, many=True).data

    def get_admin_requests(self, obj):
        # figure out not yet assigned users
        data = UserProfile.objects.filter(donor_id=obj.id, account_type=UserProfile.DONOR_ADMIN) \
            .difference(obj.admins.all())
        return UserProfileSerializer(data, many=True).data

    def get_super_admin_requests(self, obj):
        # figure out not yet assigned users
        data = UserProfile.objects.filter(donor_id=obj.id, account_type=UserProfile.SUPER_DONOR_ADMIN) \
            .difference(obj.super_admins.all())
        return UserProfileSerializer(data, many=True).data

    def get_donor_questions(self, obj):
        queryset = DonorCustomQuestion.objects.filter(donor_id=obj.id)
        return DonorCustomQuestionSerializer(queryset, many=True, read_only=True).data


class AdminDonorSerializer(SuperAdminDonorSerializer):
    class Meta(SuperAdminDonorSerializer.Meta):
        fields = DONOR_FIELDS + DONOR_ADMIN_FIELDS + ('users', 'admins', 'super_admins',)
        read_only_fields = READ_ONLY_DONOR_ADMIN_FIELDS + READ_ONLY_DONOR_FIELDS + DONOR_ADMIN_FIELDS \
            + ('super_admins',)


class DonorSerializer(SuperAdminDonorSerializer):
    class Meta(SuperAdminDonorSerializer.Meta):
        fields = DONOR_FIELDS
        read_only_fields = READ_ONLY_DONOR_FIELDS


class DonorListSerializer(serializers.ModelSerializer):
    class Meta:
        model = Donor
        fields = ('id', 'name', 'code')
