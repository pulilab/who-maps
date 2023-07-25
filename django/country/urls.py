from django.urls import path
from rest_framework.routers import DefaultRouter
from country.views import CountryViewSet, PartnerLogoViewSet, DonorViewSet, DonorPartnerLogoViewSet, \
    MapFileViewSet, CountryImageViewSet, DonorImageViewSet, CountryLandingPageViewSet, DonorLandingPageViewSet, \
    CountryCustomQuestionViewSet, DonorCustomQuestionViewSet, CountryLandingListPageViewSet, \
    DonorLandingListPageViewSet, ArchitectureRoadMapDocumentViewSet, DocumentSearchViewSet
from . import views

router = DefaultRouter()
router.register(r'landing-country', CountryLandingPageViewSet, basename='landing-country'),
router.register(r'landing-country', CountryLandingListPageViewSet, basename='landing-country'),
router.register(r'landing-donor', DonorLandingPageViewSet, basename='landing-donor'),
router.register(r'landing-donor', DonorLandingListPageViewSet, basename='landing-donor'),
router.register(r'countries', CountryViewSet, basename='country')
router.register(r'donors', DonorViewSet, basename='donor')
router.register(r'country-partner-logos', PartnerLogoViewSet, basename='country-partner-logo')
router.register(r'donor-partner-logos', DonorPartnerLogoViewSet, basename='donor-partner-logo')
router.register(r'map-files', MapFileViewSet, basename='map-file')
router.register(r'country-images', CountryImageViewSet, basename='country-image')
router.register(r'donor-images', DonorImageViewSet, basename='donor-image')
router.register(r'country-custom-questions', CountryCustomQuestionViewSet, basename='country-custom-questions')
router.register(r'donor-custom-questions', DonorCustomQuestionViewSet, basename='donor-custom-questions')
router.register(r'architecture-roadmap-document', ArchitectureRoadMapDocumentViewSet,
                basename='architecture-roadmap-document')
router.register(r'document-search', DocumentSearchViewSet, basename='document-search')

urlpatterns = [
                  path('countries/map-download/<country_id>/',
                       view=views.MapDownloadViewSet.as_view({'get': 'map_download'}),
                       name="country-map-download"),
              ] + router.urls
