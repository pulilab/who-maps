from django.urls import reverse

from core.tests import get_temp_image
from country.tests.base import DonorBaseTests
from user.models import UserProfile


class DonorLogoTests(DonorBaseTests):

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
