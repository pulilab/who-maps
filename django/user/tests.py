from datetime import timedelta

from django.urls import reverse
from django.utils import timezone
from django.conf import settings
from django.core import mail
from mock import patch
from rest_framework.test import APIClient
from rest_framework.test import APITestCase
from allauth.account.models import EmailConfirmation

from country.models import Country
from .models import Organisation, UserProfile


class UserTests(APITestCase):

    def setUp(self):
        # Create a test user.
        url = reverse("rest_register")
        data = {
            "email": "test_user1@gmail.com",
            "password1": "123456hetNYOLC",
            "password2": "123456hetNYOLC"}
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, 201, response.json())
        self.test_user_key = response.json().get("key")
        self.test_user_client = APIClient(HTTP_AUTHORIZATION="Token {}".format(self.test_user_key), format="json")

        # Validate the account.
        key = EmailConfirmation.objects.get(email_address__email="test_user1@gmail.com").key
        url = reverse("rest_verify_email")
        data = {
            "key": key,
        }
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, 200, response.json())

        # Create a test user, don't validate the account.
        url = reverse("rest_register")
        data = {
            "email": "test_user2@gmail.com",
            "password1": "123456hetNYOLC",
            "password2": "123456hetNYOLC"}
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, 201, response.json())

        # Store to be able to mock later.
        self.timezone_now = timezone.now()

    def test_register_user(self):
        url = reverse("rest_register")
        data = {
            "email": "test_user3@gmail.com",
            "password1": "123456hetNYOLC",
            "password2": "123456hetNYOLC"
        }
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, 201)
        self.assertIn("key", response.json())

    def test_register_user_unique_email(self):
        url = reverse("rest_register")
        data = {
            "email": "test_user1@gmail.com",
            "password1": "123456hetNYOLC",
            "password2": "123456hetNYOLC"}
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.json()["email"][0], "A user is already registered with this e-mail address.")

    def test_register_user_invalid_email(self):
        url = reverse("rest_register")
        data = {
            "email": "test_user@gmail",
            "password1": "123456hetNYOLC",
            "password2": "123456hetNYOLC"}
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
        self.assertIn(response.json()["detail"], "ok")

    def test_login_user(self):
        url = reverse("api_token_auth")
        data = {
            "username": "test_user1@gmail.com",
            "password": "123456hetNYOLC"}
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, 200)
        self.assertIn("token", response.json())
        self.assertIn("user_profile_id", response.json())

    def test_login_user_wrong_credentials(self):
        url = reverse("api_token_auth")
        data = {
            "username": "aaaaaa@gmail.com",
            "password": "123456hetNYOLCs"}
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

    def test_register_user_creates_user_profile(self):
        url = reverse("rest_register")
        data = {
            "email": "test_user3@gmail.com",
            "password1": "123456hetNYOLC",
            "password2": "123456hetNYOLC"
        }
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, 201)
        self.assertIn("key", response.json())
        self.assertIn("user_profile_id", response.json())
        self.assertIn("account_type", response.json())
        self.assertEqual(response.json().get("account_type"), UserProfile.IMPLEMENTER)

    def test_register_user_creates_user_profile_with_account_type(self):
        url = reverse("rest_register")
        data = {
            "email": "test_user3@gmail.com",
            "password1": "123456hetNYOLC",
            "password2": "123456hetNYOLC",
            "account_type": "G"
        }
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, 201)
        self.assertIn("key", response.json())
        self.assertIn("user_profile_id", response.json())
        self.assertIn("account_type", response.json())
        self.assertEqual(response.json().get("account_type"), UserProfile.GOVERNMENT)

    def test_forgot_password_send_email(self):
        url = reverse("rest_password_reset")
        data = {
            "email": "test_user1@gmail.com",
        }
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()['detail'], 'Password reset e-mail has been sent.')
        self.assertIn("Password reset", mail.outbox[2].subject)


class UserProfileTests(APITestCase):

    def setUp(self):
        # Create a test user without profile.
        url = reverse("rest_register")
        data = {
            "email": "test_user1@gmail.com",
            "password1": "123456hetNYOLC",
            "password2": "123456hetNYOLC"}
        response = self.client.post(url, data)

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
            "password1": "123456hetNYOLC",
            "password2": "123456hetNYOLC"}
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
            "password": "123456hetNYOLC"}
        response = self.client.post(url, data)
        self.user_profile_id = response.json().get('user_profile_id')
        self.client = APIClient(HTTP_AUTHORIZATION="Token {}".format(response.json().get("token")), format="json")

        # Update profile.
        self.org = Organisation.objects.create(name="org1")
        self.country = Country.objects.all()[0]
        url = reverse("userprofile-detail", kwargs={"pk": self.user_profile_id})
        data = {
            "name": "Test Name",
            "organisation": self.org.id,
            "country": self.country.id}
        response = self.client.put(url, data)

    def test_obtain_user_profile_returns_id(self):
        url = reverse("api_token_auth")
        data = {
            "username": "test_user2@gmail.com",
            "password": "123456hetNYOLC"}
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json().get('user_profile_id'),
                         UserProfile.objects.get(user__email="test_user2@gmail.com").id)

    def test_retrieve_existent_user_profile_on_login(self):
        url = reverse("api_token_auth")
        data = {
            "username": "test_user2@gmail.com",
            "password": "123456hetNYOLC"}
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, 200)
        self.assertIn("token", response.json())
        self.assertIn("user_profile_id", response.json())
        self.assertTrue(response.json().get("user_profile_id"))

    def test_retrieve_existent_user_profile(self):
        url = reverse("api_token_auth")
        data = {
            "username": "test_user2@gmail.com",
            "password": "123456hetNYOLC"}
        response = self.client.post(url, data)
        user_profile_id = response.json().get('user_profile_id')
        url = reverse("userprofile-detail", kwargs={"pk": user_profile_id})
        client = APIClient(HTTP_AUTHORIZATION="Token {}".format(response.json().get("token")), format="json")
        response = client.get(url)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json().get('id'), user_profile_id)
        self.assertIn('language', response.json())

    def test_update_user_profile(self):
        url = reverse("userprofile-detail", kwargs={"pk": self.user_profile_id})
        response = self.client.get(url)
        data = response.json()
        updated_country = Country.objects.all()[2].id
        data.update(country=updated_country)
        response = self.client.put(url, data, format="json")
        self.assertEqual(response.status_code, 200)
        url = reverse("userprofile-detail", kwargs={"pk": self.user_profile_id})
        response = self.client.get(url)
        self.assertEqual(response.json().get("country"), updated_country)

    def test_user_profile_update_with_empty_values(self):
        url = reverse("userprofile-detail", kwargs={"pk": self.user_profile_id})
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)

        data = response.json()
        data['country'] = None
        data['organisation'] = None
        data['name'] = ''

        response = self.client.put(url, data, format="json")
        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.json(),
                         {'name': ['This field may not be blank.'],
                          'country': ['This field may not be null.'],
                          'organisation': ['This field may not be null.']})

    def test_create_org(self):
        url = reverse("organisation-list")
        data = {
            "name": "org2"
        }
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, 201)

    def test_retrieve_org(self):
        url = reverse("organisation-list")
        data = {
            "name": "org2"
        }
        response = self.client.post(url, data)
        url = reverse("organisation-detail", kwargs={"pk": response.json().get("id")})
        response = self.client.get(url)
        self.assertEqual(response.json().get("name"), "org2")

    def test_organisation_autocomplete(self):
        url = reverse("organisation-list")
        data = {
            "name": "other"
        }
        response = self.client.post(url, data)
        url = reverse("organisation-list")
        data = {
            "name": "org2"
        }
        response = self.client.post(url, data)
        url = reverse("organisation-list")
        response = self.client.get(url, {"name": "org"})
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.json()), 2)

    def test_user_profile_api_should_return_organisation_name_id(self):
        url = reverse("userprofile-detail", kwargs={"pk": self.user_profile_id})
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)
        self.assertTrue("organisation_name" in response.json())
        self.assertTrue("organisation" in response.json())

    def test_organisation_returns_empty_string_when_no_org_id(self):
        name = Organisation.get_name_by_id("")
        self.assertEqual(name, "")

    def test_user_profile_has_account_type_information(self):
        url = reverse("userprofile-detail", kwargs={"pk": self.user_profile_id})
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)
        self.assertTrue("account_type" in response.json())

    def test_user_profile_create_sets_account_type(self):
        url = reverse("api_token_auth")
        data = {
            "username": "test_user1@gmail.com",
            "password": "123456hetNYOLC"}
        response = self.client.post(url, data)
        user_profile_id = response.json().get('user_profile_id')
        url = reverse("userprofile-detail", kwargs={"pk": user_profile_id})
        client = APIClient(HTTP_AUTHORIZATION="Token {}".format(response.json().get("token")), format="json")
        data = {
            "name": "Test Name",
            "organisation": self.org.id,
            "country": Country.objects.get(id=3).id,
            "account_type": "D"
        }
        response = client.put(url, data)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()['account_type'], UserProfile.DONOR)

    def test_user_profile_update_changes_account_type(self):
        url = reverse("userprofile-detail", kwargs={"pk": self.user_profile_id})
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()['account_type'], UserProfile.IMPLEMENTER)

        data = {
            "name": "Test Name",
            "organisation": self.org.id,
            "country": Country.objects.get(id=3).id,
            "account_type": "G"
        }
        response = self.client.put(url, data)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()['account_type'], UserProfile.GOVERNMENT)
