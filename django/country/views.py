from rest_framework import generics, mixins, viewsets
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.parsers import FormParser, MultiPartParser

from project.models import Project, DigitalStrategy, TechnologyPlatform, InteroperabilityLink
from .models import Country, CountryField, Donor, PartnerLogo, DonorPartnerLogo
from .serializers import CountryListSerializer, LandingPageSerializer, CountryFieldsListSerializer, \
    CountryFieldsWriteSerializer, CountryMapDataSerializer, CountryAdminSerializer, PartnerLogoSerializer, \
    DonorAdminSerializer, DonorPartnerLogoSerializer


class CountryListAPIView(generics.ListAPIView):
    queryset = Country.objects.all()
    serializer_class = CountryListSerializer


class CountryAdminViewSet(mixins.UpdateModelMixin, mixins.RetrieveModelMixin, viewsets.GenericViewSet):
    queryset = Country.objects.all()
    serializer_class = CountryAdminSerializer
    parser_classes = (MultiPartParser, FormParser)


class DonorAdminViewSet(mixins.UpdateModelMixin, mixins.RetrieveModelMixin, viewsets.GenericViewSet):
    queryset = Donor.objects.all()
    serializer_class = DonorAdminSerializer
    parser_classes = (MultiPartParser, FormParser)


class PartnerLogoViewSet(mixins.CreateModelMixin, mixins.RetrieveModelMixin, mixins.DestroyModelMixin,
                         viewsets.GenericViewSet):
    queryset = PartnerLogo.objects.all()
    serializer_class = PartnerLogoSerializer
    parser_classes = (MultiPartParser, FormParser)


class DonorPartnerLogoViewSet(mixins.CreateModelMixin, mixins.RetrieveModelMixin, mixins.DestroyModelMixin,
                              viewsets.GenericViewSet):
    queryset = DonorPartnerLogo.objects.all()
    serializer_class = DonorPartnerLogoSerializer
    parser_classes = (MultiPartParser, FormParser)


class RetrieveLandingPageViewSet(mixins.RetrieveModelMixin, viewsets.GenericViewSet):
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
            country_data = {'country': country.name, 'country_code': country.code}
            country_data['platforms'] = {}
            country_data['interoperability_links'] = {}
            for project in Project.objects.filter(data__country=country.id):
                # get platforms
                for platform in project.data['platforms']:
                    platform_id = str(TechnologyPlatform.objects.get(name=platform['name']).id)
                    if platform_id not in country_data['platforms']:
                        country_data['platforms'][platform_id] = {
                            'name': platform['name'],
                            'strategies': {},
                            'owners': {},
                        }
                    # get strategies
                    strategies = {
                        str(x.id): x.name
                        for x in DigitalStrategy.objects.filter(name__in=platform['strategies'])
                    }
                    country_data['platforms'][platform_id]['strategies'].update(strategies)
                    # get owners
                    owners_data = {project.data['contact_email']: project.data['contact_name']}
                    country_data['platforms'][platform_id]['owners'].update(owners_data)
                # get interop links
                link_names = [x['name'] for x in project.data['interoperability_links']]
                links = {str(x.id): x.name for x in InteroperabilityLink.objects.filter(name__in=link_names)}
                country_data['interoperability_links'].update(links)
            data.append(country_data)

        return Response(data)


class CountryMapDataViewSet(mixins.UpdateModelMixin, mixins.RetrieveModelMixin, viewsets.GenericViewSet):
    queryset = Country.objects.all()
    serializer_class = CountryMapDataSerializer
