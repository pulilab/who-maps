from django.urls import path, include
from rest_framework.routers import DefaultRouter

from . import views

router = DefaultRouter()
router.register('import', views.ProjectImportV2ViewSet)
router.register('import-row', views.ImportRowViewSet)
router.register('software', views.TechnologyPlatformRequestViewSet)
router.register('collections', views.CollectionViewSet, basename='collection')

urlpatterns = [
    path("projects/", include(router.urls)),
    path('projects/external/draft/',
         view=views.ExternalDraftAPI.as_view({
             'post': 'create'
         }),
         kwargs={'client_code': 'default'},
         name="project-external-draft-general"),
    path('projects/external/draft/<str:client_code>/',
         view=views.ExternalDraftAPI.as_view({
             'post': 'create'
         }),
         name="project-external-draft"),
    path('projects/external/publish/',
         view=views.ExternalPublishAPI.as_view({
             'post': 'create'
         }),
         kwargs={'client_code': 'default'},
         name="project-external-publish-general"),
    path('projects/external/publish/<str:client_code>/',
         view=views.ExternalPublishAPI.as_view({
             'post': 'create'
         }),
         name="project-external-publish"),
    path('projects/publish/<int:project_id>/<int:country_id>/',
         view=views.ProjectPublishViewSet.as_view({
             'put': 'update'
         }),
         name="project-publish"),
    path('projects/unpublish/<int:project_id>/',
         view=views.ProjectUnPublishViewSet.as_view({
             'put': 'update'
         }),
         name="project-unpublish"),
    path('projects/draft/<int:country_id>/',
         view=views.ProjectDraftViewSet.as_view({
             'post': 'create'
         }), name="project-create"),
    path('projects/draft/<int:project_id>/<int:country_id>/',
         view=views.ProjectDraftViewSet.as_view({
             'put': 'update'
         }),
         name="project-draft"),
    path("projects/member-of/",
         view=views.ProjectListViewSet.as_view({
             'get': 'list'
         }), name="project-list"),
    path("projects/structure/",
         view=views.ProjectPublicViewSet.as_view({
             'get': 'project_structure'
         }),
         name="get-project-structure"),
    path("projects/structure/export/",
         view=views.ProjectPublicViewSet.as_view({
             'get': 'project_structure_export'
         }),
         name="get-project-structure-export"),
    path("projects/<int:project_id>/version/",
         view=views.ProjectVersionViewSet.as_view({
             'post': 'create'
         }),
         name="make-version"),
    path("projects/<int:project_id>/coverage/versions/",
         view=views.ProjectVersionViewSet.as_view({
             'get': 'coverage_versions'
         }),
         name="get-coverage-versions"),
    path("projects/<int:project_id>/toolkit/versions/",
         view=views.ProjectVersionViewSet.as_view({
             'get': 'toolkit_versions'
         }),
         name="get-toolkit-versions"),
    path("projects/<int:pk>/groups/",
         view=views.ProjectGroupViewSet.as_view({
             'get': 'retrieve',
             'put': 'update'
         }),
         name="project-groups"),
    path("projects/map/",
         view=views.MapProjectCountryViewSet.as_view({
             'get': 'list',
         }),
         name="project-map"),
    path('approvals/<int:country_id>/',
         view=views.ProjectApprovalViewSet.as_view({
             'get': 'list'
         }),
         name="approval"),
    path('approval/<int:pk>/',
         view=views.ProjectApprovalViewSet.as_view({
             'put': 'update'
         }),
         name="approval"),
    path("projects/<int:pk>/",
         view=views.ProjectRetrieveViewSet.as_view({
             'get': 'retrieve',
         }),
         name="project-retrieve"),
    path("projects/<str:public_id>/",
         view=views.ProjectRetrieveViewSet.as_view({
             'get': 'retrieve',
         }),
         name="project-retrieve"),
    path("projects/collection/my-collections/",
         view=views.CollectionListView.as_view(),
         name='my-collections'),
    path("projects/import-helpers/check-availability/",
         view=views.ProjectImportCheckAvailabilityView.as_view(),
         name='is-collection-data-available'),
    path("projects/import-helpers/add-me/<str:collection_url>/<int:pk>/",
         view=views.ProjectGroupAddmeViewSet.as_view({'put': 'update'}),
         name='add-me-as-editor'),
    path("projects/collection/<str:collection_url>/project-list/",
         view=views.ProjectsInCollectionViewSet.as_view({'get': 'list'}),
         name='collection-project-list'),
    path("projects/import/<int:pk>/project-list/",
         view=views.ProjectsInProjectImportViewSet.as_view({'get': 'list'}),
         name='projectimport-project-list'),
]
