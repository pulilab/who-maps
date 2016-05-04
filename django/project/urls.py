from django.conf.urls import url, include

from . import views


urlpatterns = [
    url(r"^projects/$", view=views.project_list, name="project-list"),
    url(r"^projects/(?P<pk>\d+)/$", view=views.project_detail, name="project-detail"),
    url(r"^projects/structure/$", view=views.get_project_structure, name="get-project-structure"),
    url(r"^projects/(?P<project_id>\d+)/files/$", view=views.file_list, name="file-list"),
    url(r"^files/(?P<pk>\d+)/$", view=views.file_detail, name="file-detail"),
]
