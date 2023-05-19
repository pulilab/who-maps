from copy import copy
from unittest import mock

from rest_framework.reverse import reverse

from core.factories import DonorCustomQuestionFactory, CountryCustomQuestionFactory, UserFactory, UserProfileFactory, \
    ProjectFactory
from country.models import CountryCustomQuestion
from country.tasks import send_new_custom_country_question_digest, send_new_custom_donor_question_digest
from project.models import Project
from project.tests.setup import SetupTests
from user.models import UserProfile


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
        self.assertEqual(response.json(), {'detail': 'No such country'})

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
        self.assertEqual(response.json(), {'detail': 'No such project'})

    def test_country_answers_are_ignored_if_no_questions(self):
        url = reverse("project-create",
                      kwargs={
                          "country_id": self.country1.id
                      })
        data = copy(self.project_data)
        # will be ignored even if the question ID is invalid
        data.update({"country_custom_answers": [dict(question_id='a', answer=["lol1"])]})

        response = self.test_user_client.post(url, data=data, format='json')
        self.assertEqual(response.status_code, 201)
        self.assertTrue('id' in response.json())
        self.assertFalse('country_custom_answers' in response.json())

    def test_country_answer_wrong_question_id(self):
        CountryCustomQuestionFactory(question="What up?", country=self.country1)
        url = reverse("project-create",
                      kwargs={
                          "country_id": self.country1.id
                      })
        data = copy(self.project_data)
        data.update({"country_custom_answers": [dict(question_id='a', answer=["lol1"])]})

        response = self.test_user_client.post(url, data=data, format='json')
        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.json()['country_custom_answers'], [{'question_id': ['A valid integer is required.']}])

        data.update({"country_custom_answers": [dict(question_id=999, answer=["lol1"])]})

        response = self.test_user_client.post(url, data=data, format='json')
        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.json()['country_custom_answers'],
                         [{'question_id': ['This question_id does not exist.']}])

    def test_country_answer_wrong_all_required(self):
        CountryCustomQuestionFactory(question="What up?", country=self.country1)
        url = reverse("project-create",
                      kwargs={
                          "country_id": self.country1.id
                      })
        data = copy(self.project_data)
        data.update({"country_custom_answers": [dict()]})

        response = self.test_user_client.post(url, data=data, format='json')
        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.json()['country_custom_answers'], [{'question_id': ['This field is required.'],
                                                                      'answer': ['This field is required.']}])

        url = reverse("project-draft",
                      kwargs={
                          "country_id": self.country1.id,
                          "project_id": self.project_id
                      })

        response = self.test_user_client.put(url, data=data, format='json')
        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.json()['country_custom_answers'], [{'question_id': ['This field is required.'],
                                                                      'answer': ['This field is required.']}])

        url = reverse("project-publish",
                      kwargs={
                          "country_id": self.country1.id,
                          "project_id": self.project_id
                      })

        response = self.test_user_client.put(url, data=data, format='json')
        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.json()['country_custom_answers'], [{'question_id': ['This field is required.'],
                                                                      'answer': ['This field is required.']}])

    def test_country_answer_for_draft(self):
        q = CountryCustomQuestionFactory(question="test", country=self.country1)
        url = reverse("project-draft",
                      kwargs={
                          "country_id": self.country1.id,
                          "project_id": self.project_id
                      })
        data = copy(self.project_data)
        data.update({"country_custom_answers": [dict(question_id=q.id, answer=["lol1"])]})

        response = self.test_user_client.put(url, data=data, format='json')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()['draft']['country_custom_answers'], {str(q.id): ['lol1']})

        project = Project.objects.last()
        self.assertEqual(project.draft['country_custom_answers'], {str(q.id): ['lol1']})
        self.assertTrue('country_custom_answers' not in project.data)

    def test_country_answer_for_published(self):
        q = CountryCustomQuestionFactory(question="test", country=self.country1)
        url = reverse("project-publish",
                      kwargs={
                          "country_id": self.country1.id,
                          "project_id": self.project_id
                      })
        data = copy(self.project_data)
        data.update({"country_custom_answers": [dict(question_id=q.id, answer=["lol1"])]})

        response = self.test_user_client.put(url, data=data, format='json')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()['published']['country_custom_answers'], {str(q.id): ['lol1']})
        self.assertEqual(response.json()['draft']['country_custom_answers'], {str(q.id): ['lol1']})

        project = Project.objects.last()
        self.assertEqual(project.data['country_custom_answers'], {str(q.id): ['lol1']})
        self.assertEqual(project.draft['country_custom_answers'], {str(q.id): ['lol1']})

    def test_country_answer_for_published_is_required(self):
        q1 = CountryCustomQuestionFactory(question="test", country=self.country1, required=True)
        url = reverse("project-publish",
                      kwargs={
                          "country_id": self.country1.id,
                          "project_id": self.project_id
                      })
        # answer key present but empty
        data = copy(self.project_data)
        data.update({"country_custom_answers": [dict(question_id=q1.id, answer=[])]})

        response = self.test_user_client.put(url, data=data, format='json')
        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.json()['country_custom_answers'], [{'answer': ['This field is required.']}])

        # answer key not present
        data.update({"country_custom_answers": [dict(question_id=q1.id)]})

        response = self.test_user_client.put(url, data=data, format='json')
        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.json()['country_custom_answers'], [{'answer': ['This field is required.']}])

        # answer one is present, but answer 2 is missing
        data.update({"country_custom_answers": [dict(question_id=q1.id, answer=["answer1"])]})

        response = self.test_user_client.put(url, data=data, format='json')
        self.assertEqual(response.status_code, 200)

        # country custom answers are missing
        data.pop('country_custom_answers', None)

        response = self.test_user_client.put(url, data=data, format='json')
        self.assertEqual(response.status_code, 200)

        url = reverse("project-create",
                      kwargs={
                          "country_id": self.country1.id,
                      })

        response = self.test_user_client.post(url, data=data, format='json')
        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.json()['non_field_errors'], 'Country answers are missing')

        url = reverse("project-draft",
                      kwargs={
                          "country_id": self.country1.id,
                          "project_id": self.project_id
                      })

        response = self.test_user_client.put(url, data=data, format='json')
        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.json()['non_field_errors'], 'Country answers are missing')

    def test_country_answer_numeric_validation(self):
        q = CountryCustomQuestionFactory(question="test", country=self.country1,
                                         type=CountryCustomQuestion.NUMBER)
        url = reverse("project-publish",
                      kwargs={
                          "country_id": self.country1.id,
                          "project_id": self.project_id
                      })
        data = copy(self.project_data)
        data.update({"country_custom_answers": [dict(question_id=q.id, answer=["123a"])]})

        response = self.test_user_client.put(url, data=data, format='json')
        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.json()['country_custom_answers'], [{'answer': ['This field must be numeric.']}])

        data.update({"country_custom_answers": [dict(question_id=q.id, answer=["123"])]})

        response = self.test_user_client.put(url, data=data, format='json')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()['published']['country_custom_answers'], {str(q.id): ['123']})

    def test_country_answer_length_validation(self):
        q1 = CountryCustomQuestionFactory(question="test", country=self.country1,
                                          type=CountryCustomQuestion.TEXT)
        q2 = CountryCustomQuestionFactory(question="test multi", country=self.country1,
                                          type=CountryCustomQuestion.MULTI)
        url = reverse("project-publish",
                      kwargs={
                          "country_id": self.country1.id,
                          "project_id": self.project_id
                      })
        data = copy(self.project_data)
        data.update({"country_custom_answers": [dict(question_id=q1.id, answer=['1', '2'])]})

        response = self.test_user_client.put(url, data=data, format='json')
        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.json()['country_custom_answers'], [{'answer': ['There must be 1 answer only.']}])

        data.update({"country_custom_answers": [dict(question_id=q2.id, answer=['1', '2'])]})

        response = self.test_user_client.put(url, data=data, format='json')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()['published']['country_custom_answers'], {str(q2.id): ['1', '2']})

    def test_country_answer_update_existing_answer(self):
        q = CountryCustomQuestionFactory(question="test", country=self.country1)
        url = reverse("project-publish",
                      kwargs={
                          "country_id": self.country1.id,
                          "project_id": self.project_id
                      })
        data = copy(self.project_data)
        data.update({"country_custom_answers": [dict(question_id=q.id, answer=["lol1"], draft=False)]})

        response = self.test_user_client.put(url, data=data, format='json')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()['published']['country_custom_answers'], {str(q.id): ['lol1']})

        data.update({"country_custom_answers": [dict(question_id=q.id, answer=["lol2"], draft=False)]})

        response = self.test_user_client.put(url, data=data, format='json')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()['published']['country_custom_answers'], {str(q.id): ['lol2']})

        project = Project.objects.last()
        self.assertEqual(project.data['country_custom_answers'], {str(q.id): ['lol2']})
        self.assertEqual(project.draft['country_custom_answers'], {str(q.id): ['lol2']})

    def test_country_answer_new_required_question(self):
        q1 = CountryCustomQuestionFactory(question="test", country=self.country1)
        url = reverse("project-publish",
                      kwargs={
                          "country_id": self.country1.id,
                          "project_id": self.project_id
                      })
        data = copy(self.project_data)
        data.update({"country_custom_answers": [dict(question_id=q1.id, answer=["lol1"])]})
        response = self.test_user_client.put(url, data, format="json")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()['published']['country_custom_answers'], {str(q1.id): ['lol1']})

        q2 = CountryCustomQuestionFactory(question="test2", country=self.country1, required=True)

        response = self.test_user_client.put(url, data, format="json")
        self.assertEqual(response.status_code, 200)
        # data['project']['name'] = 'Test Project 20'
        data.update({"country_custom_answers": [dict(question_id=q1.id, answer=["lol1"]), dict(question_id=q2.id,
                                                                                               answer=["lol2"])]})
        response = self.test_user_client.put(url, data, format="json")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()['published']['country_custom_answers'],
                         {str(q1.id): ['lol1'], str(q2.id): ['lol2']})

    def test_country_private_answers_are_saved_separately(self):
        q1 = CountryCustomQuestionFactory(question="test private", country=self.country1, private=True)
        q2 = CountryCustomQuestionFactory(question="test", country=self.country1)
        q3 = CountryCustomQuestionFactory(question="test2 private", country=self.country1, private=True)
        url = reverse("project-publish",
                      kwargs={
                          "country_id": self.country1.id,
                          "project_id": self.project_id
                      })
        data = copy(self.project_data)
        data.update({"country_custom_answers": [dict(question_id=q1.id, answer=["private answer 1"]),
                                                dict(question_id=q2.id, answer=["public answer"]),
                                                dict(question_id=q3.id, answer=["private answer 2"])]})

        response = self.test_user_client.put(url, data=data, format='json')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()['published']['country_custom_answers'], {str(q2.id): ['public answer']})
        self.assertEqual(response.json()['published']['country_custom_answers_private'],
                         {str(q1.id): ['private answer 1'], str(q3.id): ['private answer 2']})

    def test_reorder_country_questions_unsuccessful(self):
        q = CountryCustomQuestionFactory(question="test3", country=self.country1)

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
        q1 = CountryCustomQuestionFactory(question="test", country=self.country1)
        q2 = CountryCustomQuestionFactory(question="test2", country=self.country1)
        q3 = CountryCustomQuestionFactory(question="test3", country=self.country1)

        url = reverse("country-detail", kwargs={"pk": self.country1.id})
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
        self.assertEqual(response.json(), [{'id': q3.id, 'order': 0},
                                           {'id': q1.id, 'order': 1},
                                           {'id': q2.id, 'order': 2}])

        url = reverse("country-detail", kwargs={"pk": self.country1.id})
        response = self.test_user_client.get(url, format='json')
        self.assertEqual(response.status_code, 200)
        self.assertTrue(response.json()['country_questions'][1]['id'] <
                        response.json()['country_questions'][2]['id'] <
                        response.json()['country_questions'][0]['id'])
        self.assertTrue(response.json()['country_questions'][0]['order'] <
                        response.json()['country_questions'][1]['order'] <
                        response.json()['country_questions'][2]['order'])

    def test_reorder_donor_questions_success(self):
        dq1 = DonorCustomQuestionFactory(question="test", donor=self.d1)
        dq2 = DonorCustomQuestionFactory(question="test2", donor=self.d1)
        dq3 = DonorCustomQuestionFactory(question="test3", donor=self.d1)

        url = reverse("donor-detail", kwargs={"pk": self.d1.id})
        response = self.test_user_client.get(url, format='json')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.json()['donor_questions']), 3)
        self.assertTrue(response.json()['donor_questions'][0]['id'] <
                        response.json()['donor_questions'][1]['id'] <
                        response.json()['donor_questions'][2]['id'])
        self.assertTrue(response.json()['donor_questions'][0]['order'] <
                        response.json()['donor_questions'][1]['order'] <
                        response.json()['donor_questions'][2]['order'])

        url = reverse("donor-custom-questions-set-order-to", kwargs={"pk": dq3.id})
        response = self.test_user_client.post(url, data={'to': str(response.json()['donor_questions'][0]['order'])},
                                              format='json')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json(), [{'id': dq3.id, 'order': 0},
                                           {'id': dq1.id, 'order': 1},
                                           {'id': dq2.id, 'order': 2}])

    def test_donor_answer_for_draft(self):
        q = DonorCustomQuestionFactory(question="test", donor=self.d1)
        url = reverse("project-draft",
                      kwargs={
                          "country_id": self.country1.id,
                          "project_id": self.project_id
                      })
        data = copy(self.project_data)
        data.update({"donor_custom_answers": {str(self.d1.id): [dict(question_id=q.id, answer=["lol1"])]}})

        response = self.test_user_client.put(url, data=data, format='json')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()['draft']['donor_custom_answers'], {str(self.d1.id): {str(q.id): ['lol1']}})

        project = Project.objects.last()
        self.assertEqual(project.draft['donor_custom_answers'], {str(self.d1.id): {str(q.id): ['lol1']}})
        self.assertTrue('donor_custom_answers' not in project.data)

    def test_donor_answer_for_published(self):
        q = DonorCustomQuestionFactory(question="test", donor=self.d1)
        url = reverse("project-publish",
                      kwargs={
                          "country_id": self.country1.id,
                          "project_id": self.project_id
                      })
        data = copy(self.project_data)
        data.update({"donor_custom_answers": {str(self.d1.id): [dict(question_id=q.id, answer=["lol1"])]}})

        response = self.test_user_client.put(url, data=data, format='json')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()['published']['donor_custom_answers'], {str(self.d1.id): {str(q.id): ['lol1']}})
        self.assertEqual(response.json()['draft']['donor_custom_answers'], {str(self.d1.id): {str(q.id): ['lol1']}})

        project = Project.objects.last()
        self.assertEqual(project.data['donor_custom_answers'], {str(self.d1.id): {str(q.id): ['lol1']}})
        self.assertEqual(project.draft['donor_custom_answers'], {str(self.d1.id): {str(q.id): ['lol1']}})

    def test_donor_answer_for_all_is_required_to_be_good_if_exist(self):
        dq1 = DonorCustomQuestionFactory(question="test", donor=self.d1, required=True)
        url = reverse("project-publish",
                      kwargs={
                          "country_id": self.country1.id,
                          "project_id": self.project_id
                      })
        # answer key present but empty
        data = copy(self.project_data)
        data.update({"donor_custom_answers": {str(self.d1.id): [dict(question_id=dq1.id, answer=[])]}})

        response = self.test_user_client.put(url, data=data, format='json')
        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.json()['donor_custom_answers'],
                         {str(self.d1.id): [{'answer': ['This field is required.']}]})

        # answer key not present
        data.update({"donor_custom_answers": {str(self.d1.id): [dict(question_id=dq1.id)]}})

        response = self.test_user_client.put(url, data=data, format='json')
        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.json()['donor_custom_answers'],
                         {str(self.d1.id): [{'answer': ['This field is required.']}]})

        # answer one is present, but answer 2 is missing
        data.update({"donor_custom_answers": {str(self.d1.id): [dict(question_id=dq1.id, answer=["answer1"])]}})

        response = self.test_user_client.put(url, data=data, format='json')
        self.assertEqual(response.status_code, 200)

        # donor custom answers are missing
        data.pop('donor_custom_answers', None)

        response = self.test_user_client.put(url, data=data, format='json')
        self.assertEqual(response.status_code, 200)
        # We accept this, as the answers are no longer required

        url = reverse("project-create",
                      kwargs={
                          "country_id": self.country1.id,
                      })

        response = self.test_user_client.post(url, data=data, format='json')
        self.assertEqual(response.status_code, 201)
        # We accept this, as the answers are no longer required

        url = reverse("project-draft",
                      kwargs={
                          "country_id": self.country1.id,
                          "project_id": self.project_id
                      })

        response = self.test_user_client.put(url, data=data, format='json')
        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.json()['non_field_errors'], 'Donor answers are missing')

        # donor custom answer for donor one are missing
        data.update({"donor_custom_answers": {}})
        response = self.test_user_client.put(url, data=data, format='json')
        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.json()['non_field_errors'], 'Donor answers are missing')

        url = reverse("project-create",
                      kwargs={
                          "country_id": self.country1.id,
                      })

        response = self.test_user_client.post(url, data=data, format='json')
        self.assertEqual(response.status_code, 201)

        url = reverse("project-publish",
                      kwargs={
                          "country_id": self.country1.id,
                          "project_id": self.project_id
                      })
        data['project']['name'] = 'Test Project Omega'
        response = self.test_user_client.put(url, data=data, format='json')
        self.assertEqual(response.status_code, 200)

    def test_donor_answer_wrong_question_id(self):
        DonorCustomQuestionFactory(question="What up?", donor=self.d1)
        url = reverse("project-create",
                      kwargs={
                          "country_id": self.country1.id
                      })
        data = copy(self.project_data)
        data.update({"donor_custom_answers": {str(self.d1.id): [dict(question_id='a', answer=["lol1"])]}})

        response = self.test_user_client.post(url, data=data, format='json')
        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.json()['donor_custom_answers'],
                         {str(self.d1.id): [{'question_id': ['A valid integer is required.']}]})

        data.update({"donor_custom_answers": {str(self.d1.id): [dict(question_id=999, answer=["lol1"])]}})

        response = self.test_user_client.post(url, data=data, format='json')
        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.json()['donor_custom_answers'],
                         {str(self.d1.id): [{'question_id': ['This question_id does not exist.']}]})

        url = reverse("project-publish",
                      kwargs={
                          "country_id": self.country1.id,
                          "project_id": self.project_id
                      })

        response = self.test_user_client.put(url, data=data, format='json')
        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.json()['donor_custom_answers'],
                         {str(self.d1.id): [{'question_id': ['This question_id does not exist.']}]})

        data.update({"donor_custom_answers": {str(self.d1.id): [dict(question_id='a', answer=["lol1"])]}})

        response = self.test_user_client.put(url, data=data, format='json')
        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.json()['donor_custom_answers'],
                         {str(self.d1.id): [{'question_id': ['A valid integer is required.']}]})

        url = reverse("project-draft",
                      kwargs={
                          "country_id": self.country1.id,
                          "project_id": self.project_id
                      })

        response = self.test_user_client.put(url, data=data, format='json')
        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.json()['donor_custom_answers'],
                         {str(self.d1.id): [{'question_id': ['A valid integer is required.']}]})

        data.update({"donor_custom_answers": {str(self.d1.id): [dict(question_id=999, answer=["lol1"])]}})

        response = self.test_user_client.put(url, data=data, format='json')
        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.json()['donor_custom_answers'],
                         {str(self.d1.id): [{'question_id': ['This question_id does not exist.']}]})

    def test_donor_answer_wrong_all_required(self):
        DonorCustomQuestionFactory(question="What up?", donor=self.d1)
        url = reverse("project-create",
                      kwargs={
                          "country_id": self.country1.id
                      })
        data = copy(self.project_data)
        data.update({"donor_custom_answers": {str(self.d1.id): [dict()]}})

        response = self.test_user_client.post(url, data=data, format='json')
        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.json()['donor_custom_answers'],
                         {str(self.d1.id): [{'question_id': ['This field is required.'],
                                             'answer': ['This field is required.']}]})

        url = reverse("project-draft",
                      kwargs={
                          "country_id": self.country1.id,
                          "project_id": self.project_id
                      })

        response = self.test_user_client.put(url, data=data, format='json')
        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.json()['donor_custom_answers'],
                         {str(self.d1.id): [{'question_id': ['This field is required.'],
                                             'answer': ['This field is required.']}]})

        url = reverse("project-publish",
                      kwargs={
                          "country_id": self.country1.id,
                          "project_id": self.project_id
                      })

        response = self.test_user_client.put(url, data=data, format='json')
        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.json()['donor_custom_answers'],
                         {str(self.d1.id): [{'question_id': ['This field is required.'],
                                             'answer': ['This field is required.']}]})

    @mock.patch('country.tasks.send_mail_wrapper', return_value=None)
    def test_custom_country_question_digest(self, send_mail_wrapper):
        q1 = CountryCustomQuestionFactory(question="test", country=self.country1, required=True)
        CountryCustomQuestionFactory(question="test2", country=self.country1, required=False)

        url = reverse("project-publish",
                      kwargs={
                          "country_id": self.country1.id,
                          "project_id": self.project_id
                      })
        data = copy(self.project_data)
        data.update({"country_custom_answers": [dict(question_id=q1.id, answer=['yoyo'])]})
        response = self.test_user_client.put(url, data=data, format='json')
        self.assertEqual(response.status_code, 200, response)

        u1 = UserFactory(username='username1', email='user1@user.org')
        up1 = UserProfileFactory(name="USER1", user=u1, account_type=UserProfile.IMPLEMENTER,
                                 country_id=self.country1.id)

        u2 = UserFactory(username='username2', email='user2@user.org')
        up2 = UserProfileFactory(name="USER2", user=u2, account_type=UserProfile.IMPLEMENTER,
                                 country_id=self.country1.id)

        p1 = Project.objects.get(id=self.project_id)
        p1.team.add(up1)

        p2 = ProjectFactory(name="published in country")
        p2.team.add(self.userprofile)
        p2.team.add(up2)

        url = reverse("project-publish",
                      kwargs={
                          "country_id": self.country1.id,
                          "project_id": p2.id
                      })

        data = copy(self.project_data)
        data['project']['name'] = "published in country"
        data.update({"country_custom_answers": [dict(question_id=q1.id, answer=['yooy'])]})
        response = self.test_user_client.put(url, data=data, format='json')
        self.assertEqual(response.status_code, 200, response)

        send_new_custom_country_question_digest.apply()

        self.assertEqual(send_mail_wrapper.call_count, 3)

        for i in range(3):
            if send_mail_wrapper.call_args_list[i][1]['to'] == self.userprofile.user.email:
                self.assertTrue(p1 in send_mail_wrapper.call_args_list[i][1]['context']['projects'])
                self.assertTrue(p2 in send_mail_wrapper.call_args_list[i][1]['context']['projects'])
            elif send_mail_wrapper.call_args_list[i][1]['to'] == u1.email:
                self.assertTrue(p1 in send_mail_wrapper.call_args_list[i][1]['context']['projects'])
            elif send_mail_wrapper.call_args_list[i][1]['to'] == u2.email:
                self.assertTrue(p2 in send_mail_wrapper.call_args_list[i][1]['context']['projects'])

    @mock.patch('country.tasks.send_mail_wrapper', return_value=None)
    def test_custom_donor_question_digest(self, send_mail_wrapper):
        q = DonorCustomQuestionFactory(question="test", donor=self.d1, required=True)
        DonorCustomQuestionFactory(question="test2", donor=self.d1, required=False)

        url = reverse("project-publish",
                      kwargs={
                          "country_id": self.country1.id,
                          "project_id": self.project_id
                      })
        data = copy(self.project_data)
        data.update({"donor_custom_answers": {str(self.d1.id): [dict(question_id=q.id, answer=["lol1"])]}})

        response = self.test_user_client.put(url, data=data, format='json')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()['published']['donor_custom_answers'], {str(self.d1.id): {str(q.id): ['lol1']}})
        self.assertEqual(response.json()['draft']['donor_custom_answers'], {str(self.d1.id): {str(q.id): ['lol1']}})

        project = Project.objects.last()
        self.assertEqual(project.data['donor_custom_answers'], {str(self.d1.id): {str(q.id): ['lol1']}})
        self.assertEqual(project.draft['donor_custom_answers'], {str(self.d1.id): {str(q.id): ['lol1']}})

        u1 = UserFactory(username='username1', email='user1@user.org')
        up1 = UserProfileFactory(name="USER1", user=u1, account_type=UserProfile.IMPLEMENTER,
                                 country_id=self.country1.id)

        u2 = UserFactory(username='username2', email='user2@user.org')
        up2 = UserProfileFactory(name="USER2", user=u2, account_type=UserProfile.IMPLEMENTER,
                                 country_id=self.country1.id)

        p1 = Project.objects.get(id=self.project_id)
        p1.team.add(up1)

        p2 = ProjectFactory(name="published in country")
        p2.team.add(self.userprofile)
        p2.team.add(up2)

        url = reverse("project-publish",
                      kwargs={
                          "country_id": self.country1.id,
                          "project_id": p2.id
                      })

        data = copy(self.project_data)
        data['project']['name'] = "published in country"
        data.update({"donor_custom_answers": {str(self.d1.id): [dict(question_id=q.id, answer=["lol2"])]}})
        response = self.test_user_client.put(url, data=data, format='json')
        self.assertEqual(response.status_code, 200, response)

        send_new_custom_donor_question_digest.apply()

        self.assertEqual(send_mail_wrapper.call_count, 3)

        for i in range(3):
            if send_mail_wrapper.call_args_list[i][1]['to'] == self.userprofile.user.email:
                self.assertTrue(p1 in send_mail_wrapper.call_args_list[i][1]['context']['projects'])
                self.assertTrue(p2 in send_mail_wrapper.call_args_list[i][1]['context']['projects'])
            elif send_mail_wrapper.call_args_list[i][1]['to'] == u1.email:
                self.assertTrue(p1 in send_mail_wrapper.call_args_list[i][1]['context']['projects'])
            elif send_mail_wrapper.call_args_list[i][1]['to'] == u2.email:
                self.assertTrue(p2 in send_mail_wrapper.call_args_list[i][1]['context']['projects'])
