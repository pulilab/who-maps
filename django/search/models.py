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
    project = models.OneToOneField(Project, on_delete=models.CASCADE, primary_key=True, related_name='search')
    country = models.ForeignKey(Country, null=True, on_delete=models.SET_NULL)
    organisation = models.ForeignKey(Organisation, null=True, on_delete=models.SET_NULL)

    software = ArrayField(models.IntegerField(), default=list)
    coverage = ArrayField(models.CharField(max_length=64), default=list)
    dhi_categories = ArrayField(models.IntegerField(), default=list)
    hsc_categories = ArrayField(models.IntegerField(), default=list)
    hfa_categories = ArrayField(models.IntegerField(), default=list)

    @classmethod
    def search(cls, queryset, search_term, search_in):
        """
        Search in QuerySet
        search_term: STRING -- search term
        search_in: LIST <name,org,country,overview,loc,donor,partner> -- default is all
        :return: QuerySet
        """

        filter_exp = functools.reduce(operator.or_, q_objects)

        return queryset

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
