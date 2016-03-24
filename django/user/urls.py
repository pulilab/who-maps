from django.conf.urls import url, include
from rest_framework.routers import DefaultRouter

import user.views as views

router = DefaultRouter()
router.register(r'userprofiles', views.UserProfileViewSet)

urlpatterns = [
    url(r"^", include(router.urls)),
    url(r"^", include("django.contrib.auth.urls")),
    url(r"^accounts/", include("allauth.urls")),
    url(r"^rest-auth/", include("rest_auth.urls")),
    url(r"^rest-auth/registration/", include("rest_auth.registration.urls")),
]
