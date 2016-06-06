from django.conf.urls import url, include

from . import views


urlpatterns = [
    url(r"^projects/$", view=views.ProjectCRUDViewSet.as_view({'get': 'retrieve', 'post': 'create', 'put': 'update'}), name="project-crud"),
    url(r"^projects/member-of/$", view=views.ProjectListViewSet.as_view({'get': 'list'}), name="project-list"),
    url(r"^projects/by-view/map/(?P<country_id>\d+)/$", view=views.ProjectPublicViewSet.as_view({'get': 'by_district'}), name="project-by-district"),
    url(r"^projects/by-view/list/(?P<country_id>\d+)/$", view=views.ProjectPublicViewSet.as_view({'get': 'list_all'}), name="project-country-list"),
    url(r"^projects/by-view/list/$", view=views.ProjectPublicViewSet.as_view({'get': 'list_all'}), name="project-all-list"),
    url(r"^projects/(?P<pk>\d+)/$", view=views.ProjectCRUDViewSet.as_view({'get': 'retrieve', 'put': 'update'}), name="project-detail"),
    url(r"^projects/structure/$", view=views.get_project_structure, name="get-project-structure"),
    url(r"^projects/(?P<project_id>\d+)/file-list/$", view=views.FileListViewSet.as_view({'get': 'list'}), name="file-list"),
    url(r"^projects/(?P<project_id>\d+)/files/$", view=views.FilePostViewSet.as_view({'post': 'create'}), name="project-files"),
    url(r"^projects/(?P<project_id>\d+)/version/$", view=views.make_version, name="make-version"),
    url(r"^projects/(?P<project_id>\d+)/coverage/versions/$", view=views.get_coverage_versions, name="get-coverage-versions"),
    url(r"^projects/(?P<project_id>\d+)/toolkit/versions/$", view=views.get_toolkit_versions, name="get-toolkit-versions"),
    url(r"^projects/(?P<project_id>\d+)/partnerlogo-list/$", view=views.PartnerLogoListViewSet.as_view({'get': 'list'}), name="partnerlogo-list"),
    url(r"^projects/(?P<project_id>\d+)/partnerlogos/$", view=views.PartnerLogoViewSet.as_view({'post': 'create'}), name="project-partnerlogo"),
    url(r"^partnerlogos/(?P<pk>\d+)/$", view=views.PartnerLogoViewSet.as_view({'delete': 'destroy'}), name="partnerlogo-delete"),
    url(r"^projects/(?P<pk>\d+)/groups/$", view=views.ProjectGroupViewSet.as_view({'get': 'retrieve', 'put': 'update'}), name="project-groups"),
    url(r"^files/(?P<pk>\d+)/$", view=views.FileDetailViewSet.as_view({'get': 'retrieve'}), name="file-detail"),
    url(r"^files/(?P<pk>\d+)/delete/$", view=views.FileDeleteViewSet.as_view({'delete': 'destroy'}), name="file-delete"),
]
