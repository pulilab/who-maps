import copy
from unittest import mock

from django.utils import timezone

from core.factories import CountryCustomQuestionFactory, UserFactory, UserProfileFactory
from country.models import Country
from project.models import Project
from project.tasks import send_no_country_question_answers_reminder,\
    send_not_every_required_country_question_has_answer_reminder, send_empty_stages_reminder
from project.tests.setup import SetupTests


class ProjectNotificationTests(SetupTests):

    def setUp(self):
        super(ProjectNotificationTests, self).setUp()

        self.user_1 = UserFactory(username='bh_1', email='bh+1@pulilab.com')
        self.profile_1 = UserProfileFactory(user=self.user_1)
        self.user_2 = UserFactory(username='bh_2', email='bh+2@pulilab.com')
        self.profile_2 = UserProfileFactory(user=self.user_2)

        self.published_pr_data = dict(
            country=self.country.id,
            organisation=self.org.id, hsc_challenges=[1, 2], platforms=[{'id': 1, 'strategies': [1, 2]}],
            capability_categories=[], capability_levels=[], capability_subcategories=[])

    @mock.patch('project.tasks.send_mail_wrapper', return_value=None)
    def test_send_no_country_question_answers_reminder(self, send_mail_wrapper):
        Project.objects.all().delete()

        ccq_1 = CountryCustomQuestionFactory(question="question 1", required=True, country=self.country)
        ccq_2 = CountryCustomQuestionFactory(question="question 2", required=True, country=self.country)

        # task shouldn't pick up this because it is a draft
        draft_project = Project.objects.create(name='Draft project', public_id='')
        draft_project.team.add(self.profile_1)

        # task should pick up this, because it has no answers at all
        published_pr_1 = Project.objects.create(
            name='Published project 1', data=self.published_pr_data, public_id='1111')
        published_pr_1.team.add(self.profile_1)

        # task shouldn't pick up this, because it belongs to another country which has no questions
        data = copy.deepcopy(self.published_pr_data)
        data['country'] = Country.objects.exclude(id=self.country_id).first().id
        published_pr_2 = Project.objects.create(
            name='Published project 2', data=data, public_id='2222')
        published_pr_2.team.add(self.profile_1)

        # task shouldn't pick up this, because it has answers for every question
        data = copy.deepcopy(self.published_pr_data)
        data['country_custom_answers'] = [{"question_id": ccq_1.id, "answer": ["answer 1"]},
                                          {"question_id": ccq_2.id, "answer": ["answer 2"]}]
        published_pr_3 = Project.objects.create(
            name='Published project 3', data=data, public_id='3333')
        published_pr_3.team.add(self.profile_2)

        # task should pick up this, because it has no answers at all
        published_pr_4 = Project.objects.create(
            name='Published project 4', data=self.published_pr_data, public_id='4444')
        published_pr_4.team.add(self.profile_1)

        # task should pick up this, because it has no answers at all
        published_pr_5 = Project.objects.create(
            name='Published project 5', data=self.published_pr_data, public_id='5555')
        published_pr_5.team.add(self.profile_2)

        # task should pick up this, because it has empty answers
        data = copy.deepcopy(self.published_pr_data)
        data['country_custom_answers'] = {}
        published_pr_6 = Project.objects.create(
            name='Published project 6', data=data, public_id='6666')
        published_pr_6.team.add(self.profile_2)

        # task should pick up this, because it has empty answers
        data = copy.deepcopy(self.published_pr_data)
        data['country_custom_answers'] = []
        published_pr_7 = Project.objects.create(
            name='Published project 7', data=data, public_id='7777')
        published_pr_7.team.add(self.profile_2)

        send_no_country_question_answers_reminder.apply()

        self.assertEqual(len(send_mail_wrapper.call_args_list), 2)

        for call in send_mail_wrapper.call_args_list:
            call_args = call[1]
            self.assertEqual(call_args['subject'], 'Missing answers for country questions')
            self.assertEqual(call_args['email_type'], 'missing_country_question_answers')
            self.assertEqual(call_args['language'], 'en')
            if call_args['to'] == self.user_1.email:
                # user_1 should receive notifications about project 1 and 4
                self.assertEqual(call_args['context']['name'], self.profile_1.name)
                self.assertEqual(len(call_args['context']['projects']), 2)
                self.assertIn(published_pr_1, call_args['context']['projects'])
                self.assertIn(published_pr_4, call_args['context']['projects'])
            else:
                # user_2 should receive notifications about project 5
                self.assertEqual(call_args['context']['name'], self.profile_2.name)
                self.assertEqual(len(call_args['context']['projects']), 3)
                self.assertIn(published_pr_5, call_args['context']['projects'])
                self.assertIn(published_pr_6, call_args['context']['projects'])
                self.assertIn(published_pr_7, call_args['context']['projects'])

    @mock.patch('project.tasks.send_mail_wrapper', return_value=None)
    def test_send_not_every_required_country_question_has_answer_reminder(self, send_mail_wrapper):
        Project.objects.all().delete()

        ccq_1 = CountryCustomQuestionFactory(question="required question", required=True, country=self.country)
        ccq_2 = CountryCustomQuestionFactory(question="optional question", required=False, country=self.country)

        # task shouldn't pick up this because it is a draft
        draft_project = Project.objects.create(name='Draft project', public_id='')
        draft_project.team.add(self.profile_1)

        # task shouldn't pick up this, because it belongs to another country which has no questions
        data = copy.deepcopy(self.published_pr_data)
        data['country'] = Country.objects.exclude(id=self.country_id).first().id
        published_pr_1 = Project.objects.create(
            name='Published project 1', data=data, public_id='1111')
        published_pr_1.team.add(self.profile_1)

        # task should pick up this, because it has no answers for every required question
        data = copy.deepcopy(self.published_pr_data)
        data['country_custom_answers'] = [{"question_id": ccq_2.id, "answer": ["answer 2"]}]
        published_pr_2 = Project.objects.create(
            name='Published project 2', data=data, public_id='2222')
        published_pr_2.team.add(self.profile_2)

        # task shouldn't pick up this, because it has answers for every required question
        data = copy.deepcopy(self.published_pr_data)
        data['country_custom_answers'] = [{"question_id": ccq_1.id, "answer": ["answer 1"]},
                                          {"question_id": ccq_2.id, "answer": ["answer 2"]}]
        published_pr_3 = Project.objects.create(
            name='Published project 3', data=data, public_id='3333')
        published_pr_3.team.add(self.profile_1)

        # task should pick up this, because it has no answers for every required question
        data = copy.deepcopy(self.published_pr_data)
        data['country_custom_answers'] = [{"question_id": ccq_2.id, "answer": ["answer 2"]}]
        published_pr_4 = Project.objects.create(
            name='Published project 4', data=data, public_id='4444')
        published_pr_4.team.add(self.profile_1)

        # task should pick up this, because it has no answers for every required question
        data = copy.deepcopy(self.published_pr_data)
        data['country_custom_answers'] = [{"question_id": ccq_2.id, "answer": ["answer 2"]}]
        published_pr_5 = Project.objects.create(
            name='Published project 5', data=data, public_id='5555')
        published_pr_5.team.add(self.profile_2)

        send_not_every_required_country_question_has_answer_reminder.apply()

        self.assertEqual(len(send_mail_wrapper.call_args_list), 2)

        for call in send_mail_wrapper.call_args_list:
            call_args = call[1]
            self.assertEqual(call_args['subject'], 'Missing required answer for country question')
            self.assertEqual(call_args['email_type'], 'missing_required_country_question_answer')
            self.assertEqual(call_args['language'], 'en')
            if call_args['to'] == self.user_1.email:
                # user_1 should receive notifications about project 4
                self.assertEqual(call_args['context']['name'], self.profile_1.name)
                self.assertEqual(len(call_args['context']['projects']), 1)
                self.assertIn(published_pr_4, call_args['context']['projects'])
            else:
                # user_2 should receive notifications about project 2 and 5
                self.assertEqual(call_args['context']['name'], self.profile_2.name)
                self.assertEqual(len(call_args['context']['projects']), 2)
                self.assertIn(published_pr_2, call_args['context']['projects'])
                self.assertIn(published_pr_5, call_args['context']['projects'])

    @mock.patch('project.tasks.send_mail_wrapper', return_value=None)
    def test_send_empty_stages_reminder(self, send_mail_wrapper):
        Project.objects.all().delete()

        # task shouldn't pick up this because it is a draft
        draft_project = Project.objects.create(name='Draft project', public_id='')
        draft_project.team.add(self.profile_1)

        # task should pick up this, because it has no stages data
        published_pr_1 = Project.objects.create(
            name='Published project 1', data=self.published_pr_data, public_id='1111')
        published_pr_1.team.add(self.profile_1)

        # task shouldn't pick up this, because it has stages data
        data = copy.deepcopy(self.published_pr_data)
        data['stages'] = [
            {
                'id': 1,
                'date': str(timezone.now()),
                'note': 'preparation note'
            }
        ]
        published_pr_2 = Project.objects.create(
            name='Published project 2', data=data, public_id='2222')
        published_pr_2.team.add(self.profile_1)

        # task should pick up this, because it has empty stages data
        data = copy.deepcopy(self.published_pr_data)
        data['stages'] = []
        published_pr_3 = Project.objects.create(
            name='Published project 3', data=data, public_id='3333')
        published_pr_3.team.add(self.profile_1)

        # task should pick up this, because it has no stages data
        published_pr_4 = Project.objects.create(
            name='Published project 4', data=self.published_pr_data, public_id='4444')
        published_pr_4.team.add(self.profile_2)

        send_empty_stages_reminder.apply()

        self.assertEqual(len(send_mail_wrapper.call_args_list), 2)

        for call in send_mail_wrapper.call_args_list:
            call_args = call[1]
            self.assertEqual(call_args['subject'], 'Stages are missing from project data')
            self.assertEqual(call_args['email_type'], 'missing_data_common_template')
            self.assertEqual(call_args['language'], 'en')
            self.assertEqual(call_args['context']['details'], 'Stages are missing for the following project(s):')
            if call_args['to'] == self.user_1.email:
                # user_1 should receive notifications about project 1 and 3
                self.assertEqual(len(call_args['context']['projects']), 2)
                self.assertIn(published_pr_1, call_args['context']['projects'])
                self.assertIn(published_pr_3, call_args['context']['projects'])
            else:
                # user_2 should receive notifications about project 4
                self.assertEqual(call_args['to'], self.user_2.email)
                self.assertEqual(len(call_args['context']['projects']), 1)
                self.assertIn(published_pr_4, call_args['context']['projects'])
