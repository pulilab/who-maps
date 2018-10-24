from copy import copy

from rest_framework.reverse import reverse

from country.models import CountryCustomQuestion
from project.models import Project
from project.tests.setup import SetupTests


class CustomFieldTests(SetupTests):

    def test_country_answer_wrong_country(self):
        url = reverse("project-create",
                      kwargs={
                          "country_id": 999,
                      })
        data = copy(self.project_data)
        data.update({"country_custom_answers": [dict(question_id=1, answer=["lol1"])]})

        response = self.test_user_client.post(url, data=data, format='json')
        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.json(), {'details': 'No such country'})

    def test_country_answer_wrong_country_and_project(self):
        url = reverse("project-draft",
                      kwargs={
                          "country_id": 999,
                          "project_id": 999
                      })
        data = copy(self.project_data)
        data.update({"country_custom_answers": [dict(question_id=1, answer=["lol1"])]})

        response = self.test_user_client.put(url, data=data, format='json')
        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.json(), {'details': 'No such project'})

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
        self.assertEqual(response.json(), [{'question_id': ['This question_id does not exist.']}])

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

    def test_country_answer_for_published_is_required(self):
        q1 = CountryCustomQuestion.objects.create(question="test", country_id=self.country_id, required=True)
        q2 = CountryCustomQuestion.objects.create(question="test2", country_id=self.country_id, required=True)
        url = reverse("country-custom-answer",
                      kwargs={
                          "country_id": self.country_id,
                          "project_id": self.project_id
                      })
        # answer key present but empty
        data = [dict(question_id=q1.id, answer=[], draft=False)]

        response = self.test_user_client.post(url, data=data, format='json')
        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.json(), [{'answer': ['This field is required.']}])

        # answer key not present
        data = [dict(question_id=q1.id, draft=False)]

        response = self.test_user_client.post(url, data=data, format='json')
        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.json(), [{'answer': ['This field is required.']}])

        # answer one is present, but answer 2 is missing
        data = [dict(question_id=q1.id, answer=["answer1"], draft=False)]

        response = self.test_user_client.post(url, data=data, format='json')
        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.json(), {str(q2.id): ['This field is required']})

    def test_country_answer_numeric_validation(self):
        q = CountryCustomQuestion.objects.create(question="test", country_id=self.country_id,
                                                 type=CountryCustomQuestion.NUMBER)
        url = reverse("country-custom-answer",
                      kwargs={
                          "country_id": self.country_id,
                          "project_id": self.project_id
                      })
        data = [dict(question_id=q.id, answer=['123a'], draft=False)]

        response = self.test_user_client.post(url, data=data, format='json')
        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.json(), [{'answer': ['This field must be numeric.']}])

        data = [dict(question_id=q.id, answer=['123'], draft=False)]

        response = self.test_user_client.post(url, data=data, format='json')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json(), [{'question_id': q.id, 'answer': ['123'], 'draft': False}])

    def test_country_answer_length_validation(self):
        q1 = CountryCustomQuestion.objects.create(question="test", country_id=self.country_id,
                                                  type=CountryCustomQuestion.TEXT)
        q2 = CountryCustomQuestion.objects.create(question="test multi", country_id=self.country_id,
                                                  type=CountryCustomQuestion.MULTI)
        url = reverse("country-custom-answer",
                      kwargs={
                          "country_id": self.country_id,
                          "project_id": self.project_id
                      })
        data = [dict(question_id=q1.id, answer=['1', '2'], draft=False)]

        response = self.test_user_client.post(url, data=data, format='json')
        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.json(), [{'answer': ['There must be 1 answer only.']}])

        data = [dict(question_id=q2.id, answer=['1', '2'], draft=False)]

        response = self.test_user_client.post(url, data=data, format='json')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json(), [{'question_id': q2.id, 'answer': ['1', '2'], 'draft': False}])

    def test_answer_type_mismatch(self):
        q1 = CountryCustomQuestion.objects.create(question="test", country_id=self.country_id,
                                                  type=CountryCustomQuestion.TEXT)
        q2 = CountryCustomQuestion.objects.create(question="test 2", country_id=self.country_id,
                                                  type=CountryCustomQuestion.TEXT)
        url = reverse("country-custom-answer",
                      kwargs={
                          "country_id": self.country_id,
                          "project_id": self.project_id
                      })
        data = [dict(question_id=q1.id, answer=['1'], draft=False),
                dict(question_id=q2.id, answer=['2'], draft=True)]

        response = self.test_user_client.post(url, data=data, format='json')
        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.json(), ['Draft/Published type mismatch.'])

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

    def test_country_private_answers_are_saved_separately(self):
        q1 = CountryCustomQuestion.objects.create(question="test private", country_id=self.country_id, private=True)
        q2 = CountryCustomQuestion.objects.create(question="test", country_id=self.country_id)
        q3 = CountryCustomQuestion.objects.create(question="test2 private", country_id=self.country_id, private=True)
        url = reverse("country-custom-answer",
                      kwargs={
                          "country_id": self.country_id,
                          "project_id": self.project_id
                      })
        data = [dict(question_id=q1.id, answer=["private answer 1"], draft=False),
                dict(question_id=q2.id, answer=["public answer"], draft=False),
                dict(question_id=q3.id, answer=["private answer 2"], draft=False)]

        response = self.test_user_client.post(url, data=data, format='json')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json(), [{'question_id': q1.id, 'answer': ['private answer 1'], 'draft': False},
                                           {'question_id': q2.id, 'answer': ['public answer'], 'draft': False},
                                           {'question_id': q3.id, 'answer': ['private answer 2'], 'draft': False}])
        project = Project.objects.last()
        self.assertNotEqual(project.data['country_custom_answers'], project.draft['country_custom_answers'])
        self.assertEqual(project.data['country_custom_answers'], {str(q2.id): ["public answer"]})
        self.assertEqual(project.data['country_custom_answers_private'], {str(q1.id): ["private answer 1"],
                                                                          str(q3.id): ["private answer 2"]})

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
