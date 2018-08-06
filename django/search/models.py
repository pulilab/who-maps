import itertools
import operator
import functools

from django.db import models
from django.db.models import Q
from django.db.models.signals import post_save
from django.contrib.postgres.fields import ArrayField
from django.dispatch import receiver

from core.models import ExtendedModel
from project.models import Project, HealthFocusArea, TechnologyPlatform, HSCChallenge, DigitalStrategy
from country.models import Country
from user.models import Organisation


class ProjectSearch(ExtendedModel):
    MAP_VALUES = (
        "project_id",
        "project__name",
        "organisation_id",
        "country_id",
        "project__data__coverage",
        "project__data__national_level_deployment",
        "project__data__government_investor",
        "project__approval__approved",
        "found_in"  # TODO: compute this
    )

    LIST_VALUES = (
        "project_id",
        "project__name",
        "organisation_id",
        "country_id",
        "project__data__geographic_scope",
        "project__data__implementation_overview",
        "project__data__contact_name",
        "project__data__contact_email",
        "project__data__platforms",
        "project__data__health_focus_areas",
        "project__data__hsc_challenges",
        "project__data__his_bucket",
        "country__region",
        "project__data__government_investor",
        "project__data__donors",  # TODO: will be refactored
        "project__approval__approved"
    )

    ORDER_BY = (
        "project__name",
        "country__name",
        "country__region",
        "organisation__name",
        "project__data__government_investor"
    )

    SEARCH_BY = (
        "project__name",
        "organisation__name",
        "country__name",
        "project__data__implementation_overview",
        "coverage",
        "project__data__implementing_partners",  # TODO: will be refactored
        "project__data__donors"  # TODO: will be refactored
    )

    project = models.OneToOneField(Project, on_delete=models.CASCADE, primary_key=True, related_name='search')
    country = models.ForeignKey(Country, null=True, on_delete=models.SET_NULL)
    organisation = models.ForeignKey(Organisation, null=True, on_delete=models.SET_NULL)

    software = ArrayField(models.IntegerField(), default=list)
    coverage = ArrayField(models.CharField(max_length=64), default=list)
    dhi_categories = ArrayField(models.IntegerField(), default=list)
    hsc_categories = ArrayField(models.IntegerField(), default=list)
    hfa_categories = ArrayField(models.IntegerField(), default=list)

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
                "country": Country.objects.only('id').get(id=ps.project.data.get('country')).id
            })
        return results

    def update(self, project):
        if project.public_id:
            self.country_id = int(project.data["country"])
            self.organisation_id = int(project.data["organisation"])

@receiver(post_save, sender=Project)
def create_search_objects(sender, instance, created, **kwargs):
    if created:
        ProjectSearch.objects.get_or_create(project_id=instance.id)


@receiver(post_save, sender=Project)
def update_with_project_data(sender, instance, **kwargs):
    """
    Updates relevant ProjectSearch data on every Project model save.
    """
    if instance.public_id:
        project_search, created = ProjectSearch.objects.get_or_create(project_id=instance.id)
        project_search.location = Country.objects.get(id=instance.data["country"]).name
        project_search.project_name = instance.name
        project_search.organisation = Organisation.get_name_by_id(instance.data.get("organisation"))
        project_search.contact_name = instance.data.get("contact_name", "")
        project_search.contact_email = instance.data.get("contact_email", "")
        project_search.implementation_overview = instance.data.get("implementation_overview", "")
        project_search.implementing_partners = ", ".join([x for x in instance.data.get("implementing_partners", "")])
        project_search.implementation_dates = instance.data.get("implementation_dates", "")
        project_search.geographic_scope = instance.data.get("geographic_scope", "")
        project_search.repository = instance.data.get("repository", "")
        project_search.mobile_application = instance.data.get("mobile_application", "")
        project_search.wiki = instance.data.get("wiki", "")
        project_search.public_id = instance.public_id

        project_search.health_focus_areas = ", ".join(
            [x.name for x in HealthFocusArea.objects.get_names_for_ids(instance.data.get("health_focus_areas", []))])

        platform_ids = [x['id'] for x in instance.data.get("platforms", [])]
        project_search.platforms = ", ".join([x.name for x in TechnologyPlatform.objects.filter(
            id__in=platform_ids).only('name')])

        project_search.save()
