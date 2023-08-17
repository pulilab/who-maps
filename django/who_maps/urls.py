from django.conf import settings
from django.conf.urls import include
from django.contrib import admin
from django.urls import path
from django.views.i18n import JSONCatalog
from rest_framework import permissions
from drf_yasg import openapi
from drf_yasg.views import get_schema_view
from rest_framework.routers import SimpleRouter

from country.views import CountryLandingPageViewSet, CountryLandingListPageViewSet, DonorLandingPageViewSet, \
    DonorLandingListPageViewSet, ReferenceDocumentViewSet, DocumentSearchViewSet, ReferenceDocumentUploadViewSet
from project.views import ProjectPublicViewSet, ExternalDraftAPI, ExternalPublishAPI
from user.views import OrganisationViewSet, TokenCheckView

admin.site.site_header = 'Digital Health Atlas'
API_TITLE = 'Digital Health Atlas API'
API_DESCRIPTION = 'Private API'

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/", include("core.urls")),
    path("api/", include("user.urls")),
    path("api/", include("project.urls")),
    path("api/", include("toolkit.urls")),
    path("api/", include("country.urls")),
    path("api/", include("search.urls")),
    path("api/", include("cms.urls")),
    path("api/", include("simple_feedback.urls")),
    path("api/", include("kpiexport.urls")),
    path('translation/json/', JSONCatalog.as_view(), name='json-catalog'),
    path('translation/', include('rosetta.urls'))
]

if settings.DEBUG:  # pragma: no cover
    api_info_internal = openapi.Info(
        title='Digital Health Atlas Developer API',
        default_version='latest',
        description='Digital Health Atlas Public API for Developers, '
                    'INTERNAL',
        contact=openapi.Contact(email="f@pulilab.com"),
    )

    api_schema_view_internal = get_schema_view(
        api_info_internal,
        public=True,
        patterns=urlpatterns,
    )

    urlpatterns += [
        path('api/docs/', api_schema_view_internal.with_ui('redoc', cache_timeout=0), name='schema-redoc')
    ]

api_info = openapi.Info(
    title='Digital Health Atlas Public API',
    default_version='v1.2 BETA',
    description="""Digital Health Atlas Public API for Developers, only BETA 
(subject to breaking changes and deprecations)
# v1.2
ADDED: Reference Document endpoints
- /api/document/ for CRUD
- /api/document-search/ for search and filter

/api/document/ POST,PUT,PATCH has `multipart/form-data` for uploading a file, but can also be called with 
`application/json` if document file is not present in the request body. 
# v1.1
DEPRECATED: Project `platforms` decoupled into `software` and `dhis` and is no longer available or used
# v1.0
Bearer token implemented for External API that needs authentication 
`project-draft-external`, `project-publish-external`
""",
    contact=openapi.Contact(email="f@pulilab.com"),
)

api_info_router = SimpleRouter()
api_info_router.register('api/landing-country', CountryLandingPageViewSet, basename='landing-country'),
api_info_router.register('api/landing-country', CountryLandingListPageViewSet, basename='landing-country'),
api_info_router.register('api/organisations', OrganisationViewSet, basename='organisation')
api_info_router.register('api/landing-donor', DonorLandingPageViewSet, basename='landing-donor')
api_info_router.register('api/landing-donor', DonorLandingListPageViewSet, basename='landing-donor')
api_info_router.register('api/document', ReferenceDocumentUploadViewSet, basename='reference-document-upload')
api_info_router.register('api/document-search', DocumentSearchViewSet, basename='document-search')
# These API urls miss their trailing slashes due to an apparent bug in redoc
# adding extra trailing slashes. Since these are only used for generating the public docs,
# this should cause no issue.
api_info_router.register('api/projects/external/draft/<str:client_code>', ExternalDraftAPI,
                         basename='project-external-draft')
api_info_router.register('api/projects/external/publish/<str:client_code>', ExternalPublishAPI,
                         basename='project-external-publish')

api_info_urlpatterns = [
    path("api/", include("search.urls")),
    path("api/projects/structure/",
         view=ProjectPublicViewSet.as_view({'get': 'project_structure'}),
         name="get-project-structure"),
    path("api/token/validate/",
         view=TokenCheckView.as_view())
]
api_info_urlpatterns += api_info_router.urls

api_schema_view_public = get_schema_view(
    api_info,
    public=True,
    permission_classes=[permissions.AllowAny],
    patterns=api_info_urlpatterns,
)

urlpatterns += [
    path('api/public-docs/', api_schema_view_public.with_ui('redoc', cache_timeout=0), name='schema-redoc-public')
]
