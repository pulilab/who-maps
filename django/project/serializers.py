from rest_framework import serializers

from .models import Project, Report, Publication


class ProjectSerializer(serializers.ModelSerializer):
    reports = serializers.SerializerMethodField()
    publications = serializers.SerializerMethodField()

    def get_reports(self, obj):
        reports = Report.objects.filter(project_id=obj.id)
        serialized = ReportSerializer(instance=reports, many=True)
        return serialized.data

    def get_publications(self, obj):
        publications = Publication.objects.filter(project_id=obj.id)
        serialized = PublicationSerializer(instance=publications, many=True)
        return serialized.data

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
