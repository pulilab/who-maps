from rest_framework import serializers

from .models import Country


class CountryListSerializer(serializers.Serializer):

    class Meta:
        model = Country
        fields = ("id", "name",)
