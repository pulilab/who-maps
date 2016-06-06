from rest_framework import serializers

from user.models import UserProfile
from .models import Project


class ProjectModelSerializer(serializers.ModelSerializer):

    class Meta:
        model = Project
        fields = ("name",)


class ProjectSerializer(serializers.Serializer):

    date = serializers.CharField()
    name = serializers.CharField()
    organisation = serializers.CharField()
    contact_name = serializers.CharField()
    contact_email = serializers.CharField()
    implementation_overview = serializers.CharField(max_length=500)
    implementing_partners = serializers.CharField(required=False)
    implementation_dates = serializers.CharField()
    geographic_coverage = serializers.CharField()
    intervention_areas = serializers.ListField()
    strategy = serializers.ListField(required=False)   # Can hold 'other' fields
    country = serializers.IntegerField(required=False)
    objective = serializers.CharField(required=False, max_length=250)
    technology_platforms = serializers.ListField(required=False)  # Can hold 'other' fields
    licenses = serializers.ListField(required=False)  # Can hold 'other' fields
    application = serializers.ListField(required=False)
    coverage = serializers.ListField(required=False)
    started = serializers.CharField(required=False)
    donors = serializers.ListField(required=False)  # Should be text instead of ID - no Donors in MVP
    reports = serializers.ListField(required=False)
    publications = serializers.ListField(required=False)
    pipeline = serializers.ListField(required=False)  # Can hold 'other' fields
    goals_to_scale = serializers.CharField(required=False)
    anticipated_time = serializers.CharField(required=False)
    repository = serializers.CharField(required=False)
    mobile_application = serializers.CharField(required=False)
    wiki = serializers.CharField(required=False)
    pre_assessment = serializers.ListField(required=False)


class GroupSerializer(serializers.ModelSerializer):
    org = serializers.SerializerMethodField('get_org_name')

    class Meta:
        model = UserProfile
        fields = ('id', 'name', 'org')

    @staticmethod
    def get_org_name(obj):
        return obj.organisation.name


class ProjectGroupListSerializer(serializers.ModelSerializer):
    team = GroupSerializer(many=True)
    viewers = GroupSerializer(many=True)

    class Meta:
        model = Project
        fields = ("team", "viewers")


class ProjectGroupUpdateSerializer(serializers.ModelSerializer):

    class Meta:
        model = Project
        fields = ("team", "viewers")

    def update(self, instance, validated_data):
        instance.team = validated_data.get('team', instance.team)
        instance.viewers = validated_data.get('viewers', instance.viewers)
        return super(ProjectGroupUpdateSerializer, self).update(instance, validated_data)
