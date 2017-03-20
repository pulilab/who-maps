from django.conf.urls import url
from rest_framework.routers import DefaultRouter
from country.views import RetrieveLandingPageViewSet
from . import views

router = DefaultRouter()
router.register(r'landing', RetrieveLandingPageViewSet)
urlpatterns = router.urls


urlpatterns += [
    url(r"^countries/$", view=views.CountryListAPIView.as_view(), name="country-list"),
]
