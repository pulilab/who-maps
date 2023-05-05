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
    stages = serializers.ReadOnlyField(source="project__data__stages")


class ListResultSerializer(serializers.Serializer):
    id = serializers.ReadOnlyField(source="project_id")
    name = serializers.ReadOnlyField(source="project__name")
    organisation = serializers.ReadOnlyField(source="organisation_id")
    country = serializers.ReadOnlyField(source="country_id")
    geographic_scope = serializers.ReadOnlyField(source="project__data__geographic_scope")
    implementation_overview = serializers.ReadOnlyField(source="project__data__implementation_overview")
    contact_name = serializers.ReadOnlyField(source="project__data__contact_name")
    contact_email = serializers.ReadOnlyField(source="project__data__contact_email")
    start_date = serializers.ReadOnlyField(source="project__data__start_date")
    end_date = serializers.ReadOnlyField(source="project__data__end_date")
    implementing_partners = serializers.ReadOnlyField(source="project__data__implementing_partners")
    software = serializers.ReadOnlyField(source="project__data__software")
    dhis = serializers.ReadOnlyField(source="project__data__dhis")
    health_focus_areas = serializers.ReadOnlyField(source="project__data__health_focus_areas")
    hsc_challenges = serializers.ReadOnlyField(source="project__data__hsc_challenges")
    his_bucket = serializers.ReadOnlyField(source="project__data__his_bucket")
    region = serializers.ReadOnlyField(source="country__region")
    government_investor = serializers.ReadOnlyField(source="project__data__government_investor")
    implementation_dates = serializers.ReadOnlyField(source="project__data__implementation_dates")
    donors = serializers.ReadOnlyField()
    approved = serializers.ReadOnlyField(source="project__approval__approved")
    licenses = serializers.ReadOnlyField(source="project__data__licenses")
    repository = serializers.ReadOnlyField(source="project__data__repository")
    mobile_application = serializers.ReadOnlyField(source="project__data__mobile_application")
    wiki = serializers.ReadOnlyField(source="project__data__wiki")
    interoperability_standards = serializers.ReadOnlyField(source="project__data__interoperability_standards")
    coverage = serializers.ReadOnlyField(source="project__data__coverage")
    coverage_second_level = serializers.ReadOnlyField(source="project__data__coverage_second_level")
    national_level_deployment = serializers.ReadOnlyField(source="project__data__national_level_deployment")
    country_custom_answers = serializers.ReadOnlyField(source="project__data__country_custom_answers")
    country_custom_answers_private = serializers.ReadOnlyField(source="project__data__country_custom_answers_private")
    donor_custom_answers = serializers.ReadOnlyField(source="project__data__donor_custom_answers")
    donor_custom_answers_private = serializers.SerializerMethodField()
    stages = serializers.ReadOnlyField(source="project__data__stages")

    def get_donor_custom_answers_private(self, obj):
        private_fields = obj.get("project__data__donor_custom_answers_private")
        if private_fields and self.context['donor']:
            return {donor_id: private_fields[donor_id]
                    for donor_id in private_fields if donor_id == str(self.context['donor'].id)}
