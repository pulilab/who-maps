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
            "map_data",
            "map_version"
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
                },
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
    class Meta:
        model = Country
        fields = ("id", "map_data")
