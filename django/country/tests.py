from django.contrib.admin import AdminSite
from django.contrib.auth.models import User
from django.core import mail
from django.core.urlresolvers import reverse
from allauth.account.models import EmailConfirmation
from django.test import TestCase
from rest_framework.test import APIClient
from rest_framework.test import APITestCase

from country.admin import CountryAdmin
from country.models import Country, PartnerLogo, CountryField
from project.models import Project
from user.models import UserProfile


class CountryTests(APITestCase):
    def setUp(self):
        # Create a test user with profile.
        url = reverse("rest_register")
        data = {
            "email": "test_user@gmail.com",
            "password1": "123456",
            "password2": "123456"}
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
        data = {
            "username": "test_user@gmail.com",
            "password": "123456"}
        response = self.client.post(url, data)
        self.test_user_key = response.json().get("token")
        self.test_user_client = APIClient(HTTP_AUTHORIZATION="Token {}".format(self.test_user_key))

        self.country = Country.objects.create(name="country1", code="CC")
        PartnerLogo.objects.create(country=self.country)

        CountryField.objects.create(country=self.country, type=1, question="q1?", schema=True)
        CountryField.objects.create(country=self.country, type=1, question="q1?", answer="a1", schema=False)

    def test_get_countries(self):
        url = reverse("country-list")
        response = self.test_user_client.get(url)
        self.assertEqual(response.status_code, 200)
        self.assertIn("name", response.json()[0].keys())
        self.assertIn("code", response.json()[0].keys())
        self.assertIn("id", response.json()[0].keys())

    def test_retrieve_landing_detail(self):
        url = reverse("country-detail", kwargs={"code": self.country.code})
        response = self.test_user_client.get(url)
        self.assertEqual(response.status_code, 200)
        response_keys = response.json().keys()
        self.assertIn("name", response_keys)
        self.assertIn("code", response_keys)
        self.assertIn("logo", response_keys)
        self.assertIn("cover", response_keys)
        self.assertIn("cover_text", response_keys)
        self.assertIn("footer_text", response_keys)

    def test_retrieve_partnerlogos_list(self):
        url = reverse("country-detail", kwargs={"code": self.country.code})
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
        url = reverse("country-fields", kwargs={"country_id": self.country.id, "project_id": 1})

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
        url = reverse("country-fields", kwargs={"country_id": self.country.id, "project_id": 1})

        country_fields_data = {
            "fields": [{
                "country": self.country.id,
                "type": 1,
                "question": "q2?",
                "answer": "a2"
            }]
        }
        response = self.test_user_client.post(url, data=country_fields_data, format="json")
        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.json()['fields'], [{'non_field_errors': ['Project ID needs to be specified']}])

    def test_create_country_fields_empty_project(self):
        url = reverse("country-fields", kwargs={"country_id": self.country.id, "project_id": 1})

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
        self.project = Project.objects.create(name="project1", data={"country": self.country.id})
        url = reverse("country-fields", kwargs={"country_id": self.country.id, "project_id": self.project.id})

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

    def test_create_country_fields_missing_answer(self):
        project = Project.objects.create(name="project1", data={"country": self.country.id})
        url = reverse("country-fields", kwargs={"country_id": self.country.id, "project_id": project.id})

        country_fields_data = {
            "fields": [{
                "country": self.country.id,
                "project": project.id,
                "type": 1,
                "question": "q2?"
            }]
        }
        response = self.test_user_client.post(url, data=country_fields_data, format="json")
        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.json()['fields'], [{'non_field_errors': ["Answer can't be empty"]}])

        country_fields_data = {
            "fields": [{
                "country": self.country.id,
                "project": project.id,
                "type": 1,
                "question": "q2?",
                "answers": ""
            }]
        }
        response = self.test_user_client.post(url, data=country_fields_data, format="json")
        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.json()['fields'], [{'non_field_errors': ["Answer can't be empty"]}])

    def test_create_country_fields_missing_question(self):
        project = Project.objects.create(name="project1", data={"country": self.country.id})
        url = reverse("country-fields", kwargs={"country_id": self.country.id, "project_id": project.id})

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
        url = reverse("country-fields", kwargs={"country_id": self.country.id, "project_id": project.id})

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
        url = reverse("country-fields", kwargs={"country_id": self.country.id, "project_id": project.id})

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
        url = reverse("country-fields", kwargs={"country_id": self.country.id, "project_id": project.id})

        country_fields_data = {
            "fields": [{
                "country": self.country.id,
                "project": project.id,
                "type": "4",
                "question": "q2?",
                "answer": "a2"
            }]
        }
        response = self.test_user_client.post(url, data=country_fields_data, format="json")
        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.json()['fields'], [{'type': ['"4" is not a valid choice.']}])

    def test_create_country_fields_wrong_type_two(self):
        project = Project.objects.create(name="project1", data={"country": self.country.id})
        url = reverse("country-fields", kwargs={"country_id": self.country.id, "project_id": project.id})

        country_fields_data = {
            "fields": [{
                "country": self.country.id,
                "project": project.id,
                "type": 4,
                "question": "q2?",
                "answer": "a2"
            }]
        }
        response = self.test_user_client.post(url, data=country_fields_data, format="json")
        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.json()['fields'], [{'type': ['"4" is not a valid choice.']}])

    def test_update_answer(self):
        self.test_create_country_fields_correct_project()
        url = reverse("country-fields", kwargs={"country_id": self.country.id, "project_id": self.project.id})

        country_field_id = CountryField.objects.get(question="q2?").id

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

        country_field_updated_id = CountryField.objects.get(question="q2?").id

        self.assertEqual(CountryField.objects.get(question="q2?").__str__(), "")
        self.assertEqual(response.status_code, 201)
        self.assertEqual(country_field_id, country_field_updated_id)
        self.assertEqual(response.json()['fields'][0]['country'], self.country_fields_data['fields'][0]['country'])
        self.assertEqual(response.json()['fields'][0]['project'], self.country_fields_data['fields'][0]['project'])
        self.assertEqual(response.json()['fields'][0]['type'], self.country_fields_data['fields'][0]['type'])
        self.assertEqual(response.json()['fields'][0]['question'], self.country_fields_data['fields'][0]['question'])
        self.assertEqual(response.json()['fields'][0]['answer'], self.country_fields_data['fields'][0]['answer'])

    def test_update_answer_and_question(self):
        self.test_create_country_fields_correct_project()
        url = reverse("country-fields", kwargs={"country_id": self.country.id, "project_id": self.project.id})

        country_field_id = CountryField.objects.get(question="q2?").id

        self.country_fields_data = {
            "fields": [{
                "country": self.country.id,
                "project": self.project.id,
                "type": 1,
                "question": "q2_updated?",
                "answer": "a2_updated"
            }]
        }
        response = self.test_user_client.post(url, data=self.country_fields_data, format="json")

        country_field_updated_id = CountryField.objects.get(question="q2_updated?").id

        self.assertEqual(response.status_code, 201)
        self.assertNotEqual(country_field_id, country_field_updated_id)
        self.assertEqual(response.json()['fields'][0]['country'], self.country_fields_data['fields'][0]['country'])
        self.assertEqual(response.json()['fields'][0]['project'], self.country_fields_data['fields'][0]['project'])
        self.assertEqual(response.json()['fields'][0]['type'], self.country_fields_data['fields'][0]['type'])
        self.assertEqual(response.json()['fields'][0]['question'], self.country_fields_data['fields'][0]['question'])
        self.assertEqual(response.json()['fields'][0]['answer'], self.country_fields_data['fields'][0]['answer'])

    def test_country_export(self):

        country = Country.objects.create(name='country111', code='C2')
        project_data1 = {
            'contact_email': 'foo1@gmail.com',
            'contact_name': 'foo1',
            'country': country.id,
            'platforms': [
                {
                    'name': 'OpenSRP',
                    'strategies': [
                        'Transmit untargeted health promotion content to entire population',
                        "Track client's health and services within a longitudinal care plan",
                        'Transmit prescriptions orders'
                    ]
                },
            ],
            'interoperability_links': [
                {"name": "Client Registry", "selected": True, "link": "http://blabla.com"},
                {"name": "Health Worker Registry", "selected": True, "link": "http://example.org"},
            ]
        }
        project_data2 = {
            'contact_email': 'foo2@gmail.com',
            'contact_name': 'foo2',
            'country': country.id,
            'platforms': [
                {
                    'name': 'OpenSRP',
                    'strategies': [
                        'Transmit untargeted health promotion content to entire population',
                        'Transmit prescriptions orders'
                    ]
                },
                {
                    'name': 'Bamboo',
                    'strategies': [
                        'Guide through process algorithms according to clinical protocol',
                        'Monitor status of health equipment'
                    ]
                }
            ],
            'interoperability_links': [
                {"name": "Client Registry", "selected": True, "link": "http://blabla.com"},
                {"name": "Health Management Information System (HMIS)", "selected": True},
            ]
        }

        expected_data = {
            'country': 'country111',
            'interoperability_links': {
                '1': "Client Registry",
                '2': "Health Management Information System (HMIS)",
                '3': "Health Worker Registry",
            },
            'platforms': {
                '24': {
                    'name': 'OpenSRP',
                    'strategies': {
                        '6': 'Transmit untargeted health promotion content to entire population',
                        '31': "Track client's health and services within a longitudinal care plan",
                        '72': 'Transmit prescriptions orders',
                    },
                    'owners': {
                        'foo1@gmail.com': 'foo1',
                        'foo2@gmail.com': 'foo2',
                    }
                },
                '2': {
                    'name': 'Bamboo',
                    'strategies': {
                        '35': 'Guide through process algorithms according to clinical protocol',
                        '76': 'Monitor status of health equipment',
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
        self.assertEqual(ma.get_list_display(self.request), ('name', 'code'))
        self.assertEqual(ma.get_queryset(self.request).count(), Country.objects.all().count())

    def test_staff_can_see_no_country_if_no_user_assigned_to_country(self):
        ma = CountryAdmin(Country, self.site)
        self.user.is_superuser = False
        self.user.is_staff = True
        self.user.save()
        self.request.user = self.user
        self.assertEqual(ma.get_list_display(self.request), ('name', 'code'))
        self.assertEqual(ma.get_queryset(self.request).count(), 0)

    def test_staff_only_sees_the_country_he_is_assigned_to(self):
        ma = CountryAdmin(Country, self.site)
        self.user.is_superuser = False
        self.user.is_staff = True
        self.user.save()
        self.request.user = self.user
        user_profile = UserProfile.objects.create(user=self.user)
        Country.objects.create(name="Country1", code="CC1", user=user_profile)
        self.assertEqual(ma.get_list_display(self.request), ('name', 'code'))
        self.assertEqual(ma.get_queryset(self.request).count(), 1)
        self.assertEqual(ma.get_queryset(self.request)[0].name, "Country1")
        self.assertEqual(ma.get_queryset(self.request)[0].code, "CC1")

    def test_staff_has_some_readonly_fields(self):
        ma = CountryAdmin(Country, self.site)
        self.user.is_superuser = False
        self.user.is_staff = True
        self.user.save()
        self.request.user = self.user
        self.assertEqual(ma.get_readonly_fields(self.request), ('name', 'code', 'user',))

    def test_superuser_can_change_every_field(self):
        ma = CountryAdmin(Country, self.site)
        self.user.is_superuser = True
        self.user.is_staff = True
        self.user.save()
        self.request.user = self.user
        self.assertEqual(ma.get_readonly_fields(self.request), ())

    def test_country_field_inlines(self):
        user_profile = UserProfile.objects.create(user=self.user)
        country = Country.objects.create(name="Country1", code="CC1", user=user_profile)
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

        addcountryfield_formset_and_inline = formsets_and_inlines[1]
        addcountryfield_inline = addcountryfield_formset_and_inline[1]

        self.assertEqual(countryfield_inline.get_readonly_fields(self.request), ('type', 'question'))
        self.assertEqual(countryfield_inline.get_queryset(self.request).count(), 1)

        self.assertEqual(addcountryfield_inline.get_readonly_fields(self.request), ())
        self.assertEqual(addcountryfield_inline.get_queryset(self.request).count(), 0)

    def test_assign_user_will_send_email(self):
        user_profile = UserProfile.objects.create(user=self.user)
        country = Country.objects.create(name="Country1", code="CC1")
        ma = CountryAdmin(Country, self.site)
        self.user.is_superuser = True
        self.user.is_staff = True
        self.user.save()
        self.request.user = self.user

        class MockForm:
            changed_data = ['user']

        country.user = user_profile
        ma.save_model(self.request, country, MockForm(), True)

        outgoing_email = mail.outbox[-1].message()
        outgoing_email_text = mail.outbox[-1].message().as_string()

        self.assertTrue("You have been selected as the Country Admin for {}".format(country.name) in outgoing_email.values())
        self.assertTrue("test@test.com" in outgoing_email.values())
        self.assertTrue('You have been selected as the Country Admin' in outgoing_email_text)
        self.assertTrue('/admin/country/country/{}/change/'.format(country.id) in outgoing_email_text)
