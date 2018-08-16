from django.conf.urls import url
from rest_framework.routers import DefaultRouter
from country.views import CountryMapDataViewSet, CountryViewSet, PartnerLogoViewSet, DonorViewSet, \
    DonorPartnerLogoViewSet
from . import views

router = DefaultRouter()
router.register(r'countries', CountryViewSet, base_name='country')
router.register(r'donors', DonorViewSet, base_name='donor')
router.register(r'country-partner-logos', PartnerLogoViewSet, base_name='country-partner-logo')
router.register(r'donor-partner-logos', DonorPartnerLogoViewSet, base_name='donor-partner-logo')
router.register(r'country-map-data', CountryMapDataViewSet, base_name='country-map-data')

urlpatterns = [
    url(r'^countries/export/$', view=views.CountryExportView.as_view(), name='country-export'),
    url(r"^country-fields/(?P<country_id>\d+)/$",
        view=views.CountryFieldsListView.as_view(),
        name="country-fields-list"),
    url(r"^country-fields/(?P<country_id>\d+)/(?P<project_id>\d+)/(?P<mode>draft|publish)/$",
        view=views.CountryFieldsCreateUpdateView.as_view(),
        name="country-fields"),
] + router.urls
