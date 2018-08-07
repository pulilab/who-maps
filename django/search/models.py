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

    @classmethod
    def filter(cls, queryset):
        """
        Filter QuerySet by various filter terms
        :return: QuerySet
        """
        return queryset

    @classmethod
    def order(cls, queryset):
        """
        Order QuerySet by order keywords
        :return: QuerySet
        """
        ORDER_BY = (
            "project__name",
            "country__name",
            "country__region",
            "organisation__name",
            "project__data__government_investor"
        )
        return queryset

    def update(self, project):
        """
        Update search object from project object
        """
        if project.public_id:
            self.country_id = int(project.data["country"])
            self.organisation_id = int(project.data["organisation"])

            self.software = [int(x['id']) for x in project.data.get("platforms", [])]
            self.coverage = [x.get('district', "") for x in project.data.get("coverage", [])]
            self.dhi_categories = list(set(filter(None.__ne__,
                                              [DigitalStrategy.get_parent_id(int(strategy_id), 'parent') for
                                               strategy_id in list(itertools.chain(
                                                  *[platform['strategies'] for platform in
                                                    project.data.get("platforms", []) if
                                                    platform.get('strategies')]))])))
            self.hsc_categories = list(set(filter(None.__ne__,
                                              [HSCChallenge.get_parent_id(int(id), 'group') for id in
                                               project.data.get("hsc_challenges", [])])))
            self.hfa_categories = list(set(filter(None.__ne__,
                                              [HealthFocusArea.get_parent_id(int(id), 'health_category') for
                                               id in project.data.get("health_focus_areas", [])])))

            self.save()


@receiver(post_save, sender=Project)
def create_search_objects(sender, instance, created, **kwargs):
    if created:
        ProjectSearch.objects.get_or_create(project_id=instance.id)


@receiver(post_save, sender=Project)
def update_with_project_data(sender, instance, **kwargs):
    instance.search.update(instance)
