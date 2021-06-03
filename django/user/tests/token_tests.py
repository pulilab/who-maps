from unittest import mock

from django.contrib.auth.models import User
from django.test import override_settings
from django.urls import reverse
from rest_framework import status

from core.factories import UserFactory, UserProfileFactory, OrganisationFactory, DonorFactory, CountryFactory
from django.core import mail
from rest_framework.test import APIClient
from rest_framework.test import APITestCase
from rest_framework.authtoken.models import Token
from allauth.account.models import EmailConfirmation
from requests.auth import HTTPBasicAuth
import base64

from country.models import Country
from user.tasks import send_user_request_to_admins
from user.models import UserProfile


class TokenTests(APITestCase):

    def create_user(self,
                    email="test_user1@gmail.com",
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
        test_user_key = response.json().get("key")
        user_id = response.json()['user']['pk']
        test_user_client = APIClient(HTTP_AUTHORIZATION="Token {}".format(test_user_key), format="json")

        if validate:
            key = EmailConfirmation.objects.get(email_address__email="test_user1@gmail.com").key
            url = reverse("rest_verify_email")
            data = {
                "key": key,
            }
            response = self.client.post(url, data)
            self.assertEqual(response.status_code, 200, response.json())

        return test_user_key, test_user_client, user_id

    def login_user(self, user_name="test_user1@gmail.com", password="123456hetNYOLC"):
        url = reverse("api_token_auth")
        data = {"username": user_name, "password": password}
        response = self.client.post(url, data)
        test_user_key = response.json().get("token")
        test_user_client = APIClient(HTTP_AUTHORIZATION="Token {}".format(test_user_key), format="json")
        self.user_profile_id = response.json().get('user_profile_id')
        return test_user_key, test_user_client

    def setUp(self):
        self.username = "test_user1"
        self.user_email = "test_user1@gmail.com"
        self.user_password = "123456hetNYOLC"
        # Create a test user.
        self.user_1_key, self.user_1_client, self.user_1_id = self.create_user()
        tokens = Token.objects.filter(user__id=self.user_1_id)
        self.assertEqual(tokens.count(), 0)  # user should not have token at this stage
        self.user_1_key, self.user_1_client = self.login_user()
        self.donor = DonorFactory(name='Donor 1', code='dnr1')

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

    def test_token_basic_auth(self):
        cred_str = f'{self.user_email}:{self.user_password}'
        credentials = base64.b64encode(cred_str.encode())
        basic_auth_client = APIClient(HTTP_AUTHORIZATION=f'Basic {credentials.decode()}', format="json")
        tokens = Token.objects.filter(user__id=self.user_1_id)
        self.assertEqual(tokens.count(), 0)  # user should not have token at this stage
        url = reverse('token-create')
        response = basic_auth_client.post(url)
        self.assertEqual(response.status_code, 201)
        self.assertEqual(response.json()['user'], self.user_1_id)
        token_key = response.json()['key']
        tokens = Token.objects.filter(user__id=self.user_1_id)
        self.assertEqual(tokens.count(), 1)  # Exactly one token per user
        self.assertEqual(tokens[0].key, token_key)
        url = reverse('token-get')
        response = basic_auth_client.get(url)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()['key'], token_key)
        url = reverse('token-delete')
        response = basic_auth_client.delete(url)
        self.assertEqual(response.status_code, 204)

    def test_token_bad_auth(self):
        cred_str = f'{self.user_email}:{self.user_password}ABLAKZSIRAF'
        credentials = base64.b64encode(cred_str.encode())
        basic_auth_client = APIClient(HTTP_AUTHORIZATION=f'Basic {credentials.decode()}', format="json")
        tokens = Token.objects.filter(user__id=self.user_1_id)
        self.assertEqual(tokens.count(), 0)  # user should not have token at this stage
        url = reverse('token-create')
        response = basic_auth_client.post(url)
        self.assertEqual(response.status_code, 401)
        tokens = Token.objects.filter(user__id=self.user_1_id)
        self.assertEqual(tokens.count(), 0)  # user should not have token at this stage


