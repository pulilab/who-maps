from django.conf.urls import url

from . import views

urlpatterns = [
    url(r"^search/projects/$", view=views.search_project, name="search-project"),
]
