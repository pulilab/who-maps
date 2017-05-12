from django.contrib.admin import AdminSite
from django.test import TestCase
from django.test.client import Client
from django.contrib.auth.models import User

from core.admin import CustomUserAdmin
from user.models import UserProfile


class AuthTest(TestCase):
    def setUp(self):
        self.password = 'mypassword'

        self.admin = User.objects.create_superuser('myuser', 'myemail@test.com', self.password)

        self.client = Client()

        self.site = AdminSite()
        self.user = User.objects.create(username="alma", password="korte")
        self.userprofile = UserProfile.objects.create(user=self.user, name="almakorte", country="Country1")

    def test_email_authentication(self):
        self.assertTrue(self.client.login(username=self.admin.email, password=self.password))
        self.assertTrue('core.auth.EmailBackend' in self.client.session.values())

    def test_user_authentication_should_fail(self):
        self.assertFalse(self.client.login(username=self.admin.username, password=self.password))
        self.assertFalse('core.auth.EmailBackend' in self.client.session.values())

    def test_hide_fields_from_user_change_form(self):
        ma = CustomUserAdmin(User, self.site)
        ma.get_form(None)
        self.assertEqual(ma.get_list_filter(None),
                         ('is_staff', 'is_superuser', 'is_active', 'groups', 'userprofile__account_type'))
        self.assertEqual(ma.country(self.user), self.userprofile.country)
        self.assertEqual(ma.type(self.user), self.userprofile.get_account_type_display())
        self.assertIsNone(ma.organisation(self.user))