import copy
from datetime import datetime

from django.core.urlresolvers import reverse
from allauth.account.models import EmailConfirmation
from rest_framework.test import APIClient
from rest_framework.test import APITestCase

from country.models import Country
from user.models import Organisation


class ProjectTests(APITestCase):

    def setUp(self):
        # Create a test user with profile.
        url = reverse("rest_register")
        data = {
            "email": "test_user@gmail.com",
            "password1": "123456",
            "password2": "123456"}
        response = self.client.post(url, data)

        # Validate the account.
        key = EmailConfirmation.objects.get(email_address__email="test_user@gmail.com").key
        url = reverse("rest_verify_email")
        data = {
            "key": key,
        }
        response = self.client.post(url, data)

        # Log in the user.
        url = reverse("api_token_auth")
        data = {
            "username": "test_user@gmail.com",
            "password": "123456"}
        response = self.client.post(url, data)
        self.test_user_key = response.json().get("token")
        self.test_user_client = APIClient(HTTP_AUTHORIZATION="Token {}".format(self.test_user_key), format="json")
        self.user_profile_id = response.json().get('user_profile_id')

        # Update profile.
        self.org = Organisation.objects.create(name="org1")
        url = reverse("userprofile-detail", kwargs={"pk": self.user_profile_id})
        data = {
            "name": "Test Name",
            "organisation": self.org.id,
            "country": "test_country"}
        response = self.test_user_client.put(url, data)

        country = Country.objects.create(name="country1")

        project_data = {
            "date": datetime.utcnow(),
            "name": "phrase1 phrase2",
            "organisation": self.org.id,
            "contact_name": "name1",
            "contact_email": "a@a.com",
            "implementation_overview": "overview",
            "implementation_dates": "2016",
            "health_focus_areas": ["area1", "area2"],
            "geographic_scope": "somewhere",
            "strategy": ["strat1", "strat2"],   # Can hold 'other' fields
            "country": country.id,
            "objective": "objective1",
            "technology_platforms": ["tech1", "tech2"],  # Can hold 'other' fields
            "licenses": ["lic1", "lic2"],  # Can hold 'other' fields
            "application": ["app1", "app2"],
            "coverage": [
                {"district": "dist1", "clients": 20, "health_workers": 5, "facilities": 4},
                {"district": "dist2", "clients": 10, "health_workers": 2, "facilities": 8}
            ],
            "started": datetime.utcnow(),
            "donors": ["donor1", "donor2"],  # Should be text instead of ID - no Donors in MVP
            "reports": ["http://foo.com", "http://bar.com"],
            "publications": ["http://foo.com", "http://bar.com"],
            "pipeline": ["pip1", "pip2"],  # Can hold 'other' fields
            "goals_to_scale": "scale",
            "anticipated_time": "time",
            "pre_assessment": [1,0,3,0,4,0],
        }
        url = reverse("project-crud")
        response = self.test_user_client.post(url, project_data)
        self.project_id = response.json().get("id")

        project_data2 = copy.deepcopy(project_data)
        project_data2.update(name="phrase3 phrase5")
        project_data2.update(technology_platforms=["phrase2", "phrase1"])
        response = self.test_user_client.post(url, project_data2)

    def test_search_two_fields(self):
        url = reverse("search-project")
        data = {
            "query": "phrase2",
            "project_name": True,
            "technology_platform": True
        }
        response = self.test_user_client.post(url, data)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.json()), 2)

    def test_search_one_field(self):
        url = reverse("search-project")
        data = {
            "query": "phrase1",
            "project_name": True,
        }
        response = self.test_user_client.post(url, data)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.json()), 1)

    def test_search_org(self):
        url = reverse("search-project")
        data = {
            "query": "org1",
            "organisation": True,
        }
        response = self.test_user_client.post(url, data)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.json()), 2)

    def test_search_not_found(self):
        url = reverse("search-project")
        data = {
            "query": "nonexistent",
            "project_name": True,
            "technology_platform": True,
            "location": True,
            "health_topic": True,
            "organisation": True
        }
        response = self.test_user_client.post(url, data)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.json()), 0)
