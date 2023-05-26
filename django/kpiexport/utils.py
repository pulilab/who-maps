from project.models import ProjectVersion
from django.conf import settings
from project.serializers import ProjectPublishedSerializer, DonorCustomAnswerSerializer, CountryCustomAnswerSerializer
from rest_framework.validators import UniqueValidator
from country.models import Country, Donor


class ProjectStatusChangeDescriptor:
    """
    Descriptor object for describing how a project's status has changed
    """

    def __init__(self):
        self.published = False
        self.unpublished = False
        self.ready_to_publish = False
        self.draft = False
        self.to_delete = False
        self.new = False
        self.archived = False

    def __str__(self):  # pragma: no cover
        return f'P: {self.published} U: {self.unpublished} R: {self.ready_to_publish} D: {self.draft} ' \
               f'TD: {self.to_delete} N: {self.new} A: {self.archived}'

    @staticmethod
    def _check_for_obsolete_project_name(name: str) -> bool:
        lowercase = name.lower()
        return any(marker in lowercase for marker in settings.OBSOLETE_PROJECT_MARKERS)

    @staticmethod
    def _validate_project_version_for_publish(version: ProjectVersion, country):  # pragma: no cover
        if not country or version.published or version.archived:
            return False

        data_serializer = ProjectPublishedSerializer(data=version.data)
        data_serializer.fields.get('name').validators = \
            [v for v in data_serializer.fields.get('name').validators if not isinstance(v, UniqueValidator)]
        data_serializer.fields.get('name').validators \
            .append(UniqueValidator(queryset=version.project.__class__.objects.all().exclude(id=version.project.id)))
        if country.country_questions.exists() and 'country_custom_answers' in version.data:
            country_answers = CountryCustomAnswerSerializer(
                data=version.data['country_custom_answers'],
                many=True,
                context=dict(question_queryset=country.country_questions, is_draft=False))

            if not country_answers.is_valid():
                return False
        if not data_serializer.is_valid():
            return False
        for donor_id in data_serializer.validated_data.get('donors', []):
            donor = Donor.objects.get(id=donor_id)
            if donor and donor.donor_questions.exists():
                if 'donor_custom_answers' not in version.data:
                    return False
                if str(donor_id) not in version.data['donor_custom_answers']:
                    return False

                donor_answers = DonorCustomAnswerSerializer(
                    data=version.data['donor_custom_answers'][str(donor_id)], many=True,
                    context=dict(question_queryset=donor.donor_questions, is_draft=False))

                if not donor_answers.is_valid():
                    return False
        return True

    def fill_from_new_version(self, version: ProjectVersion, country: Country):
        """
        Fills descriptor based on a single ProjectVersion only
        """
        self.published = version.published
        self.draft = not self.published and not version.archived
        self.archived = version.archived
        self.to_delete = self._check_for_obsolete_project_name(version.project.name)
        self.ready_to_publish = self._validate_project_version_for_publish(version, country)
        self.new = True
        # unpublished is always false for new projects

    def fill_from_version_diff(self, version_old: ProjectVersion, version_new: ProjectVersion, country: Country):
        """
        Fills descriptor based on two ProjectVersions
        Note: "old" projects can't be moved to draft, they either stay a draft or get unpublished
        """
        self.to_delete = not self._check_for_obsolete_project_name(version_old.project.name) and \
            self._check_for_obsolete_project_name(version_new.project.name)
        self.unpublished = version_old.published and not version_new.published and not version_new.archived
        self.published = not version_old.published and version_new.published
        self.archived = not version_old.archived and version_new.archived
        self.ready_to_publish = not self._validate_project_version_for_publish(version_old, country) and \
            not version_new.published and \
            self._validate_project_version_for_publish(version_new, country)


def project_status_change(version_1: ProjectVersion, version_2: ProjectVersion) -> dict:
    return dict(
        published=not version_1.published and version_2.published,
        unpublished=not version_2.published and not version_2.archived and version_1.published,
        archived=not version_1.archived and version_2.archived,
        data_changed=version_1.data != version_2.data,
        name_changed=version_1.name != version_2.name,
        research_changed=version_1.research != version_2.research
    )


def project_status_change_sum(date, project, country) -> ProjectStatusChangeDescriptor:
    status_desc = ProjectStatusChangeDescriptor()

    # Old version we look from yesterday only
    old_version = ProjectVersion.objects.filter(created__date__lt=date, project=project).order_by('-created').first()

    # New version we look for today only that can have multiple versions, eg. you make a draft, publish and archive
    new_version = ProjectVersion.objects.filter(created__date=date, project=project).order_by('-created').first()

    if not old_version:
        status_desc.fill_from_new_version(new_version, country)
    else:
        status_desc.fill_from_version_diff(old_version, new_version, country)

    return status_desc


def project_status_change_str(status_dict: dict) -> str:  # pragma: no cover
    changes = list()
    if status_dict.get('published'):
        changes.append('published')
    if status_dict.get('unpublished'):
        changes.append('unpublished')
    if status_dict.get('data_changed'):
        changes.append('data was changed')
    if status_dict.get('name_changed'):
        changes.append('name was changed')
    if status_dict.get('research_changed'):
        changes.append('research was changed')
    if status_dict.get('archived'):
        changes.append('archived')

    return ', '.join(changes)
