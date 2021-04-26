from django.urls import path
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()

urlpatterns = [
    path('kpi/users/',
         view=views.UserKPIsViewSet.as_view({'get': 'list'}),
         name='user-kpi'),
    path('kpi/tokens/',
         view=views.TokenKPIsViewSet.as_view({'get': 'list'}),
         name='token-kpi'),
]
