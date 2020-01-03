from allauth.account.models import EmailConfirmation
from django.contrib.auth.models import User
from django.core import mail
from django.urls import reverse
from django.utils.translation import override
from rest_framework.test import APITestCase, APIClient

from core.tests import get_temp_image
from country.models import Donor, DonorPartnerLogo
from user.models import UserProfile


class DonorTests(APITestCase):
    def setUp(self):
        # Create a test user with profile.
        url = reverse("rest_register")
        data = {"email": "test_user@gmail.com", "password1": "123456hetNYOLC", "password2": "123456hetNYOLC"}
        self.client.post(url, data)

        # Validate the account.
        key = EmailConfirmation.objects.get(email_address__email="test_user@gmail.com").key
        url = reverse("rest_verify_email")
        data = {
            "key": key,
        }
        self.client.post(url, data)

        # Log in the user.
        url = reverse("api_token_auth")
        data = {"username": "test_user@gmail.com", "password": "123456hetNYOLC"}
        response = self.client.post(url, data)
        self.test_user = response.json()
        self.test_user_key = response.json().get("token")
        self.test_user_client = APIClient(HTTP_AUTHORIZATION="Token {}".format(self.test_user_key))

        self.donor = Donor.objects.create(name="donor1", code="donor1")
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
        self.assertIn("code", response_keys)
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
        self.assertIn("code", response_keys)
        self.assertIn("id", response_keys)

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
        self.assertTrue('You have been selected as Viewer for {}'.format(self.donor.name) in outgoing_en_email_text)
        self.assertTrue('/en/-/admin/donor' in outgoing_en_email_text)
        self.assertIn('<meta http-equiv="content-language" content="en">', outgoing_en_email_text)
        self.assertNotIn('{{', outgoing_en_email_text)

        outgoing_en_email_text = outgoing_emails[1].as_string()
        self.assertTrue("test2@foo.com" in outgoing_emails[1].values())
        self.assertTrue('You have been selected as Admin for {}'.format(self.donor.name) in outgoing_en_email_text)
        self.assertTrue('/en/-/admin/donor' in outgoing_en_email_text)
        self.assertIn('<meta http-equiv="content-language" content="en">', outgoing_en_email_text)
        self.assertNotIn('{{', outgoing_en_email_text)

        outgoing_en_email_text = outgoing_emails[2].as_string()
        self.assertTrue("test3@foo.com" in outgoing_emails[2].values())
        self.assertTrue('You have been selected as System Admin for {}'.format(self.donor.name)
                        in outgoing_en_email_text)
        self.assertTrue('/en/-/admin/donor' in outgoing_en_email_text)
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
