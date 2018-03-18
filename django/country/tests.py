import json
import os
from fnmatch import fnmatch

from django.contrib.admin import AdminSite
from django.contrib.auth.models import User
from django.utils.translation import override

from django.core import mail
from django.core.management import call_command
from django.core.urlresolvers import reverse
from allauth.account.models import EmailConfirmation
from django.test import TestCase
from rest_framework.test import APIClient
from rest_framework.test import APITestCase

from country.admin import CountryAdmin
from country.models import Country, PartnerLogo, CountryField
from project.models import Project
from user.models import UserProfile
from django.utils.six import StringIO
from django.conf import settings
from mock import patch


class CountryTests(APITestCase):
    def setUp(self):
        # Create a test user with profile.
        url = reverse("rest_register")
        data = {"email": "test_user@gmail.com", "password1": "123456", "password2": "123456"}
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
        data = {"username": "test_user@gmail.com", "password": "123456"}
        response = self.client.post(url, data)
        self.test_user_key = response.json().get("token")
        self.test_user_client = APIClient(HTTP_AUTHORIZATION="Token {}".format(self.test_user_key))

        self.country = Country.objects.create(name="country1", code="CC")
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
        self.assertEqual(country_data['name'], 'Hungary')

        response = self.test_user_client.get(url, HTTP_ACCEPT_LANGUAGE='fr')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()[0]['name'], 'Hongrie')

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

    def test_update_and_list_country_map_data(self):
        url = reverse("country-detail", kwargs={"pk": Country.objects.last().id})
        self.map_data = {"map_data": {
            "sub_level_name": "District",
            "sub_levels": [{
                "name_en": "District 1",
                "name_es": "Districto Uno"
            }, {
                "name_en": "Disctrict 9"
            }]
        }}
        response = self.test_user_client.put(url, data=self.map_data, format="json")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()['map_data'], self.map_data['map_data'])

        url = reverse("country-list")
        response = self.test_user_client.get(url)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()[-1]['map_data'], self.map_data['map_data'])


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

    def test_staff_can_see_no_country_if_no_user_assigned_to_country(self):
        ma = CountryAdmin(Country, self.site)
        self.user.is_superuser = False
        self.user.is_staff = True
        self.user.save()
        self.request.user = self.user
        self.assertEqual(ma.get_list_display(self.request), ('name', 'code', 'project_approval'))
        self.assertEqual(ma.get_queryset(self.request).count(), 0)

    def test_staff_only_sees_the_country_he_is_assigned_to(self):
        ma = CountryAdmin(Country, self.site)
        self.user.is_superuser = False
        self.user.is_staff = True
        self.user.save()
        self.request.user = self.user
        user_profile = UserProfile.objects.create(user=self.user)
        country = Country.objects.create(name="Country1", code="CC1")
        country.users.add(user_profile)
        self.assertEqual(ma.get_list_display(self.request), ('name', 'code', 'project_approval'))
        self.assertEqual(ma.get_queryset(self.request).count(), 1)
        self.assertEqual(ma.get_queryset(self.request)[0].name, "Country1")
        self.assertEqual(ma.get_queryset(self.request)[0].code, "CC1")

    def test_staff_has_some_readonly_fields(self):
        ma = CountryAdmin(Country, self.site)
        self.user.is_superuser = False
        self.user.is_staff = True
        self.user.save()
        self.request.user = self.user
        self.assertEqual(ma.get_readonly_fields(self.request), (
            'code',
            'name',
            'map_download',
            'users'
        ))

    def test_superuser_readonlies(self):
        ma = CountryAdmin(Country, self.site)
        self.user.is_superuser = True
        self.user.is_staff = True
        self.user.save()
        self.request.user = self.user
        self.assertEqual(ma.get_readonly_fields(self.request), (
            'code',
            'name',
            'map_download'
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

    def test_assign_user_will_send_email(self):
        user_profile = UserProfile.objects.create(user=self.user)
        country = Country.objects.create(name="Country1", code="CC1")
        ma = CountryAdmin(Country, self.site)
        self.user.is_superuser = True
        self.user.is_staff = True
        self.user.save()
        self.request.user = self.user

        user_2 = User.objects.create_superuser(username='test_2', email='test2@test.test', password='a')
        user_2_profile = UserProfile.objects.create(user=user_2, language='fr')

        class MockForm:
            changed_data = ['users', 'map_activated_on']

        country.users.add(user_profile, user_2_profile)
        ma.save_model(self.request, country, MockForm(), True)

        outgoing_en_email = [m for m in mail.outbox
                             if '<meta http-equiv="content-language" content="en">' in m.message().as_string()
                             and 'You have been selected as the Country Admin' in m.message().as_string()][0].message()
        outgoing_en_email_text = outgoing_en_email.as_string()

        self.assertTrue(
            "You have been selected as the Country Admin for {}".format(country.name) in outgoing_en_email.values())
        self.assertTrue("test@test.com" in outgoing_en_email.values())
        self.assertTrue('You have been selected as the Country Admin' in outgoing_en_email_text)
        self.assertTrue('/admin/country/country/{}/change/'.format(country.id) in outgoing_en_email_text)
        self.assertIn('<meta http-equiv="content-language" content="en">', outgoing_en_email_text)
        self.assertNotIn('{{', outgoing_en_email_text)

        outgoing_fr_email = [m for m in mail.outbox
                             if '<meta http-equiv="content-language" content="fr">' in m.message().as_string()
                             and 'You have been selected as the Country Admin' in m.message().as_string()][0].message()
        outgoing_fr_email_text = outgoing_fr_email.as_string()

        self.assertTrue("test2@test.test" in outgoing_fr_email.values())
        self.assertIn('<meta http-equiv="content-language" content="fr">', outgoing_fr_email_text)
        self.assertNotIn('{{', outgoing_fr_email_text)

        outgoing_map_email = [m for m in mail.outbox
                              if '<meta http-equiv="content-language" content="en">' in m.message().as_string()
                              and 'A new map for' in m.message().as_string()][0].message()
        outgoing_map_email_text = outgoing_map_email.as_string()
        self.assertTrue("test@test.com" in outgoing_map_email.values())
        self.assertTrue("A new map for {} has been activated".format(country.name) in outgoing_map_email_text)

    def test_country_map_inline(self):
        user_profile = UserProfile.objects.create(user=self.user)
        country = Country.objects.create(name="Country1", code="CC1")
        country.users.add(user_profile)
        ma = CountryAdmin(Country, self.site)
        self.user.is_superuser = True
        self.user.is_staff = True
        self.user.save()
        self.request.user = self.user

        formsets_and_inlines = list(ma.get_formsets_with_inlines(self.request))
        mapfile_formset_and_inline = formsets_and_inlines[0]
        mapfile_inline = mapfile_formset_and_inline[1]

        class MockMap:
            class MockMapFile:
                url = 'test_url'
            map_file = MockMapFile()
            country_id = 0
        with patch('json.dumps', return_value=[{"name": "a", "displayName": "b"}]):
            self.assertEqual(mapfile_inline.print_map_customizer(MockMap()),
                             '<div id="app"><vue-map-customizer map-url="test_url" flag-base-url="/static/flags/"'
                             ':country-id="0" api-url="/api/country-map-data/"'
                             ' sub-level-types=\'[{\'name\': \'a\', \'displayName\': \'b\'}]\'></vue-map-customizer></div>'
                             '<script src="/static/vue-map-customiser-entrypoint.js"></script>')

    def test_country_get_fields(self):
        ma = CountryAdmin(Country, self.site)
        self.user.is_superuser = True
        self.user.is_staff = True
        self.user.save()
        self.request.user = self.user
        self.assertTrue('map_data' not in ma.get_fields(self.request))

    def test_country_map_download(self):
        ma = CountryAdmin(Country, self.site)
        self.user.is_superuser = True
        self.user.is_staff = True
        self.user.save()
        self.request.user = self.user

        class MockCountry:
            code = "SL"
            name = "Sierra Leone"

        self.assertEqual(ma.map_download(MockCountry),
                         "<a href='https://wambachers-osm.website/boundaries/exportBoundaries?cliVersion=1.0"
                         "&cliKey=a9ea45b5-ab37-4323-8263-767aa5896113&exportFormat=json&exportLayout=single"
                         "&exportAreas=land&union=false&from_AL=2&to_AL=6&selected=SLE'>"
                         " Sierra Leone map download </a>")


class CountryManagementCommandTest(TestCase):
    null_topo = os.path.join(settings.STATIC_ROOT, 'country-geodata', 'null.json')
    backup_folder = os.path.join(settings.MEDIA_ROOT, 'topojson-backups')

    def setUp(self):
        call_command('loaddata', 'null_land.json', verbosity=0)
        try:
            open(self.null_topo, 'x')
        except FileExistsError:  # pragma: no cover
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
