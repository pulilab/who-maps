from datetime import timedelta
from django.utils import timezone
from django.conf import settings
from django.test import TestCase
from django.test.client import Client
from django.core.urlresolvers import reverse
from mock import patch

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

        # Store to be able to mock later.
        self.timezone_now = timezone.now()

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
        url = reverse("api_token_auth")
        data = {
            "username": "test_user1@gmail.com",
            "password": "123456"}
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, 200)
        self.assertIn("token", response.json())
        self.assertIn("userprofile", response.json())

    def test_login_user_wrong_credentials(self):
        url = reverse("api_token_auth")
        data = {
            "username": "aaaaaa@gmail.com",
            "password": "12345"}
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, 400)
        self.assertIn(response.json()["non_field_errors"][0], "Unable to log in with provided credentials.")

    @patch("django.utils.timezone.now")
    def test_expired_token(self, mock_timezone_now):
        mock_timezone_now.return_value = self.timezone_now + settings.EXPIRING_TOKEN_LIFESPAN + timedelta(days=1)
        url = reverse("rest_user_details")
        response = self.test_user_client.get(url)
        self.assertEqual(response.status_code, 401)
        self.assertEqual(response.json().get("detail"), "Token has expired")


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

        # Validate the account.
        key = EmailConfirmation.objects.get(email_address__email="test_user1@gmail.com").key
        url = reverse("rest_verify_email")
        data = {
            "key": key,
        }
        response = self.client.post(url, data)

        # Create a test user with profile.
        url = reverse("rest_register")
        data = {
            "email": "test_user2@gmail.com",
            "password1": "123456",
            "password2": "123456"}
        response = self.client.post(url, data)

        # Validate the account.
        key = EmailConfirmation.objects.get(email_address__email="test_user2@gmail.com").key
        url = reverse("rest_verify_email")
        data = {
            "key": key,
        }
        response = self.client.post(url, data)

        # Log in.
        url = reverse("api_token_auth")
        data = {
            "username": "test_user2@gmail.com",
            "password": "123456"}
        response = self.client.post(url, data)
        url = reverse("userprofile-list")
        client = Client(HTTP_AUTHORIZATION="Token {}".format(response.json().get("token")))

        # Create profile.
        url = reverse("userprofile-list")
        data = {
            "name": "Test Name",
            "organisation": "test_org",
            "country": "test_country"}
        response = client.post(url, data)

    def test_retrieve_nonexistent_user_profile_on_login(self):
        url = reverse("api_token_auth")
        data = {
            "username": "test_user1@gmail.com",
            "password": "123456"}
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, 200)
        self.assertIn("token", response.json())
        self.assertIn("userprofile", response.json())
        self.assertFalse(response.json().get("userprofile"))

    def test_retrieve_nonexistent_user_profile(self):
        url = reverse("api_token_auth")
        data = {
            "username": "test_user1@gmail.com",
            "password": "123456"}
        response = self.client.post(url, data)
        url = reverse("userprofile-list")
        client = Client(HTTP_AUTHORIZATION="Token {}".format(response.json().get("token")))
        response = client.get(url)
        self.assertEqual(response.status_code, 200)
        self.assertEqual([], response.json())

    def test_retrieve_existent_user_profile_on_login(self):
        url = reverse("api_token_auth")
        data = {
            "username": "test_user2@gmail.com",
            "password": "123456"}
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, 200)
        self.assertIn("token", response.json())
        self.assertIn("userprofile", response.json())
        self.assertTrue(response.json().get("userprofile"))

    def test_retrieve_existent_user_profile(self):
        url = reverse("api_token_auth")
        data = {
            "username": "test_user2@gmail.com",
            "password": "123456"}
        response = self.client.post(url, data)
        url = reverse("userprofile-list")
        client = Client(HTTP_AUTHORIZATION="Token {}".format(response.json().get("token")))
        response = client.get(url)
        self.assertEqual(response.status_code, 200)
        self.assertNotEqual([], response.json())

    def test_create_user_profile(self):
        url = reverse("api_token_auth")
        data = {
            "username": "test_user1@gmail.com",
            "password": "123456"}
        response = self.client.post(url, data)
        url = reverse("userprofile-list")
        client = Client(HTTP_AUTHORIZATION="Token {}".format(response.json().get("token")))
        data = {
            "name": "Test Name",
            "organisation": "test_org",
            "country": "test_country"}
        response = client.post(url, data)
        self.assertEqual(response.status_code, 201)

    def test_create_duplicate_profile(self):
        url = reverse("api_token_auth")
        data = {
            "username": "test_user1@gmail.com",
            "password": "123456"}
        response = self.client.post(url, data)
        url = reverse("userprofile-list")
        client = Client(HTTP_AUTHORIZATION="Token {}".format(response.json().get("token")))
        data = {
            "name": "Test Name",
            "organisation": "test_org",
            "country": "test_country"}
        response = client.post(url, data)
        self.assertEqual(response.status_code, 201)

        # shouldn't create duplicate profile
        data = {
            "name": "Test Name2",
            "organisation": "test_org2",
            "country": "test_country2"}
        response = client.post(url, data)
        self.assertEqual(response.status_code, 200)

