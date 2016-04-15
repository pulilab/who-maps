from django.conf.urls import url, include

from . import views


urlpatterns = [
    url(r"^projects/(?P<project_id>\d+)/toolkit/score/$", view=views.ScoreView.as_view(), name="toolkit-scores"),
    url(r"^projects/(?P<project_id>\d+)/toolkit/data/$", view=views.get_toolkit_data, name="toolkit-data"),
]
