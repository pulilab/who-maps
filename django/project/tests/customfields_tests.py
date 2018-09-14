from rest_framework.reverse import reverse

from country.models import CountryCustomQuestion
from project.models import Project
from project.tests.setup import SetupTests


class CustomFieldTests(SetupTests):

    def test_country_answer_wrong_country(self):
        url = reverse("country-custom-answer",
                      kwargs={
                          "country_id": 999,
                          "project_id": self.project_id
                      })
        data = [dict(question_id=1, answer="lol1", draft=False)]

        response = self.test_user_client.post(url, data=data, format='json')
        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.json(), {'country_id': ['Wrong country_id']})

    def test_country_answer_wrong_country_and_project(self):
        url = reverse("country-custom-answer",
                      kwargs={
                          "country_id": 999,
                          "project_id": 999
                      })
        data = [dict(question_id=1, answer="lol1", draft=False)]

        response = self.test_user_client.post(url, data=data, format='json')
        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.json(), {'country_id': ['Wrong country_id'], 'project_id': ['Wrong project_id']})

    def test_country_answer_wrong_question_id(self):
        url = reverse("country-custom-answer",
                      kwargs={
                          "country_id": self.country_id,
                          "project_id": self.project_id
                      })
        data = [dict(question_id='a', answer="lol1", draft=False)]

        response = self.test_user_client.post(url, data=data, format='json')
        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.json(), [{'question_id': ['A valid integer is required.']}])

        data = [dict(question_id=1, answer="lol1", draft=False)]

        response = self.test_user_client.post(url, data=data, format='json')
        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.json(), [{'question_id': ['Wrong question_id']}])

    def test_country_answer_wrong_all_required(self):
        url = reverse("country-custom-answer",
                      kwargs={
                          "country_id": self.country_id,
                          "project_id": self.project_id
                      })
        data = [dict()]

        response = self.test_user_client.post(url, data=data, format='json')
        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.json(), [{'question_id': ['This field is required.'],
                                            'answer': ['This field is required.'],
                                            'draft': ['This field is required.']}])
