import functools
import operator

from django.db import models
from django.contrib.postgres.fields import JSONField

from core.models import ExtendedModel
from project.models import Project
from .hss_data import continuum as CONTINUUM
from .hss_data import applications as APPLICATIONS


class HSS(ExtendedModel):
    project = models.ForeignKey(Project)
    data = JSONField()

    def get_interventions_list(self):
        interventions = self.data.get('interventions')
        if interventions:
            return list(set(functools.reduce(operator.add, [i['interventions'] for i in interventions])))
        else:
            return []

    def get_continuum_list(self):
        continuum = self.data.get('continuum')
        if continuum:
            return [CONTINUUM[c['column_id']]['title'] for c in continuum if c['state'] is True]
        else:
            return []

    def get_constraints_list(self):
        taxonomies = self.data.get('taxonomies')
        if taxonomies:
            return functools.reduce(operator.add, [t['content'] for t in taxonomies])
        else:
            return []

    def get_applications_list(self):
        applications = self.data.get('applications')
        result = set()
        if applications:
            for a in applications:
                try:
                    result.add(APPLICATIONS[a['app_id'] + 1]['subApplications'][a['subapp_id']])
                except Exception:
                    pass

        return list(result)