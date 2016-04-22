from django.conf.urls import url, include

from . import views


urlpatterns = [
    url(r"^countries/(?P<country_id>\d+)/geodata/$", view=views.get_geodata, name="get-geodata"),
]
