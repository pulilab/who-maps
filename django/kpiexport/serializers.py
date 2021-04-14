from rest_framework import serializers
from kpiexport.models import AuditLogUsers


class AuditLogUserSerializer(serializers.ModelSerializer):
    date = serializers.CharField(read_only=True, max_length=10)
    country = serializers.PrimaryKeyRelatedField(read_only=True)
    data = serializers.JSONField(read_only=True)
    registered = serializers.IntegerField(read_only=True)
    active = serializers.IntegerField(read_only=True)

    class Meta:
        model = AuditLogUsers
        fields = ("date", "country", "data", "registered", "active")
