from rest_framework import serializers
from django.core import mail
from django.template import loader
from django.conf import settings
from rest_framework.validators import UniqueValidator

from .models import Project


class NDPSerializer(serializers.Serializer):
    clients = serializers.IntegerField(min_value=0, max_value=100000)
    health_workers = serializers.IntegerField(min_value=0, max_value=100000)
    facilities = serializers.IntegerField(min_value=0, max_value=100000)


class CoverageSerializer(NDPSerializer):
    district = serializers.CharField(max_length=128)


class PlatformSerializer(serializers.Serializer):
    name = serializers.CharField(max_length=128, required=True)
    strategies = serializers.ListField(
        child=serializers.CharField(max_length=512), max_length=64, min_length=0, allow_empty=True)


class InteroperabilityLinksSerializer(serializers.Serializer):
    name = serializers.CharField(max_length=64)
    selected = serializers.BooleanField(required=False)
    link = serializers.CharField(required=False, max_length=256)


class ProjectPublishedSerializer(serializers.Serializer):
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
    health_focus_areas = serializers.ListField(
        child=serializers.CharField(max_length=512), max_length=64, required=False)
    hsc_challenges = serializers.ListField(
        child=serializers.CharField(max_length=128), max_length=64, min_length=0, allow_empty=True)
    his_bucket = serializers.ListField(child=serializers.CharField(max_length=128), max_length=64)
    coverage = CoverageSerializer(many=True, required=False)
    national_level_deployment = NDPSerializer(required=False)
    government_approved = serializers.BooleanField()
    government_investor = serializers.ChoiceField(choices=[(0, 'No, they have not yet contributed'), (
        1, 'Yes, they are contributing in-kind people or time'), (
            2, 'Yes, there is a financial contribution through MOH budget')])
    implementing_partners = serializers.ListField(
        child=serializers.CharField(max_length=64), max_length=50, min_length=0, required=False)
    donors = serializers.ListField(child=serializers.CharField(max_length=64), max_length=32)

    # SECTION 3 Technology Overview
    implementation_dates = serializers.CharField(max_length=128)
    licenses = serializers.ListField(child=serializers.CharField(max_length=64), max_length=16, required=False)
    repository = serializers.CharField(max_length=200, required=False, allow_blank=True)
    mobile_application = serializers.CharField(max_length=256, required=False, allow_blank=True)
    wiki = serializers.URLField(max_length=200, required=False, allow_blank=True)

    # SECTION 4 Interoperability & Standards
    interoperability_links = InteroperabilityLinksSerializer(many=True, required=False, allow_null=True)
    interoperability_standards = serializers.ListField(
        child=serializers.CharField(max_length=64), required=False, max_length=50)

    class Meta:
        model = Project

    def update(self, instance, validated_data):
        instance.name = validated_data["name"]
        instance.data = validated_data
        instance.draft = validated_data
        instance.make_public_id(validated_data['country'])

        instance.save()

        return instance


class ProjectDraftSerializer(ProjectPublishedSerializer):
    """
    Override fields that are not required for draft project.
    """
    name = serializers.CharField(max_length=128)
    # SECTION 1 General Overview
    organisation = serializers.CharField(max_length=128, required=False)
    country = serializers.IntegerField(min_value=0, max_value=100000, required=False)
    implementation_overview = serializers.CharField(max_length=512, required=False)
    contact_name = serializers.CharField(max_length=256, required=False)
    contact_email = serializers.EmailField(required=False)

    # SECTION 2 Implementation Overview
    platforms = PlatformSerializer(many=True, required=False)
    hsc_challenges = serializers.ListField(
        child=serializers.CharField(max_length=128), max_length=64, min_length=0, allow_empty=True, required=False)
    his_bucket = serializers.ListField(child=serializers.CharField(max_length=128), max_length=64, required=False)
    government_approved = serializers.BooleanField(required=False)
    government_investor = serializers.ChoiceField(
        choices=[(0, 'No, they have not yet contributed'), (1, 'Yes, they are contributing in-kind people or time'),
                 (2, 'Yes, there is a financial contribution through MOH budget')],
        required=False)
    donors = serializers.ListField(child=serializers.CharField(max_length=64), max_length=32, required=False)

    # SECTION 3 Technology Overview
    implementation_dates = serializers.CharField(max_length=128, required=False)

    def create(self, validated_data):
        owner = validated_data.pop('owner')
        instance = self.Meta.model.projects.create(name=validated_data["name"], draft=validated_data)
        instance.team.add(owner)

        return instance

    def update(self, instance, validated_data):
        instance.name = validated_data["name"]
        instance.draft = validated_data
        instance.save()

        return instance


class ProjectGroupSerializer(serializers.ModelSerializer):
    class Meta:
        model = Project
        fields = ("team", "viewers")
        read_only_fields = ("id",)

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
            "role": "team member"
        })
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
            "role": "viewer"
        })
        for profile in new_viewers:
            mail.send_mail(
                subject="You were added to a project!",
                message="",
                from_email=settings.FROM_EMAIL,
                recipient_list=[profile.user.email],
                html_message=html_message,
                fail_silently=True)
