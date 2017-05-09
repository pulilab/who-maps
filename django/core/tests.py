from django.test import TestCase
from django.test.client import Client
from django.contrib.auth.models import User


class AuthTest(TestCase):
    def setUp(self):
        self.password = 'mypassword'

        self.admin = User.objects.create_superuser('myuser', 'myemail@test.com', self.password)

        self.client = Client()

    def test_email_authentication(self):
        self.assertTrue(self.client.login(username=self.admin.email, password=self.password))
        self.assertTrue('core.auth.EmailBackend' in self.client.session.values())

    def test_user_authentication_should_fail(self):
        self.assertFalse(self.client.login(username=self.admin.username, password=self.password))
        self.assertFalse('core.auth.EmailBackend' in self.client.session.values())
