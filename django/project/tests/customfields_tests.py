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
        data = [dict(question_id=1, answer=["lol1"], draft=False)]

        response = self.test_user_client.post(url, data=data, format='json')
        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.json(), {'country_id': ['Wrong country_id']})

    def test_country_answer_wrong_country_and_project(self):
        url = reverse("country-custom-answer",
                      kwargs={
                          "country_id": 999,
                          "project_id": 999
                      })
        data = [dict(question_id=1, answer=["lol1"], draft=False)]

        response = self.test_user_client.post(url, data=data, format='json')
        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.json(), {'country_id': ['Wrong country_id'], 'project_id': ['Wrong project_id']})

    def test_country_answer_wrong_question_id(self):
        url = reverse("country-custom-answer",
                      kwargs={
                          "country_id": self.country_id,
                          "project_id": self.project_id
                      })
        data = [dict(question_id='a', answer=["lol1"], draft=False)]

        response = self.test_user_client.post(url, data=data, format='json')
        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.json(), [{'question_id': ['A valid integer is required.']}])

        data = [dict(question_id=1, answer=["lol1"], draft=False)]

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
                                            'draft': ['This field is required.']}])

    def test_country_answer_for_draft(self):
        q = CountryCustomQuestion.objects.create(question="test", country_id=self.country_id)
        url = reverse("country-custom-answer",
                      kwargs={
                          "country_id": self.country_id,
                          "project_id": self.project_id
                      })
        data = [dict(question_id=q.id, answer=["lol1"], draft=True)]

        response = self.test_user_client.post(url, data=data, format='json')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json(), [{'question_id': q.id, 'answer': ['lol1'], 'draft': True}])

        project = Project.objects.last()
        self.assertEqual(project.draft['country_custom_answers'], {str(q.id): ['lol1']})
        self.assertTrue('country_custom_answers' not in project.data)

    def test_country_answer_for_published(self):
        q = CountryCustomQuestion.objects.create(question="test", country_id=self.country_id)
        url = reverse("country-custom-answer",
                      kwargs={
                          "country_id": self.country_id,
                          "project_id": self.project_id
                      })
        data = [dict(question_id=q.id, answer=["lol1"], draft=False)]

        response = self.test_user_client.post(url, data=data, format='json')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json(), [{'question_id': q.id, 'answer': ['lol1'], 'draft': False}])

        project = Project.objects.last()
        self.assertEqual(project.data['country_custom_answers'], {str(q.id): ['lol1']})
        self.assertEqual(project.draft['country_custom_answers'], {str(q.id): ['lol1']})

    def test_country_answer_update_existing_answer(self):
        q = CountryCustomQuestion.objects.create(question="test", country_id=self.country_id)
        url = reverse("country-custom-answer",
                      kwargs={
                          "country_id": self.country_id,
                          "project_id": self.project_id
                      })
        data = [dict(question_id=q.id, answer=["lol1"], draft=False)]

        response = self.test_user_client.post(url, data=data, format='json')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json(), [{'question_id': q.id, 'answer': ['lol1'], 'draft': False}])

        data = [dict(question_id=q.id, answer=["lol2"], draft=False)]

        response = self.test_user_client.post(url, data=data, format='json')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json(), [{'question_id': q.id, 'answer': ['lol2'], 'draft': False}])

        project = Project.objects.last()
        self.assertEqual(project.data['country_custom_answers'], {str(q.id): ['lol2']})
        self.assertEqual(project.draft['country_custom_answers'], {str(q.id): ['lol2']})

    def test_country_answer_new_question(self):
        q1 = CountryCustomQuestion.objects.create(question="test", country_id=self.country_id)
        q2 = CountryCustomQuestion.objects.create(question="test2", country_id=self.country_id)
        url = reverse("country-custom-answer",
                      kwargs={
                          "country_id": self.country_id,
                          "project_id": self.project_id
                      })
        data = [dict(question_id=q1.id, answer=["lol1"], draft=False)]

        response = self.test_user_client.post(url, data=data, format='json')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json(), [{'question_id': q1.id, 'answer': ['lol1'], 'draft': False}])

        data = [dict(question_id=q2.id, answer=["lol2"], draft=False)]

        response = self.test_user_client.post(url, data=data, format='json')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json(), [{'question_id': q2.id, 'answer': ['lol2'], 'draft': False}])

        project = Project.objects.last()
        self.assertEqual(project.data['country_custom_answers'], {str(q1.id): ['lol1'], str(q2.id): ['lol2']})
        self.assertEqual(project.draft['country_custom_answers'], {str(q1.id): ['lol1'], str(q2.id): ['lol2']})

    def test_reorder_country_questions_unsuccessful(self):
        q = CountryCustomQuestion.objects.create(question="test3", country_id=self.country_id)

        url = reverse("country-custom-questions-set-order-to", kwargs={"pk": q.id})
        response = self.test_user_client.post(url, format='json')
        self.assertEqual(response.status_code, 400)

        response = self.test_user_client.post(url, data={'to': 'a'}, format='json')
        self.assertEqual(response.status_code, 400)

        url = reverse("country-custom-questions-set-order-to", kwargs={"pk": 999})
        response = self.test_user_client.post(url, format='json')
        self.assertEqual(response.status_code, 404)
        self.assertEqual(response.json(), {'detail': 'Not found.'})

    def test_reorder_country_questions_success(self):
        CountryCustomQuestion.objects.create(question="test", country_id=self.country_id)
        CountryCustomQuestion.objects.create(question="test2", country_id=self.country_id)
        q3 = CountryCustomQuestion.objects.create(question="test3", country_id=self.country_id)

        url = reverse("country-detail", kwargs={"pk": self.country_id})
        response = self.test_user_client.get(url, format='json')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.json()['country_questions']), 3)
        self.assertTrue(response.json()['country_questions'][0]['id'] <
                        response.json()['country_questions'][1]['id'] <
                        response.json()['country_questions'][2]['id'])
        self.assertTrue(response.json()['country_questions'][0]['order'] <
                        response.json()['country_questions'][1]['order'] <
                        response.json()['country_questions'][2]['order'])

        url = reverse("country-custom-questions-set-order-to", kwargs={"pk": q3.id})
        response = self.test_user_client.post(url, data={'to': str(response.json()['country_questions'][0]['order'])},
                                              format='json')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json(), {'status': 'order set'})

        url = reverse("country-detail", kwargs={"pk": self.country_id})
        response = self.test_user_client.get(url, format='json')
        self.assertEqual(response.status_code, 200)
        self.assertTrue(response.json()['country_questions'][1]['id'] <
                        response.json()['country_questions'][2]['id'] <
                        response.json()['country_questions'][0]['id'])
        self.assertTrue(response.json()['country_questions'][0]['order'] <
                        response.json()['country_questions'][1]['order'] <
                        response.json()['country_questions'][2]['order'])
