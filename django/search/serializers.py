from rest_framework import serializers


class MapResultSerializer(serializers.Serializer):
    id = serializers.ReadOnlyField(source="project_id")
    name = serializers.ReadOnlyField(source="project__name")
    organisation = serializers.ReadOnlyField(source="organisation_id")
    country = serializers.ReadOnlyField(source="country_id")
    coverage = serializers.ReadOnlyField(source="project__data__coverage")
    national_level_deployment = serializers.ReadOnlyField(source="project__data__national_level_deployment")
    government_investor = serializers.ReadOnlyField(source="project__data__government_investor")
    approved = serializers.ReadOnlyField(source="project__approval__approved")


class ListResultSerializer(serializers.Serializer):
    id = serializers.ReadOnlyField(source="project_id")
    name = serializers.ReadOnlyField(source="project__name")
    organisation = serializers.ReadOnlyField(source="organisation_id")
    country = serializers.ReadOnlyField(source="country_id")
    geographic_scope = serializers.ReadOnlyField(source="project__data__geographic_scope")
    implementation_overview = serializers.ReadOnlyField(source="project__data__implementation_overview")
    contact_name = serializers.ReadOnlyField(source="project__data__contact_name")
    contact_email = serializers.ReadOnlyField(source="project__data__contact_email")
    platforms = serializers.ReadOnlyField(source="project__data__platforms")
    health_focus_areas = serializers.ReadOnlyField(source="project__data__health_focus_areas")
    hsc_challenges = serializers.ReadOnlyField(source="project__data__hsc_challenges")
    his_bucket = serializers.ReadOnlyField(source="project__data__his_bucket")
    region = serializers.ReadOnlyField(source="country__region")
    government_investor = serializers.ReadOnlyField(source="project__data__government_investor")
    donors = serializers.ReadOnlyField(source="project__data__donors")  # TODO: will be refactored
    approved = serializers.ReadOnlyField(source="project__approval__approved")
