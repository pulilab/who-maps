from django.conf.urls import url, include

from . import views


urlpatterns = [
    url(r"^projects/(?P<project_id>\d+)/hss/bubbles/$", view=views.BubbleView.as_view({"post": "create"}), name="hss-bubbles"),
    url(r"^projects/(?P<project_id>\d+)/hss/continuum/$", view=views.ContinuumView.as_view({"post": "create"}), name="hss-continuum"),
    url(r"^projects/(?P<project_id>\d+)/hss/constraints/$", view=views.ConstraintView.as_view({"post": "create"}), name="hss-constraints"),
    url(r"^projects/(?P<project_id>\d+)/hss/interventions/$", view=views.InterventionView.as_view({"post": "create"}), name="hss-interventions"),
    url(r"^projects/(?P<project_id>\d+)/hss/targetpopulation/$", view=views.TargetPopulationView.as_view({"post": "create"}), name="hss-targetpopulation"),
    url(r"^projects/(?P<project_id>\d+)/hss/taxonomies/$", view=views.TaxonomyView.as_view({"post": "create"}), name="hss-taxonomies"),
    url(r"^projects/(?P<project_id>\d+)/hss/data/$", view=views.hss_data, name="hss-data"),
    url(r"^projects/hss/structure/$", view=views.hss_structure, name="hss-structure"),
]
