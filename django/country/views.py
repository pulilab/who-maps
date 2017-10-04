from copy import deepcopy

from rest_framework import generics, mixins, viewsets
from rest_framework.views import APIView
from rest_framework.response import Response

from project.models import Project, DigitalStrategy, TechnologyPlatform, InteroperabilityLink
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


class CountryExportView(APIView):

    def get(self, request, *args, **kwargs):
        data = []
        for country in Country.objects.all():
            country_data = {'country': country.name}
            country_data['platforms'] = []
            country_data['interoperability_links'] = []
            for project in Project.projects.filter(data__country=country.id):
                owners_data = [{'name': project.data['contact_name'], 'email': project.data['contact_email']}]
                # get platforms and strategies
                for platform in project.data['platforms']:
                    platform_id = TechnologyPlatform.objects.get(name=platform['name']).id
                    strategies = [{'id': x.id, 'name': x.name} for x in DigitalStrategy.objects.filter(name__in=platform['strategies'])]
                    platform_data = {
                        'id': platform_id,
                        'name': platform['name'],
                        'strategies': strategies,
                        'owners': deepcopy(owners_data),
                    }
                    country_data['platforms'].append(platform_data)
                # get interop links
                link_names = [x['name'] for x in project.data['interoperability_links']]
                links = [{'id': x.id, 'name': x.name} for x in InteroperabilityLink.objects.filter(name__in=link_names)]
                country_data['interoperability_links'].extend(links)
            data.append(country_data)

        return Response(data)
