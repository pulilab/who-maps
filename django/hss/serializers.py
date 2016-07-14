from rest_framework import serializers


class BubbleSerializer(serializers.Serializer):

    app_id = serializers.IntegerField()
    subapp_id = serializers.IntegerField()
    column_id = serializers.IntegerField()
    colspan = serializers.IntegerField()
    content = serializers.CharField(allow_blank=True)


class ContinuumSerializer(serializers.Serializer):

    column_id = serializers.IntegerField()
    state = serializers.BooleanField(required=False)


class ConstraintSerializer(serializers.Serializer):

    name = serializers.CharField()
    icon = serializers.CharField()
    active = serializers.BooleanField()


class InterventionSerializer(serializers.Serializer):

    column_id = serializers.IntegerField()
    interventions = serializers.ListField()


class AgeRangeSerializer(serializers.Serializer):

    column_id = serializers.IntegerField()
    age_ranges = serializers.ListField()


class TaxonomySerializer(serializers.Serializer):
    app_id = serializers.IntegerField()
    subapp_id = serializers.IntegerField()
    content = serializers.ListField()
