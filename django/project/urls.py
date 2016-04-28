from django.conf.urls import url, include
from rest_framework.routers import DefaultRouter

import project.views as views

router = DefaultRouter()
router.register(r'projects', views.ProjectViewSet)

urlpatterns = [
    url(r"^projects/structure/$", view=views.get_project_structure, name="get-project-structure"),
    url(r"^projects/structure/(?P<project_id>\d+)/$", view=views.get_project_structure, name="get-project-structure-id"),
    url(r"^projects/(?P<pk>\d+)/files/$", view=views.create_project_files, name="create-project-files"),
    url(r"^", include(router.urls)),
    url(r"^publications/(?P<pk>\d+)/$", view=views.get_publication, name="get-publication"),
    url(r"^reports/(?P<pk>\d+)/$", view=views.get_report, name="get-report"),
]
