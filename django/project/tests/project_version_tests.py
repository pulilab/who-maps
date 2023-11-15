import copy
from datetime import datetime

from allauth.account.models import EmailConfirmation
from rest_framework.reverse import reverse
from rest_framework.test import APITestCase, APIClient

from core.factories import OrganisationFactory, DonorFactory, CountryFactory
from country.models import Country
from user.models import UserProfile
from project.models import ProjectVersion, Project


class MockRequest:
    user = None
    GET = {}
    COOKIES = {}


class ProjectVersionTests(APITestCase):

    def setUp(self):
        # Create a test user with profile.
        url = reverse("rest_register")
        data = {
            "email": "test_user@gmail.com",
            "password1": "123456hetNYOLC",
            "password2": "123456hetNYOLC"}
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, 201, response.json())
        self.user_profile_id = response.json().get('user_profile_id')

        # Validate the account.
        key = EmailConfirmation.objects.get(email_address__email="test_user@gmail.com").key
        url = reverse("rest_verify_email")
        data = {
            "key": key,
        }
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, 200, response.json())

        # Log in the user.
        url = reverse("token_obtain_pair")
        data = {
            "username": "test_user@gmail.com",
            "password": "123456hetNYOLC"}
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, 200, response.json())
        self.test_user_key = response.json().get("access")
        self.test_user_client = APIClient(HTTP_AUTHORIZATION="Token {}".format(self.test_user_key), format="json")

        # Update profile.
        self.org = OrganisationFactory(name="org1")
        self.country = CountryFactory(name="country1", code='CTR1', project_approval=True,
                                      region=Country.REGIONS[0][0], name_en='Hungary', name_fr='Hongrie')
        self.country_id = self.country.id

        url = reverse("userprofile-detail", kwargs={"pk": self.user_profile_id})
        data = {
            "name": "Test Name",
            "organisation": self.org.id,
            "country": self.country_id}
        response = self.test_user_client.put(url, data, format='json')
        self.assertEqual(response.status_code, 200, response.json())
        self.user_profile_id = response.json().get('id')

        self.userprofile = UserProfile.objects.get(id=self.user_profile_id)
        self.country.users.add(self.userprofile)

        self.d1 = DonorFactory(name="Donor1", code="donor1")
        self.d2 = DonorFactory(name="Donor2", code="donor2")

        self.project_data = {"project": {
            "date": datetime.utcnow(),
            "name": "Test Project1",
            "organisation": self.org.id,
            "contact_name": "name1",
            "contact_email": "a@a.com",
            "implementation_overview": "overview",
            "health_focus_areas": [1, 2],
            "geographic_scope": "somewhere",
            "country": self.country_id,
            "software": [1, 2],
            "dhis": [1, 2, 9],
            "osi_licenses": [1, 2],
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
            "donors": [self.d1.id, self.d2.id],
            "services_and_application_types": [1, 2],
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
            "start_date": str(datetime.today().date()),
            "end_date": str(datetime.today().date()),
            "stages": [{
                "id": 1,
                "date": str(datetime.today().date()),
                "note": "stage 1 note",
            }, {
                "id": 2,
                "date": str(datetime.today().date()),
                "note": "stage 2 note",
            }],
        }}

        # Create project draft
        url = reverse("project-create", kwargs={"country_id": self.country_id})
        response = self.test_user_client.post(url, self.project_data, format="json")
        self.assertEqual(response.status_code, 201, response.json())

        self.project_id = response.json().get("id")

        versions = ProjectVersion.objects.filter(project__pk=self.project_id)
        self.assertEqual(len(versions), 1)
        version = versions[0]
        project = Project.objects.get(id=self.project_id)

        self.assertEqual(version.data, project.draft)
        self.assertEqual(version.name, project.name)
        self.assertEqual(version.version, 1)
        self.assertEqual(version.user, self.userprofile)

    def test_project_versioning(self):
        # Publish
        url = reverse("project-publish", kwargs={"project_id": self.project_id, "country_id": self.country_id})
        response = self.test_user_client.put(url, self.project_data, format="json")
        self.assertEqual(response.status_code, 200)

        versions = ProjectVersion.objects.filter(project__pk=self.project_id)
        self.assertEqual(len(versions), 2)

        version = versions[1]
        project = Project.objects.get(id=self.project_id)

        self.assertEqual(version.data, project.data)
        self.assertEqual(version.name, project.name)
        self.assertEqual(version.version, 2)
        self.assertEqual(version.user, self.userprofile)
        # publish again with same data
        url = reverse("project-publish", kwargs={"project_id": self.project_id, "country_id": self.country_id})
        response = self.test_user_client.put(url, self.project_data, format="json")
        self.assertEqual(response.status_code, 200)

        versions = ProjectVersion.objects.filter(project__pk=self.project_id)
        self.assertEqual(len(versions), 2)
        updated_data = copy.deepcopy(self.project_data)
        updated_data['project']['name'] = 'Updated_project_name'
        # publish again with new data
        url = reverse("project-publish", kwargs={"project_id": self.project_id, "country_id": self.country_id})
        response = self.test_user_client.put(url, updated_data, format="json")
        self.assertEqual(response.status_code, 200)

        versions = ProjectVersion.objects.filter(project__pk=self.project_id)
        self.assertEqual(len(versions), 3)
        version_1 = versions.filter(version=2)[0]
        version_2 = versions.filter(version=3)[0]
        self.assertEqual(version_1.data, project.data)
        self.assertEqual(version_1.name, project.name)
        project.refresh_from_db()
        self.assertEqual(version_2.data, project.data)
        self.assertEqual(version_2.name, project.name)
        self.assertNotEqual(version_1.data, version_2.data)
