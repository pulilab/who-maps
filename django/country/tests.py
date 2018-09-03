import json
import os
from fnmatch import fnmatch
from unittest.mock import patch

from django.contrib.admin import AdminSite
from django.contrib.auth.models import User
from django.urls import reverse
from django.utils.translation import override
from django.core.files.uploadedfile import SimpleUploadedFile
from django.utils import timezone
from django.utils.dateformat import format
from requests import RequestException

from django.core import mail
from django.core.management import call_command
from allauth.account.models import EmailConfirmation
from django.test import TestCase
from rest_framework.test import APIClient
from rest_framework.test import APITestCase

from core.tests import get_temp_image
from country.admin import CountryAdmin
from country.models import Country, PartnerLogo, CountryField, Donor, DonorPartnerLogo
from project.models import Project
from user.models import UserProfile
from django.utils.six import StringIO
from django.conf import settings


class CountryTests(APITestCase):
    def setUp(self):
        # Create a test user with profile.
        url = reverse("rest_register")
        data = {"email": "test_user@gmail.com", "password1": "123456hetNYOLC", "password2": "123456hetNYOLC"}
        response = self.client.post(url, data)

        # Validate the account.
        key = EmailConfirmation.objects.get(email_address__email="test_user@gmail.com").key
        url = reverse("rest_verify_email")
        data = {
            "key": key,
        }
        response = self.client.post(url, data)

        # Log in the user.
        url = reverse("api_token_auth")
        data = {"username": "test_user@gmail.com", "password": "123456hetNYOLC"}
        response = self.client.post(url, data)
        self.test_user = response.json()
        self.test_user_key = response.json().get("token")
        self.test_user_client = APIClient(HTTP_AUTHORIZATION="Token {}".format(self.test_user_key))

        self.country = Country.objects.create(name="country1", code="CC", map_activated_on=timezone.now())
        self.country.name_en = 'Hungary'
        self.country.name_fr = 'Hongrie'
        self.country.save()
        PartnerLogo.objects.create(country=self.country)

        self.cf_schema = CountryField.objects.create(country=self.country, type=1, question="q1?", schema=True)
        CountryField.objects.create(country=self.country, type=1, question="q1?", answer="a1", schema=False)

    def test_country_model(self):
        with override('en'):
            self.assertEqual(self.country.name, 'Hungary')

        with override('fr'):
            self.assertEqual(self.country.name, 'Hongrie')

    def test_country_model_str(self):
        self.assertEqual(str(self.country), 'Hungary')

    def test_retrieve_landing_detail(self):
        url = reverse("landing-country-detail", kwargs={"code": self.country.code})
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)
        response_keys = response.json().keys()
        self.assertIn("name", response_keys)
        self.assertIn("code", response_keys)
        self.assertIn("logo", response_keys)
        self.assertIn("cover", response_keys)
        self.assertIn("cover_text", response_keys)
        self.assertIn("footer_text", response_keys)

    def test_retrieve_landing_list(self):
        url = reverse("landing-country-list")
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)
        response_keys = response.json()[0].keys()
        self.assertIn("name", response_keys)
        self.assertIn("code", response_keys)
        self.assertIn("logo", response_keys)
        self.assertIn("cover", response_keys)
        self.assertIn("cover_text", response_keys)
        self.assertIn("footer_text", response_keys)

    def test_get_countries(self):
        Country.objects.exclude(id=self.country.id).delete()

        url = reverse("country-list")
        response = self.test_user_client.get(url, HTTP_ACCEPT_LANGUAGE='en')
        self.assertEqual(response.status_code, 200)
        country_data = response.json()[0]
        self.assertIn("name", country_data.keys())
        self.assertIn("code", country_data.keys())
        self.assertIn("id", country_data.keys())
        self.assertIn("project_approval", country_data.keys())
        self.assertIn("map_version", country_data.keys())
        self.assertEqual(country_data['name'], 'Hungary')

        response = self.test_user_client.get(url, HTTP_ACCEPT_LANGUAGE='fr')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()[0]['name'], 'Hongrie')

    def test_country_admin_retrieve(self):
        url = reverse("country-detail", kwargs={"pk": self.country.id})
        response = self.test_user_client.get(url, HTTP_ACCEPT_LANGUAGE='en')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()['name'], 'Hungary')
        self.assertEqual(response.json()['map_version'], format(self.country.map_activated_on, 'U'))
        response_keys = response.json().keys()
        self.assertIn("name", response_keys)
        self.assertIn("code", response_keys)
        self.assertIn("logo", response_keys)
        self.assertIn("cover", response_keys)
        self.assertIn("cover_text", response_keys)
        self.assertIn("footer_text", response_keys)
        self.assertIn("map_data", response_keys)

    def test_country_admin_retrieve_without_map_version(self):
        country2 = Country.objects.create(name="country2", code="CC2")
        url = reverse("country-detail", kwargs={"pk": country2.id})
        response = self.test_user_client.get(url, HTTP_ACCEPT_LANGUAGE='en')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()['map_version'], 0)
        response_keys = response.json().keys()
        self.assertIn("name", response_keys)
        self.assertIn("code", response_keys)
        self.assertIn("logo", response_keys)
        self.assertIn("cover", response_keys)
        self.assertIn("cover_text", response_keys)
        self.assertIn("footer_text", response_keys)
        self.assertIn("map_data", response_keys)

    def test_super_country_admin_update(self):
        UserProfile.objects.filter(id=self.test_user['user_profile_id']) \
            .update(account_type=UserProfile.SUPER_COUNTRY_ADMIN, country=self.country)
        self.country.super_admins.add(self.test_user['user_profile_id'])

        url = reverse("country-detail", kwargs={"pk": self.country.id})
        data = {
            "cover_text": "blah",
            "footer_text": "foo",
            "project_approval": True
        }
        response = self.test_user_client.patch(url, data=data, HTTP_ACCEPT_LANGUAGE='en')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()["cover_text"], data["cover_text"])
        self.assertEqual(response.json()["footer_text"], data["footer_text"])
        self.assertEqual(response.json()["project_approval"], data["project_approval"])

    def test_superuser_country_admin_update(self):
        user = UserProfile.objects.get(id=self.test_user['user_profile_id']).user
        user.is_superuser = True
        user.save()

        url = reverse("country-detail", kwargs={"pk": self.country.id})
        data = {
            "cover_text": "blah",
            "footer_text": "foo",
            "project_approval": True
        }
        response = self.test_user_client.patch(url, data=data, HTTP_ACCEPT_LANGUAGE='en')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()["cover_text"], data["cover_text"])
        self.assertEqual(response.json()["footer_text"], data["footer_text"])
        self.assertEqual(response.json()["project_approval"], data["project_approval"])

    def test_country_admin_update_noperm_fails(self):
        url = reverse("country-detail", kwargs={"pk": self.country.id})
        data = {
            "cover_text": "blah",
            "footer_text": "foo",
            "project_approval": True
        }
        response = self.test_user_client.patch(url, data=data, HTTP_ACCEPT_LANGUAGE='en')
        self.assertEqual(response.status_code, 403)

    def test_country_admin_update_info_fails(self):
        UserProfile.objects.filter(id=self.test_user['user_profile_id']) \
            .update(account_type=UserProfile.COUNTRY_ADMIN, country=self.country)
        self.country.admins.add(self.test_user['user_profile_id'])

        url = reverse("country-detail", kwargs={"pk": self.country.id})
        data = {
            "cover_text": "blah",
            "footer_text": "foo",
            "project_approval": True
        }
        response = self.test_user_client.patch(url, data=data, HTTP_ACCEPT_LANGUAGE='en')
        self.assertEqual(response.status_code, 200)
        self.assertNotEqual(response.json()["cover_text"], data["cover_text"])
        self.assertNotEqual(response.json()["footer_text"], data["footer_text"])
        self.assertNotEqual(response.json()["project_approval"], data["project_approval"])

    def test_country_admin_update_images(self):
        UserProfile.objects.filter(id=self.test_user['user_profile_id']).update(
            account_type=UserProfile.SUPER_DONOR_ADMIN, country=self.country)
        self.country.super_admins.add(self.test_user['user_profile_id'])

        url = reverse("country-image-detail", kwargs={"pk": self.country.id})
        cover = get_temp_image("cover")
        logo = get_temp_image("logo")
        data = {
            "cover": cover,
            "logo": logo
        }
        response = self.test_user_client.patch(url, data=data, format='multipart', HTTP_ACCEPT_LANGUAGE='en')
        self.assertEqual(response.status_code, 200)

    def test_country_superuser_update_images(self):
        user = UserProfile.objects.get(id=self.test_user['user_profile_id']).user
        user.is_superuser = True
        user.save()

        url = reverse("country-image-detail", kwargs={"pk": self.country.id})
        cover = get_temp_image("cover")
        logo = get_temp_image("logo")
        data = {
            "cover": cover,
            "logo": logo
        }
        response = self.test_user_client.patch(url, data=data, format='multipart', HTTP_ACCEPT_LANGUAGE='en')
        self.assertEqual(response.status_code, 200)

    def test_country_admin_update_images_noperm_fail(self):
        url = reverse("country-image-detail", kwargs={"pk": self.country.id})
        cover = get_temp_image("cover")
        logo = get_temp_image("logo")
        data = {
            "cover": cover,
            "logo": logo
        }
        response = self.test_user_client.patch(url, data=data, format='multipart', HTTP_ACCEPT_LANGUAGE='en')
        self.assertEqual(response.status_code, 403)

    def test_country_admin_delete_images(self):
        UserProfile.objects.filter(id=self.test_user['user_profile_id']).update(
            account_type=UserProfile.SUPER_DONOR_ADMIN, country=self.country)
        self.country.super_admins.add(self.test_user['user_profile_id'])

        url = reverse("country-image-detail", kwargs={"pk": self.country.id})
        cover = get_temp_image("cover")
        logo = get_temp_image("logo")
        data = {
            "cover": cover,
            "logo": logo
        }
        response = self.test_user_client.patch(url, data=data, format='multipart', HTTP_ACCEPT_LANGUAGE='en')
        self.assertEqual(response.status_code, 200)
        data = {
            "cover": "",
            "logo": ""
        }
        response = self.test_user_client.patch(url, data=data, format='multipart', HTTP_ACCEPT_LANGUAGE='en')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()["logo"], None)
        self.assertEqual(response.json()["cover"], None)

    def test_country_admin_retrieve_admin_requests(self):
        UserProfile.objects.filter(id=self.test_user['user_profile_id']).update(account_type=UserProfile.COUNTRY_ADMIN,
                                                                                country=self.country)
        self.country.admins.add(self.test_user['user_profile_id'])

        user1 = User.objects.create(username="test1", password="12345678")
        userprofile1 = UserProfile.objects.create(user=user1, name="test1", country=self.country,
                                                  account_type=UserProfile.GOVERNMENT)
        user2 = User.objects.create(username="test2", password="12345678")
        userprofile2 = UserProfile.objects.create(user=user2, name="test2", country=self.country,
                                                  account_type=UserProfile.COUNTRY_ADMIN)

        url = reverse("country-detail", kwargs={"pk": self.country.id})
        response = self.test_user_client.get(url, HTTP_ACCEPT_LANGUAGE='en')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()["user_requests"][0]['id'], userprofile1.id)
        self.assertEqual(response.json()["user_requests"][0]['email'], userprofile1.user.email)
        self.assertEqual(response.json()["admin_requests"][0]['id'], userprofile2.id)
        self.assertEqual(response.json()["admin_requests"][0]['email'], userprofile2.user.email)
        self.assertEqual(response.json()["super_admin_requests"], [])

    def test_country_admin_retrieve_super_admin_requests(self):
        UserProfile.objects.filter(id=self.test_user['user_profile_id']).update(
            account_type=UserProfile.SUPER_COUNTRY_ADMIN, country=self.country)
        self.country.super_admins.add(self.test_user['user_profile_id'])

        user1 = User.objects.create(username="test1", password="12345678")
        userprofile1 = UserProfile.objects.create(user=user1, name="test1", country=self.country,
                                                  account_type=UserProfile.GOVERNMENT)
        user2 = User.objects.create(username="test2", password="12345678")
        userprofile2 = UserProfile.objects.create(user=user2, name="test2", country=self.country,
                                                  account_type=UserProfile.COUNTRY_ADMIN)
        user3 = User.objects.create(username="test3", password="12345678")
        userprofile3 = UserProfile.objects.create(user=user3, name="test3", country=self.country,
                                                  account_type=UserProfile.SUPER_COUNTRY_ADMIN)

        url = reverse("country-detail", kwargs={"pk": self.country.id})
        response = self.test_user_client.get(url, HTTP_ACCEPT_LANGUAGE='en')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()["user_requests"][0]['id'], userprofile1.id)
        self.assertEqual(response.json()["admin_requests"][0]['id'], userprofile2.id)
        self.assertEqual(response.json()["super_admin_requests"][0]['id'], userprofile3.id)

    def test_country_superuser_retrieve_super_admin_requests(self):
        user = UserProfile.objects.get(id=self.test_user['user_profile_id']).user
        user.is_superuser = True
        user.save()

        user1 = User.objects.create(username="test1", password="12345678")
        userprofile1 = UserProfile.objects.create(user=user1, name="test1", country=self.country,
                                                  account_type=UserProfile.GOVERNMENT)
        user2 = User.objects.create(username="test2", password="12345678")
        userprofile2 = UserProfile.objects.create(user=user2, name="test2", country=self.country,
                                                  account_type=UserProfile.COUNTRY_ADMIN)
        user3 = User.objects.create(username="test3", password="12345678")
        userprofile3 = UserProfile.objects.create(user=user3, name="test3", country=self.country,
                                                  account_type=UserProfile.SUPER_COUNTRY_ADMIN)

        url = reverse("country-detail", kwargs={"pk": self.country.id})
        response = self.test_user_client.get(url, HTTP_ACCEPT_LANGUAGE='en')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()["user_requests"][0]['id'], userprofile1.id)
        self.assertEqual(response.json()["admin_requests"][0]['id'], userprofile2.id)
        self.assertEqual(response.json()["super_admin_requests"][0]['id'], userprofile3.id)

    def test_country_admin_assign_users_send_email(self):
        UserProfile.objects.filter(id=self.test_user['user_profile_id']).update(
            account_type=UserProfile.SUPER_COUNTRY_ADMIN, country=self.country)
        self.country.super_admins.add(self.test_user['user_profile_id'])

        user1 = User.objects.create(username="test1", password="12345678", email="test1@foo.com")
        userprofile1 = UserProfile.objects.create(user=user1, name="test1", country=self.country,
                                                  account_type=UserProfile.GOVERNMENT)
        user2 = User.objects.create(username="test2", password="12345678", email="test2@foo.com")
        userprofile2 = UserProfile.objects.create(user=user2, name="test2", country=self.country,
                                                  account_type=UserProfile.COUNTRY_ADMIN)
        user3 = User.objects.create(username="test3", password="12345678", email="test3@foo.com")
        userprofile3 = UserProfile.objects.create(user=user3, name="test3", country=self.country,
                                                  account_type=UserProfile.SUPER_COUNTRY_ADMIN)
        user4 = User.objects.create(username="test4", password="12345678", email="test4@foo.com")
        userprofile4 = UserProfile.objects.create(user=user4, name="test4", country=self.country,
                                                  account_type=UserProfile.SUPER_COUNTRY_ADMIN, language='fr')

        url = reverse("country-detail", kwargs={"pk": self.country.id})
        data = {
            "users": [userprofile1.id],
            "admins": [userprofile2.id],
            "super_admins": [userprofile3.id, userprofile4.id]
        }
        response = self.test_user_client.patch(url, data=data, HTTP_ACCEPT_LANGUAGE='en')
        self.assertEqual(response.status_code, 200)

        outgoing_emails = [m.message() for m in mail.outbox if 'You have been selected' in m.message().as_string()]

        self.assertEqual(len(outgoing_emails), 4)

        outgoing_en_email_text = outgoing_emails[0].as_string()
        self.assertTrue("test1@foo.com" in outgoing_emails[0].values())
        self.assertTrue('You have been selected as User for {}'.format(self.country.name) in outgoing_en_email_text)
        self.assertTrue('/admin/country/country/{}/change/'.format(self.country.id) in outgoing_en_email_text)
        self.assertIn('<meta http-equiv="content-language" content="en">', outgoing_en_email_text)
        self.assertNotIn('{{', outgoing_en_email_text)

        outgoing_en_email_text = outgoing_emails[1].as_string()
        self.assertTrue("test2@foo.com" in outgoing_emails[1].values())
        self.assertTrue('You have been selected as Admin for {}'.format(self.country.name) in outgoing_en_email_text)
        self.assertTrue('/admin/country/country/{}/change/'.format(self.country.id) in outgoing_en_email_text)
        self.assertIn('<meta http-equiv="content-language" content="en">', outgoing_en_email_text)
        self.assertNotIn('{{', outgoing_en_email_text)

        outgoing_en_email_text = outgoing_emails[2].as_string()
        self.assertTrue("test3@foo.com" in outgoing_emails[2].values())
        self.assertTrue('You have been selected as Super Admin for {}'.format(self.country.name)
                        in outgoing_en_email_text)
        self.assertTrue('/admin/country/country/{}/change/'.format(self.country.id) in outgoing_en_email_text)
        self.assertIn('<meta http-equiv="content-language" content="en">', outgoing_en_email_text)
        self.assertNotIn('{{', outgoing_en_email_text)

        outgoing_fr_email_text = outgoing_emails[3].as_string()
        self.assertTrue("test4@foo.com" in outgoing_emails[3].values())
        self.assertIn('<meta http-equiv="content-language" content="fr">', outgoing_fr_email_text)
        self.assertNotIn('{{', outgoing_fr_email_text)

    def test_country_admin_update_remove_ser_puts_back_to_requested(self):
        UserProfile.objects.filter(id=self.test_user['user_profile_id']).update(
            account_type=UserProfile.SUPER_COUNTRY_ADMIN, country=self.country)
        self.country.super_admins.add(self.test_user['user_profile_id'])

        user1 = User.objects.create(username="test1", password="12345678")
        userprofile1 = UserProfile.objects.create(user=user1, name="test1", country=self.country,
                                                  account_type=UserProfile.COUNTRY_ADMIN)

        url = reverse("country-detail", kwargs={"pk": self.country.id})

        # Check requests - it's there
        response = self.test_user_client.get(url, HTTP_ACCEPT_LANGUAGE='en')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()["admin_requests"][0]['id'], userprofile1.id)

        # Add
        data = {
            "admins": [userprofile1.id]
        }
        response = self.test_user_client.patch(url, data=data,  format='json', HTTP_ACCEPT_LANGUAGE='en')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()['admins'], [userprofile1.id])

        # Check requests - removed
        response = self.test_user_client.get(url, HTTP_ACCEPT_LANGUAGE='en')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()["admin_requests"], [])

        # Remove
        data = {
            "admins": []
        }
        response = self.test_user_client.patch(url, data=data, format='json', HTTP_ACCEPT_LANGUAGE='en')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()['admins'], [])

        # Check requests - should be there
        response = self.test_user_client.get(url, HTTP_ACCEPT_LANGUAGE='en')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()["admin_requests"][0]['id'], userprofile1.id)

    def test_country_admin_update_users_remove_from_other_group(self):
        UserProfile.objects.filter(id=self.test_user['user_profile_id']).update(
            account_type=UserProfile.SUPER_COUNTRY_ADMIN, country=self.country)
        self.country.super_admins.add(self.test_user['user_profile_id'])

        url = reverse("country-detail", kwargs={"pk": self.country.id})

        user1 = User.objects.create(username="test1", password="12345678")
        userprofile1 = UserProfile.objects.create(user=user1, name="test1", country=self.country,
                                                  account_type=UserProfile.GOVERNMENT)
        data = {
            "users": [userprofile1.id]
        }
        response = self.test_user_client.patch(url, data=data, format='multipart', HTTP_ACCEPT_LANGUAGE='en')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()['users'], [userprofile1.id])

        UserProfile.objects.filter(id=userprofile1.id).update(
            account_type=UserProfile.COUNTRY_ADMIN, country=self.country)
        data = {
            "admins": [userprofile1.id]
        }
        response = self.test_user_client.patch(url, data=data, format='multipart', HTTP_ACCEPT_LANGUAGE='en')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()['users'], [])
        self.assertEqual(response.json()['admins'], [userprofile1.id])

        UserProfile.objects.filter(id=userprofile1.id).update(
            account_type=UserProfile.SUPER_COUNTRY_ADMIN, country=self.country)
        data = {
            "super_admins": [userprofile1.id]
        }
        response = self.test_user_client.patch(url, data=data, format='multipart', HTTP_ACCEPT_LANGUAGE='en')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()['users'], [])
        self.assertEqual(response.json()['admins'], [])
        self.assertEqual(response.json()['super_admins'], [userprofile1.id])

    def test_country_admin_update_super_admin_without_perm(self):
        UserProfile.objects.filter(id=self.test_user['user_profile_id']).update(
            account_type=UserProfile.COUNTRY_ADMIN, country=self.country)
        self.country.admins.add(self.test_user['user_profile_id'])

        url = reverse("country-detail", kwargs={"pk": self.country.id})

        user1 = User.objects.create(username="test1", password="12345678")
        userprofile1 = UserProfile.objects.create(user=user1, name="test1", country=self.country,
                                                  account_type=UserProfile.SUPER_COUNTRY_ADMIN)
        data = {
            "super_admins": [userprofile1.id],
        }
        response = self.test_user_client.patch(url, data=data, HTTP_ACCEPT_LANGUAGE='en')
        self.assertEqual(response.status_code, 200)
        self.country.refresh_from_db()
        self.assertTrue(userprofile1.id not in self.country.super_admins.all())

    def test_country_partner_logos_create_noperm_fail(self):
        url = reverse("country-partner-logo-list")
        logo = get_temp_image("logo")
        data = {
            "country": self.country.id,
            "image": logo
        }
        response = self.test_user_client.post(url, data)
        self.assertEqual(response.status_code, 403)

    def test_country_partner_logos_create(self):
        UserProfile.objects.filter(id=self.test_user['user_profile_id']).update(
            account_type=UserProfile.SUPER_DONOR_ADMIN, country=self.country)
        self.country.super_admins.add(self.test_user['user_profile_id'])

        url = reverse("country-partner-logo-list")
        logo = get_temp_image("logo")
        data = {
            "country": self.country.id,
            "image": logo
        }
        response = self.test_user_client.post(url, data)
        self.assertEqual(response.status_code, 201)

    def test_country_superuser_partner_logos_create(self):
        user = UserProfile.objects.get(id=self.test_user['user_profile_id']).user
        user.is_superuser = True
        user.save()

        url = reverse("country-partner-logo-list")
        logo = get_temp_image("logo")
        data = {
            "country": self.country.id,
            "image": logo
        }
        response = self.test_user_client.post(url, data)
        self.assertEqual(response.status_code, 201)

    def test_country_partner_logos_list(self):
        UserProfile.objects.filter(id=self.test_user['user_profile_id']).update(
            account_type=UserProfile.SUPER_DONOR_ADMIN, country=self.country)
        self.country.super_admins.add(self.test_user['user_profile_id'])

        url = reverse("country-partner-logo-list")
        logo1 = get_temp_image("logo1")
        data = {
            "country": self.country.id,
            "image": logo1
        }
        response = self.test_user_client.post(url, data)
        self.assertEqual(response.status_code, 201)
        logo2 = get_temp_image("logo2")
        data = {
            "country": self.country.id,
            "image": logo2
        }
        response = self.test_user_client.post(url, data)
        self.assertEqual(response.status_code, 201)

        url = reverse("country-detail", kwargs={"pk": self.country.id})
        response = self.test_user_client.get(url, HTTP_ACCEPT_LANGUAGE='en')

        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.json()['partner_logos']), 3)
        self.assertEqual(response.json()['partner_logos'][1]['country'], self.country.id)
        self.assertEqual(response.json()['partner_logos'][1]['image'], 'http://testserver/media/logo1.png')
        self.assertEqual(response.json()['partner_logos'][2]['country'], self.country.id)
        self.assertEqual(response.json()['partner_logos'][2]['image'], 'http://testserver/media/logo2.png')

    def test_country_partner_logos_delete(self):
        UserProfile.objects.filter(id=self.test_user['user_profile_id']).update(
            account_type=UserProfile.SUPER_DONOR_ADMIN, country=self.country)
        self.country.super_admins.add(self.test_user['user_profile_id'])

        url = reverse("country-partner-logo-list")
        logo = get_temp_image("logo")
        data = {
            "country": self.country.id,
            "image": logo
        }
        response = self.test_user_client.post(url, data)
        self.assertEqual(response.status_code, 201)

        url = reverse("country-partner-logo-detail", kwargs={"pk": response.json()["id"]})
        response = self.test_user_client.delete(url)
        self.assertEqual(response.status_code, 204)

    def test_country_superuser_partner_logos_delete(self):
        user = UserProfile.objects.get(id=self.test_user['user_profile_id']).user
        user.is_superuser = True
        user.save()

        url = reverse("country-partner-logo-list")
        logo = get_temp_image("logo")
        data = {
            "country": self.country.id,
            "image": logo
        }
        response = self.test_user_client.post(url, data)
        self.assertEqual(response.status_code, 201)

        url = reverse("country-partner-logo-detail", kwargs={"pk": response.json()["id"]})
        response = self.test_user_client.delete(url)
        self.assertEqual(response.status_code, 204)

    def test_retrieve_partnerlogos_list(self):
        url = reverse("country-detail", kwargs={"pk": self.country.id})
        response = self.test_user_client.get(url)
        self.assertEqual(response.status_code, 200)
        self.assertIn("partner_logos", response.json().keys())
        self.assertTrue(isinstance(response.json()['partner_logos'], list))

    def test_retrieve_country_field(self):
        url = reverse("country-fields-list", kwargs={"country_id": self.country.id})
        response = self.test_user_client.get(url)

        self.assertEqual(len(response.json()), 1)
        self.assertEqual(response.json()[0]['type'], 1)
        self.assertEqual(response.json()[0]['question'], "q1?")
        self.assertNotIn("answer", response.json()[0].keys())

    def test_create_country_fields_fake_project(self):
        url = reverse("country-fields", kwargs={"country_id": self.country.id, "project_id": 1, "mode": 'publish'})

        country_fields_data = {
            "fields": [{
                "country": self.country.id,
                "project": 1,
                "type": 1,
                "question": "q2?",
                "answer": "a2"
            }]
        }
        response = self.test_user_client.post(url, data=country_fields_data, format="json")
        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.json()['fields'], [{'project': ['Invalid pk "1" - object does not exist.']}])

    def test_create_country_fields_missing_project(self):
        url = reverse("country-fields", kwargs={"country_id": self.country.id, "project_id": 1, "mode": 'publish'})

        country_fields_data = {"fields": [{"country": self.country.id, "type": 1, "question": "q2?", "answer": "a2"}]}
        response = self.test_user_client.post(url, data=country_fields_data, format="json")
        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.json()['fields'], [{'non_field_errors': ['Project ID needs to be specified']}])

    def test_create_country_fields_empty_project(self):
        url = reverse("country-fields", kwargs={"country_id": self.country.id, "project_id": 1, "mode": 'publish'})

        country_fields_data = {
            "fields": [{
                "country": self.country.id,
                "type": 1,
                "project": "",
                "question": "q2?",
                "answer": "a2"
            }]
        }
        response = self.test_user_client.post(url, data=country_fields_data, format="json")
        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.json()['fields'], [{'project': ['Project ID needs to be specified']}])

    def test_create_country_fields_correct_project(self):
        CountryField.objects.create(country=self.country, type=1, question="q2?", schema=True)
        self.project = Project.objects.create(name="project1", data={"country": self.country.id})
        url = reverse("country-fields", kwargs={"country_id": self.country.id, "project_id": self.project.id,
                                                "mode": 'publish'})

        self.country_fields_data = {
            "fields": [{
                "country": self.country.id,
                "project": self.project.id,
                "type": 1,
                "question": "q2?",
                "answer": "a2"
            }]
        }
        response = self.test_user_client.post(url, data=self.country_fields_data, format="json")
        self.assertEqual(response.status_code, 201)
        self.assertEqual(response.json()['fields'][0]['country'], self.country_fields_data['fields'][0]['country'])
        self.assertEqual(response.json()['fields'][0]['project'], self.country_fields_data['fields'][0]['project'])
        self.assertEqual(response.json()['fields'][0]['type'], self.country_fields_data['fields'][0]['type'])
        self.assertEqual(response.json()['fields'][0]['question'], self.country_fields_data['fields'][0]['question'])
        self.assertEqual(response.json()['fields'][0]['answer'], self.country_fields_data['fields'][0]['answer'])

        cfs = CountryField.get_for_project(self.project)
        self.assertEqual(cfs[0].to_csv(), {'q2?': 'a2'})

    def test_create_country_fields_missing_answer(self):
        schema = CountryField.objects.create(country=self.country, type=1, question="q2?", schema=True)
        project = Project.objects.create(name="project1", data={"country": self.country.id})
        url = reverse("country-fields", kwargs={"country_id": self.country.id, "project_id": project.id,
                                                "mode": 'publish'})

        country_fields_data = {
            "fields": [{
                "country": self.country.id,
                "project": project.id,
                "type": 1,
                "question": "q2?"
            }]
        }
        response = self.test_user_client.post(url, data=country_fields_data, format="json")
        self.assertEqual(response.status_code, 201)
        self.assertEqual(response.json()['fields'], [
            {'schema_id': schema.id, 'country': self.country.id, 'type': 1,
             'question': 'q2?', 'answer': '', 'project': project.id}])

        country_fields_data = {
            "fields": [{
                "country": self.country.id,
                "project": project.id,
                "type": 1,
                "question": "q2?",
                "answers": None
            }]
        }
        response = self.test_user_client.post(url, data=country_fields_data, format="json")
        self.assertEqual(response.status_code, 201)
        self.assertEqual(response.json()['fields'], [
            {'schema_id': schema.id, 'country': self.country.id, 'type': 1,
             'question': 'q2?', 'answer': '', 'project': project.id}])

    def test_create_country_fields_missing_question(self):
        project = Project.objects.create(name="project1", data={"country": self.country.id})
        url = reverse("country-fields", kwargs={"country_id": self.country.id, "project_id": project.id,
                                                "mode": 'publish'})

        country_fields_data = {
            "fields": [{
                "country": self.country.id,
                "project": project.id,
                "type": 1,
                "answer": "a2"
            }]
        }
        response = self.test_user_client.post(url, data=country_fields_data, format="json")
        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.json()['fields'], [{'question': ['This field is required.']}])

    def test_create_country_fields_empty_question(self):
        project = Project.objects.create(name="project1", data={"country": self.country.id})
        url = reverse("country-fields", kwargs={"country_id": self.country.id, "project_id": project.id,
                                                "mode": 'publish'})

        country_fields_data = {
            "fields": [{
                "country": self.country.id,
                "project": project.id,
                "type": 1,
                "question": "",
                "answer": "a2"
            }]
        }
        response = self.test_user_client.post(url, data=country_fields_data, format="json")
        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.json()['fields'], [{'question': ['This field may not be blank.']}])

    def test_create_country_fields_missing_type(self):
        project = Project.objects.create(name="project1", data={"country": self.country.id})
        url = reverse("country-fields", kwargs={"country_id": self.country.id, "project_id": project.id,
                                                "mode": 'publish'})

        country_fields_data = {
            "fields": [{
                "country": self.country.id,
                "project": project.id,
                "question": "q2?",
                "answer": "a2"
            }]
        }
        response = self.test_user_client.post(url, data=country_fields_data, format="json")
        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.json()['fields'], [{'type': ['This field is required.']}])

    def test_create_country_fields_wrong_type(self):
        project = Project.objects.create(name="project1", data={"country": self.country.id})
        url = reverse("country-fields", kwargs={"country_id": self.country.id, "project_id": project.id,
                                                "mode": 'publish'})

        country_fields_data = {
            "fields": [{
                "country": self.country.id,
                "project": project.id,
                "type": "9",
                "question": "q2?",
                "answer": "a2"
            }]
        }
        response = self.test_user_client.post(url, data=country_fields_data, format="json")
        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.json()['fields'], [{'type': ['"9" is not a valid choice.']}])

    def test_create_country_fields_wrong_type_two(self):
        project = Project.objects.create(name="project1", data={"country": self.country.id})
        url = reverse("country-fields", kwargs={"country_id": self.country.id, "project_id": project.id,
                                                "mode": 'publish'})

        country_fields_data = {
            "fields": [{
                "country": self.country.id,
                "project": project.id,
                "type": 9,
                "question": "q2?",
                "answer": "a2"
            }]
        }
        response = self.test_user_client.post(url, data=country_fields_data, format="json")
        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.json()['fields'], [{'type': ['"9" is not a valid choice.']}])

    def test_create_draft_cf(self):
        project = Project.objects.create(name="project1", data={"country": self.country.id})
        url = reverse("country-fields", kwargs={"country_id": self.country.id, "project_id": project.id,
                                                "mode": 'draft'})

        country_fields_data = {
            "fields": [{
                "country": self.country.id,
                "project": project.id,
                "type": 4,
                "question": "q1?",
                "answer": "a9"
            }]
        }
        response = self.test_user_client.post(url, data=country_fields_data, format="json")
        self.assertEqual(response.status_code, 201)

        self.assertEqual(response.json()['fields'][0]['schema_id'], self.cf_schema.id)
        self.assertEqual(response.json()['fields'][0]['answer'], country_fields_data['fields'][0]['answer'])
        self.assertEqual(response.json()['fields'][0]['question'], country_fields_data['fields'][0]['question'])
        self.assertEqual(response.json()['fields'][0]['type'], country_fields_data['fields'][0]['type'])
        self.assertEqual(response.json()['fields'][0]['project'], project.id)
        self.assertEqual(response.json()['fields'][0]['country'], self.country.id)

    def test_create_publish_rewrites_draft(self):
        project = Project.objects.create(name="project1", data={"country": self.country.id})
        url = reverse("country-fields", kwargs={"country_id": self.country.id, "project_id": project.id,
                                                "mode": 'draft'})

        country_fields_data = {
            "fields": [{
                "country": self.country.id,
                "project": project.id,
                "type": 4,
                "question": "q1?",
                "answer": "a9"
            }]
        }
        response = self.test_user_client.post(url, data=country_fields_data, format="json")
        self.assertEqual(response.status_code, 201)
        self.assertEqual(response.json()['fields'][0]['schema_id'], self.cf_schema.id)
        self.assertEqual(response.json()['fields'][0]['answer'], country_fields_data['fields'][0]['answer'])

        url = reverse("country-fields", kwargs={"country_id": self.country.id, "project_id": project.id,
                                                "mode": 'publish'})

        country_fields_data2 = {
            "fields": [{
                "country": self.country.id,
                "project": project.id,
                "type": 4,
                "question": "q1?",
                "answer": "b9"
            }]
        }
        response = self.test_user_client.post(url, data=country_fields_data2, format="json")
        self.assertEqual(response.status_code, 201)
        self.assertEqual(response.json()['fields'][0]['schema_id'], self.cf_schema.id)
        self.assertEqual(response.json()['fields'][0]['answer'], country_fields_data2['fields'][0]['answer'])
        self.assertNotEqual(response.json()['fields'][0]['answer'], country_fields_data['fields'][0]['answer'])

    def test_create_single_selection(self):
        options = ["a1", "a2"]
        new_schema = CountryField.objects.create(options=options, country=self.country, type=1,
                                                 question="q2?", schema=True)
        project = Project.objects.create(name="project1", data={"country": self.country.id})
        url = reverse("country-fields", kwargs={"country_id": self.country.id, "project_id": project.id,
                                                "mode": 'draft'})

        country_fields_data = {
            "fields": [{
                "country": self.country.id,
                "project": project.id,
                "type": CountryField.SINGLE,
                "question": "q2?",
                "answer": "a1"
            }]
        }
        response = self.test_user_client.post(url, data=country_fields_data, format="json")
        self.assertEqual(response.status_code, 201)

        self.assertEqual(response.json()['fields'][0]['schema_id'], new_schema.id)
        self.assertEqual(response.json()['fields'][0]['answer'], country_fields_data['fields'][0]['answer'])
        self.assertEqual(response.json()['fields'][0]['question'], country_fields_data['fields'][0]['question'])
        self.assertEqual(response.json()['fields'][0]['type'], country_fields_data['fields'][0]['type'])
        self.assertEqual(response.json()['fields'][0]['project'], project.id)
        self.assertEqual(response.json()['fields'][0]['country'], self.country.id)

    def test_create_multi_selection(self):
        options = ["a1", "a2"]
        new_schema = CountryField.objects.create(options=options, country=self.country, type=CountryField.SINGLE,
                                                 question="q2?", schema=True)
        project = Project.objects.create(name="project1", data={"country": self.country.id})
        url = reverse("country-fields", kwargs={"country_id": self.country.id, "project_id": project.id,
                                                "mode": 'draft'})

        country_fields_data = {
            "fields": [{
                "country": self.country.id,
                "project": project.id,
                "type": CountryField.SINGLE,
                "question": "q2?",
                "answer": json.dumps(["a1", "a2", "a3"])
            }]
        }
        response = self.test_user_client.post(url, data=country_fields_data, format="json")
        self.assertEqual(response.status_code, 201)
        self.assertEqual(response.json()['fields'][0]['schema_id'], new_schema.id)
        self.assertEqual(response.json()['fields'][0]['answer'], country_fields_data['fields'][0]['answer'])
        self.assertEqual(response.json()['fields'][0]['question'], country_fields_data['fields'][0]['question'])
        self.assertEqual(response.json()['fields'][0]['type'], country_fields_data['fields'][0]['type'])
        self.assertEqual(response.json()['fields'][0]['project'], project.id)
        self.assertEqual(response.json()['fields'][0]['country'], self.country.id)

    def test_required_fields(self):
        new_schema = CountryField.objects.create(required=True, country=self.country, type=1,
                                                 question="q2?", schema=True)
        project = Project.objects.create(name="project1", data={"country": self.country.id})
        url = reverse("country-fields", kwargs={"country_id": self.country.id, "project_id": project.id,
                                                "mode": 'draft'})

        country_fields_data = {
            "fields": [{
                "country": self.country.id,
                "project": project.id,
                "type": CountryField.TEXT,
                "question": "q2?",
                "answer": ""
            }]
        }
        response = self.test_user_client.post(url, data=country_fields_data, format="json")
        self.assertEqual(response.status_code, 201)
        self.assertEqual(response.json()['fields'][0]['schema_id'], new_schema.id)
        self.assertEqual(response.json()['fields'][0]['answer'], country_fields_data['fields'][0]['answer'])
        self.assertEqual(response.json()['fields'][0]['question'], country_fields_data['fields'][0]['question'])
        self.assertEqual(response.json()['fields'][0]['type'], country_fields_data['fields'][0]['type'])
        self.assertEqual(response.json()['fields'][0]['project'], project.id)
        self.assertEqual(response.json()['fields'][0]['country'], self.country.id)

        publish_url = reverse("country-fields", kwargs={"country_id": self.country.id, "project_id": project.id,
                                                        "mode": 'publish'})
        response = self.test_user_client.post(publish_url, data=country_fields_data, format="json")
        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.json(), {'fields': [{'non_field_errors': ['Answer is required for: q2?']}]})

    def test_no_schema_present(self):
        project = Project.objects.create(name="project1", data={"country": self.country.id})
        url = reverse("country-fields", kwargs={"country_id": self.country.id, "project_id": project.id,
                                                "mode": 'draft'})

        country_fields_data = {
            "fields": [{
                "country": self.country.id,
                "project": project.id,
                "type": CountryField.TEXT,
                "question": "q2?",
                "answer": ""
            }]
        }
        response = self.test_user_client.post(url, data=country_fields_data, format="json")
        self.assertEqual(response.status_code, 400, response)
        self.assertEqual(response.json(), {'fields': [{'non_field_errors': ['No schema found for this answer']}]})

    def test_all_required_fields_are_required(self):
        new_schema1 = CountryField.objects.create(required=True, country=self.country, type=1,
                                                  question="q2?", schema=True)
        new_schema2 = CountryField.objects.create(required=True, country=self.country, type=1,
                                                  question="q3?", schema=True)
        project = Project.objects.create(name="project1", data={"country": self.country.id})
        url = reverse("country-fields", kwargs={"country_id": self.country.id, "project_id": project.id,
                                                "mode": 'publish'})

        country_fields_data = {
            "fields": [{
                "country": self.country.id,
                "project": project.id,
                "type": CountryField.TEXT,
                "question": "q2?",
                "answer": "a2"
            }]
        }
        response = self.test_user_client.post(url, data=country_fields_data, format="json")
        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.json(), {'fields': ['All required answers need to be given']})

        country_fields_data = {
            "fields": [{
                "country": self.country.id,
                "project": project.id,
                "type": CountryField.TEXT,
                "question": "q2?",
                "answer": "a2"
            }, {
                "country": self.country.id,
                "project": project.id,
                "type": CountryField.TEXT,
                "question": "q3?",
                "answer": "a3"
            }]
        }
        response = self.test_user_client.post(url, data=country_fields_data, format="json")
        self.assertEqual(response.status_code, 201)
        country_fields_data['fields'][0].update(schema_id=new_schema1.id)
        country_fields_data['fields'][1].update(schema_id=new_schema2.id)
        self.assertEqual(response.json(), country_fields_data)

    def test_update_answer(self):
        self.test_create_country_fields_correct_project()
        url = reverse("country-fields", kwargs={"country_id": self.country.id, "project_id": self.project.id,
                                                "mode": 'publish'})
        country_field_id = CountryField.objects.get(question="q2?", schema=False).id

        self.country_fields_data = {
            "fields": [{
                "country": self.country.id,
                "project": self.project.id,
                "type": 1,
                "question": "q2?",
                "answer": "a2_updated"
            }]
        }
        response = self.test_user_client.post(url, data=self.country_fields_data, format="json")

        country_field_updated_id = CountryField.objects.get(question="q2?", schema=False).id

        self.assertEqual(CountryField.objects.get(question="q2?", schema=False).__str__(), "")
        self.assertEqual(response.status_code, 201)
        self.assertEqual(country_field_id, country_field_updated_id)
        self.assertEqual(response.json()['fields'][0]['country'], self.country_fields_data['fields'][0]['country'])
        self.assertEqual(response.json()['fields'][0]['project'], self.country_fields_data['fields'][0]['project'])
        self.assertEqual(response.json()['fields'][0]['type'], self.country_fields_data['fields'][0]['type'])
        self.assertEqual(response.json()['fields'][0]['question'], self.country_fields_data['fields'][0]['question'])
        self.assertEqual(response.json()['fields'][0]['answer'], self.country_fields_data['fields'][0]['answer'])

    def test_country_export(self):

        country = Country.objects.create(name='country111', code='C2')
        project_data1 = {
            'contact_email':
            'foo1@gmail.com',
            'contact_name':
            'foo1',
            'country':
            country.id,
            'platforms': [
                {
                    'name':
                    'OpenSRP',
                    'strategies': [
                        'Transmit or manage out of pocket payments by client',
                        'Access by client to own medical records',
                        'Map location of health event'
                    ]
                },
            ],
            'interoperability_links': [
                {
                    "name": "Client Registry",
                    "selected": True,
                    "link": "http://blabla.com"
                },
                {
                    "name": "Health Worker Registry",
                    "selected": True,
                    "link": "http://example.org"
                },
            ]
        }
        project_data2 = {
            'contact_email':
            'foo2@gmail.com',
            'contact_name':
            'foo2',
            'country':
            country.id,
            'platforms': [{
                'name':
                'OpenSRP',
                'strategies':
                ['Transmit untargeted health promotion content to entire population', 'Transmit prescriptions orders']
            }, {
                'name':
                'Bamboo',
                'strategies': [
                    'Provide prompts and alerts based according to protocol',
                    'Consultations between remote client and healthcare provider'
                ]
            }],
            'interoperability_links': [
                {
                    "name": "Client Registry",
                    "selected": True,
                    "link": "http://blabla.com"
                },
                {
                    "name": "Health Management Information System (HMIS)",
                    "selected": True
                },
            ]
        }

        expected_data = {
            'country': 'country111',
            'country_code': 'C2',
            'interoperability_links': {
                '1': "Client Registry",
                '2': "Health Management Information System (HMIS)",
                '3': "Health Worker Registry",
            },
            'platforms': {
                '24': {
                    'name': 'OpenSRP',
                    'strategies': {
                        '132': 'Transmit or manage out of pocket payments by client',
                        '123': 'Access by client to own medical records',
                        '222': 'Map location of health event'
                    },
                    'owners': {
                        'foo1@gmail.com': 'foo1',
                        'foo2@gmail.com': 'foo2',
                    }
                },
                '2': {
                    'name': 'Bamboo',
                    'strategies': {
                        '144': 'Provide prompts and alerts based according to protocol',
                        '148': 'Consultations between remote client and healthcare provider'
                    },
                    'owners': {
                        'foo2@gmail.com': 'foo2',
                    }
                }
            }
        }
        Project.objects.create(name='proj1', data=project_data1)
        Project.objects.create(name='proj2', data=project_data2)
        response = self.client.get(reverse('country-export'))

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data[-1], expected_data)

    def test_create_retrieve_update_mapfile_noperm_fail(self):
        url = reverse('map-file-list')
        map_file = SimpleUploadedFile("file.txt", b"file_content")
        data = {
            'country': self.country.id,
            'map_file': map_file
        }
        response = self.test_user_client.post(url, data=data, format="multipart")
        self.assertEqual(response.status_code, 403)

    def test_create_retrieve_update_mapfile(self):
        UserProfile.objects.filter(id=self.test_user['user_profile_id']) \
            .update(account_type=UserProfile.COUNTRY_ADMIN, country=self.country)
        self.country.admins.add(self.test_user['user_profile_id'])

        url = reverse('map-file-list')
        map_file = SimpleUploadedFile("file.txt", b"file_content")
        data = {
            'country': self.country.id,
            'map_file': map_file
        }
        response = self.test_user_client.post(url, data=data, format="multipart")
        self.assertEqual(response.status_code, 201)
        self.assertEqual(response.json()['country'], self.country.id)

        map_file_id = response.json()['id']

        url = reverse('map-file-detail', kwargs={'pk': map_file_id})
        map_file2 = SimpleUploadedFile("file2.txt", b"file_content2")
        data = {
            'map_file': map_file2
        }
        response = self.test_user_client.patch(url, data=data, format="multipart")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()['country'], self.country.id)

        url = reverse('map-file-detail', kwargs={'pk': map_file_id})
        response = self.test_user_client.get(url)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()['country'], self.country.id)

        url = reverse("country-detail", kwargs={"pk": self.country.id})
        response = self.test_user_client.get(url)

        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.json()['map_files']), 1)
        self.assertEqual(response.json()['map_files'][0], map_file_id)

    def test_country_admin_update_map_data(self):
        UserProfile.objects.filter(id=self.test_user['user_profile_id']) \
            .update(account_type=UserProfile.SUPER_COUNTRY_ADMIN, country=self.country)
        self.country.super_admins.add(self.test_user['user_profile_id'])

        url = reverse("country-detail", kwargs={"pk": self.country.id})
        data = {
            "map_data": {
                "sub_level_name": "District",
                "sub_levels": [{
                    "name_en": "District 1",
                    "name_es": "Districto Uno"
                }, {
                    "name_en": "Disctrict 9"
                }]
            }
        }
        response = self.test_user_client.patch(url, data=data, format='json', HTTP_ACCEPT_LANGUAGE='en')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()["map_data"], data["map_data"])

    def test_country_map_download_success(self):
        url = reverse("country-map-download", kwargs={"country_id": Country.objects.all()[0].id})

        def mocked_request_get(*args, **kwargs):
            class MockResponse:
                def __init__(self, status_code):
                    self.status_code = status_code
                    self.content = None

                def raise_for_status(self):
                    pass

            return [MockResponse(args[0]), ]

        with patch('requests.get', side_effect=mocked_request_get(200)):
            response = self.test_user_client.get(url)

            self.assertEqual(response.status_code, 200)

    def test_country_map_download_wrong_country(self):
        url = reverse("country-map-download", kwargs={"country_id": Country.objects.all()[0].id})

        def mocked_request_get(*args, **kwargs):
            class MockResponse:
                def __init__(self, status_code):
                    self.status_code = status_code
                    self.content = b'Download failed'

                def raise_for_status(self):
                    raise RequestException

            return [MockResponse(args[0]), ]

        with patch('requests.get', side_effect=mocked_request_get(400)):
            response = self.test_user_client.get(url)

            self.assertEqual(response.status_code, 400)
            self.assertEqual(response.content, b'Download failed')

    def test_country_map_download_country_doesnt_exist(self):
        url = reverse("country-map-download", kwargs={"country_id": 999})
        response = self.test_user_client.get(url)
        self.assertEqual(response.status_code, 404)


class DonorTests(APITestCase):
    def setUp(self):
        # Create a test user with profile.
        url = reverse("rest_register")
        data = {"email": "test_user@gmail.com", "password1": "123456hetNYOLC", "password2": "123456hetNYOLC"}
        response = self.client.post(url, data)

        # Validate the account.
        key = EmailConfirmation.objects.get(email_address__email="test_user@gmail.com").key
        url = reverse("rest_verify_email")
        data = {
            "key": key,
        }
        response = self.client.post(url, data)

        # Log in the user.
        url = reverse("api_token_auth")
        data = {"username": "test_user@gmail.com", "password": "123456hetNYOLC"}
        response = self.client.post(url, data)
        self.test_user = response.json()
        self.test_user_key = response.json().get("token")
        self.test_user_client = APIClient(HTTP_AUTHORIZATION="Token {}".format(self.test_user_key))

        self.donor = Donor.objects.create(name="donor1")
        self.donor.name_en = 'Donor Group'
        self.donor.name_fr = 'Doner Grup'
        self.donor.save()
        DonorPartnerLogo.objects.create(donor=self.donor)

    def test_donor_model(self):
        with override('en'):
            self.assertEqual(self.donor.name, 'Donor Group')

        with override('fr'):
            self.assertEqual(self.donor.name, 'Doner Grup')

    def test_donor_model_str(self):
        self.assertEqual(str(self.donor), 'Donor Group')

    def test_retrieve_landing_detail(self):
        url = reverse("landing-donor-detail", kwargs={"pk": self.donor.id})
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)
        response_keys = response.json().keys()
        self.assertIn("name", response_keys)
        self.assertIn("logo", response_keys)
        self.assertIn("cover", response_keys)
        self.assertIn("cover_text", response_keys)
        self.assertIn("footer_text", response_keys)

    def test_retrieve_landing_list(self):
        url = reverse("landing-donor-list")
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)
        response_keys = response.json()[0].keys()
        self.assertIn("name", response_keys)
        self.assertIn("logo", response_keys)
        self.assertIn("cover", response_keys)
        self.assertIn("cover_text", response_keys)
        self.assertIn("footer_text", response_keys)

    def test_donor_admin_retrieve(self):
        url = reverse("donor-detail", kwargs={"pk": self.donor.id})
        response = self.test_user_client.get(url, HTTP_ACCEPT_LANGUAGE='en')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()['name'], 'Donor Group')
        response_keys = response.json().keys()
        self.assertIn("name", response_keys)
        self.assertIn("logo", response_keys)
        self.assertIn("cover", response_keys)
        self.assertIn("cover_text", response_keys)
        self.assertIn("footer_text", response_keys)

    def test_super_donor_admin_update(self):
        UserProfile.objects.filter(id=self.test_user['user_profile_id']).update(
            account_type=UserProfile.SUPER_DONOR_ADMIN, donor=self.donor)
        self.donor.super_admins.add(self.test_user['user_profile_id'])

        url = reverse("donor-detail", kwargs={"pk": self.donor.id})
        data = {
            "cover_text": "blah",
            "footer_text": "foo"
        }
        response = self.test_user_client.patch(url, data=data, HTTP_ACCEPT_LANGUAGE='en')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()["cover_text"], data["cover_text"])
        self.assertEqual(response.json()["footer_text"], data["footer_text"])

    def test_superuser_donor_admin_update(self):
        user = UserProfile.objects.get(id=self.test_user['user_profile_id']).user
        user.is_superuser = True
        user.save()

        url = reverse("donor-detail", kwargs={"pk": self.donor.id})
        data = {
            "cover_text": "blah",
            "footer_text": "foo"
        }
        response = self.test_user_client.patch(url, data=data, HTTP_ACCEPT_LANGUAGE='en')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()["cover_text"], data["cover_text"])
        self.assertEqual(response.json()["footer_text"], data["footer_text"])

    def test_donor_admin_update_fields_fails(self):
        UserProfile.objects.filter(id=self.test_user['user_profile_id']).update(
            account_type=UserProfile.DONOR_ADMIN, donor=self.donor)
        self.donor.admins.add(self.test_user['user_profile_id'])

        url = reverse("donor-detail", kwargs={"pk": self.donor.id})
        data = {
            "cover_text": "blah",
            "footer_text": "foo"
        }
        response = self.test_user_client.patch(url, data=data, HTTP_ACCEPT_LANGUAGE='en')
        self.assertEqual(response.status_code, 200)
        self.assertNotEqual(response.json()["cover_text"], data["cover_text"])
        self.assertNotEqual(response.json()["footer_text"], data["footer_text"])

    def test_donor_admin_update_noperm_fails(self):
        url = reverse("donor-detail", kwargs={"pk": self.donor.id})
        data = {
            "cover_text": "blah",
            "footer_text": "foo"
        }
        response = self.test_user_client.patch(url, data=data, HTTP_ACCEPT_LANGUAGE='en')
        self.assertEqual(response.status_code, 403)

    def test_donor_admin_update_images_noperm_fail(self):
        url = reverse("donor-image-detail", kwargs={"pk": self.donor.id})
        cover = get_temp_image("cover")
        logo = get_temp_image("logo")
        data = {
            "cover": cover,
            "logo": logo
        }
        response = self.test_user_client.patch(url, data=data, format='multipart', HTTP_ACCEPT_LANGUAGE='en')
        self.assertEqual(response.status_code, 403)

    def test_donor_admin_update_images(self):
        UserProfile.objects.filter(id=self.test_user['user_profile_id']).update(
            account_type=UserProfile.SUPER_DONOR_ADMIN, donor=self.donor)
        self.donor.super_admins.add(self.test_user['user_profile_id'])

        url = reverse("donor-image-detail", kwargs={"pk": self.donor.id})
        cover = get_temp_image("cover")
        logo = get_temp_image("logo")
        data = {
            "cover": cover,
            "logo": logo
        }
        response = self.test_user_client.patch(url, data=data, format='multipart', HTTP_ACCEPT_LANGUAGE='en')
        self.assertEqual(response.status_code, 200)

    def test_donor_superuser_update_images(self):
        user = UserProfile.objects.get(id=self.test_user['user_profile_id']).user
        user.is_superuser = True
        user.save()

        url = reverse("donor-image-detail", kwargs={"pk": self.donor.id})
        cover = get_temp_image("cover")
        logo = get_temp_image("logo")
        data = {
            "cover": cover,
            "logo": logo
        }
        response = self.test_user_client.patch(url, data=data, format='multipart', HTTP_ACCEPT_LANGUAGE='en')
        self.assertEqual(response.status_code, 200)

    def test_donor_admin_retrieve_admin_requests(self):
        UserProfile.objects.filter(id=self.test_user['user_profile_id']).update(
            account_type=UserProfile.DONOR_ADMIN, donor=self.donor)
        self.donor.admins.add(self.test_user['user_profile_id'])

        user1 = User.objects.create(username="test1", password="12345678")
        userprofile1 = UserProfile.objects.create(user=user1, name="test1", donor=self.donor,
                                                  account_type=UserProfile.DONOR)
        user2 = User.objects.create(username="test2", password="12345678")
        userprofile2 = UserProfile.objects.create(user=user2, name="test2", donor=self.donor,
                                                  account_type=UserProfile.DONOR_ADMIN)

        url = reverse("donor-detail", kwargs={"pk": self.donor.id})
        response = self.test_user_client.get(url, HTTP_ACCEPT_LANGUAGE='en')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()["user_requests"][0]['id'], userprofile1.id)
        self.assertEqual(response.json()["admin_requests"][0]['id'], userprofile2.id)
        self.assertEqual(response.json()["super_admin_requests"], [])

    def test_donor_admin_retrieve_super_admin_requests(self):
        UserProfile.objects.filter(id=self.test_user['user_profile_id']).update(
            account_type=UserProfile.SUPER_DONOR_ADMIN, donor=self.donor)
        self.donor.super_admins.add(self.test_user['user_profile_id'])

        user1 = User.objects.create(username="test1", password="12345678")
        userprofile1 = UserProfile.objects.create(user=user1, name="test1", donor=self.donor,
                                                  account_type=UserProfile.DONOR)
        user2 = User.objects.create(username="test2", password="12345678")
        userprofile2 = UserProfile.objects.create(user=user2, name="test2", donor=self.donor,
                                                  account_type=UserProfile.DONOR_ADMIN)
        user3 = User.objects.create(username="test3", password="12345678")
        userprofile3 = UserProfile.objects.create(user=user3, name="test3", donor=self.donor,
                                                  account_type=UserProfile.SUPER_DONOR_ADMIN)

        url = reverse("donor-detail", kwargs={"pk": self.donor.id})
        response = self.test_user_client.get(url, HTTP_ACCEPT_LANGUAGE='en')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()["user_requests"][0]['id'], userprofile1.id)
        self.assertEqual(response.json()["admin_requests"][0]['id'], userprofile2.id)
        self.assertEqual(response.json()["super_admin_requests"][0]['id'], userprofile3.id)

    def test_donor_superuser_retrieve_super_admin_requests(self):
        user = UserProfile.objects.get(id=self.test_user['user_profile_id']).user
        user.is_superuser = True
        user.save()

        user1 = User.objects.create(username="test1", password="12345678")
        userprofile1 = UserProfile.objects.create(user=user1, name="test1", donor=self.donor,
                                                  account_type=UserProfile.DONOR)
        user2 = User.objects.create(username="test2", password="12345678")
        userprofile2 = UserProfile.objects.create(user=user2, name="test2", donor=self.donor,
                                                  account_type=UserProfile.DONOR_ADMIN)
        user3 = User.objects.create(username="test3", password="12345678")
        userprofile3 = UserProfile.objects.create(user=user3, name="test3", donor=self.donor,
                                                  account_type=UserProfile.SUPER_DONOR_ADMIN)

        url = reverse("donor-detail", kwargs={"pk": self.donor.id})
        response = self.test_user_client.get(url, HTTP_ACCEPT_LANGUAGE='en')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()["user_requests"][0]['id'], userprofile1.id)
        self.assertEqual(response.json()["admin_requests"][0]['id'], userprofile2.id)
        self.assertEqual(response.json()["super_admin_requests"][0]['id'], userprofile3.id)

    def test_donor_admin_assign_users_send_email(self):
        UserProfile.objects.filter(id=self.test_user['user_profile_id']).update(
            account_type=UserProfile.SUPER_DONOR_ADMIN, donor=self.donor)
        self.donor.super_admins.add(self.test_user['user_profile_id'])

        user1 = User.objects.create(username="test1", password="12345678", email="test1@foo.com")
        userprofile1 = UserProfile.objects.create(user=user1, name="test1", donor=self.donor,
                                                  account_type=UserProfile.DONOR)
        user2 = User.objects.create(username="test2", password="12345678", email="test2@foo.com")
        userprofile2 = UserProfile.objects.create(user=user2, name="test2", donor=self.donor,
                                                  account_type=UserProfile.DONOR_ADMIN)
        user3 = User.objects.create(username="test3", password="12345678", email="test3@foo.com")
        userprofile3 = UserProfile.objects.create(user=user3, name="test3", donor=self.donor,
                                                  account_type=UserProfile.SUPER_DONOR_ADMIN)
        user4 = User.objects.create(username="test4", password="12345678", email="test4@foo.com")
        userprofile4 = UserProfile.objects.create(user=user4, name="test4", donor=self.donor,
                                                  account_type=UserProfile.SUPER_DONOR_ADMIN, language='fr')

        url = reverse("donor-detail", kwargs={"pk": self.donor.id})
        data = {
            "users": [userprofile1.id],
            "admins": [userprofile2.id],
            "super_admins": [userprofile3.id, userprofile4.id]
        }
        response = self.test_user_client.patch(url, data=data, format='json', HTTP_ACCEPT_LANGUAGE='en')
        self.assertEqual(response.status_code, 200)

        outgoing_emails = [m.message() for m in mail.outbox if 'You have been selected' in m.message().as_string()]

        self.assertEqual(len(outgoing_emails), 4)

        outgoing_en_email_text = outgoing_emails[0].as_string()
        self.assertTrue("test1@foo.com" in outgoing_emails[0].values())
        self.assertTrue('You have been selected as User for {}'.format(self.donor.name) in outgoing_en_email_text)
        self.assertTrue('/admin/country/country/{}/change/'.format(self.donor.id) in outgoing_en_email_text)
        self.assertIn('<meta http-equiv="content-language" content="en">', outgoing_en_email_text)
        self.assertNotIn('{{', outgoing_en_email_text)

        outgoing_en_email_text = outgoing_emails[1].as_string()
        self.assertTrue("test2@foo.com" in outgoing_emails[1].values())
        self.assertTrue('You have been selected as Admin for {}'.format(self.donor.name) in outgoing_en_email_text)
        self.assertTrue('/admin/country/country/{}/change/'.format(self.donor.id) in outgoing_en_email_text)
        self.assertIn('<meta http-equiv="content-language" content="en">', outgoing_en_email_text)
        self.assertNotIn('{{', outgoing_en_email_text)

        outgoing_en_email_text = outgoing_emails[2].as_string()
        self.assertTrue("test3@foo.com" in outgoing_emails[2].values())
        self.assertTrue('You have been selected as Super Admin for {}'.format(self.donor.name)
                        in outgoing_en_email_text)
        self.assertTrue('/admin/country/country/{}/change/'.format(self.donor.id) in outgoing_en_email_text)
        self.assertIn('<meta http-equiv="content-language" content="en">', outgoing_en_email_text)
        self.assertNotIn('{{', outgoing_en_email_text)

        outgoing_fr_email_text = outgoing_emails[3].as_string()
        self.assertTrue("test4@foo.com" in outgoing_emails[3].values())
        self.assertIn('<meta http-equiv="content-language" content="fr">', outgoing_fr_email_text)
        self.assertNotIn('{{', outgoing_fr_email_text)

    def test_donor_admin_update_users_remove_from_other_group(self):
        UserProfile.objects.filter(id=self.test_user['user_profile_id']).update(
            account_type=UserProfile.SUPER_DONOR_ADMIN, donor=self.donor)
        self.donor.super_admins.add(self.test_user['user_profile_id'])

        url = reverse("donor-detail", kwargs={"pk": self.donor.id})

        user1 = User.objects.create(username="test1", password="12345678")
        userprofile1 = UserProfile.objects.create(user=user1, name="test1", donor=self.donor,
                                                  account_type=UserProfile.DONOR)
        data = {
            "users": [userprofile1.id]
        }
        response = self.test_user_client.patch(url, data=data, format='multipart', HTTP_ACCEPT_LANGUAGE='en')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()['users'], [userprofile1.id])

        UserProfile.objects.filter(id=userprofile1.id).update(account_type=UserProfile.DONOR_ADMIN)
        data = {
            "admins": [userprofile1.id]
        }
        response = self.test_user_client.patch(url, data=data, format='multipart', HTTP_ACCEPT_LANGUAGE='en')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()['users'], [])
        self.assertEqual(response.json()['admins'], [userprofile1.id])

        UserProfile.objects.filter(id=userprofile1.id).update(account_type=UserProfile.SUPER_DONOR_ADMIN)
        data = {
            "super_admins": [userprofile1.id]
        }
        response = self.test_user_client.patch(url, data=data, format='multipart', HTTP_ACCEPT_LANGUAGE='en')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()['users'], [])
        self.assertEqual(response.json()['admins'], [])
        self.assertEqual(response.json()['super_admins'], [userprofile1.id])

    def test_country_admin_update_super_admin_without_perm(self):
        UserProfile.objects.filter(id=self.test_user['user_profile_id']).update(
            account_type=UserProfile.DONOR_ADMIN, donor=self.donor)
        self.donor.admins.add(self.test_user['user_profile_id'])

        url = reverse("donor-detail", kwargs={"pk": self.donor.id})

        user1 = User.objects.create(username="test1", password="12345678")
        userprofile1 = UserProfile.objects.create(user=user1, name="test1", donor=self.donor,
                                                  account_type=UserProfile.SUPER_DONOR_ADMIN)
        data = {
            "super_admins": [userprofile1.id],
        }
        response = self.test_user_client.patch(url, data=data, HTTP_ACCEPT_LANGUAGE='en')
        self.assertEqual(response.status_code, 200)
        self.donor.refresh_from_db()
        self.assertTrue(userprofile1.id not in self.donor.super_admins.all())

    def test_donor_partner_logos_create_get(self):
        UserProfile.objects.filter(id=self.test_user['user_profile_id']).update(
            account_type=UserProfile.SUPER_DONOR_ADMIN, donor=self.donor)
        self.donor.super_admins.add(self.test_user['user_profile_id'])

        url = reverse("donor-partner-logo-list")
        logo = get_temp_image("logo")
        data = {
            "donor": self.donor.id,
            "image": logo
        }
        response = self.test_user_client.post(url, data)
        self.assertEqual(response.status_code, 201)

    def test_donor_superuser_partner_logos_create_get(self):
        user = UserProfile.objects.get(id=self.test_user['user_profile_id']).user
        user.is_superuser = True
        user.save()

        url = reverse("donor-partner-logo-list")
        logo = get_temp_image("logo")
        data = {
            "donor": self.donor.id,
            "image": logo
        }
        response = self.test_user_client.post(url, data)
        self.assertEqual(response.status_code, 201)

    def test_donor_superuser_partner_logos_delete(self):
        user = UserProfile.objects.get(id=self.test_user['user_profile_id']).user
        user.is_superuser = True
        user.save()

        url = reverse("donor-partner-logo-list")
        logo = get_temp_image("logo")
        data = {
            "donor": self.donor.id,
            "image": logo
        }
        response = self.test_user_client.post(url, data)
        self.assertEqual(response.status_code, 201)

        url = reverse("donor-partner-logo-detail", kwargs={"pk": response.json()["id"]})
        response = self.test_user_client.delete(url)
        self.assertEqual(response.status_code, 204)

    def test_donor_partner_logos_list(self):
        UserProfile.objects.filter(id=self.test_user['user_profile_id']).update(
            account_type=UserProfile.SUPER_DONOR_ADMIN, donor=self.donor)
        self.donor.super_admins.add(self.test_user['user_profile_id'])

        url = reverse("donor-partner-logo-list")
        logo1 = get_temp_image("donorlogo1")
        data = {
            "donor": self.donor.id,
            "image": logo1
        }
        response = self.test_user_client.post(url, data)
        self.assertEqual(response.status_code, 201)
        logo2 = get_temp_image("donorlogo2")
        data = {
            "donor": self.donor.id,
            "image": logo2
        }
        response = self.test_user_client.post(url, data)
        self.assertEqual(response.status_code, 201)

        url = reverse("donor-detail", kwargs={"pk": self.donor.id})
        response = self.test_user_client.get(url, HTTP_ACCEPT_LANGUAGE='en')

        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.json()['partner_logos']), 3)
        self.assertEqual(response.json()['partner_logos'][1]['donor'], self.donor.id)
        self.assertEqual(response.json()['partner_logos'][1]['image'], 'http://testserver/media/donorlogo1.png')
        self.assertEqual(response.json()['partner_logos'][2]['donor'], self.donor.id)
        self.assertEqual(response.json()['partner_logos'][2]['image'], 'http://testserver/media/donorlogo2.png')

    def test_donor_partner_logos_delete(self):
        UserProfile.objects.filter(id=self.test_user['user_profile_id']).update(
            account_type=UserProfile.SUPER_DONOR_ADMIN, donor=self.donor)
        self.donor.super_admins.add(self.test_user['user_profile_id'])

        url = reverse("donor-partner-logo-list")
        logo = get_temp_image("logo")
        data = {
            "donor": self.donor.id,
            "image": logo
        }
        response = self.test_user_client.post(url, data)
        self.assertEqual(response.status_code, 201)

        url = reverse("donor-partner-logo-detail", kwargs={"pk": response.json()["id"]})
        response = self.test_user_client.delete(url)
        self.assertEqual(response.status_code, 204)


class MockRequest:
    pass


class CountryAdminTests(TestCase):
    def setUp(self):
        self.site = AdminSite()
        self.request = MockRequest()
        self.user = User.objects.create(username="alma", password="korte", email="test@test.com")

    def test_superuser_can_see_every_country(self):
        ma = CountryAdmin(Country, self.site)
        self.user.is_superuser = True
        self.user.is_staff = True
        self.user.save()
        self.request.user = self.user
        self.assertEqual(ma.get_list_display(self.request), ('name', 'code', 'project_approval'))
        self.assertEqual(ma.get_queryset(self.request).count(), Country.objects.all().count())

    def test_superuser_readonlies(self):
        ma = CountryAdmin(Country, self.site)
        self.user.is_superuser = True
        self.user.is_staff = True
        self.user.save()
        self.request.user = self.user
        self.assertEqual(ma.get_readonly_fields(self.request), (
            'code',
            'name'
        ))

    def test_country_field_inlines(self):
        user_profile = UserProfile.objects.create(user=self.user)
        country = Country.objects.create(name="Country1", code="CC1")
        country.users.add(user_profile)
        CountryField.objects.create(country=country, type=1, question="q1?", schema=True)
        CountryField.objects.create(country=country, type=1, question="q2?", schema=False)
        ma = CountryAdmin(Country, self.site)
        self.user.is_superuser = True
        self.user.is_staff = True
        self.user.save()
        self.request.user = self.user

        formsets_and_inlines = list(ma.get_formsets_with_inlines(self.request))
        countryfield_formset_and_inline = formsets_and_inlines[-1]
        countryfield_inline = countryfield_formset_and_inline[1]

        addcountryfield_formset_and_inline = formsets_and_inlines[-2]
        addcountryfield_inline = addcountryfield_formset_and_inline[1]

        self.assertEqual(countryfield_inline.get_readonly_fields(self.request), ('type', 'question'))
        self.assertEqual(countryfield_inline.get_queryset(self.request).count(), 1)

        self.assertEqual(addcountryfield_inline.get_readonly_fields(self.request), ())
        self.assertEqual(addcountryfield_inline.get_queryset(self.request).count(), 0)

    def test_country_get_fields(self):
        ma = CountryAdmin(Country, self.site)
        self.user.is_superuser = True
        self.user.is_staff = True
        self.user.save()
        self.request.user = self.user
        self.assertTrue('map_data' not in ma.get_fields(self.request))


class CountryManagementCommandTest(TestCase):
    null_topo = os.path.join(settings.STATIC_ROOT, 'country-geodata', 'null.json')
    backup_folder = os.path.join(settings.MEDIA_ROOT, 'topojson-backups')

    def setUp(self):
        call_command('loaddata', 'null_land.json', verbosity=0)
        try:
            open(self.null_topo, 'x')
        except Exception:  # pragma: no cover
            pass

    def tearDown(self):
        if os.path.isfile(self.null_topo):  # pragma: no cover
            os.remove(self.null_topo)
        for file in os.listdir(self.backup_folder):
            if fnmatch(file, '*null.json'):
                os.remove(os.path.join(self.backup_folder, file))

    def test_country_management_command_clean_maps(self):

        out = StringIO()
        call_command('clean_maps', stdout=out)
        output = out.getvalue().strip()
        self.assertEqual(output, 'No country code provided')

        out = StringIO()
        call_command('clean_maps', 'something', stdout=out)
        output = out.getvalue().strip()
        self.assertEqual(output, 'Selected country does not exist or it does not have an associated MapFile')

        out = StringIO()
        call_command('clean_maps', 'NULL', stdout=out)
        output = out.getvalue().strip()
        self.assertEqual(output, 'Removing unused features from Null Land geojson')

        topo_stats = os.stat(self.null_topo)
        self.assertTrue(topo_stats.st_size > 10)
