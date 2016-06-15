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
from user.models import Organisation
from .signals import intervention_save


class ProjectSearch(ExtendedModel):
    project = models.ForeignKey(Project)
    location = models.TextField(blank=True)
    project_name = models.TextField(blank=True)
    health_topic = models.TextField(blank=True)
    technology_platform = models.TextField(blank=True)
    organisation = models.TextField(blank=True)
    contact_name = models.TextField(blank=True)
    contact_email = models.TextField(blank=True)
    implementation_overview = models.TextField(blank=True)
    implementing_partners = models.TextField(blank=True)
    implementation_dates = models.TextField(blank=True)
    geographic_coverage = models.TextField(blank=True)
    health_focus_areas = models.TextField(blank=True)
    repository = models.TextField(blank=True)
    mobile_application = models.TextField(blank=True)
    wiki = models.TextField(blank=True)

    @classmethod
    def search(cls, **kwargs):
        """
        Search based on search term in given fields.
        """
        q_objects = []
        results = []
        query = kwargs["query"]

        selectable_fields = {
            "location",
            "project_name",
            "health_topic",
            "technology_platform",
            "organisation"
        }

        intersect = selectable_fields & kwargs.keys()

        if intersect:
            if kwargs.get("location"):
                q_objects.append(Q(location__icontains=query))
            if kwargs.get("project_name"):
                q_objects.append(Q(project_name__icontains=query))
            if kwargs.get("health_topic"):
                q_objects.append(Q(health_topic__icontains=query))
            if kwargs.get("technology_platform"):
                q_objects.append(Q(technology_platform__icontains=query))
            if kwargs.get("organisation"):
                q_objects.append(Q(organisation__icontains=query))
        else:
            q_objects.append(Q(location__icontains=query))
            q_objects.append(Q(project_name__icontains=query))
            q_objects.append(Q(health_topic__icontains=query))
            q_objects.append(Q(technology_platform__icontains=query))
            q_objects.append(Q(organisation__icontains=query))
            q_objects.append(Q(contact_name__icontains=query))
            q_objects.append(Q(contact_email__icontains=query))
            q_objects.append(Q(implementation_overview__icontains=query))
            q_objects.append(Q(implementing_partners__icontains=query))
            q_objects.append(Q(geographic_coverage__icontains=query))
            q_objects.append(Q(implementation_dates__icontains=query))
            q_objects.append(Q(health_focus_areas__icontains=query))
            q_objects.append(Q(repository__icontains=query))
            q_objects.append(Q(mobile_application__icontains=query))
            q_objects.append(Q(wiki__icontains=query))

        filter_exp = functools.reduce(operator.or_, q_objects)

        for ps in cls.objects.filter(filter_exp):
            results.append({
                "id": ps.project.id,
                "name": ps.project_name,
                "organisation_name": ps.project.get_organisation().name,
                "country_name": Country.objects.get(id=ps.project.data.get('country')).name
            })
        return results


@receiver(post_save, sender=Project)
def update_with_project_data(sender, instance, **kwargs):
    """
    Updates relevant ProjectSearch data on every Project model save.
    """
    project_search, created = ProjectSearch.objects.get_or_create(project_id=instance.id)
    project_search.location = Country.objects.get(id=instance.data["country"]).name
    project_search.project_name = instance.data.get("name", "")
    project_search.technology_platform = ", ".join([x for x in instance.data.get("technology_platforms", "")])
    project_search.organisation = Organisation.get_name_by_id(instance.data.get("organisation"))
    project_search.contact_name = instance.data.get("contact_name", "")
    project_search.contact_email = instance.data.get("contact_email", "")
    project_search.implementation_overview = instance.data.get("implementation_overview", "")
    project_search.implementing_partners = instance.data.get("implementing_partners", "")
    project_search.implementation_dates = instance.data.get("implementation_dates", "")
    project_search.geographic_coverage = instance.data.get("geographic_coverage", "")
    project_search.health_focus_areas = ", ".join([x for x in instance.data.get("health_focus_areas", "")])
    project_search.repository = instance.data.get("repository", "")
    project_search.mobile_application = instance.data.get("mobile_application", "")
    project_search.wiki = instance.data.get("wiki", "")
    project_search.save()


@receiver(intervention_save, sender=InterventionView)
def update_with_hss_data(sender, instance, **kwargs):
    intervention_labels = []
    for col_index, col in enumerate(instance.data["interventions"]):
        for value in col["interventions"]:
            intervention_labels.append(value)
    if intervention_labels:
        project_search, created = ProjectSearch.objects.get_or_create(project_id=instance.project_id)
        project_search.health_topic = ", ".join(intervention_labels)
        project_search.save()
