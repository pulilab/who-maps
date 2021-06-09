from django.conf import settings
from django.conf.urls import url, include
from django.contrib import admin
from django.urls import path
from django.views.i18n import JSONCatalog
from rest_framework import permissions
from rest_framework.documentation import include_docs_urls
from drf_yasg import openapi
from drf_yasg.views import get_schema_view
from rest_framework.routers import SimpleRouter

from country.views import CountryLandingPageViewSet, CountryLandingListPageViewSet, DonorLandingPageViewSet, \
    DonorLandingListPageViewSet
from project.views import ProjectPublicViewSet, ExternalDraftAPI, ExternalPublishAPI
from user.views import OrganisationViewSet, TokenViewSet

admin.site.site_header = 'Digital Health Atlas'
API_TITLE = 'Digital Health Atlas API'
API_DESCRIPTION = 'Private API'

urlpatterns = [
    url(r"^admin/", admin.site.urls),
    url(r"^api/", include("core.urls")),
    url(r"^api/", include("user.urls")),
    url(r"^api/", include("project.urls")),
    url(r"^api/", include("toolkit.urls")),
    url(r"^api/", include("country.urls")),
    url(r"^api/", include("search.urls")),
    url(r"^api/", include("cms.urls")),
    url(r"^api/", include("simple-feedback.urls")),
    url(r"^api/", include("kpiexport.urls")),
    url(r'^translation/json/$', JSONCatalog.as_view(), name='json-catalog'),
    url(r'^translation/', include('rosetta.urls'))
]

if settings.DEBUG:  # pragma: no cover
    urlpatterns.append(url(r'^api/docs/', include_docs_urls(title=API_TITLE, description=API_DESCRIPTION)))


api_info = openapi.Info(
    title='Digital Health Atlas Public API',
    default_version='v1 BETA',
    description='Digital Health Atlas Public API for Developers, '
                'only BETA (subject to breaking changes and deprecations)',
    contact=openapi.Contact(email="f@pulilab.com"),
)

api_info_router = SimpleRouter()
api_info_router.register(r'api/landing-country', CountryLandingPageViewSet, base_name='landing-country'),
api_info_router.register(r'api/landing-country', CountryLandingListPageViewSet, base_name='landing-country'),
api_info_router.register(r'api/organisations', OrganisationViewSet, base_name='organisation')
api_info_router.register(r'api/landing-donor', DonorLandingPageViewSet, base_name='landing-donor')
api_info_router.register(r'api/landing-donor', DonorLandingListPageViewSet, base_name='landing-donor')
# These API urls miss their trailing slashes due to an apparent bug in redoc
# adding extra trailing slashes. Since these are only used for generating the public docs,
# this should cause no issue.
api_info_router.register(r'api/projects/external/draft/<str:client_code>', ExternalDraftAPI,
                         base_name='project-external-draft')
api_info_router.register(r'api/projects/external/publish/<str:client_code>', ExternalPublishAPI,
                         base_name='project-external-publish')

api_info_urlpatterns = [
    url(r"^api/", include("search.urls")),
    url(r"^api/projects/structure/",
        view=ProjectPublicViewSet.as_view({'get': 'project_structure'}),
        name="get-project-structure"),
]
api_info_urlpatterns += api_info_router.urls

api_schema_view = get_schema_view(
    api_info,
    public=True,
    permission_classes=(permissions.AllowAny,),
    patterns=api_info_urlpatterns,
)

urlpatterns += [
    path('api/public-docs/', api_schema_view.with_ui('redoc', cache_timeout=0), name='schema-redoc')
]
