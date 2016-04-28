from rest_framework import serializers

from .models import Project, Strategy, Technology, Pipeline, Application
from .models import Report, Publication, Coverage


class CoverageSerializer(serializers.ModelSerializer):

    class Meta:
        model = Coverage
        read_only_fields = ("project",)


class ProjectListRetrieveSerializer(serializers.ModelSerializer):
    reports = serializers.SerializerMethodField()
    publications = serializers.SerializerMethodField()
    coverage = serializers.SerializerMethodField()

    def get_reports(self, obj):
        reports = Report.objects.filter(project_id=obj.id)
        serialized = ReportSerializer(instance=reports, many=True)
        return serialized.data

    def get_publications(self, obj):
        publications = Publication.objects.filter(project_id=obj.id)
        serialized = PublicationSerializer(instance=publications, many=True)
        return serialized.data

    def get_coverage(self, obj):
        coverage = Coverage.objects.filter(project_id=obj.id, version=None)
        serialized = CoverageSerializer(instance=coverage, many=True)
        return serialized.data

    class Meta:
        model = Project


class ProjectCreateUpdateSerializer(serializers.ModelSerializer):
    strategy_other = serializers.ListField(required=False)
    technology_other = serializers.ListField(required=False)
    pipeline_other = serializers.ListField(required=False)
    publications_new = serializers.ListField(required=False)
    reports_new = serializers.ListField(required=False)
    coverage_update = CoverageSerializer(many=True, required=False)
    publications_deleted = serializers.ListField(required=False)
    reports_deleted = serializers.ListField(required=False)
    coverage_deleted =  serializers.ListField(required=False)

    def create(self, validated_data):
        self.strip_extra_fields()
        self.create_other_fields()
        project = super(ProjectCreateUpdateSerializer, self).create(self.validated_data)
        self.save_new_related_data(project.id)
        self.delete_related_data(project.id)

        return project

    def update(self, instance, validated_data):
        self.strip_extra_fields()
        self.create_other_fields()
        project = super(ProjectCreateUpdateSerializer, self).update(instance, self.validated_data)
        self.save_new_related_data(project.id)
        self.delete_related_data(project.id)

        return project

    def strip_extra_fields(self):
        self.extra_fields = {}
        self.extra_fields["strategy_other"] = self._pop_or_empty("strategy_other")
        self.extra_fields["technology_other"] = self._pop_or_empty("technology_other")
        self.extra_fields["pipeline_other"] = self._pop_or_empty("pipeline_other")
        self.extra_fields["publications_new"] = self._pop_or_empty("publications_new")
        self.extra_fields["reports_new"] = self._pop_or_empty("reports_new")
        self.extra_fields["coverage_update"] = self._pop_or_empty("coverage_update")
        self.extra_fields["publications_deleted"] = self._pop_or_empty("publications_deleted")
        self.extra_fields["reports_deleted"] = self._pop_or_empty("reports_deleted")
        self.extra_fields["coverage_deleted"] = self._pop_or_empty("coverage_deleted")

    def create_other_fields(self):
        """
        Create the "other" fields in the database,
        and put back their ID to the original validated data.
        """
        for name in self.extra_fields["strategy_other"]:
            item = Strategy.objects.create(name=name, project_specific=True)
            self.validated_data["strategy"].append(item.id)

        for name in self.extra_fields["technology_other"]:
            item = Technology.objects.create(name=name, project_specific=True)
            self.validated_data["technology"].append(item.id)

        for name in self.extra_fields["pipeline_other"]:
            item = Pipeline.objects.create(name=name, project_specific=True)
            self.validated_data["pipeline"].append(item.id)

    def save_new_related_data(self, project_id):
        """
        Store new publications and reports.
        """
        for item in self.extra_fields["publications_new"]:
            Publication.objects.create(project_id=project_id, url=item)

        for item in self.extra_fields["reports_new"]:
            Report.objects.create(project_id=project_id, url=item)

        # Create or update coverage.
        for item in self.extra_fields["coverage_update"]:
            item.update(project_id=project_id)
            coverage, created = Coverage.objects.update_or_create(**item)

    def delete_related_data(self, project_id):
        """
        Delete removed publications and reports.
        """
        Publication.objects.filter(project_id=project_id, id__in=self.extra_fields["publications_deleted"]).delete()
        Report.objects.filter(project_id=project_id, id__in=self.extra_fields["reports_deleted"]).delete()
        Coverage.objects.filter(project_id=project_id, district__in=self.extra_fields["coverage_deleted"]).delete()

    def _pop_or_empty(self, key):
        """
        Boilerplate code for handling KeyError in case of dict.pop().

        Args:
            key (string): The key we need to pop.

        Returns:
            list: empty list on KeyError, otherwise the result of pop()
        """
        try:
            return self.validated_data.pop(key)
        except KeyError:
            return []

    class Meta:
        model = Project


class ReportSerializer(serializers.ModelSerializer):

    class Meta:
        model = Report
        fields = ("id", "url", "filename",)


class PublicationSerializer(serializers.ModelSerializer):

    class Meta:
        model = Publication
        fields = ("id", "url", "filename",)
