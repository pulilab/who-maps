from rest_framework import generics
from rest_framework.response import Response
from rest_framework.authentication import TokenAuthentication
from rest_framework.decorators import api_view, authentication_classes
from rest_framework.decorators import permission_classes
from rest_framework.permissions import IsAuthenticated

from core.views import TokenAuthMixin, get_object_or_400
from .models import Country
from .serializers import CountryListSerializer


@api_view(['GET'])
@authentication_classes((TokenAuthentication,))
@permission_classes((IsAuthenticated,))
def get_geodata(request, country_id):
    """
    Retrieves geodata based on country_id.

    Args:
        country_id: ID for the given country.

    Returns:
        json: geodata for the given country in JSON.
    """
    country = get_object_or_400(Country, "No such country.", id=country_id)
    return Response(country.geodata)


@api_view(['GET'])
@authentication_classes((TokenAuthentication,))
@permission_classes((IsAuthenticated,))
def get_districts(request, country_id):
    """
    Retrieves districts based on country_id.

    Args:
        country_id: ID for the given country.

    Returns:
        json: districts for the given country in JSON.
    """
    country = get_object_or_400(Country, "No such country.", id=country_id)
    admin_level_5 = country.geodata.get("admin_level_5", None)
    if admin_level_5:
        districts = []
        for item in admin_level_5["objects"]["admin_level_5"]["geometries"]:
            if "properties" in item.keys():
                if "admin_level" in item["properties"].keys():
                    name = item["properties"].get("name:en", None) or item["properties"].get("name")
                    districts.append(name)
        return Response(set(districts))
    else:
        # No admin_level_5 for the given country.
        return Response(list())


class CountryListAPIView(TokenAuthMixin, generics.ListAPIView):
    queryset = Country.objects.all()
    serializer_class = CountryListSerializer
