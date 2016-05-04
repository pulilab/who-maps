from django.conf.urls import url, include

from . import views


urlpatterns = [
    url(r"^countries/$", view=views.CountryListAPIView.as_view(), name="country-list"),
    url(r"^countries/(?P<country_id>\d+)/geodata/$", view=views.get_geodata, name="get-geodata"),
    url(r"^countries/(?P<country_id>\d+)/districts/$", view=views.get_districts, name="get-districts"),
]
