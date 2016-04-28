from django.conf.urls import url, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'projects', views.ProjectViewSet)

urlpatterns = [
    url(r"^", include(router.urls)),
    url(r"^templates/project/detail/$", view=views.template_project_detail, name="template-project-detail"),
    url(r"^templates/project/detail/(?P<project_id>\d+)/$", view=views.template_project_detail, name="template-project-detail-id"),
    url(r"^publications/(?P<pk>\d+)/$", view=views.get_publication, name="get-publication"),
    url(r"^reports/(?P<pk>\d+)/$", view=views.get_report, name="get-report"),
    url(r"^projects/(?P<pk>\d+)/files/$", view=views.create_project_files, name="create-project-files"),
]
