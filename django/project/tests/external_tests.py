import copy
from datetime import datetime

from allauth.account.models import EmailConfirmation
from django.core import mail
from rest_framework.reverse import reverse
from rest_framework.test import APITestCase, APIClient

from core.factories import CountryFactory, OrganisationFactory
from country.models import Country, Donor
from project.models import Project
from user.models import UserProfile, Organisation


class ExternalAPITests(APITestCase):
