from django.conf.urls import url
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()

urlpatterns = [
    # url('kpi/project/', view=views.ProjectKPIsView.as_view(), name='project-kpi'),
    url('kpi/users/', view=views.UserKPIsView.as_view(), name='user-kpi'),
]
