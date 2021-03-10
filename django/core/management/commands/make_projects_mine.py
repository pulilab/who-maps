import os

import datetime
import operator
from functools import reduce
from django.core.management.base import BaseCommand
from django.conf import settings
from django.db.models import Count
from django.utils import timezone
from rest_framework.authtoken.models import Token

# from django.contrib.postgres.aggregates import ArrayAgg
from project.models import Project, ProjectApproval, ProjectImportV2
from country.models import Country
from user.models import User, UserProfile
from django.db.models import Q, F, IntegerField
from search.models import ProjectSearch

from django.contrib.postgres.fields.jsonb import KeyTextTransform
from django.db.models.functions import Cast
import pprint


class Command(BaseCommand):
    help = """
    Adds me to the members of a large number of projects
    """

    def handle(self, *args, **options):
        self.stdout.write("-- Starting the noble process")

        user = UserProfile.objects.get(user__email='dk@pulilab.com')

        for project in Project.objects.all():
            if project.pk % 10 == 0:
                project.viewers.add(user)
                project.save()
            elif project.pk % 11 == 0:
                project.team.add(user)
                project.save()

        self.stdout.write("-- Done")
