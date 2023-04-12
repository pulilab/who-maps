from collections import defaultdict
from copy import copy
from datetime import datetime
from unittest.mock import patch

from django.urls import reverse
from django.utils.translation import override
from django.core.files.uploadedfile import SimpleUploadedFile
from django.utils.dateformat import format
from requests import RequestException

from core.factories import UserFactory, UserProfileFactory, OrganisationFactory, DonorFactory, \
    TechnologyPlatformFactory, DigitalStrategyFactory, CountryFactory
from country.tests.base import CountryBaseTests
from django.core import mail

from country.models import Country, CustomQuestion
from project.models import DigitalStrategy
from user.models import UserProfile


class CountryTests(CountryBaseTests):

    def test_country_model(self):
        with override('en'):
            self.assertEqual(self.country.name, 'Hungary')

        with override('fr'):
            self.assertEqual(self.country.name, 'Hongrie')

    def test_country_model_str(self):
        self.assertEqual(str(self.country), 'Hungary')

    def test_retrieve_landing_detail(self):
        url = reverse("landing-country-detail", kwargs={"pk": self.country.id})
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
        self.assertIn("id", response_keys)

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
        country2 = CountryFactory(name="country2", code="CC2")
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

    def test_country_admin_retrieve_admin_requests(self):
        UserProfile.objects.filter(id=self.test_user['user_profile_id']).update(account_type=UserProfile.COUNTRY_ADMIN,
                                                                                country=self.country)
        self.country.admins.add(self.test_user['user_profile_id'])

        user1 = UserFactory(username='test1', password='12345678')
        userprofile1 = UserProfileFactory(user=user1, name="test1", country=self.country,
                                          account_type=UserProfile.GOVERNMENT)
        user2 = UserFactory(username='test2', password='12345678')
        userprofile2 = UserProfileFactory(user=user2, name="test2", country=self.country,
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

        user1 = UserFactory(username='test1', password='12345678')
        userprofile1 = UserProfileFactory(user=user1, name="test1", country=self.country,
                                          account_type=UserProfile.GOVERNMENT)
        user2 = UserFactory(username='test2', password='12345678')
        userprofile2 = UserProfileFactory(user=user2, name="test2", country=self.country,
                                          account_type=UserProfile.COUNTRY_ADMIN)
        user3 = UserFactory(username='test3', password='12345678')
        userprofile3 = UserProfileFactory(user=user3, name="test3", country=self.country,
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

        user1 = UserFactory(username='test1', password='12345678')
        userprofile1 = UserProfileFactory(user=user1, name="test1", country=self.country,
                                          account_type=UserProfile.GOVERNMENT)
        user2 = UserFactory(username='test2', password='12345678')
        userprofile2 = UserProfileFactory(user=user2, name="test2", country=self.country,
                                          account_type=UserProfile.COUNTRY_ADMIN)
        user3 = UserFactory(username='test3', password='12345678')
        userprofile3 = UserProfileFactory(user=user3, name="test3", country=self.country,
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

        user1 = UserFactory(username='test1', password='12345678', email='test1@foo.com')
        userprofile1 = UserProfileFactory(user=user1, name="test1", country=self.country,
                                          account_type=UserProfile.GOVERNMENT)
        user2 = UserFactory(username='test2', password='12345678', email='test2@foo.com')
        userprofile2 = UserProfileFactory(user=user2, name="test2", country=self.country,
                                          account_type=UserProfile.COUNTRY_ADMIN)
        user3 = UserFactory(username='test3', password='12345678', email='test3@foo.com')
        userprofile3 = UserProfileFactory(user=user3, name="test3", country=self.country,
                                          account_type=UserProfile.SUPER_COUNTRY_ADMIN)
        user4 = UserFactory(username='test4', password='12345678', email='test4@foo.com')
        userprofile4 = UserProfileFactory(user=user4, name="test4", country=self.country,
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

        outgoing_emails_dict = defaultdict()
        for email in outgoing_emails:
            outgoing_emails_dict[email['To']] = email

        message = outgoing_emails_dict[user1.email]
        outgoing_en_email_text = message.as_string()
        self.assertTrue("test1@foo.com" in message.values())
        self.assertTrue('You have been selected as Viewer for {}'.format(self.country.name) in outgoing_en_email_text)
        self.assertTrue('/en/-/admin/country' in outgoing_en_email_text)
        self.assertIn('<meta http-equiv="content-language" content="en">', outgoing_en_email_text)
        self.assertNotIn('{{', outgoing_en_email_text)

        message = outgoing_emails_dict[user2.email]
        outgoing_en_email_text = message.as_string()
        self.assertTrue("test2@foo.com" in message.values())
        self.assertTrue('You have been selected as Admin for {}'.format(self.country.name) in outgoing_en_email_text)
        self.assertTrue('/en/-/admin/country' in outgoing_en_email_text)
        self.assertIn('<meta http-equiv="content-language" content="en">', outgoing_en_email_text)
        self.assertNotIn('{{', outgoing_en_email_text)

        message = outgoing_emails_dict[user3.email]
        outgoing_en_email_text = message.as_string()
        self.assertTrue("test3@foo.com" in message.values())
        self.assertTrue('You have been selected as the <b>System Admin</b> within the Digital Health Atlas for ' +
                        '<b>{}</b>. Use the link below to begin updating your country information.'.format(
                            self.country.name)
                        in outgoing_en_email_text)
        self.assertTrue('/en/-/admin/country' in outgoing_en_email_text)
        self.assertIn('<meta http-equiv="content-language" content="en">', outgoing_en_email_text)
        self.assertNotIn('{{', outgoing_en_email_text)

        message = outgoing_emails_dict[user4.email]
        outgoing_fr_email_text = message.as_string()
        self.assertTrue("test4@foo.com" in message.values())
        self.assertIn('<meta http-equiv="content-language" content="fr">', outgoing_fr_email_text)
        self.assertNotIn('{{', outgoing_fr_email_text)

    def test_country_admin_update_remove_ser_puts_back_to_requested(self):
        UserProfile.objects.filter(id=self.test_user['user_profile_id']).update(
            account_type=UserProfile.SUPER_COUNTRY_ADMIN, country=self.country)
        self.country.super_admins.add(self.test_user['user_profile_id'])

        user1 = UserFactory(username='test1', password='12345678')
        userprofile1 = UserProfileFactory(user=user1, name="test1", country=self.country,
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
        response = self.test_user_client.patch(url, data=data, format='json', HTTP_ACCEPT_LANGUAGE='en')
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

        user1 = UserFactory(username='test1', password='12345678')
        userprofile1 = UserProfileFactory(user=user1, name="test1", country=self.country,
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

        user1 = UserFactory(username='test1', password='12345678')
        userprofile1 = UserProfileFactory(user=user1, name="test1", country=self.country,
                                          account_type=UserProfile.SUPER_COUNTRY_ADMIN)
        data = {
            "super_admins": [userprofile1.id],
        }
        response = self.test_user_client.patch(url, data=data, HTTP_ACCEPT_LANGUAGE='en')
        self.assertEqual(response.status_code, 200)
        self.country.refresh_from_db()
        self.assertTrue(userprofile1.id not in self.country.super_admins.all())

    def test_retrieve_partnerlogos_list(self):
        url = reverse("country-detail", kwargs={"pk": self.country.id})
        response = self.test_user_client.get(url)
        self.assertEqual(response.status_code, 200)
        self.assertIn("partner_logos", response.json().keys())
        self.assertTrue(isinstance(response.json()['partner_logos'], list))

    def test_country_export(self):
        country = CountryFactory(name='country111', code='C2')
        org = OrganisationFactory(name="org1")
        d1 = DonorFactory(name="Donor1", code="donor1")
        p1 = TechnologyPlatformFactory(name='platform1')
        p2 = TechnologyPlatformFactory(name='platform2')
        s_parent = DigitalStrategyFactory(name="strategy parent", group=DigitalStrategy.GROUP_CHOICES[0])
        s1 = DigitalStrategyFactory(parent=s_parent, name="strategy1", group=DigitalStrategy.GROUP_CHOICES[0])
        s2 = DigitalStrategyFactory(parent=s_parent, name="strategy2", group=DigitalStrategy.GROUP_CHOICES[0])
        s3 = DigitalStrategyFactory(parent=s_parent, name="strategy3", group=DigitalStrategy.GROUP_CHOICES[0])

        project_data1 = {"project": {
            "date": datetime.utcnow(),
            "name": "Proj1",
            "organisation": org.id,
            "contact_name": "name1",
            "contact_email": "a@a.com",
            "implementation_overview": "overview",
            "implementation_dates": "2016",
            "health_focus_areas": [1, 2],
            "geographic_scope": "somewhere",
            "country": country.id,
            "platforms": [{
                "id": p1.id,
                "strategies": [s1.id, s2.id]
            }, {
                "id": p2.id,
                "strategies": [s1.id]
            }],
            "licenses": [1, 2],
            "coverage": [
                {"district": "dist1", "clients": 20, "health_workers": 5, "facilities": 4},
                {"district": "dist2", "clients": 10, "health_workers": 2, "facilities": 8}
            ],
            "coverage_second_level": [
                {"district": "ward1", "clients": 209, "health_workers": 59, "facilities": 49},
                {"district": "ward2", "clients": 109, "health_workers": 29, "facilities": 89}
            ],
            "national_level_deployment":
                {"clients": 20000, "health_workers": 0, "facilities": 0,
                 "facilities_list": ['facility1', 'facility2', 'facility3']},
            "donors": [d1.id],
            "his_bucket": [1, 2],
            "hsc_challenges": [1, 2],
            "government_investor": 0,
            "implementing_partners": ["partner1", "partner2"],
            "repository": "http://some.repo",
            "mobile_application": "http://mobile.app.org",
            "wiki": "http://wiki.org",
            "interoperability_links": [{"id": 1, "selected": True, "link": "http://blabla.com"},
                                       {"id": 2, "selected": True},
                                       {"id": 3, "selected": True, "link": "http://example.org"}],
            "interoperability_standards": [1],
            "start_date": str(datetime.today().date()),
            "end_date": str(datetime.today().date()),
            "stages": [{
                "id": 1,
                "date": str(datetime.today().date()),
                "note": "stage 1 note"
            }],
        }}

        # Create project draft
        url = reverse("project-create", kwargs={"country_id": country.id})
        response = self.test_user_client.post(url, project_data1, format="json")
        self.assertEqual(response.status_code, 201, response.json())

        project1_id = response.json().get("id")

        # Publish
        url = reverse("project-publish", kwargs={"project_id": project1_id, "country_id": country.id})
        response = self.test_user_client.put(url, project_data1, format="json")
        self.assertEqual(response.status_code, 200)

        project_data2 = copy(project_data1)
        project_data2['project']['name'] = "Proj2"
        project_data2['project']['platforms'] = [{
            "id": p1.id,
            "strategies": [s1.id, s2.id]
        }, {
            "id": p2.id,
            "strategies": [s3.id]
        }]

        # Create project draft
        url = reverse("project-create", kwargs={"country_id": country.id})
        response = self.test_user_client.post(url, project_data2, format="json")
        self.assertEqual(response.status_code, 201, response.json())

        project2_id = response.json().get("id")

        # Publish
        url = reverse("project-publish", kwargs={"project_id": project2_id, "country_id": country.id})
        response = self.test_user_client.put(url, project_data2, format="json")
        self.assertEqual(response.status_code, 200)

        response = self.client.get(reverse('country-export'))

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()[-1], {'country': country.name, 'country_code': country.code,
                                               'platforms': {
                                                   str(p1.id): {'strategies': [s_parent.id],
                                                                'projects': [project1_id, project2_id]},
                                                   str(p2.id): {'strategies': [s_parent.id],
                                                                'projects': [project1_id, project2_id]}}})

    def test_create_retrieve_update_mapfile_noperm_fail(self):
        url = reverse('map-file-list')
        map_file = SimpleUploadedFile("file.txt", b"file_content")
        data = {
            'country': self.country.id,
            'map_file': map_file
        }
        response = self.test_user_client.post(url, data=data, format="multipart")
        self.assertEqual(response.status_code, 403)

    def test_create_retrieve_update_mapfile_as_superuser(self):
        user = UserProfile.objects.get(id=self.test_user['user_profile_id']).user
        user.is_superuser = True
        user.save()

        url = reverse('map-file-list')
        map_file = SimpleUploadedFile("file.txt", b"file_content")
        data = {
            'country': self.country.id,
            'map_file': map_file
        }
        response = self.test_user_client.post(url, data=data, format="multipart")
        self.assertEqual(response.status_code, 201)
        self.assertEqual(response.json()['country'], self.country.id)

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
        self.assertEqual(response.json()['map_files'][0]['id'], map_file_id)

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

    def test_save_coordinates_extracts_polylabels(self):
        UserProfile.objects.filter(id=self.test_user['user_profile_id']) \
            .update(account_type=UserProfile.SUPER_COUNTRY_ADMIN, country=self.country)
        self.country.super_admins.add(self.test_user['user_profile_id'])

        url = reverse("country-detail", kwargs={"pk": self.country.id})
        lat = 8.569510985419903
        lon = -11.781153749741312
        data = {
            "map_data": {
                "polylabel": {
                    "lat": lat,
                    "lng": lon
                }
            }
        }
        response = self.test_user_client.patch(url, data=data, format='json', HTTP_ACCEPT_LANGUAGE='en')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()["map_data"], data["map_data"])
        self.assertEqual(response.json()['lat'], str(lat))
        self.assertEqual(response.json()['lon'], str(lon))
        self.assertEqual(response.json()['map_data']['polylabel']['lat'], lat)
        self.assertEqual(response.json()['map_data']['polylabel']['lng'], lon)

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

    def test_country_custom_question_options_validation(self):
        url = reverse("country-custom-questions-list")

        data = {
            "country": self.country.id,
            "type": CustomQuestion.TEXT,
            "question": "waddup?"
        }
        response = self.test_user_client.post(url, data=data)
        self.assertEqual(response.status_code, 201)
        self.assertIsNone(response.json()['options'])

        data = {
            "country": self.country.id,
            "type": CustomQuestion.SINGLE,
            "question": "waddup?",
            "options": []
        }
        response = self.test_user_client.post(url, data=data)
        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.json(), {'options': ['Ensure options field has at least 1 elements.']})

        data = {
            "country": self.country.id,
            "type": CustomQuestion.SINGLE,
            "question": "waddup?",
            "options": ['yes', 'maybe']
        }
        response = self.test_user_client.post(url, data=data)
        self.assertEqual(response.status_code, 201)
        self.assertEqual(response.json()['options'], ['yes', 'maybe'])
