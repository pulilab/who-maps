from rest_framework import serializers
from rest_framework.exceptions import ValidationError
from django.utils.dateformat import format
from django.db.transaction import atomic

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


class CountrySerializer(serializers.ModelSerializer):
    partner_logos = PartnerLogoSerializer(many=True, read_only=True)
    map_version = serializers.SerializerMethodField()
    user_requests = serializers.SerializerMethodField()
    admin_requests = serializers.SerializerMethodField()
    super_admin_requests = serializers.SerializerMethodField()

    class Meta:
        model = Country
        fields = (
            "id",
            "name",
            "code",
            "logo",
            "cover",
            "cover_text",
            "footer_title",
            "footer_text",
            "users",
            "admins",
            "super_admins",
            "partner_logos",
            "project_approval",
            "map_data",
            "map_version",
            "map_activated_on",
            "user_requests",
            "admin_requests",
            "super_admin_requests",
        )
        read_only_fields = ("name", "code", "project_approval", "map_data", "map_version", "map_activated_on",)

    @staticmethod
    def get_map_version(obj):
        if obj.map_activated_on:
            return format(obj.map_activated_on, 'U')
        return 0

    def get_user_requests(self, obj):
        # figure out not yet assigned users
        return UserProfile.objects.filter(country=obj, account_type=UserProfile.GOVERNMENT) \
            .difference(obj.users.all()).values_list('id', flat=True)

    def get_admin_requests(self, obj):
        # figure out not yet assigned users
        return UserProfile.objects.filter(country=obj, account_type=UserProfile.COUNTRY_ADMIN) \
            .difference(obj.admins.all()).values_list('id', flat=True)

    def get_super_admin_requests(self, obj):
        # figure out not yet assigned users
        return UserProfile.objects.filter(country=obj, account_type=UserProfile.SUPER_COUNTRY_ADMIN) \
            .difference(obj.super_admins.all()).values_list('id', flat=True)

    @atomic
    def update(self, instance, validated_data):
        # keep original lists for comparison
        original_users = set(instance.users.all())
        original_admins = set(instance.admins.all())
        original_super_admins = set(instance.super_admins.all())

        # perform update
        instance = super().update(instance, validated_data)

        # figure out the new entities
        new_users = set(instance.users.all()) - original_users
        new_admins = set(instance.admins.all()) - original_admins
        new_super_admins = set(instance.super_admins.all()) - original_super_admins

        # remove new additions from any other user group
        if new_users:
            instance.admins.remove(*new_users)
            instance.super_admins.remove(*new_users)

        if new_admins:
            instance.users.remove(*new_admins)
            instance.super_admins.remove(*new_admins)

        if new_super_admins:
            instance.users.remove(*new_super_admins)
            instance.admins.remove(*new_super_admins)

        return instance


class DonorSerializer(serializers.ModelSerializer):
    partner_logos = DonorPartnerLogoSerializer(many=True, read_only=True)

    class Meta:
        model = Donor
        fields = (
            "id",
            "name",
            "logo",
            "cover",
            "cover_text",
            "footer_title",
            "footer_text",
            "users",
            "admins",
            "super_admins",
            "partner_logos",
        )
        read_only_fields = ("name",)


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


class CountryMapDataSerializer(serializers.ModelSerializer):
    map_file = serializers.SerializerMethodField()

    class Meta:
        model = Country
        fields = ("id", "map_data", "map_file")

    @staticmethod
    def get_map_file(obj):  # pragma: no cover
        # TODO: refactor this
        file = MapFile.objects.filter(country=obj.id).first()
        if file and file.map_file:
            return file.map_file.url
        return None
