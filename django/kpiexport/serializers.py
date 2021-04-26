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
