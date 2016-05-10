import operator
import functools

from django.db import models
from django.db.models import Q
from django.db.models.signals import post_save
from django.dispatch import receiver

from core.models import ExtendedModel
from project.models import Project
from hss.models import HSS
from hss.hss_data import interventions
from hss.views import InterventionView
from country.models import Country
from .signals import intervention_save


class ProjectSearch(ExtendedModel):
    project = models.ForeignKey(Project)
    location = models.TextField(blank=True)
    project_name = models.TextField(blank=True)
    health_topic = models.TextField(blank=True)
    technology_platform = models.TextField(blank=True)
    organisation = models.TextField(blank=True)

    @classmethod
    def search(cls, **kwargs):
        """
        Search based on search term in given fields.
        """
        q_objects = []
        results = []

        if kwargs.get("location", None):
            q_objects.append(Q(location__icontains=kwargs["query"]))
        if kwargs.get("project_name", None):
            q_objects.append(Q(project_name__icontains=kwargs["query"]))
        if kwargs.get("health_topic", None):
            q_objects.append(Q(health_topic__icontains=kwargs["query"]))
        if kwargs.get("technology_platform", None):
            q_objects.append(Q(technology_platform__icontains=kwargs["query"]))
        if kwargs.get("organisation", None):
            q_objects.append(Q(organisation__icontains=kwargs["query"]))

        filter_exp = functools.reduce(operator.or_, q_objects)

        for ps in cls.objects.filter(filter_exp):
            results.append({
                "id": ps.id,
                "name": ps.project_name,
                "organisation": ps.project.data.get('organisation'),
                "countryName": Country.objects.get(id=ps.project.data.get('country')).name
            })
        return results


@receiver(post_save, sender=Project)
def update_with_project_data(sender, instance, **kwargs):
    """
    Updates relevant ProjectSearch data on every Project model save.
    """
    project_search, created = ProjectSearch.objects.get_or_create(project_id=instance.id)
    project_search.location = Country.objects.get(id=instance.data["country"]).name
    project_search.project_name = instance.data["name"]
    project_search.technology_platform = ", ".join([x for x in instance.data["technology_platforms"]])
    project_search.organisation = instance.data["organisation"]
    project_search.save()


@receiver(intervention_save, sender=InterventionView)
def update_with_hss_data(sender, instance, **kwargs):
    intervention_labels = []
    for col_index, col in enumerate(instance.data["interventions"]):
        for value in col["interventions"]:
            intervention_labels.append(interventions.get(col_index)[value])
    if intervention_labels:
        project_search, created = ProjectSearch.objects.get_or_create(project_id=instance.project_id)
        project_search.health_topic = ", ".join(intervention_labels)
        project_search.save()
