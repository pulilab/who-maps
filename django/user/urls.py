from django.conf.urls import url, include
from rest_framework.routers import DefaultRouter
from allauth.account.views import confirm_email

import user.views as views

router = DefaultRouter()
router.register(r'userprofiles', views.UserProfileViewSet)
router.register(r'organisations', views.OrganisationViewSet)

urlpatterns = [
    url(r"^", include(router.urls)),
    url(r"^", include("django.contrib.auth.urls")),
    url(r"^all-auth/", include("allauth.urls")),
    url(r"^rest-auth/", include("rest_auth.urls")),
    url(r"^rest-auth/registration/", include("rest_auth.registration.urls")),
    url(r'^api-token-auth/', view=views.ExpiringAuthTokenWithUserProfile.as_view(), name="api_token_auth"),
    url(r"^email-confirmation/(?P<key>\w+)/$", confirm_email, name="account_confirm_email"),
    url(r"^language/(?P<language_code>\w+)/$", views.LanguageSwitcher.as_view(), name="language-switcher"),
]
