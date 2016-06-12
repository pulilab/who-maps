from rest_framework import serializers
from django.core import mail
from django.template import loader
from django.conf import settings
from user.models import UserProfile
from .models import Project


class ProjectModelSerializer(serializers.ModelSerializer):

    class Meta:
        model = Project
        fields = ("name",)


class ProjectSerializer(serializers.Serializer):

    name = serializers.CharField()
    organisation = serializers.CharField()
    contact_name = serializers.CharField()
    contact_email = serializers.EmailField()
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
        instance.team = validated_data.get('team', instance.team)
        instance.viewers = validated_data.get('viewers', instance.viewers)
        return super(ProjectGroupUpdateSerializer, self).update(instance, validated_data)

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
