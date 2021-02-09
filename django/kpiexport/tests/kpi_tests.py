from rest_framework.test import APITestCase, APIClient
from rest_framework.reverse import reverse

from core.factories import OrganisationFactory, DonorFactory, UserProfileFactory
from country.models import Country, Donor
from user.models import UserProfile, Organisation

from datetime import datetime, date, timedelta
from random import randint

from allauth.account.models import EmailConfirmation
from django.utils import timezone
from rest_framework.authtoken.models import Token

class TestProjectData:
    """
    Base class for KPI tests. In setUp, it creates:
    - test user with profile
    - 4 countries
    - 2 donors
    - 10 draft projects
    - 10 published projects
    """

    def setUp(self):
        # Create organisation and donors
        self.org = OrganisationFactory(name="org1")
        self.d1 = DonorFactory(name="Donor1", code="donor1")
        self.d2 = DonorFactory(name="Donor2", code="donor2")
        # Create countries
        self.country1, _ = Country.objects.get_or_create(name="kpi_country_1",
                                                         defaults={"code": "CTR1",
                                                                   "project_approval": True,
                                                                   "region": Country.REGIONS[0][0]})
        self.country2, _ = Country.objects.get_or_create(name="kpi_country_2",
                                                         defaults={"code": "CTR2",
                                                                   "project_approval": True,
                                                                   "region": Country.REGIONS[0][0]})
        self.country3, _ = Country.objects.get_or_create(name="kpi_country_3",
                                                         defaults={"code": "CTR3",
                                                                   "project_approval": False,
                                                                   "region": Country.REGIONS[0][0]})
        self.country4, _ = Country.objects.get_or_create(name="kpi_country_4",
                                                         defaults={"code": "CTR4",
                                                                   "project_approval": False,
                                                                   "region": Country.REGIONS[0][0]})
        # Create user
        self.userprofile, self.test_user_key, self.test_user_client = self.create_user(org=self.org,
                                                                                       country=self.country1)
        # Create draft projects
        self.draft_projects = list()
        for i in range(10):
            if i % 2 == 0:
                country = self.country1
            else:
                country = self.country3
            project = self.create_new_project(name=f'Draft project {i}', country=country, publish=False)
            self.draft_projects.append(project)
        # Create published projects
        self.published_projects = list()
        for i in range(10):
            if i % 2 == 0:
                country = self.country2
            else:
                country = self.country4
            project = self.create_new_project(name=f'Published project {i}', country=country)
            self.published_projects.append(project)

        # Create test users:
        self.userprofiles = list()
        for i in range(20):
            profile = UserProfileFactory(name=f'Test User {i}')

            profile.account_type = UserProfile.ACCOUNT_TYPE_CHOICES[i % len(UserProfile.ACCOUNT_TYPE_CHOICES)][0]
            profile.user.last_login = timezone.now() - timedelta(days=i*10)
            profile.country = self.country1 if i % 2 == 0 else self.country3
            profile.user.save()
            profile.save()
        self.token, _ = Token.objects.get_or_create(user=self.userprofile.user)
        self.token_client = APIClient(HTTP_AUTHORIZATION="Token {}".format(self.token.key), format="json")

    def create_user(self, user_email="test_user@gmail.com", user_password_1="123456hetNYOLC",
                    user_password_2="123456hetNYOLC", org: Organisation = None, country: Country = None):
        """
        Create a test user with profile.
        """
        if org is None:  # pragma: no cover
            org = self.org
        if country is None:  # pragma: no cover
            country = self.country

        url = reverse("rest_register")
        data = {
            "email": user_email,
            "password1": user_password_1,
            "password2": user_password_2}

        response = self.client.post(url, data)
        self.assertEqual(response.status_code, 201, response.json())

        # Validate the account.
        key = EmailConfirmation.objects.get(email_address__email="test_user@gmail.com").key
        url = reverse("rest_verify_email")
        data = {
            "key": key,
        }
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, 200, response.json())

        # Log in the user.
        url = reverse("api_token_auth")
        data = {
            "username": "test_user@gmail.com",
            "password": "123456hetNYOLC"}
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, 200, response.json())
        test_user_key = response.json().get("token")
        test_user_client = APIClient(HTTP_AUTHORIZATION="Token {}".format(test_user_key), format="json")
        user_profile_id = response.json().get('user_profile_id')

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

    def create_test_data(self, name: str = "Test Project1",
                         country: Country = None, d1: Donor = None, d2: Donor = None, org: Organisation = None,
                         date: date = None, start_date: date = None, end_date: date = None,
                         stages: list = None):
        """
        Generates test project data, with (somewhat) customizable parameters
        """
        if country is None:  # pragma: no cover
            country = self.country1
        if org is None:
            org = self.org
        if d1 is None:
            d1 = self.d1
        if d2 is None:
            d2 = self.d2
        if date is None:
            date = datetime.utcnow()
        if start_date is None:
            start_date = str(datetime.today().date())
        if end_date is None:
            end_date = str(datetime.today().date())
        if stages is None:
            stages = [{
                "id": 1,
                "date": str(datetime.today().date()),
                "note": "stage 1 note",
            }, {
                "id": 2,
                "date": str(datetime.today().date()),
                "note": "stage 2 note",
            }]

        return {"project": {
            "date": date,
            "name": name,
            "organisation": org.id,
            "contact_name": "name1",
            "contact_email": "a@a.com",
            "implementation_overview": "overview",
            "implementation_dates": "2016",
            "health_focus_areas": [1, 2],
            "geographic_scope": "somewhere",
            "country": country.id,
            "platforms": [{
                "id": 1,
                "strategies": [1, 2]
            }, {
                "id": 2,
                "strategies": [1, 9]
            }],
            "licenses": [1, 2],
            "coverage": [
                {"district": "dist1", "clients": 20, "health_workers": 5, "facilities": 4},
                {"district": "dist2", "clients": 10, "health_workers": 2, "facilities": 8}
            ],
            "coverage_second_level": [
                {"district": "ward1", "clients": 209, "health_workers": 59, "facilities": 49},
                {"district": "ward2", "clients": 109, "health_workers": 29, "facilities": 89}
            ],
            "national_level_deployment":
                {"clients": 20000, "health_workers": 0, "facilities": 0,
                 "facilities_list": ['facility1', 'facility2', 'facility3']},
            "donors": [d1.id, d2.id],
            "his_bucket": [1, 2],
            "hsc_challenges": [1, 2],
            "government_investor": 0,
            "implementing_partners": ["partner1", "partner2"],
            "repository": "http://some.repo",
            "mobile_application": "http://mobile.app.org",
            "wiki": "http://wiki.org",
            "interoperability_links": [{"id": 1, "selected": True, "link": "http://blabla.com"},
                                       {"id": 2, "selected": True},
                                       {"id": 3, "selected": True, "link": "http://example.org"}],
            "interoperability_standards": [1],
            "start_date": str(start_date),
            "end_date": str(end_date),
            "stages": stages,
        }}

    def create_new_project(self, test_user_client=None, name: str = None,
                           country: Country = None, d1: Donor = None, d2: Donor = None, org: Organisation = None,
                           date: date = None, start_date: date = None, end_date: date = None,
                           stages: list = None, publish: bool = True):
        if test_user_client is None:
            test_user_client = self.test_user_client

        if name is None:  # pragma: no cover
            project_name = f"Test Project{randint(999, 999999)}"
        else:
            project_name = name
        project_data = self.create_test_data(name=project_name, country=country, d1=d1, d2=d2, org=org, date=date,
                                             start_date=start_date, end_date=end_date, stages=stages)

        # Create project draft
        url = reverse("project-create", kwargs={"country_id": country.id})
        response = test_user_client.post(url, project_data, format="json")
        self.assertEqual(response.status_code, 201, response.json())

        project_id = response.json().get("id")

        # Publish
        if publish:
            url = reverse("project-publish", kwargs={"project_id": project_id, "country_id": country.id})
            response = test_user_client.put(url, project_data, format="json")
            self.assertEqual(response.status_code, 200)

        return project_id


class KPITests(TestProjectData, APITestCase):

    def test_project_kpi_nofilter(self):
        url = reverse("project-kpi")
        response = self.token_client.get(url)
        expected = {'deletable': 0, 'draft': 10, 'duplicates': 0, 'publishable': 10, 'published': 10, 'total': 20}
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json(), expected)

    def test_project_kpi_country_filter(self):
        url = reverse("project-kpi") + f'?countryCode={self.country1.code}'
        response = self.token_client.get(url)
        expected = {'deletable': 0, 'draft': 5, 'duplicates': 0, 'publishable': 5, 'published': 0, 'total': 5}
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json(), expected)

    def test_project_kpi_no_auth(self):
        test_user_client = APIClient(format="json")
        url = reverse("project-kpi")
        response = test_user_client.get(url)
        self.assertEqual(response.status_code, 401)

    def test_project_kpi_date_filter(self):
        date_str = str((timezone.now() - timezone.timedelta(days=9)).date())
        url = reverse('project-kpi') + f'?modified={date_str}'
        response = self.token_client.get(url)
        # we can't edit the modified date for projects, so it should be the same as no filter
        expected = {'deletable': 0, 'draft': 10, 'duplicates': 0, 'publishable': 10, 'published': 10, 'total': 20}
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json(), expected)

    def test_user_kpi_nofilter(self):
        url = reverse("user-kpi")
        response = self.token_client.get(url)

        expected = {
            'Investor Admin': 3,
            'Inventory User': 2,
            'Investor Viewer': 3,
            'Implementer': 4,
            'Government Admin': 2,
            'Government System Admin': 2,
            'Investor System Admin': 3,
            'Government Viewer': 2
        }

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json(), expected)

    def test_user_kpi_countryfilter(self):
        url = reverse("user-kpi") + f'?countryCode={self.country1.code}'
        response = self.token_client.get(url)

        expected = {'Investor Admin': 3, 'Government Viewer': 2, 'Implementer': 4, 'Government System Admin': 2}
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json(), expected)

    def test_user_kpi_loginfilter(self):
        url = reverse("user-kpi") + f'?lastLogin={str((datetime.today() - timedelta(days=20)).date())}'
        response = self.token_client.get(url)

        expected = {'Investor Viewer': 1, 'Implementer': 2, 'Investor Admin': 1}
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json(), expected)
