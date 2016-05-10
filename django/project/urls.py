from django.conf.urls import url, include

from . import views


urlpatterns = [
    url(r"^projects/$", view=views.ProjectViewSet.as_view({'get': 'list', 'post': 'create'}), name="project-list"),
    url(r"^projects/(?P<pk>\d+)/$", view=views.ProjectViewSet.as_view({'get': 'retrieve', 'put': 'update'}), name="project-detail"),
    url(r"^projects/structure/$", view=views.get_project_structure, name="get-project-structure"),
    url(r"^projects/(?P<project_id>\d+)/files/$", view=views.file_list, name="file-list"),
    url(r"^projects/(?P<project_id>\d+)/version/$", view=views.make_version, name="make-version"),
    url(r"^projects/(?P<project_id>\d+)/coverage/versions/$", view=views.get_coverage_versions, name="get-coverage-versions"),
    url(r"^projects/(?P<project_id>\d+)/toolkit/versions/$", view=views.get_toolkit_versions, name="get-toolkit-versions"),
    url(r"^projects/(?P<project_id>\d+)/partnerlogos/$", view=views.PartnerLogoViewSet.as_view({'get': 'list', 'post': 'create'}), name="partnerlogo-list"),
    url(r"^partnerlogos/(?P<pk>\d+)/$", view=views.PartnerLogoViewSet.as_view({'delete': 'destroy'}), name="partnerlogo-detail"),
    url(r"^files/(?P<pk>\d+)/$", view=views.file_detail, name="file-detail"),
]
