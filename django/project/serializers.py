import re

from allauth.account import app_settings as allauth_settings
from allauth.account.utils import complete_signup
from django.conf import settings
from django.contrib.auth.models import User
from rest_auth.app_settings import create_token
from rest_auth.models import TokenModel
from rest_auth.utils import jwt_encode
from rest_framework import serializers
from rest_framework.exceptions import ValidationError
from rest_framework.fields import ReadOnlyField
from rest_framework.validators import UniqueValidator

# This has to stay here to use the proper celery instance with the djcelery_email package
import scheduler.celery  # noqa

from core.utils import send_mail_wrapper
from country.models import CustomQuestion
from project.utils import remove_keys
from user.models import UserProfile
from .models import Project, ProjectApproval, ImportRow, ProjectImportV2

URL_REGEX = re.compile(r"^(http[s]?://)?(www\.)?[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,20}[.]?")


def url_validator(value):
    if not URL_REGEX.match(value):
        raise ValidationError('Enter a valid URL.')
    return value


class NDPSerializer(serializers.Serializer):
    clients = serializers.IntegerField(min_value=0, max_value=2000000000)
    health_workers = serializers.IntegerField(min_value=0, max_value=2000000000)
    facilities = serializers.IntegerField(min_value=0, max_value=2000000000)
    facilities_list = serializers.ListField(child=serializers.CharField(max_length=128), max_length=20000,
                                            required=False, allow_null=True)


class CoverageSerializer(NDPSerializer):
    district = serializers.CharField(max_length=128)


class PlatformSerializer(serializers.Serializer):
    id = serializers.IntegerField(required=True)
    strategies = serializers.ListField(
        child=serializers.IntegerField(), max_length=64, min_length=1)


class InteroperabilityLinksSerializer(serializers.Serializer):
    id = serializers.IntegerField()
    selected = serializers.BooleanField(required=False)
    link = serializers.CharField(required=False, max_length=256)

    @staticmethod
    def validate_link(value):
        return url_validator(value)


class DraftInteroperabilityLinksSerializer(InteroperabilityLinksSerializer):
    @staticmethod
    def validate_link(value):
        return value


class DraftPlatformSerializer(serializers.Serializer):
    id = serializers.IntegerField(required=True)
    strategies = serializers.ListField(
        child=serializers.IntegerField(), max_length=64, min_length=0, allow_empty=True)


INVESTOR_CHOICES = [(0, 'No, they have not yet contributed'),
                    (1, 'Yes, they are contributing in-kind people or time'),
                    (2, 'Yes, there is a financial contribution through MOH budget'),
                    (3, 'Yes, MOH is fully funding the project')]


class ProjectPublishedSerializer(serializers.Serializer):
    # SECTION 1 General Overview
    name = serializers.CharField(max_length=128, validators=[UniqueValidator(queryset=Project.objects.all())])
    organisation = serializers.CharField(max_length=128)
    country = serializers.IntegerField(min_value=0, max_value=100000)
    geographic_scope = serializers.CharField(max_length=1024, required=False)
    implementation_overview = serializers.CharField(max_length=1024)
    start_date = serializers.CharField(max_length=256, required=True)
    end_date = serializers.CharField(max_length=256, required=False, allow_blank=True)
    contact_name = serializers.CharField(max_length=256)
    contact_email = serializers.EmailField()

    # SECTION 2 Implementation Overview
    platforms = PlatformSerializer(many=True, required=True, allow_empty=False)
    health_focus_areas = serializers.ListField(
        child=serializers.IntegerField(), max_length=64, min_length=1)
    hsc_challenges = serializers.ListField(
        child=serializers.IntegerField(), max_length=64, min_length=1)
    his_bucket = serializers.ListField(child=serializers.IntegerField(), max_length=64, required=False)
    coverage = CoverageSerializer(many=True, required=False, allow_null=True)
    coverage_second_level = CoverageSerializer(many=True, required=False, allow_null=True)
    national_level_deployment = NDPSerializer(required=False, allow_null=True)
    government_investor = serializers.ChoiceField(choices=INVESTOR_CHOICES, required=False)
    implementing_partners = serializers.ListField(
        child=serializers.CharField(max_length=128), max_length=50, min_length=0, required=False, allow_empty=True)
    donors = serializers.ListField(child=serializers.IntegerField(), max_length=32)

    # SECTION 3 Technology Overview
    implementation_dates = serializers.CharField(max_length=128, required=False)
    licenses = serializers.ListField(child=serializers.IntegerField(), max_length=16, required=False)
    repository = serializers.CharField(max_length=256, required=False, allow_blank=True)
    mobile_application = serializers.CharField(max_length=256, required=False, allow_blank=True)
    wiki = serializers.CharField(max_length=256, required=False, allow_blank=True)

    # SECTION 4 Interoperability & Standards
    interoperability_links = InteroperabilityLinksSerializer(many=True, required=False, allow_null=True)
    interoperability_standards = serializers.ListField(
        child=serializers.IntegerField(), required=False, max_length=50)

    class Meta:
        model = Project

    def validate_country(self, value):
        if self.instance:
            project = Project.objects.get(id=self.instance.id)
            if project.public_id and project.data['country'] != self.initial_data['country']:
                raise serializers.ValidationError('Country cannot be altered on published projects.')
        return value

    def update(self, instance, validated_data):
        instance.name = validated_data["name"]
        instance.data = validated_data
        instance.draft = validated_data
        instance.odk_etag = None
        instance.make_public_id(validated_data['country'])

        instance.save()

        return instance

    @staticmethod
    def validate_wiki(value):
        return url_validator(value)

    @staticmethod
    def validate_mobile_application(value):
        return url_validator(value)

    @staticmethod
    def validate_repository(value):
        return url_validator(value)


class ProjectDraftSerializer(ProjectPublishedSerializer):
    """
    Override fields that are not required for draft project.
    """
    # SECTION 1 General Overview
    name = serializers.CharField(max_length=128)
    organisation = serializers.CharField(max_length=128, required=False)
    country = serializers.IntegerField(min_value=0, max_value=100000, required=False)
    implementation_overview = serializers.CharField(max_length=1024, required=False)
    contact_name = serializers.CharField(max_length=256, required=False)
    contact_email = serializers.EmailField(required=False)
    start_date = serializers.CharField(max_length=256, required=False)

    # SECTION 2 Implementation Overview
    platforms = DraftPlatformSerializer(many=True, required=False)
    health_focus_areas = serializers.ListField(
        child=serializers.IntegerField(), max_length=64, min_length=0, allow_empty=True)
    hsc_challenges = serializers.ListField(
        child=serializers.IntegerField(), max_length=64, min_length=0, allow_empty=True, required=False)
    donors = serializers.ListField(child=serializers.IntegerField(), max_length=32, required=False)

    # SECTION 4
    interoperability_links = DraftInteroperabilityLinksSerializer(many=True, required=False, allow_null=True)

    # ODK DATA
    odk_etag = serializers.CharField(allow_blank=True, allow_null=True, max_length=64, required=False)
    odk_id = serializers.CharField(allow_blank=True, allow_null=True, max_length=64, required=False)
    odk_extra_data = serializers.JSONField(required=False)

    def validate_country(self, value):
        if self.instance:
            project = Project.objects.get(id=self.instance.id)
            if project.public_id and project.draft['country'] != self.initial_data['country']:
                raise serializers.ValidationError('Country cannot be altered on published projects.')
        return value

    def create(self, validated_data):
        odk_etag = validated_data.pop('odk_etag', None)
        odk_id = validated_data.pop('odk_id', None)
        odk_extra_data = validated_data.pop('odk_extra_data', dict())
        return self.Meta.model(
            name=validated_data["name"],
            draft=validated_data,
            odk_etag=odk_etag,
            odk_id=odk_id,
            odk_extra_data=odk_extra_data
        )

    def update(self, instance, validated_data):
        odk_etag = validated_data.pop('odk_etag', None)
        validated_data.pop('odk_id', None)
        odk_extra_data = validated_data.pop('odk_extra_data', None)

        if not instance.public_id:
            instance.name = validated_data["name"]

        instance.odk_etag = odk_etag if self.context.get('preserve_etag') else None

        if odk_extra_data:
            instance.odk_extra_data = odk_extra_data

        instance.draft = validated_data
        return instance

    @staticmethod
    def validate_wiki(value):
        return value

    @staticmethod
    def validate_mobile_application(value):
        return value

    @staticmethod
    def validate_repository(value):
        return value


class ProjectGroupSerializer(serializers.ModelSerializer):
    new_team_emails = serializers.ListField(
        child=serializers.EmailField(), max_length=64, min_length=0, allow_empty=True, required=False)
    new_viewer_emails = serializers.ListField(
        child=serializers.EmailField(), max_length=64, min_length=0, allow_empty=True, required=False)

    class Meta:
        model = Project
        fields = ("team", "viewers", "new_team_emails", "new_viewer_emails")
        read_only_fields = ("id",)

    def perform_create(self, email):
        user = User.objects.create_user(username=email[:150], email=email)
        UserProfile.objects.create(user=user, account_type=UserProfile.IMPLEMENTER)

        if getattr(settings, 'REST_USE_JWT', False):
            self.token = jwt_encode(user)
        else:  # pragma: no cover
            # Backwards compatibility for use without JWT
            create_token(TokenModel, user, None)

        complete_signup(self.context['request']._request, user,
                        allauth_settings.EMAIL_VERIFICATION,
                        None)
        return user

    def save(self, **kwargs):
        for email in self.validated_data.get('new_team_emails', []):
            try:
                user = User.objects.get(email=email)
            except User.DoesNotExist:
                user = self.perform_create(email)
            self.validated_data['team'].append(user.userprofile)

        for email in self.validated_data.get('new_viewer_emails', []):
            try:
                user = User.objects.get(email=email)
            except User.DoesNotExist:
                user = self.perform_create(email)
            self.validated_data['viewers'].append(user.userprofile)

        self.validated_data.pop('new_viewer_emails', None)
        self.validated_data.pop('new_viewer_emails', None)

        # remove duplicates
        self.validated_data['team'] = list(set(self.validated_data['team']))
        self.validated_data['viewers'] = list(set(self.validated_data['viewers']))

        return super().save(**kwargs)

    def update(self, instance, validated_data):
        self._send_notification(instance, validated_data)

        # don't allow empty team, so no orphan projects
        if 'team' in validated_data and isinstance(validated_data['team'], list):
            instance.team.set(validated_data.get('team') or instance.team.all())

        # a project however can exist without viewers
        if 'viewers' in validated_data and isinstance(validated_data['viewers'], list):
            instance.viewers.set(validated_data['viewers'])

        instance.save()

        return instance

    def _send_notification(self, instance, validated_data):
        new_team_members = [x for x in validated_data.get('team', []) if x not in instance.team.all()]
        new_viewers = [x for x in validated_data.get('viewers', []) if x not in instance.viewers.all()]

        for profile in new_team_members:
            context = {
                "user_name": profile.name,
                "project_id": instance.id,
                "project_name": instance.name,
                "role": "team member",
            }
            send_mail_wrapper(subject="You have been added to a project in the Digital Health Atlas",
                              email_type="new_member",
                              to=profile.user.email,
                              language=profile.language,
                              context=context)

        for profile in new_viewers:
            context = {
                "user_name": profile.name,
                "project_id": instance.id,
                "project_name": instance.name,
                "role": "viewer",
            }
            send_mail_wrapper(subject="You have been added to a project in the Digital Health Atlas",
                              email_type="new_member",
                              to=profile.user.email,
                              language=profile.language,
                              context=context)


class MapProjectCountrySerializer(serializers.ModelSerializer):
    country = ReadOnlyField(source='get_country_id')

    class Meta:
        model = Project
        fields = ("id", "name", "country")


class CustomAnswerSerializer(serializers.Serializer):
    question_id = serializers.IntegerField(required=True)
    answer = serializers.ListField(
        child=serializers.CharField(max_length=512), max_length=50, min_length=0, required=True)

    def validate_question_id(self, value):
        self.context['question'] = self.context['question_queryset'].filter(id=int(value)).first()
        if not self.context['question']:
            raise ValidationError('This question_id does not exist.')
        return value

    def validate_required_answer(self, value):
        if not value:
            raise ValidationError({'answer': 'This field is required.'})

    def validate_numeric_answer(self, value):
        if value and isinstance(value[0], str) and not value[0].isnumeric():
            raise ValidationError({'answer': 'This field must be numeric.'})

    def validate_answer_length(self, value):
        if value and len(value) > 1:
            raise ValidationError({'answer': 'There must be 1 answer only.'})

    def validate(self, attrs):
        if not self.context['is_draft']:
            if self.context['question'].required:
                self.validate_required_answer(attrs['answer'])
            if self.context['question'].type != CustomQuestion.MULTI:
                self.validate_answer_length(attrs['answer'])
            if self.context['question'].type == CustomQuestion.NUMBER:
                self.validate_numeric_answer(attrs['answer'])
        return attrs


class CountryCustomAnswerListSerializer(serializers.ListSerializer):
    def create(self, validated_data):
        instance = self.context['project']
        custom_answers = {k['question_id']: k['answer'] for k in validated_data}
        instance.draft['country_custom_answers'] = custom_answers
        if not self.context['is_draft']:
            private_ids = self.context['question_queryset'].filter(private=True).values_list('id', flat=True)
            if private_ids:
                private_answers = {k: custom_answers[k] for k in custom_answers if k in private_ids}
                instance.data['country_custom_answers_private'] = private_answers
                instance.data['country_custom_answers'] = remove_keys(data_dict=custom_answers, keys=private_ids)
            else:
                instance.data['country_custom_answers'] = custom_answers
        return instance


class DonorCustomAnswerListSerializer(serializers.ListSerializer):
    def create(self, validated_data):
        instance = self.context['project']
        donor_id = self.context['donor_id']

        custom_answers = {k['question_id']: k['answer'] for k in validated_data}
        instance.draft.setdefault('donor_custom_answers', {})
        instance.draft['donor_custom_answers'].setdefault(donor_id, {})
        instance.draft['donor_custom_answers'][donor_id] = custom_answers

        if not self.context['is_draft']:
            private_ids = self.context['question_queryset'].filter(private=True).values_list('id', flat=True)
            if private_ids:
                private_answers = {k: custom_answers[k] for k in custom_answers if k in private_ids}
                instance.data.setdefault('donor_custom_answers_private', {})
                instance.data['donor_custom_answers_private'].setdefault(donor_id, {})
                instance.data['donor_custom_answers_private'][donor_id] = private_answers
                instance.data['donor_custom_answers'][donor_id] = remove_keys(data_dict=custom_answers,
                                                                              keys=private_ids)
            else:
                instance.data.setdefault('donor_custom_answers', {})
                instance.data['donor_custom_answers'].setdefault(donor_id, {})
                instance.data['donor_custom_answers'][donor_id] = custom_answers
        return instance


class CountryCustomAnswerSerializer(CustomAnswerSerializer):
    class Meta:
        list_serializer_class = CountryCustomAnswerListSerializer


class DonorCustomAnswerSerializer(CustomAnswerSerializer):
    class Meta:
        list_serializer_class = DonorCustomAnswerListSerializer


class ProjectApprovalSerializer(serializers.ModelSerializer):
    project = serializers.ReadOnlyField(source='project_id')
    project_name = serializers.SerializerMethodField()
    history = serializers.SerializerMethodField()
    legacy_approved_by = serializers.ReadOnlyField(source='user_id')

    class Meta:
        model = ProjectApproval
        fields = ('id', 'project_name', 'created', 'modified', 'approved',
                  'reason', 'project', 'history', 'legacy_approved_by')

    def get_project_name(self, obj):
        return obj.project.name

    def get_history(self, obj):
        return obj.history.values('history_user__userprofile', 'approved', 'reason', 'modified')


class CSVExportSerializer(serializers.Serializer):
    ids = serializers.ListField(
        child=serializers.IntegerField(), max_length=200, min_length=1, required=True)
    country = serializers.IntegerField(required=False)
    donor = serializers.IntegerField(required=False)


class ImportRowSerializer(serializers.ModelSerializer):
    class Meta:
        model = ImportRow
        fields = "__all__"


class ProjectImportV2Serializer(serializers.ModelSerializer):
    user = serializers.HiddenField(default=serializers.CurrentUserDefault())
    status = serializers.ReadOnlyField()
    rows = ImportRowSerializer(many=True)

    class Meta:
        model = ProjectImportV2
        fields = ('id', 'user', 'status', 'header_mapping',
                  'rows', 'country', 'donor', 'filename', 'sheet_name', 'draft')

    # TODO: Need Coverage
    def create(self, validated_data):  # pragma: no cover
        rows = validated_data.pop('rows')
        instance = super().create(validated_data)
        for row_data in rows[0].get('data', []):
            ImportRow.objects.create(parent=instance, data=row_data, original_data=row_data)
        return instance

    # TODO: Need Coverage
    def update(self, instance, validated_data):  # pragma: no cover
        rows = validated_data.pop('rows', [])
        instance = super().update(instance, validated_data)
        for row in rows:
            ImportRow.objects.get(id=row['id']).update(data=row.get('data'))
        return instance
