import pycountry
import requests

from requests import RequestException
from django.conf import settings
from django.http import HttpResponse
from rest_framework import generics, mixins, viewsets
from rest_framework.generics import get_object_or_404
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.parsers import FormParser, MultiPartParser
from rest_framework.permissions import IsAuthenticated

from user.models import UserProfile
from project.models import Project, DigitalStrategy, TechnologyPlatform, InteroperabilityLink
from .permissions import InAdminOrReadOnly, InSuperAdmin, InCountryAdminOrReadOnly, \
    InCountrySuperAdmin, InDonorSuperAdmin
from .models import Country, CountryField, Donor, PartnerLogo, DonorPartnerLogo, MapFile, CustomQuestion, \
    CountryCustomQuestion, DonorCustomQuestion
from .serializers import CountryFieldsListSerializer, CountryFieldsWriteSerializer, CountrySerializer, \
    SuperAdminCountrySerializer, AdminCountrySerializer, PartnerLogoSerializer, DonorSerializer, \
    SuperAdminDonorSerializer, AdminDonorSerializer, DonorPartnerLogoSerializer, MapFileSerializer, \
    CountryImageSerializer, DonorImageSerializer, DonorCustomQuestionSerializer, CountryCustomQuestionSerializer


class CountryLandingPageViewSet(mixins.RetrieveModelMixin,  mixins.ListModelMixin, viewsets.GenericViewSet):
    queryset = Country.objects.all()
    serializer_class = CountrySerializer


class DonorLandingPageViewSet(mixins.RetrieveModelMixin,  mixins.ListModelMixin, viewsets.GenericViewSet):
    queryset = Donor.objects.all()
    serializer_class = DonorSerializer


class AdminPermissionMixin:
    permission_classes = (IsAuthenticated, InAdminOrReadOnly,)


class SuperAdminPermissionMixin:
    permission_classes = (IsAuthenticated, InSuperAdmin,)


class CountryAdminPermissionMixin:
    permission_classes = (IsAuthenticated, InCountryAdminOrReadOnly,)


class CountrySuperAdminPermissionMixin:
    permission_classes = (IsAuthenticated, InCountrySuperAdmin,)


class DonorSuperAdminPermissionMixin:
    permission_classes = (IsAuthenticated, InDonorSuperAdmin,)


class CountryViewSet(AdminPermissionMixin, mixins.ListModelMixin, mixins.UpdateModelMixin, mixins.RetrieveModelMixin,
                     viewsets.GenericViewSet):
    queryset = Country.objects.all()
    serializer_class = CountrySerializer

    def get_serializer_class(self):
        if self.request and self.action in ['update', 'retrieve', 'partial_update'] \
                and self.request.user.is_authenticated:
            country = self.get_object()
            profile = self.request.user.userprofile
            if profile.account_type == UserProfile.COUNTRY_ADMIN and profile in country.admins.all():
                return AdminCountrySerializer
            if profile.account_type == UserProfile.SUPER_COUNTRY_ADMIN and profile in country.super_admins.all() \
                    or self.request.user.is_superuser:
                return SuperAdminCountrySerializer
        return super().get_serializer_class()


class DonorViewSet(AdminPermissionMixin, mixins.ListModelMixin, mixins.UpdateModelMixin, mixins.RetrieveModelMixin,
                   viewsets.GenericViewSet):
    queryset = Donor.objects.all()
    serializer_class = DonorSerializer

    def get_serializer_class(self):
        if self.request and self.action in ['update', 'retrieve', 'partial_update'] \
                and self.request.user.is_authenticated:
            donor = self.get_object()
            profile = self.request.user.userprofile
            if profile.account_type == UserProfile.DONOR_ADMIN and profile in donor.admins.all():
                return AdminDonorSerializer
            if profile.account_type == UserProfile.SUPER_DONOR_ADMIN and profile in donor.super_admins.all() \
                    or self.request.user.is_superuser:
                return SuperAdminDonorSerializer
        return super().get_serializer_class()


class PartnerLogoViewSet(CountrySuperAdminPermissionMixin, mixins.CreateModelMixin, mixins.RetrieveModelMixin,
                         mixins.DestroyModelMixin, viewsets.GenericViewSet):
    queryset = PartnerLogo.objects.all()
    serializer_class = PartnerLogoSerializer
    parser_classes = (MultiPartParser, FormParser)


class DonorPartnerLogoViewSet(DonorSuperAdminPermissionMixin, mixins.CreateModelMixin, mixins.RetrieveModelMixin,
                              mixins.DestroyModelMixin, viewsets.GenericViewSet):
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


class MapFileViewSet(CountryAdminPermissionMixin, mixins.CreateModelMixin, mixins.UpdateModelMixin,
                     mixins.RetrieveModelMixin, viewsets.GenericViewSet):
    queryset = MapFile.objects.all()
    serializer_class = MapFileSerializer
    parser_classes = (MultiPartParser, FormParser)


class MapDownloadViewSet(viewsets.ViewSet):
    @staticmethod
    def map_download(request, country_id):
        obj = get_object_or_404(Country.objects.all(), id=country_id)
        country = pycountry.countries.get(alpha_2=obj.code)
        url = ("https://wambachers-osm.website/boundaries/exportBoundaries?"
               "cliVersion=1.0&cliKey={}&exportFormat=json&exportLayout=single"
               "&exportAreas=land&union=false&from_AL=2&to_AL=6&selected={}").format(
            settings.OSM_MAP_CLI_KEY, country.alpha_3)

        osm_request = requests.get(url, stream=True)
        try:
            osm_request.raise_for_status()
        except RequestException:
            return HttpResponse(status=osm_request.status_code, content='Download failed', content_type='text/plain')
        else:
            response = HttpResponse(osm_request.content, content_type='application/zip')
            response['Content-Disposition'] = 'attachment; filename="{}"'.format('exportBoundaries.zip')
            return response


class CountryImageViewSet(SuperAdminPermissionMixin, mixins.UpdateModelMixin, viewsets.GenericViewSet):
    queryset = Country.objects.all()
    serializer_class = CountryImageSerializer
    parser_classes = (MultiPartParser, FormParser)


class DonorImageViewSet(SuperAdminPermissionMixin, mixins.UpdateModelMixin, viewsets.GenericViewSet):
    queryset = Donor.objects.all()
    serializer_class = DonorImageSerializer
    parser_classes = (MultiPartParser, FormParser)


class CountryCustomQuestionViewSet(mixins.CreateModelMixin, mixins.UpdateModelMixin, mixins.DestroyModelMixin,
                                   viewsets.GenericViewSet):
    queryset = CountryCustomQuestion.objects.all()
    serializer_class = CountryCustomQuestionSerializer


class DonorCustomQuestionViewSet(mixins.CreateModelMixin, mixins.UpdateModelMixin, mixins.DestroyModelMixin,
                                   viewsets.GenericViewSet):
    queryset = DonorCustomQuestion.objects.all()
    serializer_class = DonorCustomQuestionSerializer