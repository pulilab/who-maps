from rest_framework import generics, mixins, viewsets

from .models import Country, CountryField
from .serializers import CountryListSerializer, LandingPageSerializer, CountryFieldsListSerializer, \
    CountryFieldsWriteSerializer


class CountryListAPIView(generics.ListAPIView):
    queryset = Country.objects.values('id', 'name', 'code')
    serializer_class = CountryListSerializer


class RetrieveLandingPageViewSet(mixins.RetrieveModelMixin,
                                 viewsets.GenericViewSet):
    queryset = Country.objects.all()
    serializer_class = LandingPageSerializer
    lookup_field = "code"


class CountryFieldsListView(generics.ListAPIView):
    serializer_class = CountryFieldsListSerializer

    def get_queryset(self):
        return CountryField.objects.get_schema(self.kwargs.get('country_id'))


class CountryFieldsCreateUpdateView(generics.CreateAPIView):
    serializer_class = CountryFieldsWriteSerializer

    def get_queryset(self):
        return CountryField.objects.filter(enabled=True)
