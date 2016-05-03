from rest_framework import serializers


class ProjectSerializer(serializers.Serializer):

    date = serializers.CharField()
    name = serializers.CharField()
    organisation = serializers.CharField()  # Should be text instead of ID - no Orgs in MVP
    strategy = serializers.ListField(required=False)   # Can hold 'other' fields
    country = serializers.IntegerField(required=False)
    technology_platforms = serializers.ListField(required=False)  # Can hold 'other' fields
    licenses = serializers.ListField(required=False)  # Can hold 'other' fields
    digital_tools = serializers.ListField(required=False)  # Can hold 'other' fields
    application = serializers.ListField(required=False)
    coverage = serializers.ListField(required=False)
    started = serializers.CharField(required=False)
    donors = serializers.ListField(required=False)  # Should be text instead of ID - no Donors in MVP
    reports = serializers.ListField(required=False)
    publications = serializers.ListField(required=False)
    pipeline = serializers.ListField(required=False)  # Can hold 'other' fields
    goals_to_scale = serializers.CharField(required=False)
    anticipated_time = serializers.CharField(required=False)
    pre_assessment = serializers.ListField(required=False)
