from rest_framework import generics, mixins, viewsets, status
from rest_framework.response import Response

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
        country_id = self.kwargs.get('country_id')
        return CountryField.objects.filter(country_id=country_id, project=None, enabled=True)


class CountryFieldsCreateUpdateView(generics.CreateAPIView):
    serializer_class = CountryFieldsWriteSerializer

    def get_queryset(self):
        return CountryField.objects.filter(enabled=True)

    def put(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset())
        country_id = self.kwargs.get('country_id')
        project_id = self.kwargs.get('project_id')
        instances = queryset.filter(country_id=country_id, project_id=project_id)

        # May raise a permission denied
        self.check_object_permissions(self.request, instances[0])

        serializer = self.get_serializer(instances, data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()

        return Response(serializer.data)
