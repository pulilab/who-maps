from rest_framework import serializers

from .models import Country, PartnerLogo


class CountryListSerializer(serializers.ModelSerializer):

    class Meta:
        model = Country
        fields = ("id", "name", "code")


class LandingPageSerializer(serializers.ModelSerializer):
    partner_logos = serializers.SerializerMethodField()

    class Meta:
        model = Country
        fields = ("id", "name", "code", "logo", "cover", "cover_text", "footer_title", "footer_text", "partner_logos")

    @staticmethod
    def get_partner_logos(obj):
        return [p.image_url for p in PartnerLogo.objects.filter(country=obj)]
