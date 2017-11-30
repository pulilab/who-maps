from rest_framework import serializers
from rest_framework.exceptions import ValidationError

from .models import Country, PartnerLogo, CountryField


class CountryListSerializer(serializers.ModelSerializer):
    class Meta:
        model = Country
        fields = (
            "id",
            "name",
            "code",
            "project_approval",
        )


class LandingPageSerializer(serializers.ModelSerializer):
    partner_logos = serializers.SerializerMethodField()

    class Meta:
        model = Country
        fields = ("id", "name", "code", "logo", "cover", "cover_text", "footer_title", "footer_text", "partner_logos")

    @staticmethod
    def get_partner_logos(obj):
        return [p.image_url for p in PartnerLogo.objects.filter(country=obj)]


class CountryFieldsListSerializer(serializers.ModelSerializer):
    class Meta:
        model = CountryField
        fields = ("id", "country", "type", "question")


class CountryFieldsSerializer(serializers.ModelSerializer):
    class Meta:
        model = CountryField
        fields = ("country", "type", "question", "answer", "project")

    def validate(self, attrs):
        if "project" not in attrs:
            raise ValidationError("Project ID needs to be specified")
        return attrs

    @staticmethod
    def validate_project(value):
        if not value:
            raise ValidationError("Project ID needs to be specified")
        return value


class CountryFieldsWriteSerializer(serializers.Serializer):
    fields = CountryFieldsSerializer(many=True, required=True, allow_null=False)

    def create(self, validated_data):
        return [
            CountryField.objects.update_or_create(
                defaults={"answer": field.get("answer", "")},
                **{
                    "country": field["country"],
                    "project": field["project"],
                    "question": field["question"],
                    "type": field["type"],
                    "schema": False
                },
            )[0] for field in validated_data['fields']
        ]

    def to_representation(self, instances):
        return {"fields": [instance.to_representation() for instance in instances]}
