from rest_framework import serializers
from django.core import mail
from django.template import loader
from django.conf import settings
from rest_framework.validators import UniqueValidator

from user.models import UserProfile
from .models import Project


class NDPSerializer(serializers.Serializer):
    clients = serializers.IntegerField(min_value=0, max_value=100000)
    health_workers = serializers.IntegerField(min_value=0, max_value=100000)
    facilities = serializers.IntegerField(min_value=0, max_value=100000)


class CoverageSerializer(NDPSerializer):
    district = serializers.CharField(max_length=128)


class PlatformSerializer(serializers.Serializer):
    name = serializers.CharField(max_length=128, required=True)
    strategies = serializers.ListField(max_length=64, min_length=0, allow_empty=True)


class ProjectSerializer(serializers.Serializer):
    name = serializers.CharField(validators=[UniqueValidator(queryset=Project.objects.all())])
    organisation = serializers.CharField(max_length=256)
    contact_name = serializers.CharField(max_length=256)
    contact_email = serializers.EmailField()
    implementation_overview = serializers.CharField(max_length=512)
    implementing_partners = serializers.ListField(max_length=16, min_length=0)
    implementation_dates = serializers.CharField(max_length=128)
    health_focus_areas = serializers.ListField(max_length=64)
    geographic_scope = serializers.CharField(required=False)
    country = serializers.IntegerField(min_value=0, max_value=100000)
    licenses = serializers.ListField(max_length=16, required=False)  # Can hold 'other' fields
    donors = serializers.ListField(max_length=32)
    his_bucket = serializers.ListField(max_length=64)
    hsc_challenges = serializers.ListField(max_length=64)
    interventions = serializers.ListField(max_length=64)
    government_investor = serializers.BooleanField()
    repository = serializers.URLField(required=False, allow_blank=True)
    mobile_application = serializers.CharField(max_length=256, required=False, allow_blank=True)
    wiki = serializers.URLField(required=False, allow_blank=True)
    interoperability_links = serializers.ListField(required=False, max_length=16)
    interoperability_standards = serializers.ListField(required=False, max_length=16)
    data_exchanges = serializers.ListField(required=False, max_length=32)
    coverage = CoverageSerializer(many=True, required=False)
    platforms = PlatformSerializer(many=True, required=True, allow_empty=False)
    national_level_deployment = NDPSerializer(required=False)
    start_date = serializers.CharField(max_length=256, required=False, allow_blank=True)
    end_date = serializers.CharField(max_length=256, required=False, allow_blank=True)


class GroupSerializer(serializers.ModelSerializer):
    org = serializers.SerializerMethodField('get_org_name')

    class Meta:
        model = UserProfile
        fields = ('id', 'name', 'org')

    @staticmethod
    def get_org_name(obj):
        return obj.organisation.name if obj.organisation else None


class ProjectGroupListSerializer(serializers.ModelSerializer):
    team = GroupSerializer(many=True)
    viewers = GroupSerializer(many=True)
    user_profiles = serializers.SerializerMethodField()

    class Meta:
        model = Project
        fields = ("team", "viewers", "user_profiles")

    @staticmethod
    def get_user_profiles(obj):
        return UserProfile.objects.all().values("id", "name", "organisation__name")


class ProjectGroupUpdateSerializer(serializers.ModelSerializer):

    class Meta:
        model = Project
        fields = ("team", "viewers")

    def update(self, instance, validated_data):
        self._send_notification(instance, validated_data)

        # don't allow empty team, so no orphan projects
        if 'team' in validated_data and isinstance(validated_data['team'], list):
            instance.team = validated_data.get('team') or instance.team.all()

        # a project however can exist without viewers
        if 'viewers' in validated_data and isinstance(validated_data['viewers'], list):
            instance.viewers = validated_data['viewers']

        instance.save()

        return instance

    def _send_notification(self, instance, validated_data):
        new_team_members = [x for x in validated_data.get('team', []) if x not in instance.team.all()]
        new_viewers = [x for x in validated_data.get('viewers', []) if x not in instance.viewers.all()]

        html_template = loader.get_template("email/new_member.html")
        html_message = html_template.render({
                                        "project_id": instance.id,
                                        "project_name": instance.name,
                                        "role": "team member"})
        for profile in new_team_members:
            mail.send_mail(
                subject="You were added to a project!",
                message="",
                from_email=settings.FROM_EMAIL,
                recipient_list=[profile.user.email],
                html_message=html_message,
                fail_silently=True)

        html_message = html_template.render({
                                        "project_id": instance.id,
                                        "project_name": instance.name,
                                        "role": "viewer"})
        for profile in new_viewers:
            mail.send_mail(
                subject="You were added to a project!",
                message="",
                from_email=settings.FROM_EMAIL,
                recipient_list=[profile.user.email],
                html_message=html_message,
                fail_silently=True)
