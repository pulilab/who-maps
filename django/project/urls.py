from django.conf.urls import url

from . import views

urlpatterns = [
    url(r"^projects/$", view=views.ProjectCRUDViewSet.as_view({
        'post': 'create'
    }), name="project-crud"),
    url(r"^projects/(?P<pk>\d+)/$",
        view=views.ProjectCRUDViewSet.as_view({
            'get': 'retrieve',
            'put': 'update'
        }),
        name="project-detail"),
    url(r"^projects/draft/$", view=views.ProjectDraftCRUDViewSet.as_view({
        'post': 'create'
    }), name="project-draft-crud"),
    url(r"^projects/draft/(?P<pk>\d+)/$",
        view=views.ProjectDraftCRUDViewSet.as_view({
            'get': 'retrieve',
            'put': 'update'
        }),
        name="project-draft-detail"),
    url(r"^projects/member-of/$", view=views.ProjectListViewSet.as_view({
        'get': 'list'
    }), name="project-list"),
    url(r"^projects/by-view/map/(?P<country_id>\d+)/$",
        view=views.ProjectPublicViewSet.as_view({
            'get': 'by_district'
        }),
        name="project-by-district"),
    url(r"^projects/by-view/list/(?P<country_id>\d+)/$",
        view=views.ProjectPublicViewSet.as_view({
            'get': 'list_all'
        }),
        name="project-country-list"),
    url(r"^projects/by-view/list/$",
        view=views.ProjectPublicViewSet.as_view({
            'get': 'list_all'
        }),
        name="project-all-list"),
    url(r"^projects/structure/$",
        view=views.ProjectPublicViewSet.as_view({
            'get': 'project_structure'
        }),
        name="get-project-structure"),
    url(r"^projects/structure/export/$",
        view=views.ProjectPublicViewSet.as_view({
            'get': 'project_structure_export'
        }),
        name="get-project-structure-export"),
    url(r"^projects/(?P<project_id>\d+)/version/$",
        view=views.ProjectVersionViewSet.as_view({
            'post': 'create'
        }),
        name="make-version"),
    url(r"^projects/(?P<project_id>\d+)/coverage/versions/$",
        view=views.ProjectVersionViewSet.as_view({
            'get': 'coverage_versions'
        }),
        name="get-coverage-versions"),
    url(r"^projects/(?P<project_id>\d+)/toolkit/versions/$",
        view=views.ProjectVersionViewSet.as_view({
            'get': 'toolkit_versions'
        }),
        name="get-toolkit-versions"),
    url(r"^projects/(?P<pk>\d+)/groups/$",
        view=views.ProjectGroupViewSet.as_view({
            'get': 'retrieve',
            'put': 'update'
        }),
        name="project-groups"),
    url(r"^projects/csv-export/$", view=views.CSVExportViewSet.as_view({
        'post': 'create'
    }), name="csv-export"),
]
