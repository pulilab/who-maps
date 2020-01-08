from unittest import mock

from django.test import override_settings
from django.urls import reverse
from rest_framework import status

from country.models import Country
from country.tasks import update_gdhi_data_task
from country.tests.base import CountryBaseTests
from user.models import UserProfile


class CountryGDHITests(CountryBaseTests):

    def test_country_admin_tries_to_update_country_gdhi_data(self):
        user_profile = UserProfile.objects.get(id=self.test_user['user_profile_id'])
        user_profile.account_type = 'CA'
        user_profile.save()

        country = Country.objects.get(code='AF')
        country.admins.add(self.test_user['user_profile_id'])

        self.assertEqual(country.total_population, None)
        self.assertEqual(country.gni_per_capita, None)
        self.assertEqual(country.leadership_and_governance, None)

        url = reverse("country-detail", args=[country.id])
        data = {
            'total_population': 34.66,
            'gni_per_capita': 0.58,
            'leadership_and_governance': 3,
        }
        response = self.test_user_client.patch(url, data)
        self.assertEqual(response.status_code, status.HTTP_200_OK, response.json())
        # the values should be the same as before
        country.refresh_from_db()
        self.assertEqual(country.total_population, None)
        self.assertEqual(country.gni_per_capita, None)
        self.assertEqual(country.leadership_and_governance, None)

    @override_settings(ENABLE_GDHI_UPDATE_ON_COUNTRY_SAVE=True)
    @mock.patch('country.models.update_gdhi_data_task.apply_async')
    def test_update_gdhi_called_in_post_save(self, update_gdhi_task):
        update_gdhi_task.return_value = None

        country = Country.objects.get(code='AF')
        country.total_population = 34.5
        country.save()

        call_args_list = update_gdhi_task.call_args_list
        self.assertEqual(call_args_list[0][0][0][0], 'AF')
        self.assertEqual(call_args_list[0][0][0][1], True)

    @mock.patch('country.tasks.call_command')
    def test_update_gdhi_data_task(self, call_command):
        call_command.return_value = None

        update_gdhi_data_task.apply(('AF', True))

        call_args_list = call_command.call_args_list
        self.assertIn('gdhi', call_args_list[0][0])
        self.assertEqual(call_args_list[0][1]['country_code'], 'AF')
        self.assertEqual(call_args_list[0][1]['override'], True)
