from django.urls import path

from . import views

urlpatterns = [
    path("^projects/<project_id>/toolkit/score/",
         view=views.ToolkitViewSet.as_view({
             "post": "create"
         }),
         name="toolkit-scores"),
    path("^projects/<project_id>/toolkit/data/",
         view=views.ToolkitViewSet.as_view({
             "get": "retrieve"
         }),
         name="toolkit-data"),
]
