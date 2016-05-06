from rest_framework import serializers


class SearchSerializer(serializers.Serializer):

    query = serializers.CharField()
    location = serializers.BooleanField(required=False)
    project_name = serializers.BooleanField(required=False)
    health_topic = serializers.BooleanField(required=False)
    technology_platform = serializers.BooleanField(required=False)
    organisation = serializers.BooleanField(required=False)
