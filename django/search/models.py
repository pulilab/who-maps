import operator
import functools

from django.db import models
from django.db.models import Q
from django.db.models.signals import post_save
from django.dispatch import receiver

from core.models import ExtendedModel
from project.models import Project
from country.models import Country
from user.models import Organisation


class ProjectSearch(ExtendedModel):
    project = models.ForeignKey(Project)
    location = models.TextField(blank=True)
    project_name = models.TextField(blank=True)
    organisation = models.TextField(blank=True)
    contact_name = models.TextField(blank=True)
    contact_email = models.TextField(blank=True)
    implementation_overview = models.TextField(blank=True)
    implementing_partners = models.TextField(blank=True)
    implementation_dates = models.TextField(blank=True)
    health_focus_areas = models.TextField(blank=True)
    geographic_scope = models.TextField(blank=True)
    repository = models.TextField(blank=True)
    mobile_application = models.TextField(blank=True)
    wiki = models.TextField(blank=True)
    platforms = models.TextField(blank=True)
    public_id = models.TextField(blank=True)

    @classmethod
    def search(cls, **kwargs):
        """
        Search based on search term in given fields.
        """
        q_objects = []
        results = []
        query = kwargs["query"]

        selectable_fields = {"location", "project_name", "technology_platform", "organisation"}
        query_keys = set([k for k, v in kwargs.items() if v is True])
        intersect = selectable_fields & query_keys

        if intersect:
            if kwargs.get("location"):
                q_objects.append(Q(location__icontains=query))
            if kwargs.get("project_name"):
                q_objects.append(Q(project_name__icontains=query))
            if kwargs.get("technology_platform"):
                q_objects.append(Q(platforms__icontains=query))
            if kwargs.get("organisation"):
                q_objects.append(Q(organisation__icontains=query))
        else:
            q_objects.append(Q(location__icontains=query))
            q_objects.append(Q(project_name__icontains=query))
            q_objects.append(Q(platforms__icontains=query))
            q_objects.append(Q(organisation__icontains=query))
            q_objects.append(Q(contact_name__icontains=query))
            q_objects.append(Q(contact_email__icontains=query))
            q_objects.append(Q(implementation_overview__icontains=query))
            q_objects.append(Q(implementing_partners__icontains=query))
            q_objects.append(Q(implementation_dates__icontains=query))
            q_objects.append(Q(geographic_scope__icontains=query))
            q_objects.append(Q(health_focus_areas__icontains=query))
            q_objects.append(Q(repository__icontains=query))
            q_objects.append(Q(mobile_application__icontains=query))
            q_objects.append(Q(wiki__icontains=query))
            q_objects.append(Q(public_id__icontains=query))

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
    project_search.project_name = instance.name
    project_search.organisation = Organisation.get_name_by_id(instance.data.get("organisation"))
    project_search.contact_name = instance.data.get("contact_name", "")
    project_search.contact_email = instance.data.get("contact_email", "")
    project_search.implementation_overview = instance.data.get("implementation_overview", "")
    project_search.implementing_partners = ", ".join([x for x in instance.data.get("implementing_partners", "")])
    project_search.implementation_dates = instance.data.get("implementation_dates", "")
    project_search.health_focus_areas = ", ".join([x for x in instance.data.get("health_focus_areas", "")])
    project_search.geographic_scope = instance.data.get("geographic_scope", "")
    project_search.repository = instance.data.get("repository", "")
    project_search.mobile_application = instance.data.get("mobile_application", "")
    project_search.wiki = instance.data.get("wiki", "")
    project_search.platforms = ", ".join([x.get('name', '') for x in instance.data.get("platforms", "")])
    project_search.public_id = instance.public_id
    project_search.save()
