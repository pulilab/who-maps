import copy

from django.utils import timezone
from rest_framework import status
from rest_framework.reverse import reverse

from project.tests.setup import SetupTests


class ProjectStageTests(SetupTests):

    def test_project_stages(self):
        now = timezone.now()

        data = copy.deepcopy(self.project_data)

        data['project']['name'] = 'Test Project 100'
        data['project']['start_date'] = str((now - timezone.timedelta(days=10)).date())
        data['project']['end_date'] = str((now - timezone.timedelta(days=1)).date())
        del data['project']['stages']

        # create project
        url = reverse("project-create", kwargs={"country_id": self.country_id})
        response = self.test_user_client.post(url, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED, response.json())

        project_id = response.json()['id']

        # add stages
        stages = [
            {
                'id': 1,
                'date': str((now - timezone.timedelta(days=10)).date()),
                'note': 'preparation note'
            },
            {
                'id': 2,
                'date': str((now - timezone.timedelta(days=7)).date()),
                'note': 'analysis note'
            },
            {
                'id': 3,
                'date': str((now - timezone.timedelta(days=3)).date()),
                'note': 'developing note'
            }
        ]
        data['project']['stages'] = stages

        url = reverse("project-draft", kwargs={"project_id": project_id, "country_id": self.country_id})
        response = self.test_user_client.put(url, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK, response.json())
        resp_data = response.json()
        self.assertIn('stages', resp_data['draft'])
        self.assertEqual(len(resp_data['draft']['stages']), 3)

        # try to publish without stages
        del data['project']['stages']
        url = reverse("project-publish", kwargs={"project_id": project_id, "country_id": self.country_id})
        response = self.test_user_client.put(url, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST, response.json())
        self.assertEqual(response.json(), {'project': {'stages': ['This field is required.']}})

        # publish with stages
        data['project']['stages'] = stages
        url = reverse("project-publish", kwargs={"project_id": project_id, "country_id": self.country_id})
        response = self.test_user_client.put(url, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK, response.json())
        resp_data = response.json()
        self.assertIn('stages', resp_data['draft'])
        self.assertEqual(len(resp_data['draft']['stages']), 3)
