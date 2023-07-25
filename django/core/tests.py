from io import BytesIO
from PIL import Image

from django.contrib.admin import AdminSite
from django.test import TestCase
from django.test.client import Client
from django.contrib.auth.models import User
from rest_framework.reverse import reverse

from core.admin import CustomUserAdmin
from core.factories import UserFactory, UserProfileFactory
from country.models import Country
from project.tests.setup import MockRequest


class AuthTest(TestCase):
    def setUp(self):
        self.password = 'mypassword'

        self.admin = UserFactory(
            username='myuser', email='myemail@test.com', password=self.password, is_staff=True, is_superuser=True)

        self.client = Client()

        self.site = AdminSite()
        self.user = UserFactory(username='alma', password='korte')
        self.userprofile = UserProfileFactory(user=self.user, name="almakorte", country=Country.objects.get(id=1))

    def test_email_authentication(self):
        self.assertTrue(self.client.login(username=self.admin.email, password=self.password))

    def test_user_authentication_should_fail(self):
        self.assertFalse(self.client.login(username=self.admin.username, password=self.password))

    def test_hide_fields_from_user_change_form(self):
        ma = CustomUserAdmin(User, self.site)
        ma.get_form(None)
        self.assertEqual(
            ma.get_list_filter(None), ('is_staff', 'is_superuser', 'is_active', 'groups', 'userprofile__account_type'))
        self.assertEqual(ma.country(self.user), self.userprofile.country)
        self.assertEqual(ma.type(self.user), self.userprofile.get_account_type_display())
        self.assertIsNone(ma.organisation(self.user))

    def test_get_readonly_fields_with_staff(self):
        normal_staff = UserFactory(
            username='staff', email='staff@example.com', password=self.password, is_staff=True, is_superuser=False)
        model_admin = CustomUserAdmin(User, self.site)
        request = MockRequest()
        request.user = normal_staff
        self.assertEqual(
            model_admin.get_readonly_fields(request),
            ('password', 'is_active', 'is_staff', 'is_superuser', 'groups', 'last_login', 'date_joined')
        )

    def test_get_readonly_fields_with_superuser(self):
        model_admin = CustomUserAdmin(User, self.site)
        request = MockRequest()
        request.user = self.admin
        self.assertEqual(len(model_admin.get_readonly_fields(request)), 0)


class TestStaticDataEndpoint(TestCase):
    def test_url(self):
        url = reverse('static-data')
        self.assertEqual(url, '/api/static-data/')

    def test_payload_keys(self):
        response = self.client.get(reverse('static-data'))
        self.assertEqual(response.status_code, 200)
        self.assertIn('languages', response.json())
        self.assertIn('search_filters', response.json())
        self.assertIn('landing_page_defaults', response.json())
        self.assertIn('axis', response.json())
        self.assertIn('domains', response.json())
        self.assertIn('thematic_overview', response.json())
        self.assertIn('toolkit_questions', response.json())
        self.assertIn('sub_level_types', response.json())

    def test_language_payload(self):
        response = self.client.get(reverse('static-data'))
        self.assertEqual(response.status_code, 200)
        self.assertIn('languages', response.json())
        self.assertEqual(response.json()['languages'],
                         [{'code': 'en', 'flag': 'gb.png', 'name': 'English'},
                          {'code': 'fr', 'flag': 'fr.png', 'name': 'French'},
                          {'code': 'es', 'flag': 'es.png', 'name': 'Spanish'},
                          {'code': 'pt', 'flag': 'pt.png', 'name': 'Portuguese'},
                          {'code': 'ar', 'flag': 'sa.png', 'name': 'Arabic'}])

    def test_name_translation(self):
        response = self.client.get(reverse('static-data'), HTTP_ACCEPT_LANGUAGE='en')
        self.assertEqual(response.status_code, 200)
        name_list = [l['name'] for l in response.json()['languages']]
        self.assertEqual(name_list, ['English', 'French', 'Spanish', 'Portuguese', 'Arabic'])

        response = self.client.get(reverse('static-data'), HTTP_ACCEPT_LANGUAGE='fr')
        self.assertEqual(response.status_code, 200)
        name_list = [l['name'] for l in response.json()['languages']]
        self.assertEqual(name_list, ['Anglais', 'Français', 'Espagnol', 'Portugais', 'Arabe'])

    def test_roadmap_limits(self):
        response = self.client.get(reverse('static-data'))
        self.assertEqual(response.status_code, 200)
        self.assertIn('roadmap', response.json())
        self.assertTrue('valid_types', response.json()['roadmap'])
        self.assertTrue('max_size_in_MB', response.json()['roadmap'])
        self.assertTrue('max_documents', response.json()['roadmap'])


def get_temp_image(name='test', ext='png'):
    cover = BytesIO()
    image = Image.new('RGBA', size=(100, 100))
    image.save(cover, 'png')
    cover.name = '{}.{}'.format(name, ext)
    cover.seek(0)
    return cover
