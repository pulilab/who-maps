from rest_framework import generics, mixins, viewsets
from .models import Country
from .serializers import CountryListSerializer, LandingPageSerializer


class CountryListAPIView(generics.ListAPIView):
    queryset = Country.objects.values('id', 'name', 'code')
    serializer_class = CountryListSerializer


class RetrieveLandingPageViewSet(mixins.RetrieveModelMixin,
                                 viewsets.GenericViewSet):
    queryset = Country.objects.all()
    serializer_class = LandingPageSerializer
    lookup_field = "code"
