from unittest import mock

from django.contrib.auth.models import User

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

        data = dict(country=self.country.id, organisation=self.org.id, hsc_challenges=[1, 2], his_bucket=[1, 2])
        self.published_project = ProjectFactory(name='published project', data=data, team=[self.profile_3])
        # 'publish' the project
        self.published_project.public_id = '1234'
        self.published_project.save()

    @mock.patch('systemmessages.tasks.send_mail_wrapper', return_value=None)
    def test_system_message_to_all_users(self, send_mail_wrapper):
        system_message = SystemMessage.objects.create(
            subject='Message to all users',
            receiver_type=SystemMessage.ALL_USERS,
            message='Test message to all users'
        )

        send_system_message.apply((system_message.id,))

        system_message.refresh_from_db()
        self.assertEqual(system_message.receivers_number, 3)

        call_args = send_mail_wrapper.call_args_list[0][1]

        self.assertEqual(call_args['subject'], system_message.subject)
        self.assertEqual(call_args['email_type'], 'all_users')
        self.assertEqual(call_args['context']['message'], system_message.message)
        self.assertIn(self.user_1.email, call_args['to'])
        self.assertIn(self.user_2.email, call_args['to'])
        self.assertIn(self.user_3.email, call_args['to'])

    @mock.patch('systemmessages.tasks.send_mail_wrapper', return_value=None)
    def test_system_message_to_project_owners(self, send_mail_wrapper):
        system_message = SystemMessage.objects.create(
            subject='Message to project owners',
            receiver_type=SystemMessage.PROJECT_OWNERS,
            message='Test message to project owners'
        )

        send_system_message.apply((system_message.id,))

        system_message.refresh_from_db()
        self.assertEqual(system_message.receivers_number, 1)

        call_args = send_mail_wrapper.call_args_list[0][1]

        self.assertEqual(call_args['subject'], system_message.subject)
        self.assertEqual(call_args['email_type'], 'all_users')
        self.assertEqual(call_args['context']['message'], system_message.message)
        self.assertNotIn(self.user_1.email, call_args['to'])
        self.assertIn(self.user_2.email, call_args['to'])
        self.assertNotIn(self.user_3.email, call_args['to'])

    @mock.patch('systemmessages.tasks.send_mail_wrapper', return_value=None)
    def test_system_message_to_project_owners_with_published_projects(self, send_mail_wrapper):
        system_message = SystemMessage.objects.create(
            subject='Message to project owners with_published_projects',
            receiver_type=SystemMessage.PROJECT_OWNERS_WITH_PUBLISHED_PROJECTS,
            message='Test message to project owners with published projects'
        )

        send_system_message.apply((system_message.id,))

        system_message.refresh_from_db()
        self.assertEqual(system_message.receivers_number, 1)

        call_args = send_mail_wrapper.call_args_list[0][1]

        self.assertEqual(call_args['subject'], system_message.subject)
        self.assertEqual(call_args['email_type'], 'all_users')
        self.assertEqual(call_args['context']['message'], system_message.message)
        self.assertNotIn(self.user_1.email, call_args['to'])
        self.assertNotIn(self.user_2.email, call_args['to'])
        self.assertIn(self.user_3.email, call_args['to'])
