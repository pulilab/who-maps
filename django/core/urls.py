from django.urls import path

from .views import StaticDataView

urlpatterns = [
    path('static-data/', view=StaticDataView.as_view(), name='static-data'),
]
