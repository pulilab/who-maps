from django.conf.urls import url
from rest_framework.routers import DefaultRouter
from country.views import RetrieveLandingPageViewSet, CountryMapDataViewSet, CountryAdminViewSet, PartnerLogoViewSet, \
    DonorAdminViewSet, DonorPartnerLogoViewSet
from . import views

router = DefaultRouter()
router.register(r'landing', RetrieveLandingPageViewSet)
router.register(r'country-map-data', CountryMapDataViewSet)
router.register(r'country-admin', CountryAdminViewSet, base_name='country-admin')
router.register(r'donor-admin', DonorAdminViewSet, base_name='donor-admin')
router.register(r'partner-logos', PartnerLogoViewSet, base_name='partner-logo')
router.register(r'donor-partner-logos', DonorPartnerLogoViewSet, base_name='donor-partner-logo')
urlpatterns = router.urls

urlpatterns += [
    url(r"^countries/$", view=views.CountryListAPIView.as_view(), name="country-list"),
    url(r'^countries/export/$', view=views.CountryExportView.as_view(), name='country-export'),
    url(r"^country-fields/(?P<country_id>\d+)/$",
        view=views.CountryFieldsListView.as_view(),
        name="country-fields-list"),
    url(r"^country-fields/(?P<country_id>\d+)/(?P<project_id>\d+)/(?P<mode>draft|publish)/$",
        view=views.CountryFieldsCreateUpdateView.as_view(),
        name="country-fields"),
]
