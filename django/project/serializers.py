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
    strategies = serializers.ListField(child=serializers.CharField(max_length=512),
                                       max_length=64, min_length=0, allow_empty=True)


class InteroperabilityLinksSerializer(serializers.Serializer):
    name = serializers.CharField(max_length=64)
    selected = serializers.BooleanField(required=False)
    link = serializers.CharField(required=False, max_length=256)


class ProjectBaseSerializer(serializers.Serializer):
    # SECTION 1 General Overview
    name = serializers.CharField(max_length=128, validators=[UniqueValidator(queryset=Project.objects.all())])
    organisation = serializers.CharField(max_length=128)
    country = serializers.IntegerField(min_value=0, max_value=100000)
    geographic_scope = serializers.CharField(required=False)
    implementation_overview = serializers.CharField(max_length=512)
    start_date = serializers.CharField(max_length=256, required=False, allow_blank=True)
    end_date = serializers.CharField(max_length=256, required=False, allow_blank=True)
    contact_name = serializers.CharField(max_length=256)
    contact_email = serializers.EmailField()

    # SECTION 2 Implementation Overview
    platforms = PlatformSerializer(many=True, required=True, allow_empty=False)
    health_focus_areas = serializers.ListField(child=serializers.CharField(max_length=512), max_length=64, required=False)
    hsc_challenges = serializers.ListField(child=serializers.CharField(max_length=128),
                                           max_length=64, min_length=0, allow_empty=True)
    his_bucket = serializers.ListField(child=serializers.CharField(max_length=128), max_length=64)
    coverage = CoverageSerializer(many=True, required=False)
    national_level_deployment = NDPSerializer(required=False)
    government_approved = serializers.BooleanField()
    government_investor = serializers.ChoiceField(choices=[(0, 'No, they have not yet contributed'),
                                                           (1, 'Yes, they are contributing in-kind people or time'),
                                                           (2, 'Yes, there is a financial contribution through MOH budget')])
    implementing_partners = serializers.ListField(child=serializers.CharField(max_length=64),
                                                  max_length=50, min_length=0, required=False)
    donors = serializers.ListField(child=serializers.CharField(max_length=64), max_length=32)

    # SECTION 3 Technology Overview
    implementation_dates = serializers.CharField(max_length=128)
    licenses = serializers.ListField(child=serializers.CharField(max_length=64), max_length=16, required=False)
    repository = serializers.CharField(max_length=200, required=False, allow_blank=True)
    mobile_application = serializers.CharField(max_length=256, required=False, allow_blank=True)
    wiki = serializers.URLField(max_length=200, required=False, allow_blank=True)

    # SECTION 4 Interoperability & Standards
    interoperability_links = InteroperabilityLinksSerializer(many=True, required=False, allow_null=True)
    interoperability_standards = serializers.ListField(child=serializers.CharField(max_length=64),
                                                       required=False, max_length=50)


class ProjectDraftSerializer(ProjectBaseSerializer):
    """
    Override fields that are not required for draft project.
    """
    project = serializers.IntegerField(required=False, allow_null=True)
    # SECTION 1 General Overview
    organisation = serializers.CharField(max_length=128, required=False)
    country = serializers.IntegerField(min_value=0, max_value=100000, required=False)
    implementation_overview = serializers.CharField(max_length=512, required=False)
    contact_name = serializers.CharField(max_length=256, required=False)
    contact_email = serializers.EmailField(required=False)

    # SECTION 2 Implementation Overview
    platforms = PlatformSerializer(many=True, required=False)
    hsc_challenges = serializers.ListField(child=serializers.CharField(max_length=128),
                                           max_length=64, min_length=0, allow_empty=True, required=False)
    his_bucket = serializers.ListField(child=serializers.CharField(max_length=128), max_length=64, required=False)
    government_approved = serializers.BooleanField(required=False)
    government_investor = serializers.ChoiceField(choices=[(0, 'No, they have not yet contributed'),
                                                           (1, 'Yes, they are contributing in-kind people or time'),
                                                           (2, 'Yes, there is a financial contribution through MOH budget')], required=False)
    donors = serializers.ListField(child=serializers.CharField(max_length=64), max_length=32, required=False)

    # SECTION 3 Technology Overview
    implementation_dates = serializers.CharField(max_length=128, required=False)


class ProjectSerializer(ProjectBaseSerializer):
    approved = serializers.BooleanField(required=False, read_only=True)
    # Draft project
    project_draft = serializers.IntegerField(required=False, allow_null=True)


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
