from django.urls import reverse

from core.tests import get_temp_image
from country.tests.base import DonorBaseTests
from user.models import UserProfile


class DonorImageTests(DonorBaseTests):

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
