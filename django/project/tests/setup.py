from datetime import datetime

from allauth.account.models import EmailConfirmation
from rest_framework.reverse import reverse
from rest_framework.test import APITestCase, APIClient

from core.factories import OrganisationFactory, DonorFactory
from country.models import Country
from user.models import Organisation, UserProfile
from project.models import Project
from typing import List, Dict
from rest_framework import status


class MockRequest:
    user = None
    GET = {}
    COOKIES = {}


class TestData(APITestCase):
    """
    Base class for test data generation.
    Provides functions to create the general structure that we need for our unit tests involving projects.
    """

    def setUp(self):
        self.create_base_info()
        self.create_countries()
        self.projects = []

    def create_base_info(self, org: str = 'org1', donors: List[Dict] = None):
        """
        Create organisation and donors
        """
        if donors is None:
            donors = [{'name': 'Donor1', 'code': 'donor1'}, {'name': 'Donor2', 'code': 'donor2'}]
        self.org = OrganisationFactory(name=org)
        self.donors = []
        for d in donors:
            self.donors.append(DonorFactory(name=d['name'], code=d['code']))
        self.d1 = self.donors[0]
        self.d2 = self.donors[1]

    def create_countries(self, countries: List[Dict] = None, create_global: bool = True):
        """
        Create countries
        """
        if create_global:
            self.country_global, _ = Country.objects.get_or_create(code="00", defaults={'name': "Global"})
        if countries is None:
            countries = [
                {'name': 'Hungary',
                 'code': 'CTR1',
                 'project_approval': True,
                 'region': Country.REGIONS[0][0],
                 'name_en': 'Hungary',
                 'name_fr': 'Hongrie'},
                {'name': 'country_2', 'code': 'CTR2', 'project_approval': False, 'region': Country.REGIONS[0][0]},
            ]
        self.countries = []

        for country in countries:
            c, _ = Country.objects.get_or_create(code=country['code'], defaults={
                "name": country['name'],
                "project_approval": country['project_approval'],
                "region": country['region']
            })
            self.countries.append(c)
        self.country1 = self.countries[0]
        self.country2 = self.countries[1]

    def generate_project_data(
            self,
            project_name: str,
            organisation: Organisation = None,
            country: Country = None,
            donors: List[int] = None,
            date=datetime.today().date(),
            stages: List[Dict] = None,
            hfa: List[int] = None,
            standards: List[int] = None):
        if not organisation:
            organisation = self.org
        if not country:
            country = self.country1
        if donors is None:
            donors = [self.d1.id, self.d2.id]
        if not stages:
            stages = [
                dict(id=1, date=str(date), note="stage 1 note"),
                dict(id=2, date=str(date), note="stage 2 note")
            ]
        if not hfa:
            hfa = [1, 2]
        if not standards:
            standards = [1]
        return {
            'project': {
                'date': date,
                'name': project_name,
                'organisation': organisation.id,
                'contact_name': 'name1',
                'contact_email': 'a@a.com',
                'implementation_overview': 'overview',
                'implementation_dates': '2016',
                'health_focus_areas': hfa,
                'geographic_scope': "somewhere",
                'country': country.id,
                'software': [1, 2],
                'dhis': [1, 2],
                'licenses': [1, 2],
                'coverage': [
                    {'district': 'dist1', 'clients': 20, 'health_workers': 5, 'facilities': 4},
                    {'district': 'dist2', 'clients': 10, 'health_workers': 2, 'facilities': 8}
                ],
                'coverage_second_level': [
                    {'district': 'ward1', 'clients': 209, 'health_workers': 59, 'facilities': 49},
                    {'district': 'ward2', 'clients': 109, 'health_workers': 29, 'facilities': 89}
                ],
                'national_level_deployment': {
                    'clients': 20000, 'health_workers': 0, 'facilities': 0,
                    'facilities_list': ['facility1', 'facility2', 'facility3']
                },
                'donors': donors,
                'his_bucket': [1, 2],
                'hsc_challenges': [1, 2],
                'government_investor': 0,
                'implementing_partners': ['partner1', 'partner2'],
                'repository': 'http://some.repo',
                'mobile_application': 'http://mobile.app.org',
                'wiki': 'http://wiki.org',
                'interoperability_link': [
                    {'id': 1, 'selected': True, 'link': 'http://blabla.com'},
                    {'id': 2, 'selected': True},
                    {'id': 3, 'selected': True, 'link': 'http://example.org'},
                ],
                'interoperability_standards': standards,
                'start_date': date,
                'end_date': date,
                'stages': stages,
            }
        }

    def create_user(self, user_email="test_user@gmail.com", user_password_1="123456hetNYOLC",
                    user_password_2="123456hetNYOLC", org: Organisation = None, country: Country = None):
        """
        Create a test user with profile.
        """
        if org is None:  # pragma: no cover
            org = self.org
        if country is None:  # pragma: no cover
            country = self.country1

        url = reverse("rest_register")
        data = {"email": user_email, "password1": user_password_1, "password2": user_password_2}
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, 201, response.json())
        user_profile_id = response.json().get('user_profile_id')

        # Validate the account.
        key = EmailConfirmation.objects.get(email_address__email=user_email).key
        url = reverse("rest_verify_email")
        data = {
            "key": key,
        }
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, 200, response.json())

        # Log in the user.
        url = reverse("token_obtain_pair")
        data = {
            "username": user_email,
            "password": user_password_1}
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, 200, response.json())
        test_user_key = response.json().get("access")
        test_user_client = APIClient(HTTP_AUTHORIZATION="Token {}".format(test_user_key), format="json")

        # Update profile
        url = reverse("userprofile-detail", kwargs={"pk": user_profile_id})
        data = {
            "name": "Test Name",
            "organisation": org.pk,
            "country": country.pk}
        response = test_user_client.put(url, data, format='json')
        self.assertEqual(response.status_code, 200, response.json())

        userprofile = UserProfile.objects.get(id=user_profile_id)
        country.users.add(userprofile)

        return userprofile, test_user_key, test_user_client

    def create_draft_project(self, project_data):
        url = reverse("project-create", kwargs={"country_id": project_data['project']['country']})
        response = self.test_user_client.post(url, project_data, format="json")
        self.assertEqual(response.status_code, 201)
        self.assertFalse(response.json()['public_id'])
        project = Project.objects.get(id=response.json()['id'])
        self.projects.append(project)
        return project

    def publish_project(self, project_id, project_data):
        url = reverse("project-publish", kwargs={"project_id": project_id,
                                                 "country_id": project_data['project']['country']})
        response = self.test_user_client.put(url, project_data, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK, response.json())

    def archive_project(self, project_id):
        url = reverse("project-archive", kwargs={"project_id": project_id})
        response = self.test_user_client.put(url, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)


class SetupTests(TestData):
    def setUp(self):
        super(SetupTests, self).setUp()
        self.userprofile, self.test_user_key, self.test_user_client = self.create_user()

        self.user_profile_id = self.userprofile.id
        self.project_data = self.generate_project_data(project_name="Test Project1")
        project = self.create_draft_project(self.project_data)
        self.project_id = project.id
        self.publish_project(self.project_id, self.project_data)

        # Make an archived project as well, see if it generates any confusion down the line
        archived_project_data = self.generate_project_data(project_name="Test Project Archived")
        archived_project = self.create_draft_project(archived_project_data)
        archived_project_id = archived_project.id
        self.publish_project(archived_project_id, archived_project_data)
        archived_project.archive()

    def check_project_search_init_state(self, project):
        obj = project.search
        self.assertEqual(obj.project_id, project.id)

        for field in obj._meta.fields:
            if field.name not in ('created', 'modified', 'project'):
                self.assertEqual(getattr(obj, field.name), field.get_default())
