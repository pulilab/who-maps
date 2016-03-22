from django.test import TestCase
from django.test.client import Client
from django.core.urlresolvers import reverse

from allauth.account.models import EmailConfirmation


class UserTests(TestCase):

    def setUp(self):
        # Create a test user.
        url = reverse("rest_register")
        data = {
            "email": "test_user1@gmail.com",
            "password1": "123456",
            "password2": "123456"}
        response = self.client.post(url, data)
        self.test_user_key = response.json().get("key")
        self.test_user_client = Client(HTTP_AUTHORIZATION="Token {}".format(self.test_user_key))

        # Validate the account.
        key = EmailConfirmation.objects.get(email_address__email="test_user1@gmail.com").key
        url = reverse("rest_verify_email")
        data = {
            "key": key,
        }
        response = self.client.post(url, data)

        # Create a test user, don't validate the account.
        url = reverse("rest_register")
        data = {
            "email": "test_user2@gmail.com",
            "password1": "123456",
            "password2": "123456"}
        response = self.client.post(url, data)

    def test_register_user(self):
        url = reverse("rest_register")
        data = {
            "email": "test_user3@gmail.com",
            "password1": "123456",
            "password2": "123456"}
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, 201)
        self.assertIn("key", response.json())

    def test_register_user_unique_email(self):
        url = reverse("rest_register")
        data = {
            "email": "test_user1@gmail.com",
            "password1": "123456",
            "password2": "123456"}
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.json()["email"][0], "A user is already registered with this e-mail address.")

    def test_register_user_invalid_email(self):
        url = reverse("rest_register")
        data = {
            "email": "test_user@gmail",
            "password1": "123456",
            "password2": "123456"}
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.json()["email"][0], "Enter a valid email address.")

    def test_verify_email(self):
        key = EmailConfirmation.objects.get(email_address__email="test_user2@gmail.com").key
        url = reverse("rest_verify_email")
        data = {
            "key": key,
        }
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, 200)
        self.assertIn(response.json()["message"], "ok")

    def test_login_user(self):
        url = reverse("rest_login")
        data = {
            "email": "test_user1@gmail.com",
            "password": "123456"}
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, 200)
        self.assertIn("key", response.json())
        self.assertIn("userprofile", response.json())

    def test_login_user_wrong_credentials(self):
        url = reverse("rest_login")
        data = {
            "email": "testuser1@gmail.com",
            "password": "12345"}
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, 400)
        self.assertIn(response.json()["non_field_errors"][0], "Unable to log in with provided credentials.")


class UserProfileTests(TestCase):

    def setUp(self):
        # Create a test user without profile.
        url = reverse("rest_register")
        data = {
            "email": "test_user1@gmail.com",
            "password1": "123456",
            "password2": "123456"}
        response = self.client.post(url, data)
        test_user_key = response.json().get("key")
        self.test_user_client = Client(HTTP_AUTHORIZATION="Token {}".format(test_user_key))

        # Validate the account.
        key = EmailConfirmation.objects.get(email_address__email="test_user1@gmail.com").key
        url = reverse("rest_verify_email")
        data = {
            "key": key,
        }
        response = self.client.post(url, data)

        # Create a second test user without profile.
        url = reverse("rest_register")
        data = {
            "email": "test_user2@gmail.com",
            "password1": "123456",
            "password2": "123456"}
        response = self.client.post(url, data)
        test_user2_key = response.json().get("key")
        self.test_user2_client = Client(HTTP_AUTHORIZATION="Token {}".format(test_user2_key))

        # Validate the account.
        key = EmailConfirmation.objects.get(email_address__email="test_user2@gmail.com").key
        url = reverse("rest_verify_email")
        data = {
            "key": key,
        }
        response = self.client.post(url, data)

        # Create a test user with profile.
        url = reverse("rest_register")
        data = {
            "email": "test_user3@gmail.com",
            "password1": "123456",
            "password2": "123456"}
        response = self.client.post(url, data)
        test_user3_key = response.json().get("key")
        self.test_user3_client = Client(HTTP_AUTHORIZATION="Token {}".format(test_user3_key))

        # Validate the account.
        key = EmailConfirmation.objects.get(email_address__email="test_user3@gmail.com").key
        url = reverse("rest_verify_email")
        data = {
            "key": key,
        }
        response = self.client.post(url, data)

        # Create profile.
        url = reverse("userprofile-list")
        data = {
            "name": "Test Name",
            "organisation": "test_org",
            "country": "test_country"}
        response = self.test_user3_client.post(url, data)

    def test_retrieve_nonexistent_user_profile_after_login(self):
        url = reverse("rest_login")
        data = {
            "email": "test_user2@gmail.com",
            "password": "123456"}
        response = self.test_user2_client.post(url, data)
        self.assertEqual(response.status_code, 200)
        self.assertIn("key", response.json())
        self.assertIn("userprofile", response.json())
        self.assertFalse(response.json().get("userprofile"))

    def test_retrieve_nonexistent_user_profile(self):
        url = reverse("userprofile-list")
        response = self.test_user2_client.get(url)
        self.assertEqual(response.status_code, 200)
        self.assertEqual([], response.json())

    def test_retrieve_existent_user_profile_after_login(self):
        url = reverse("rest_login")
        data = {
            "email": "test_user3@gmail.com",
            "password": "123456"}
        response = self.test_user3_client.post(url, data)
        self.assertEqual(response.status_code, 200)
        self.assertIn("key", response.json())
        self.assertIn("userprofile", response.json())
        self.assertTrue(response.json().get("userprofile"))

    def test_retrieve_existent_user_profile(self):
        url = reverse("userprofile-list")
        response = self.test_user3_client.get(url)
        self.assertEqual(response.status_code, 200)
        self.assertNotEqual([], response.json())

    def test_create_user_profile(self):
        url = reverse("userprofile-list")
        data = {
            "name": "Test Name",
            "organisation": "test_org",
            "country": "test_country"}
        response = self.test_user_client.post(url, data)
        self.assertEqual(response.status_code, 201)
