from django.conf.urls import url
from rest_framework.routers import DefaultRouter
from country.views import RetrieveLandingPageViewSet
from . import views

router = DefaultRouter()
router.register(r'landing', RetrieveLandingPageViewSet)
urlpatterns = router.urls


urlpatterns += [
    url(r"^countries/$", view=views.CountryListAPIView.as_view(), name="country-list"),
    url(r"^country-fields/(?P<country_id>\d+)/$", view=views.CountryFieldsListView.as_view(), name="country-fields-list"),
    url(r"^country-fields/(?P<country_id>\d+)/(?P<project_id>\d+)/$", view=views.CountryFieldsUpdateView.as_view(), name="country-fields-update"),
    url(r"^country-fields/$", view=views.CountryFieldsCreateView.as_view(), name="country-fields-create"),
]
