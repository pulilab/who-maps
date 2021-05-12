from rest_framework import serializers
from kpiexport.models import AuditLogUsers, AuditLogTokens


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
    published = serializers.IntegerField(read_only=True)
    unpublished = serializers.IntegerField(read_only=True)
    ready_to_publish = serializers.IntegerField(read_only=True)
    to_delete = serializers.IntegerField(read_only=True)
    growth = serializers.IntegerField(read_only=True)

    class Meta:
        model = AuditLogTokens
        fields = ("date", "country", "published", "unpublished", "ready_to_publish", "to_delete", "growth")


class AuditLogProjectStatusDetailedSerializer(AuditLogProjectStatusBasicSerializer):
    data = serializers.JSONField(read_only=True)

    class Meta:
        model = AuditLogTokens
        fields = ("date", "country", "data", "published", "unpublished", "ready_to_publish", "to_delete", "growth")
