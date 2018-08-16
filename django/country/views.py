from rest_framework import generics, mixins, viewsets
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.parsers import FormParser, MultiPartParser

from user.models import UserProfile
from project.models import Project, DigitalStrategy, TechnologyPlatform, InteroperabilityLink
from .models import Country, CountryField, Donor, PartnerLogo, DonorPartnerLogo
from .serializers import CountryFieldsListSerializer, CountryFieldsWriteSerializer, CountryMapDataSerializer, \
    CountrySerializer, SuperAdminCountrySerializer, AdminCountrySerializer, UserCountrySerializer, \
    PartnerLogoSerializer, DonorSerializer, DonorPartnerLogoSerializer


class CountryViewSet(mixins.ListModelMixin, mixins.UpdateModelMixin, mixins.RetrieveModelMixin,
                     viewsets.GenericViewSet):
    queryset = Country.objects.all()
    serializer_class = CountrySerializer
    parser_classes = (MultiPartParser, FormParser)
    lookup_field = "code"

    def get_serializer_class(self):
        if self.action in ['update', 'retrieve', 'partial_update']:
            country = self.get_object()
            profile = self.request.user.userprofile
            if profile.account_type == UserProfile.GOVERNMENT and profile in country.users.all():
                return UserCountrySerializer
            if profile.account_type == UserProfile.COUNTRY_ADMIN and profile in country.admins.all():
                return AdminCountrySerializer
            if profile.account_type == UserProfile.SUPER_COUNTRY_ADMIN and profile in country.super_admins.all():
                return SuperAdminCountrySerializer
        return super().get_serializer_class()


class DonorViewSet(mixins.UpdateModelMixin, mixins.RetrieveModelMixin, viewsets.GenericViewSet):
    queryset = Donor.objects.all()
    serializer_class = DonorSerializer
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
