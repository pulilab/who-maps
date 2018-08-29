from collections import defaultdict

from rest_framework import serializers
from rest_framework.exceptions import ValidationError
from django.utils.dateformat import format
from django.db.transaction import atomic
from django.urls import reverse
from django.template import loader
from django.core.mail import send_mail
from django.core import management
from django.utils.translation import ugettext, override
from django.conf import settings

from user.models import UserProfile
from .models import Country, Donor, PartnerLogo, DonorPartnerLogo, CountryField, MapFile


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


class CountryImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Country
        fields = ('id', 'logo', 'cover',)


class DonorImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Donor
        fields = ('id', 'logo', 'cover',)


class UpdateAdminMixin:
    @atomic
    def update(self, instance, validated_data):
        # keep original lists for comparison
        original_users = set(instance.users.all().only('id'))
        original_admins = set(instance.admins.all().only('id'))
        original_super_admins = set(instance.super_admins.all().only('id'))

        # perform update
        instance = super().update(instance, validated_data)

        # figure out the new entities
        new_users = set(instance.users.all().only('id')) - original_users
        new_admins = set(instance.admins.all().only('id')) - original_admins
        new_super_admins = set(instance.super_admins.all().only('id')) - original_super_admins

        # remove new additions from any other user group
        # TODO: check email template wording
        if new_users:
            instance.admins.remove(*new_users)
            instance.super_admins.remove(*new_users)
            self.notify_users(new_users, instance, 'User', 'email/added_to_group.html')

        if new_admins:
            instance.users.remove(*new_admins)
            instance.super_admins.remove(*new_admins)
            self.notify_users(new_admins, instance, 'Admin', 'email/added_to_group.html')

        if new_super_admins:
            instance.users.remove(*new_super_admins)
            instance.admins.remove(*new_super_admins)
            self.notify_users(new_super_admins, instance, 'Super Admin', 'email/added_to_group.html')

        return instance

    def notify_users(self, user_profiles, instance, group, template_name):
        html_template = loader.get_template(template_name)
        # TODO: replace this for frontend URLs for Country and Donor
        change_url = reverse('admin:country_country_change', args=(instance.id,))

        email_mapping = defaultdict(list)
        for profile in user_profiles:
            email_mapping[profile.language].append(profile.user.email)

        for language, email_list in email_mapping.items():
            with override(language):
                subject = "You have been selected as {} for {}".format(group, instance.name)
                subject = ugettext(subject)
                html_message = html_template.render({'change_url': change_url,
                                                     'group': group,
                                                     'name': instance.name,
                                                     'language': language})

            send_mail(
                subject=subject,
                message="",
                from_email=settings.FROM_EMAIL,
                recipient_list=email_list,
                html_message=html_message,
                fail_silently=True)


COUNTRY_FIELDS = ("id", "name", "code", "logo", "cover", "cover_text", "footer_title", "footer_text", "partner_logos",
                  "project_approval", "map_data", "map_version", "map_files", "map_activated_on",)
READ_ONLY_COUNTRY_FIELDS = ("name", "code", "logo", "cover", "project_approval", "map_version", "map_files",
                            "map_activated_on",)
COUNTRY_ADMIN_FIELDS = ('user_requests', 'admin_requests', 'super_admin_requests',)


class SuperAdminCountrySerializer(UpdateAdminMixin, serializers.ModelSerializer):
    partner_logos = PartnerLogoSerializer(many=True, read_only=True)
    map_version = serializers.SerializerMethodField()
    user_requests = serializers.SerializerMethodField()
    admin_requests = serializers.SerializerMethodField()
    super_admin_requests = serializers.SerializerMethodField()

    class Meta:
        model = Country
        fields = COUNTRY_FIELDS + COUNTRY_ADMIN_FIELDS + ('users', 'admins', 'super_admins',)
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


class AdminCountrySerializer(SuperAdminCountrySerializer):
    class Meta(SuperAdminCountrySerializer.Meta):
        fields = COUNTRY_FIELDS + COUNTRY_ADMIN_FIELDS + ('users', 'admins',)


class CountrySerializer(SuperAdminCountrySerializer):
    class Meta(SuperAdminCountrySerializer.Meta):
        fields = COUNTRY_FIELDS
        read_only_fields = READ_ONLY_COUNTRY_FIELDS


DONOR_FIELDS = ("id", "name", "logo", "cover", "cover_text", "footer_title", "footer_text", "partner_logos",)
READ_ONLY_DONOR_FIELDS = ("logo", "cover", "name",)
DONOR_ADMIN_FIELDS = ('user_requests', 'admin_requests', 'super_admin_requests',)


class SuperAdminDonorSerializer(UpdateAdminMixin, serializers.ModelSerializer):
    partner_logos = DonorPartnerLogoSerializer(many=True, read_only=True)
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


class AdminDonorSerializer(SuperAdminDonorSerializer):
    class Meta(SuperAdminDonorSerializer.Meta):
        fields = DONOR_FIELDS + DONOR_ADMIN_FIELDS + ('users', 'admins',)


class DonorSerializer(SuperAdminDonorSerializer):
    class Meta(SuperAdminDonorSerializer.Meta):
        fields = DONOR_FIELDS
        read_only_fields = READ_ONLY_DONOR_FIELDS


class CountryFieldsListSerializer(serializers.ModelSerializer):
    class Meta:
        model = CountryField
        fields = ("id", "country", "type", "question", "required", "options")


class CountryFieldsSerializer(serializers.ModelSerializer):
    class Meta:
        model = CountryField
        fields = ("country", "type", "question", "options", "answer", "project")

    def validate(self, attrs):
        if "project" not in attrs:
            raise ValidationError("Project ID needs to be specified")
        schema = CountryField.get_schema_for_answer(country=attrs["country"], question=attrs["question"])
        if not schema:
            raise ValidationError("No schema found for this answer")
        else:
            if schema.required and self.context['request'].parser_context['kwargs']['mode'] == 'publish' \
                    and not attrs.get("answer"):
                raise ValidationError("Answer is required for: {}".format(attrs["question"]))

        return attrs

    @staticmethod
    def validate_project(value):
        if not value:
            raise ValidationError("Project ID needs to be specified")
        return value


class CountryFieldsWriteSerializer(serializers.Serializer):
    fields = CountryFieldsSerializer(many=True, required=True, allow_null=False)

    def create(self, validated_data):
        draft_mode = self.context['request'].parser_context['kwargs']['mode'] == 'draft'
        return [
            CountryField.objects.update_or_create(
                defaults={"answer": field.get("answer", ""), "draft": field.get("answer", "")} if not draft_mode else {
                    "draft": field.get("answer", "")},
                **{
                    "country": field["country"],
                    "project": field["project"],
                    "question": field["question"],
                    "type": field["type"],
                    "schema": False,
                    "schema_instance": CountryField.get_schema_for_answer(country=field["country"],
                                                                          question=field["question"])
                }
            )[0] for field in validated_data['fields']
        ]

    def to_representation(self, instances):
        draft_mode = self.context['request'].parser_context['kwargs']['mode'] == 'draft'
        return {"fields": [instance.to_representation(draft_mode) for instance in instances]}

    def validate_fields(self, value):
        country_id = self.context['request'].parser_context['kwargs']['country_id']
        draft_mode = self.context['request'].parser_context['kwargs']['mode'] == 'draft'

        schema = CountryField.objects.get_schema(country_id)

        if draft_mode:
            return value
        else:
            for field in schema:
                if field.required and not len(list(filter(lambda a, f=field: a['question'] == f.question, value))):
                    raise ValidationError("All required answers need to be given")
            return value
