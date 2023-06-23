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
    path('kpi/project-status/',
         view=views.ProjectStatusKPIsViewSet.as_view({'get': 'list'}),
         name='project-status-kpi'),
    path('kpi/project-stages/',
         view=views.ProjectStagesKPIsViewSet.as_view({'get': 'list'}),
         name='project-stages-kpi'),
    path('kpi/data-standards/',
         view=views.DataStandardsKPIsViewSet.as_view({'get': 'list'}),
         name='data-standards-kpi'),
    path('kpi/health-categories/',
         view=views.HealthCategoriesKPIsViewSet.as_view({'get': 'list'}),
         name='health-categories-kpi'),
    path('kpi/hfa/',
         view=views.HFAKPIsViewSet.as_view({'get': 'list'}),
         name='hfa-kpi'),
    path('kpi/health-categories/<int:category_id>/',
         view=views.HFAByCategoryKPIsViewSet.as_view({'get': 'list'}),
         name='health-categories-hfa-kpi'),
]
