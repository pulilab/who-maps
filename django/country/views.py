from rest_framework.response import Response
from rest_framework.authentication import TokenAuthentication
from rest_framework.decorators import api_view, authentication_classes
from rest_framework.decorators import permission_classes
from rest_framework.permissions import IsAuthenticated

from core.views import TokenAuthMixin, get_object_or_400
from .models import Country


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
