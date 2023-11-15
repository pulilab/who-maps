from unittest import mock

from django.contrib.auth.models import User
from django.test import override_settings

from rest_framework.test import APITestCase

from core.factories import UserProfileFactory, UserFactory, ProjectFactory, CountryFactory, OrganisationFactory
from country.models import Country
from systemmessages.models import SystemMessage
from user.models import UserProfile
from systemmessages.tasks import send_system_message


class SystemMessageTests(APITestCase):

    def setUp(self):
        SystemMessage.objects.all().delete()
        User.objects.all().delete()
        UserProfile.objects.all().delete()

        self.user_1 = UserFactory(username='bh_1', email='bh+1@pulilab.com')
        self.profile_1 = UserProfileFactory(user=self.user_1)
        self.user_2 = UserFactory(username='bh_2', email='bh+2@pulilab.com')
        self.profile_2 = UserProfileFactory(user=self.user_2)
        self.user_3 = UserFactory(username='bh_3', email='bh+3@pulilab.com')
        self.profile_3 = UserProfileFactory(user=self.user_3)

        self.normal_project = ProjectFactory(name='normal project', team=[self.profile_2])

        self.country = CountryFactory(name="country_1", code='CTR1', project_approval=True,
                                      region=Country.REGIONS[0][0], name_en='Hungary', name_fr='Hongrie')
        self.org = OrganisationFactory(name="Test org 1")

        data = dict(country=self.country.id,
                    organisation=self.org.id,
                    hsc_challenges=[1, 2],
                    services_and_application_types=[1, 2],
                    health_focus_areas=[1, 2])
        self.published_project = ProjectFactory(name='published project', data=data, team=[self.profile_3])
        # 'publish' the project
        self.published_project.public_id = '1234'
        self.published_project.save()

    @mock.patch('systemmessages.tasks.send_mail_wrapper', return_value=None)
    def test_system_message_to_all_users_success(self, send_mail_wrapper):
        system_message = SystemMessage.objects.create(
            subject='Message to all users',
            receiver_type=SystemMessage.ALL_USERS,
            message='Test message to all users'
        )

        with override_settings(EMAIL_SENDING_PRODUCTION=True):
            send_system_message.apply((system_message.id,))

            system_message.refresh_from_db()
            self.assertEqual(system_message.receivers_number, 3)

            call_args = send_mail_wrapper.call_args_list[0][1]

            self.assertEqual(call_args['subject'], system_message.subject)
            self.assertEqual(call_args['email_type'], 'system_message')
            self.assertEqual(call_args['context']['message'], system_message.message)
            self.assertIn(self.user_1.email, call_args['to'])
            self.assertIn(self.user_2.email, call_args['to'])
            self.assertIn(self.user_3.email, call_args['to'])

        with override_settings(EMAIL_SENDING_PRODUCTION=False):
            send_system_message.apply((system_message.id,))

            system_message.refresh_from_db()
            self.assertEqual(system_message.receivers_number, 1)

            call_args = send_mail_wrapper.call_args_list[1][1]

            self.assertEqual(call_args['subject'], system_message.subject)
            self.assertEqual(call_args['email_type'], 'system_message')
            self.assertEqual(call_args['context']['message'], system_message.message)
            self.assertEqual(len(call_args['to']), 1)

    @mock.patch('systemmessages.tasks.send_mail_wrapper', return_value=None)
    def test_system_message_to_project_owners(self, send_mail_wrapper):
        system_message = SystemMessage.objects.create(
            subject='Message to project owners',
            receiver_type=SystemMessage.PROJECT_OWNERS,
            message='Test message to project owners'
        )

        with override_settings(EMAIL_SENDING_PRODUCTION=True):
            send_system_message.apply((system_message.id,))

            system_message.refresh_from_db()
            self.assertEqual(system_message.receivers_number, 2)

            call_args = send_mail_wrapper.call_args_list[0][1]

            self.assertEqual(call_args['subject'], system_message.subject)
            self.assertEqual(call_args['email_type'], 'system_message')
            self.assertEqual(call_args['context']['message'], system_message.message)
            self.assertNotIn(self.user_1.email, call_args['to'])
            self.assertIn(self.user_2.email, call_args['to'])
            self.assertIn(self.user_3.email, call_args['to'])

        with override_settings(EMAIL_SENDING_PRODUCTION=False):
            send_system_message.apply((system_message.id,))

            system_message.refresh_from_db()
            self.assertEqual(system_message.receivers_number, 1)

            call_args = send_mail_wrapper.call_args_list[1][1]

            self.assertEqual(call_args['subject'], system_message.subject)
            self.assertEqual(call_args['email_type'], 'system_message')
            self.assertEqual(call_args['context']['message'], system_message.message)
            self.assertEqual(len(call_args['to']), 1)

    @mock.patch('systemmessages.tasks.send_mail_wrapper', return_value=None)
    def test_system_message_to_project_owners_with_published_projects(self, send_mail_wrapper):
        system_message = SystemMessage.objects.create(
            subject='Message to project owners with_published_projects',
            receiver_type=SystemMessage.PROJECT_OWNERS_WITH_PUBLISHED_PROJECTS,
            message='Test message to project owners with published projects'
        )

        with override_settings(EMAIL_SENDING_PRODUCTION=True):
            send_system_message.apply((system_message.id,))

            system_message.refresh_from_db()
            self.assertEqual(system_message.receivers_number, 1)

            call_args = send_mail_wrapper.call_args_list[0][1]

            self.assertEqual(call_args['subject'], system_message.subject)
            self.assertEqual(call_args['email_type'], 'system_message')
            self.assertEqual(call_args['context']['message'], system_message.message)
            self.assertNotIn(self.user_1.email, call_args['to'])
            self.assertNotIn(self.user_2.email, call_args['to'])
            self.assertIn(self.user_3.email, call_args['to'])

        with override_settings(EMAIL_SENDING_PRODUCTION=False):
            send_system_message.apply((system_message.id,))

            system_message.refresh_from_db()
            self.assertEqual(system_message.receivers_number, 1)

            call_args = send_mail_wrapper.call_args_list[1][1]

            self.assertEqual(call_args['subject'], system_message.subject)
            self.assertEqual(call_args['email_type'], 'system_message')
            self.assertEqual(call_args['context']['message'], system_message.message)
            self.assertNotIn(self.user_1.email, call_args['to'])
            self.assertNotIn(self.user_2.email, call_args['to'])
            self.assertIn(self.user_3.email, call_args['to'])

    @mock.patch('systemmessages.tasks.send_mail_wrapper', return_value=None)
    def test_system_message_to_all_users_with_different_languages_success(self, send_mail_wrapper):
        self.profile_2.language = 'fr'
        self.profile_2.save()
        self.profile_3.language = 'es'
        self.profile_3.save()

        user_4 = UserFactory(username='bh_4', email='bh+4@pulilab.com')
        UserProfileFactory(user=user_4, language='pt')

        system_message = SystemMessage.objects.create(
            subject_en='subject',
            subject_fr='matière',
            subject_es='Sujeto(',
            receiver_type=SystemMessage.ALL_USERS,
            message_en='Message to everyone',
            message_fr='message à tout le monde',
            message_es='Mensaje a todos',
        )

        with override_settings(EMAIL_SENDING_PRODUCTION=True):
            send_system_message.apply((system_message.id,))

            system_message.refresh_from_db()
            self.assertEqual(system_message.receivers_number, 4)
            expected_call_args = {
                'bh+1@pulilab.com': {
                    'subject': 'subject', 'email_type': 'system_message',
                    'to': ['bh+1@pulilab.com'], 'language': 'en', 'context': {'message': 'Message to everyone'}
                },
                'bh+2@pulilab.com': {
                    'subject': 'matière', 'email_type': 'system_message',
                    'to': ['bh+2@pulilab.com'], 'language': 'fr', 'context': {'message': 'message à tout le monde'}},
                'bh+3@pulilab.com': {
                    'subject': 'Sujeto(', 'email_type': 'system_message',
                    'to': ['bh+3@pulilab.com'], 'language': 'es', 'context': {'message': 'Mensaje a todos'}},
                'bh+4@pulilab.com': {
                    'subject': 'subject', 'email_type': 'system_message',
                    'to': ['bh+4@pulilab.com'], 'language': 'pt', 'context': {'message': 'Message to everyone'}}
            }

            actual_call_args = {x[1]['to'][0]: x[1] for x in send_mail_wrapper.call_args_list}
            self.assertEqual(expected_call_args, actual_call_args)
