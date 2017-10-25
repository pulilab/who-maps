from django.conf.urls import url
from rest_framework.routers import DefaultRouter
from country.views import RetrieveLandingPageViewSet
from . import views

router = DefaultRouter()
router.register(r'landing', RetrieveLandingPageViewSet)
urlpatterns = router.urls


urlpatterns += [
    url(r"^countries/$", view=views.CountryListAPIView.as_view(), name="country-list"),
    url(r'^countries/export/$', view=views.CountryExportView.as_view(), name='country-export'),
    url(r"^country-fields/(?P<country_id>\d+)/$", view=views.CountryFieldsListView.as_view(), name="country-fields-list"),
    url(r"^country-fields/(?P<country_id>\d+)/(?P<project_id>\d+)/$", view=views.CountryFieldsCreateUpdateView.as_view(), name="country-fields"),
]
