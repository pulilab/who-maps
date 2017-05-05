from rest_framework import serializers
from rest_framework.exceptions import ValidationError

from .models import Country, PartnerLogo, CountryField


class CountryListSerializer(serializers.ModelSerializer):

    class Meta:
        model = Country
        fields = ("id", "name", "code")


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
            raise ValidationError("Project cannot be null")
        return attrs

    @staticmethod
    def validate_project(value):
        if not value:
            raise ValidationError("Project cannot be null")
        return value


class CountryFieldsWriteSerializer(serializers.Serializer):
    fields = CountryFieldsSerializer(many=True, required=True, allow_null=False)

    def create(self, validated_data):
        return [CountryField.objects.create(**field) for field in validated_data['fields']]

    def update(self, instances, validated_data):
        updated_fields = validated_data['fields']
        for updated_field in updated_fields:
            for instance in instances:
                if instance.question == updated_field['question'] and instance.type == updated_field['type']:
                    instance.answer = updated_field['answer']
                    instance.save()
        return instances

    def to_representation(self, instances):
        return {"fields": [instance.to_representation() for instance in instances]}
