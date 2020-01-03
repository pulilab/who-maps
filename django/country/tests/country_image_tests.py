from django.urls import reverse

from core.tests import get_temp_image
from country.tests.base import CountryBaseTests
from user.models import UserProfile


class CountryImageTests(CountryBaseTests):

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
