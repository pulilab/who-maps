from django.conf.urls import url, include

from . import views


urlpatterns = [
    url(r"^countries/$", view=views.CountryListAPIView.as_view(), name="country-list"),
]
