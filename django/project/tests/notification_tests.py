import copy
from unittest import mock

from core.factories import CountryCustomQuestionFactory, UserFactory, UserProfileFactory
from country.models import Country
from project.models import Project
from project.tasks import send_no_country_question_answers_reminder
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
        draft_project = Project.objects.create(name='Draft project 1', public_id='')
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
        data['country_custom_answers'] = [{"question_id": ccq_1.id, "answer": ["answer country 1"]},
                                          {"question_id": ccq_2.id, "answer": ["answer country 2"]}]
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

        send_no_country_question_answers_reminder.apply()

        self.assertEqual(len(send_mail_wrapper.call_args_list), 2)

        # user_1 should receive notifications about project 1 and 4
        call_args_list_1 = send_mail_wrapper.call_args_list[0][1]
        self.assertEqual(call_args_list_1['subject'], 'Missing answers for country questions')
        self.assertEqual(call_args_list_1['email_type'], 'missing_country_question_answers')
        self.assertEqual(call_args_list_1['to'], self.user_1.email)
        self.assertEqual(call_args_list_1['language'], 'en')
        self.assertEqual(call_args_list_1['context'], {'projects': 'Published project 1, Published project 4'})

        # user_2 should receive notifications about project 5
        call_args_list_2 = send_mail_wrapper.call_args_list[1][1]
        self.assertEqual(call_args_list_2['subject'], 'Missing answers for country questions')
        self.assertEqual(call_args_list_2['email_type'], 'missing_country_question_answers')
        self.assertEqual(call_args_list_2['to'], self.user_2.email)
        self.assertEqual(call_args_list_2['language'], 'en')
        self.assertEqual(call_args_list_2['context'], {'projects': 'Published project 5'})
