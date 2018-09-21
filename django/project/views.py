import functools
import csv
from collections import OrderedDict

from django.db import transaction
from django.db.models import QuerySet
from django.http import HttpResponse
from rest_framework import status
from rest_framework.exceptions import ValidationError
from rest_framework.mixins import RetrieveModelMixin, ListModelMixin
from rest_framework.validators import UniqueValidator
from rest_framework.viewsets import ViewSet, GenericViewSet
from rest_framework.response import Response
from core.views import TokenAuthMixin, TeamTokenAuthMixin, get_object_or_400
from project.cache import cache_structure
from project.models import HSCGroup
from user.models import Organisation
from toolkit.models import Toolkit, ToolkitVersion
from country.models import Country, CountryField, Donor

from .serializers import ProjectDraftSerializer, ProjectGroupSerializer, ProjectPublishedSerializer, INVESTOR_CHOICES, \
    MapProjectCountrySerializer, CountryCustomAnswerSerializer, DonorCustomAnswerSerializer
from .models import Project, CoverageVersion, InteroperabilityLink, TechnologyPlatform, DigitalStrategy, \
    HealthCategory, Licence, InteroperabilityStandard, HISBucket, HSCChallenge, HealthFocusArea


class ProjectPublicViewSet(ViewSet):
    @staticmethod
    def by_district(request, country_id):
        """
        Retrieves list of projects by district
        """

        # TODO: this is very very suboptimal, should switch to mongodb aggregate framework

        projects = Project.objects.published_only().filter(data__country=int(country_id))

        # get district names
        district_names = set()

        def district_name_finder(projects):
            for project in projects:
                for district in project.data.get('coverage', []):
                    district_names.add(district.get('district'))

        district_name_finder(projects)

        # build project list by districts
        result_dict = {name: [] for name in district_names}

        def filter_project_by_district_name(districts, projects):
            for district_name in districts:
                for project in projects:
                    for district in project.data.get('coverage', []):
                        if district.get('district') == district_name:
                            result_dict[district_name].append({
                                "approved": project.approval.approved if hasattr(project, 'approval') else None,
                                "id": project.id,
                                "name": project.name,
                                "organisation": Organisation.get_name_by_id(project.data.get('organisation'))
                            })

        filter_project_by_district_name(district_names, projects)

        return Response(result_dict)

    @staticmethod
    def list_all(request, *args, **kwargs):
        """
        Retrieves list of projects (optionally by country)
        """

        def get_strategies(platforms):
            ds_names = []
            for platform in platforms:
                ds_names.extend([x.name for x in DigitalStrategy.objects.get_names_for_ids(platform['strategies'])])
            return list(set(ds_names))

        projects = Project.objects.published_only()  # lazy QuerySet

        if kwargs.get("country_id"):
            projects = projects.filter(data__country=int(kwargs.get("country_id")))

        result_list = functools.reduce(
            lambda acc, p: acc + [{
                "approved": p.approval.approved if hasattr(p, 'approval') else None,
                "id": p.id,
                "uuid": p.public_id,
                "name": p.name,
                "organisation": p.data.get('organisation'),
                "organisation_name": Organisation.get_name_by_id(p.data.get('organisation')),
                "donors": p.data.get('donors'),
                "country": p.data.get('country'),
                "country_name": Country.get_name_by_id(p.data.get('country')),
                "contact_name": p.data.get('contact_name'),
                "contact_email": p.data.get('contact_email'),
                "implementation_overview": p.data.get('implementation_overview'),
                "implementing_partners": p.data.get('implementing_partners'),
                "implementation_dates": p.data.get('implementation_dates'),
                "health_focus_areas": [x.name for x in HealthFocusArea.objects.get_names_for_ids(
                    p.data.get("health_focus_areas", []))],
                "digital_strategies": get_strategies(p.data.get("platforms", [])),
                "hsc_challenges": [x.challenge for x in HSCChallenge.objects.get_names_for_ids(
                    p.data.get("hsc_challenges", []))],
                "his_bucket": [x.name for x in HISBucket.objects.get_names_for_ids(p.data.get("his_bucket", []))],
                "geographic_scope": p.data.get('geographic_scope'),
                "platforms": [x.name for x in TechnologyPlatform.objects.get_names_for_ids(
                    [x['id'] for x in p.data.get("platforms", [])])],
            }], projects, [])
        return Response(result_list)

    def project_structure(self, request):
        return Response(self._get_project_structure())

    @cache_structure
    def _get_project_structure(self):
        strategies = []
        for group, group_name in DigitalStrategy.GROUP_CHOICES:
            sub_groups = []
            for parent in DigitalStrategy.objects.filter(group=group, parent=None).all():
                sub_groups.append(dict(
                    id=parent.id,
                    name=parent.name,
                    strategies=parent.strategies.filter(is_active=True).values('id', 'name')
                ))
            strategies.append(dict(
                name=group_name,
                subGroups=sub_groups
            ))

        health_focus_areas = []
        for category in HealthCategory.objects.all():
            health_focus_areas.append(dict(
                id=category.id,
                name=category.name,
                health_focus_areas=category.health_focus_areas.filter(is_active=True).values('id', 'name')
            ))

        hsc_challenges = []
        for group in HSCGroup.objects.values('id', 'name'):
            hsc_challenges.append(dict(
                name=group['name'],
                challenges=[{'id': c['id'], 'challenge': c['name']}
                            for c in HSCChallenge.objects.filter(group__id=group['id']).values('id', 'name')]
            ))

        return dict(
            interoperability_links=InteroperabilityLink.objects.values('id', 'pre', 'name'),
            technology_platforms=TechnologyPlatform.objects.values('id', 'name'),
            licenses=Licence.objects.values('id', 'name'),
            interoperability_standards=InteroperabilityStandard.objects.values('id', 'name'),
            his_bucket=HISBucket.objects.values('id', 'name'),
            health_focus_areas=health_focus_areas,
            hsc_challenges=hsc_challenges,
            strategies=strategies
        )

    @staticmethod
    def project_structure_export(request):
        """
        Used to sync objects to "Implementation Toolkit"
        """
        return Response(dict(
            interoperability_links=InteroperabilityLink.objects.values('id', 'name'),
            technology_platforms=TechnologyPlatform.objects.values('id', 'name'),
            digital_strategies=DigitalStrategy.objects.values('id', 'name')
        ))


class ProjectListViewSet(TokenAuthMixin, ViewSet):
    def list(self, request, *args, **kwargs):
        """
        Retrieves list of projects user's projects.
        """
        data = []
        for project in Project.objects.member_of(request.user):
            published = project.to_representation()
            draft = project.to_representation(draft_mode=True)
            data.append(project.to_response_dict(published=published, draft=draft))

        return Response(data)


class ProjectRetrieveViewSet(TeamTokenAuthMixin, ViewSet):
    def get_permissions(self):
        if self.action == "retrieve":
            return []  # Retrieve needs a bit more complex filtering based on user permission
        else:
            return super(ProjectRetrieveViewSet, self).get_permissions()

    def _get_permission_based_data(self, project):
        draft = None

        if not self.request.user.is_authenticated:  # ANON
            data = project.get_anon_data()
        else:  # LOGGED IN
            is_member = project.is_member(self.request.user)
            is_country_user_or_admin = project.is_country_user_or_admin(self.request.user)
            if is_member or is_country_user_or_admin or self.request.user.is_superuser:
                data = project.get_member_data()
                draft = project.get_member_draft()
            else:
                data = project.get_non_member_data()

        if draft:
            draft = project.to_representation(data=draft, draft_mode=True)
        published = project.to_representation(data=data)

        return project.to_response_dict(published=published, draft=draft)

    def retrieve(self, request, *args, **kwargs):
        """
        Retrieves a project.
        """
        project = get_object_or_400(Project, "No such project", id=kwargs.get("pk"))

        return Response(self._get_permission_based_data(project))


class CheckRequiredMixin:
    def check_required(self, queryset: QuerySet, answers: OrderedDict):
        required_ids = set(queryset.filter(required=True).values_list('id', flat=True))
        present_ids = {answer['question_id'] for answer in answers}
        missing_ids = required_ids - present_ids
        if missing_ids:
            return {i: ['This field is required'] for i in missing_ids}


class ProjectPublishViewSet(CheckRequiredMixin, TeamTokenAuthMixin, ViewSet):
    @transaction.atomic
    def update(self, request, project_id, country_id):
        """
        Publish a project
        Takes project data and custom question-answers in one go.
        """
        project = get_object_or_400(Project, select_for_update=True, error_message="No such project", id=project_id)
        country = get_object_or_400(Country, error_message="No such country", id=country_id)

        country_answers = None
        all_donor_answers = []
        errors = {}

        if 'project' not in request.data:
            raise ValidationError({'non_field_errors': 'Project data is missing'})

        data_serializer = ProjectPublishedSerializer(project, data=request.data['project'])

        data_serializer.fields.get('name').validators = \
            [v for v in data_serializer.fields.get('name').validators if not isinstance(v, UniqueValidator)]
        data_serializer.fields.get('name').validators \
            .append(UniqueValidator(queryset=project.__class__.objects.all().exclude(id=project.id)))

        self.check_object_permissions(self.request, project)
        data_serializer.is_valid()
        if data_serializer.errors:
            errors['project'] = data_serializer.errors

        if country.country_questions.exists():
            if 'country_custom_answers' not in request.data:
                raise ValidationError({'non_field_errors': 'Country answers are missing'})
            else:
                country_answers = CountryCustomAnswerSerializer(data=request.data['country_custom_answers'], many=True,
                                                                context=dict(question_queryset=country.country_questions, is_draft=False))

                if country_answers.is_valid():
                    required_errors = self.check_required(country.country_questions, country_answers.validated_data)
                    if required_errors:
                        errors['country_custom_answers'] = required_errors
                else:
                    errors['country_custom_answers'] = country_answers.errors

        if data_serializer.validated_data.get('donors'):
            if 'donor_custom_answers' not in request.data:
                raise ValidationError({'non_field_errors': 'Donor answers are missing'})
            for donor_id in data_serializer.validated_data['donors']:
                if str(donor_id) not in request.data['donor_custom_answers']:
                    raise ValidationError({'non_field_errors': 'Donor answers are missing'})
                donor = Donor.objects.get(id=donor_id)
                if donor and donor.donor_questions.exists():
                    donor_answers = DonorCustomAnswerSerializer(data=request.data['donor_custom_answers'][str(donor_id)], many=True,
                                                                context=dict(question_queryset=donor.donor_questions, is_draft=True))

                    if not donor_answers.is_valid():
                        errors.setdefault('donor_custom_answers', {})
                        errors['donor_custom_answers'].setdefault(donor_id, {})
                        errors['donor_custom_answers'][donor_id] = donor_answers.errors
                    else:
                        all_donor_answers.append((donor_id, donor_answers))

        if errors:
            return Response(errors, status=status.HTTP_400_BAD_REQUEST)
        else:
            instance = data_serializer.save()
            if country_answers:
                country_answers.context['project'] = instance
                instance = country_answers.save()
            for donor_id, donor_answers in all_donor_answers:
                donor_answers.context['project'] = instance
                donor_answers.context['donor_id'] = donor_id
                instance = donor_answers.save()
            instance.save()

        project.reset_approval()

        draft = instance.to_representation(draft_mode=True)
        published = instance.to_representation()
        return Response(instance.to_response_dict(published=published, draft=draft))


class ProjectDraftViewSet(TeamTokenAuthMixin, ViewSet):
    def create(self, request, country_id):
        """
        Creates a Draft project.
        """
        country = get_object_or_400(Country, error_message="No such country", id=country_id)

        country_answers = None
        all_donor_answers = []
        errors = {}

        if 'project' not in request.data:
            raise ValidationError({'non_field_errors': 'Project data is missing'})

        data_serializer = ProjectDraftSerializer(data=request.data['project'])
        data_serializer.is_valid()
        instance = data_serializer.save()

        if data_serializer.errors:
            errors['project'] = data_serializer.errors

        if country.country_questions.exists():
            if 'country_custom_answers' not in request.data:
                raise ValidationError({'non_field_errors': 'Country answers are missing'})
            else:
                country_answers = CountryCustomAnswerSerializer(data=request.data['country_custom_answers'], many=True,
                                                                context=dict(question_queryset=country.country_questions, is_draft=True))

                if not country_answers.is_valid():
                    errors['country_custom_answers'] = country_answers.errors

        if data_serializer.validated_data.get('donors'):
            if 'donor_custom_answers' not in request.data:
                raise ValidationError({'non_field_errors': 'Donor answers are missing'})
            for donor_id in data_serializer.validated_data['donors']:
                if str(donor_id) not in request.data['donor_custom_answers']:
                    raise ValidationError({'non_field_errors': 'Donor answers are missing'})
                donor = Donor.objects.get(id=donor_id)
                if donor and donor.donor_questions.exists():
                    donor_answers = DonorCustomAnswerSerializer(data=request.data['donor_custom_answers'][str(donor_id)], many=True,
                                                                context=dict(question_queryset=donor.donor_questions, is_draft=True))

                    if not donor_answers.is_valid():
                        errors.setdefault('donor_custom_answers', {})
                        errors['donor_custom_answers'].setdefault(donor_id, {})
                        errors['donor_custom_answers'][donor_id] = donor_answers.errors
                    else:
                        all_donor_answers.append((donor_id, donor_answers))

        if errors:
            return Response(errors, status=status.HTTP_400_BAD_REQUEST)
        else:
            if country_answers:
                country_answers.context['project'] = instance
                instance = country_answers.save()
            for donor_id, donor_answers in all_donor_answers:
                donor_answers.context['project'] = instance
                donor_answers.context['donor_id'] = donor_id
                instance = donor_answers.save()
            instance.save()
            instance.team.add(request.user.userprofile)

        data = instance.to_representation(draft_mode=True)
        return Response(instance.to_response_dict(published={}, draft=data), status=status.HTTP_201_CREATED)

    @transaction.atomic
    def update(self, request, project_id, country_id):
        """
        Updates a draft project.
        """
        project = get_object_or_400(Project, select_for_update=True, error_message="No such project", id=project_id)
        country = get_object_or_400(Country, error_message="No such country", id=country_id)

        country_answers = None
        all_donor_answers = []
        errors = {}

        if 'project' not in request.data:
            raise ValidationError({'non_field_errors': 'Project data is missing'})

        data_serializer = ProjectDraftSerializer(project, data=request.data['project'])
        self.check_object_permissions(self.request, project)
        data_serializer.is_valid()
        if data_serializer.errors:
            errors['project'] = data_serializer.errors

        if country.country_questions.exists():
            if 'country_custom_answers' not in request.data:
                raise ValidationError({'non_field_errors': 'Country answers are missing'})
            else:
                country_answers = CountryCustomAnswerSerializer(data=request.data['country_custom_answers'], many=True,
                                                                context=dict(question_queryset=country.country_questions, is_draft=True))

                if not country_answers.is_valid():
                    errors['country_custom_answers'] = country_answers.errors

        if data_serializer.validated_data.get('donors'):
            if 'donor_custom_answers' not in request.data:
                raise ValidationError({'non_field_errors': 'Donor answers are missing'})
            for donor_id in data_serializer.validated_data['donors']:
                if str(donor_id) not in request.data['donor_custom_answers']:
                    raise ValidationError({'non_field_errors': 'Donor answers are missing'})
                donor = Donor.objects.get(id=donor_id)
                if donor and donor.donor_questions.exists():
                    donor_answers = DonorCustomAnswerSerializer(data=request.data['donor_custom_answers'][str(donor_id)], many=True,
                                                                context=dict(question_queryset=donor.donor_questions, is_draft=True))

                    if not donor_answers.is_valid():
                        errors.setdefault('donor_custom_answers', {})
                        errors['donor_custom_answers'].setdefault(donor_id, {})
                        errors['donor_custom_answers'][donor_id] = donor_answers.errors
                    else:
                        all_donor_answers.append((donor_id, donor_answers))

        if errors:
            return Response(errors, status=status.HTTP_400_BAD_REQUEST)
        else:
            instance = data_serializer.save()
            if country_answers:
                country_answers.context['project'] = instance
                instance = country_answers.save()
            for donor_id, donor_answers in all_donor_answers:
                donor_answers.context['project'] = instance
                donor_answers.context['donor_id'] = donor_id
                instance = donor_answers.save()
            instance.save()

        draft = instance.to_representation(draft_mode=True)
        published = instance.to_representation()
        return Response(instance.to_response_dict(published=published, draft=draft), status=status.HTTP_200_OK)


class ProjectGroupViewSet(TeamTokenAuthMixin, RetrieveModelMixin, GenericViewSet):
    queryset = Project.objects.all()
    serializer_class = ProjectGroupSerializer

    @transaction.atomic
    def update(self, request, *args, **kwargs):
        instance = get_object_or_400(Project, select_for_update=True, error_message="No such project", id=kwargs["pk"])
        self.check_object_permissions(self.request, instance)
        serializer = ProjectGroupSerializer(instance, data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)


class ProjectVersionViewSet(TeamTokenAuthMixin, ViewSet):
    def create(self, request, project_id):
        """
        Makes versions out of Toolkit and coverage data for the project.
        """
        project = get_object_or_400(Project, "No such project.", id=project_id)
        self.check_object_permissions(request, project)

        if not project.public_id:
            return Response(status=status.HTTP_406_NOT_ACCEPTABLE)

        last_cov_ver = CoverageVersion.objects.filter(project_id=project_id).order_by("-version").first()
        if not last_cov_ver:
            # No versions yet.
            new_version = 1
        else:
            new_version = last_cov_ver.version + 1

        current_cov = project.data.get("coverage", [])
        current_cov += [project.data.get('national_level_deployment', {})]

        new_cov_ver = CoverageVersion(project_id=project_id, version=new_version, data=current_cov)
        new_cov_ver.save()

        # Make a new version from current toolkit.
        last_toolkit_ver = ToolkitVersion.objects.filter(project_id=project_id).order_by("-version").first()
        if not last_toolkit_ver:
            # No versions yet.
            new_version = 1
        else:
            new_version = last_toolkit_ver.version + 1
        current_toolkit = get_object_or_400(Toolkit, "No such Toolkit", project_id=project_id).data
        new_toolkit_ver = ToolkitVersion(project_id=project_id, version=new_version, data=current_toolkit)
        new_toolkit_ver.save()
        data = {
            "coverage": {
                "last_version": new_cov_ver.version,
                "last_version_date": new_cov_ver.modified
            },
            "toolkit": {
                "last_version": new_toolkit_ver.version,
                "last_version_date": new_toolkit_ver.modified
            }
        }
        return Response(data, status=status.HTTP_201_CREATED)

    def toolkit_versions(self, request, project_id):
        """
        Retrieves all toolkit versions for the given project_id.
        """
        project = get_object_or_400(Project, "No such project.", id=project_id)
        self.check_object_permissions(request, project)

        toolkit_versions = ToolkitVersion.objects.filter(project_id=project_id) \
            .order_by("version").values("version", "data", "modified")
        return Response(toolkit_versions)

    def coverage_versions(self, request, project_id):
        """
        Retrieves all coverage versions for the given project_id.
        """
        coverage_versions = CoverageVersion.objects.filter(project_id=project_id) \
            .order_by("version").values("version", "data", "modified")
        return Response(coverage_versions)


class CSVExportViewSet(TeamTokenAuthMixin, ViewSet):
    def create(self, request):
        """
        Creates CSV file out of a list of project IDs
        """
        if not request.data or not isinstance(request.data, list):
            return HttpResponse(status=status.HTTP_404_NOT_FOUND)

        projects = Project.objects.filter(id__in=request.data)
        # determine if there was only one country selected
        single_country = len(set([p.data.get('country') for p in projects])) == 1
        results = []

        for p in projects:
            representation = [
                {'Name': p.name},
                {'UUID': p.public_id},
                {'Country': Country.get_name_by_id(p.data.get('country'))},
                {'Implementation Date': p.data.get('implementation_dates')},
                {'Start Date': p.data.get('start_date')},
                {'End Date': p.data.get('end_date')},
                {'Organisation Name': Organisation.get_name_by_id(p.data.get('organisation'))},
                {'Donors': ", ".join([Donor.objects.get(id=int(x)).name for x in p.data.get('donors', [])])},
                {"Implementing Partners": ", ".join(p.data.get('implementing_partners', []))},
                {"Point of Contact": ", ".join((p.data.get('contact_name'), p.data.get('contact_email')))},
                {"Overview of digital health implementation": p.data.get('implementation_overview')},
                {"Geographical scope": p.data.get('geographic_scope')},
                {"Health Focus Areas": ", ".join(
                    [str(x) for x in HealthFocusArea.objects.get_names_for_ids(p.data.get("health_focus_areas", []))])},
                {"Software": ", ".join([str(x) for x in
                                        TechnologyPlatform.objects.get_names_for_ids(
                                            [x['id'] for x in p.data.get("platforms", [])])])},
                {'Health System Challenges': ", ".join(
                    ['({}) {}'.format(x.name, x.challenge) for x in
                     HSCChallenge.objects.get_names_for_ids(p.data.get('hsc_challenges', []))])},
                {'Health Information System Support': ", ".join(
                    [str(x) for x in HISBucket.objects.get_names_for_ids(p.data.get("his_bucket", []))])},
                {'Government Investor': INVESTOR_CHOICES[p.data.get('government_investor', 0)][1]},
                {'Licenses': ", ".join(
                    [str(x) for x in Licence.objects.get_names_for_ids(p.data.get("licenses", []))])},
                {'Repository': p.data.get('repository')},
                {'Mobile Application': p.data.get('mobile_application')},
                {'Wiki': p.data.get('wiki')},
                {'Interoperability Standards': ", ".join(
                    [str(x) for x in InteroperabilityStandard.objects.get_names_for_ids(
                        p.data.get("interoperability_standards", []))])},
                {'National Level Deployment': p.str_national_level_deployment()},
                {'First Level Coverage': p.str_coverage()},
                {'Second Level Coverage': p.str_coverage(second_level=True)},
            ]
            if single_country:
                representation.extend([field.to_csv() for field in CountryField.get_for_project(p)])
            results.append(representation)

        response = HttpResponse(content_type='text/csv')
        response['Content-Disposition'] = 'attachment; filename="csv.csv"'

        writer = csv.writer(response, delimiter=';')

        # HEADER
        writer.writerow([list(field.keys())[0] for field in results[0]])

        # PROJECTS
        [writer.writerow([list(field.values())[0] for field in project]) for project in results]

        return response


class MapProjectCountryViewSet(ListModelMixin, GenericViewSet):
    queryset = Project.objects.published_only()
    serializer_class = MapProjectCountrySerializer
