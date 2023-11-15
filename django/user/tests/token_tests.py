from django.contrib.auth.models import User
from django.urls import reverse
from rest_framework import status

from rest_framework.test import APIClient
from rest_framework.test import APITestCase
from rest_framework.authtoken.models import Token
from allauth.account.models import EmailConfirmation
import base64


class TokenTests(APITestCase):
    def create_user(self, email="test_user1@gmail.com",
                    password1="123456hetNYOLC",
                    password2="123456hetNYOLC",
                    validate=True):
        data = dict(
            email=email,
            password1=password1,
            password2=password2
        )
        url = reverse("rest_register")

        response = self.client.post(url, data)
        self.assertEqual(response.status_code, 201, response.json())
        self.user_profile_id = response.json().get('user_profile_id')

        if validate:
            key = EmailConfirmation.objects.get(email_address__email="test_user1@gmail.com").key
            url = reverse("rest_verify_email")
            data = {
                "key": key,
            }
            response = self.client.post(url, data)
            self.assertEqual(response.status_code, 200, response.json())

        return self.user_profile_id

    def login_user(self, user_name="test_user1@gmail.com", password="123456hetNYOLC"):
        url = reverse("token_obtain_pair")
        data = {"username": user_name, "password": password}
        response = self.client.post(url, data)
        test_user_key = response.json().get("access")
        test_user_client = APIClient(HTTP_AUTHORIZATION="Token {}".format(test_user_key), format="json")

        return test_user_key, test_user_client

    def setUp(self):
        self.username = "test_user1"
        self.user_email = "test_user1@gmail.com"
        self.user_password = "123456hetNYOLC"

        # Create a test user.
        self.user_profile_1_id = self.create_user()
        self.user_1_id = User.objects.get(userprofile__id=self.user_profile_1_id).id
        tokens = Token.objects.filter(user__id=self.user_1_id)
        self.assertEqual(tokens.count(), 0)  # user should not have token at this stage
        self.user_1_key, self.user_1_client = self.login_user()

    def test_token_scenarios(self):
        # Create the token
        tokens = Token.objects.filter(user__id=self.user_1_id)
        self.assertEqual(tokens.count(), 0)  # user should not have token at this stage
        url = reverse('token-create')
        response = self.user_1_client.post(url)
        self.assertEqual(response.status_code, 201)
        self.assertEqual(response.json()['user'], self.user_1_id)
        token_key = response.json()['key']
        tokens = Token.objects.filter(user__id=self.user_1_id)
        self.assertEqual(tokens.count(), 1)  # Exactly one token per user
        self.assertEqual(tokens[0].key, token_key)
        # Run create again = should get the same token back
        url = reverse('token-create')
        response = self.user_1_client.post(url)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()['user'], self.user_1_id)
        self.assertEqual(response.json()['key'], token_key)
        # Validate the received token
        key = response.json()['key']
        client = APIClient(HTTP_AUTHORIZATION=f"Bearer {key}", format="json")
        url = reverse('token-check')
        response = client.get(url)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()['key'], key)
        tokens = Token.objects.filter(user__id=self.user_1_id)
        self.assertEqual(tokens.count(), 1)  # Exactly one token per user
        self.assertEqual(tokens[0].key, token_key)

        # Refresh the token
        url = reverse('token-refresh')
        response = self.user_1_client.post(url)
        self.assertEqual(response.status_code, 200)
        self.assertNotEqual(response.json()['key'], token_key)
        tokens = Token.objects.filter(user__id=self.user_1_id)
        self.assertEqual(tokens.count(), 1)
        key_new = response.json()['key']
        # Get the token
        url = reverse('token-get')
        response = self.user_1_client.get(url)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()['key'], key_new)
        # Delete the token
        url = reverse('token-delete')
        response = self.user_1_client.delete(url)
        self.assertEqual(response.status_code, 204)
        tokens = Token.objects.filter(user__id=self.user_1_id)
        self.assertEqual(tokens.count(), 0)
        # try getting the token again
        url = reverse('token-get')
        response = self.user_1_client.get(url)
        self.assertEqual(response.status_code, 404)

    def test_token_bad_auth(self):
        cred_str = f'{self.user_email}:{self.user_password}ABLAKZSIRAF'
        credentials = base64.b64encode(cred_str.encode())
        basic_auth_client = APIClient(HTTP_AUTHORIZATION=f'Token {credentials.decode()}', format="json")
        tokens = Token.objects.filter(user__id=self.user_1_id)
        self.assertEqual(tokens.count(), 0)  # user should not have token at this stage
        url = reverse('token-create')
        response = basic_auth_client.post(url)
        self.assertEqual(response.status_code, 401)
        tokens = Token.objects.filter(user__id=self.user_1_id)
        self.assertEqual(tokens.count(), 0)  # user should not have token at this stage

    def test_normal_user_cannot_impersonate(self):
        url = reverse("token_impersonate")
        data = {"user": self.user_1_id}
        response = self.user_1_client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_anonymous_user_cannot_impersonate(self):
        url = reverse("token_impersonate")
        data = {"user": self.user_1_id}
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_superuser_can_impersonate(self):
        self.superuser_profile_id = self.create_user(
            email="test_super@example.com",
            password1="123456hetNYOLC",
            password2="123456hetNYOLC",
            validate=True)
        self.superuser = User.objects.get(userprofile__id=self.superuser_profile_id)
        self.superuser.is_superuser = True
        self.superuser.save()

        self.superuser_key, self.superuser_client = self.login_user(user_name="test_super@example.com")

        url = reverse("token_impersonate")
        data = {"user": self.user_1_id}
        response = self.superuser_client.post(url, data)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        test_user_key = response.json().get("access")
        test_user_client = APIClient(HTTP_AUTHORIZATION="Token {}".format(test_user_key), format="json")
        url = reverse("userprofile-me")
        response = test_user_client.get(url, data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        data = response.json()
        self.assertEqual(data['id'], self.user_profile_1_id)
        self.assertFalse(data['is_superuser'])
        self.assertNotEqual(data['id'], self.superuser_profile_id)
