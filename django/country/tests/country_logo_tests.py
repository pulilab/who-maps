from django.urls import reverse

from core.tests import get_temp_image
from country.tests.base import CountryBaseTests
from user.models import UserProfile


class CountryLogoTests(CountryBaseTests):

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
