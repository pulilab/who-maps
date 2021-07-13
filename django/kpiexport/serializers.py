from rest_framework import serializers
from kpiexport.models import AuditLogUsers, AuditLogTokens, AuditLogProjectStatus, AuditLogProjectStages


class AuditLogUserDetailedSerializer(serializers.ModelSerializer):
    date = serializers.CharField(read_only=True, max_length=10)
    country = serializers.PrimaryKeyRelatedField(read_only=True)
    data = serializers.JSONField(read_only=True)
    registered = serializers.IntegerField(read_only=True)
    active = serializers.IntegerField(read_only=True)

    class Meta:
        model = AuditLogUsers
        fields = ("date", "country", "data", "registered", "active")


class AuditLogUserBasicSerializer(serializers.ModelSerializer):
    date = serializers.CharField(read_only=True, max_length=10)
    country = serializers.PrimaryKeyRelatedField(read_only=True)
    registered = serializers.IntegerField(read_only=True)
    active = serializers.IntegerField(read_only=True)
    data = serializers.SerializerMethodField()

    class Meta:
        model = AuditLogUsers
        fields = ("date", "country", "registered", "data", "active")

    @staticmethod
    def get_data(audit_log):
        return dict(total=audit_log.data.get('total'))


class AuditLogTokenBasicSerializer(serializers.ModelSerializer):
    date = serializers.CharField(read_only=True, max_length=10)
    country = serializers.PrimaryKeyRelatedField(read_only=True)
    tokens = serializers.IntegerField(read_only=True)

    class Meta:
        model = AuditLogTokens
        fields = ("date", "country", "tokens")


class AuditLogTokenDetailedSerializer(serializers.ModelSerializer):
    date = serializers.CharField(read_only=True, max_length=10)
    country = serializers.PrimaryKeyRelatedField(read_only=True)
    data = serializers.JSONField(read_only=True)
    tokens = serializers.IntegerField(read_only=True)

    class Meta:
        model = AuditLogTokens
        fields = ("date", "country", "data", "tokens")


class AuditLogProjectStatusBasicSerializer(serializers.ModelSerializer):
    date = serializers.CharField(read_only=True, max_length=10)
    country = serializers.PrimaryKeyRelatedField(read_only=True)
    published = serializers.SerializerMethodField()
    unpublished = serializers.SerializerMethodField()
    ready_to_publish = serializers.SerializerMethodField()
    to_delete = serializers.SerializerMethodField()
    growth = serializers.IntegerField(read_only=True)

    @staticmethod
    def get_published(audit_log):
        return len(audit_log.published)

    @staticmethod
    def get_unpublished(audit_log):
        return len(audit_log.unpublished)

    @staticmethod
    def get_ready_to_publish(audit_log):
        return len(audit_log.ready_to_publish)

    @staticmethod
    def get_to_delete(audit_log):
        return len(audit_log.to_delete)

    class Meta:
        model = AuditLogProjectStatus
        fields = ("date", "country", "published", "unpublished", "ready_to_publish", "to_delete", "growth")


class AuditLogProjectStatusDetailedSerializer(AuditLogProjectStatusBasicSerializer):
    data = serializers.SerializerMethodField()

    @staticmethod
    def get_data(audit_log):
        summary_dict = {}
        for donor_id in audit_log.data:
            summary_dict[donor_id] = {
                'published': len(audit_log.data[donor_id]['published']),
                'unpublished': len(audit_log.data[donor_id]['unpublished']),
                'ready_to_publish': len(audit_log.data[donor_id]['ready_to_publish']),
                'to_delete': len(audit_log.data[donor_id]['to_delete']),
                'growth': audit_log.data[donor_id]['growth']
            }

        return summary_dict

    class Meta:
        model = AuditLogProjectStatus
        fields = ("date", "country", "data", "published", "unpublished", "ready_to_publish", "to_delete", "growth")


class AuditLogProjectStagesBasicSerializer(serializers.ModelSerializer):
    date = serializers.CharField(read_only=True, max_length=10)
    country = serializers.PrimaryKeyRelatedField(read_only=True)
    stages = serializers.SerializerMethodField()

    @staticmethod
    def get_stages(audit_log):
        return {stage: len(val) for stage, val in audit_log.stages.items()}

    class Meta:
        model = AuditLogProjectStages
        fields = ("date", "country", "stages")


class AuditLogProjectStagesDetailedSerializer(AuditLogProjectStagesBasicSerializer):
    data = serializers.SerializerMethodField()

    @staticmethod
    def get_data(audit_log):
        result_dict = {}
        for donor_id, donor_dict in audit_log.data.items():
            result_dict[donor_id] = {stage: len(val) for stage, val in donor_dict.items()}
        return result_dict

    class Meta:
        model = AuditLogProjectStages
        fields = ("date", "country", "stages", "data")
