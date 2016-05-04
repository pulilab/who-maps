import operator
import functools

from django.db import models
from django.db.models import Q
from django.db.models.signals import post_save
from django.dispatch import receiver

from core.models import ExtendedModel
from project.models import Project
from country.models import Country


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
        """
        q_objects = []

        if kwargs.get("location", None):
            q_objects.append(Q(location__contains=kwargs["query"]))
        if kwargs.get("project_name", None):
            q_objects.append(Q(project_name__contains=kwargs["query"]))
        if kwargs.get("health_topic", None):
            q_objects.append(Q(health_topic__contains=kwargs["query"]))
        if kwargs.get("technology_platform", None):
            q_objects.append(Q(technology_platform__contains=kwargs["query"]))
        if kwargs.get("organisation", None):
            q_objects.append(Q(organisation__contains=kwargs["query"]))

        filter_exp = functools.reduce(operator.or_, q_objects)
        return cls.objects.filter(filter_exp).values("project", "project_name")


@receiver(post_save, sender=Project)
def update_project_search(sender, instance, **kwargs):
    """
    Updates relevant ProjectSearch data on every Project model save.
    """
    project_search, created = ProjectSearch.objects.get_or_create(project_id=instance.id)
    project_search.location = Country.objects.get(id=instance.data["country"]).name
    project_search.project_name = instance.data["name"]
    project_search.health_topic = ""  # What's this?
    project_search.technology_platform = " ".join([x for x in instance.data["technology_platforms"]])
    project_search.organisation = instance.data["organisation"]
    project_search.save()
