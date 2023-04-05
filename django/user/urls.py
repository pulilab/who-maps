from django.conf.urls import include
from django.urls import path
from rest_framework.routers import DefaultRouter
from allauth.account.views import confirm_email
# from rest_framework_jwt.views import obtain_jwt_token
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)
import user.views as views

router = DefaultRouter()
router.register(r'userprofiles', views.UserProfileViewSet)
router.register(r'userprofiles', views.UserProfileListViewSet)
router.register(r'organisations', views.OrganisationViewSet)

urlpatterns = [
    path("", include(router.urls)),
    path("", include("django.contrib.auth.urls")),
    path("all-auth/", include("allauth.urls")),
    path("rest-auth/", include("dj_rest_auth.urls")),
    path("rest-auth/registration/", include("dj_rest_auth.registration.urls")),

    path("email-confirmation/<key>/", confirm_email, name="account_confirm_email"),
    path("token/get/", view=views.TokenViewSet.as_view({'get': 'get'}), name="token-get"),
    path("token/create/", view=views.TokenViewSet.as_view({'post': 'create'}), name="token-create"),
    path("token/refresh/", view=views.TokenViewSet.as_view({'post': 'refresh'}), name="token-refresh"),
    path("token/delete/", view=views.TokenViewSet.as_view({'delete': 'delete'}), name="token-delete"),
    path("token/validate/", view=views.TokenCheckView.as_view(), name="token-check"),

    # path('api-token-auth/', obtain_jwt_token, name="api_token_auth"),  # DEPRECATED

    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]
