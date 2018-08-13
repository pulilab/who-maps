import itertools
import operator
import functools
from typing import Set

from django.db import models
from django.db.models import Q, QuerySet
from django.db.models.signals import post_save
from django.contrib.postgres.fields import ArrayField
from django.dispatch import receiver

from core.models import ExtendedModel
from project.models import Project, HealthFocusArea, TechnologyPlatform, HSCChallenge, DigitalStrategy
from country.models import Country
from user.models import Organisation


class ProjectSearch(ExtendedModel):
    SEARCH_BY = {
        # query_param: QuerySet param | eg: in=name&in=org
        "name": "project__name",
        "org": "organisation__name",
        "country": "country__name",
        "overview": "project__data__implementation_overview",
        "loc": "coverage",
        "partner": "project__data__implementing_partners",  # TODO: will be refactored
        "donor": "project__data__donors"  # TODO: will be refactored
    }

    FILTER_BY = {
        # query_param: QuerySet param
        "country": "country_id",  # eg: country=1&country=2
        "sw": "software",  # eg: sw=1&sw=2
        "dhi": "dhi_categories",  # eg: dhi=1&dhi=2
        "hfa": "hfa_categories",  # eg: hfa=1&hfa=2
        "hsc": "hsc_categories",  # eg: hsc=1&hsc=2
        "his": "his",  # eg: his=1&his=2
        "region": "country__region",  # eg: region=3
        "gov": "project__data__government_investor",  # false=> gov=0 ; true=> gov=1&gov=2
        "donor": "project__data__donors",  # TODO: will be refactored
        "approved": "project__approval__approved"  # false=> approved=0 ; true=> approved=1
    }

    project = models.OneToOneField(Project, on_delete=models.CASCADE, primary_key=True, related_name='search')
    country = models.ForeignKey(Country, null=True, on_delete=models.SET_NULL)
    organisation = models.ForeignKey(Organisation, null=True, on_delete=models.SET_NULL)

    software = ArrayField(models.IntegerField(), default=list)
    coverage = ArrayField(models.CharField(max_length=64), default=list)
    dhi_categories = ArrayField(models.IntegerField(), default=list)
    hsc_categories = ArrayField(models.IntegerField(), default=list)
    hfa_categories = ArrayField(models.IntegerField(), default=list)
    his = ArrayField(models.IntegerField(), default=list)

    @classmethod
    def search(cls, queryset: QuerySet, search_term: str, search_in: List[str]) -> QuerySet:
        """
        Search in QuerySet
        search_term: search term
        search_in: Available options: <name,org,country,overview,loc,donor,partner> -- default is all
        """

        selectable_fields = set(cls.SEARCH_BY.keys())
        selected_fields = selectable_fields & set(search_in) if search_in else selectable_fields

        q_objects = [Q(**{"{}__icontains".format(cls.SEARCH_BY[field]): search_term}) for field in selected_fields]

        filter_exp = functools.reduce(operator.or_, q_objects)
        qs = queryset.filter(filter_exp)

        return qs

    @classmethod
    def found_in(cls, queryset: QuerySet, search_term: str) -> Dict[str, list]:
        """
        Returns what projects are found in which search field
        {
            field: [project_id(s)]
        }
        """
        found_in = {}

        for field, exp in cls.SEARCH_BY.items():
            project_ids = queryset.filter(**{"{}__icontains".format(exp): search_term})\
                .values_list('project_id', flat=True)
            found_in[field] = project_ids

        return found_in

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
            self.his = project.data.get('his_bucket')

            self.save()


@receiver(post_save, sender=Project)
def create_search_objects(sender, instance, created, **kwargs):
    if created:
        ProjectSearch.objects.get_or_create(project_id=instance.id)


@receiver(post_save, sender=Project)
def update_with_project_data(sender, instance, **kwargs):
    instance.search.update(instance)
