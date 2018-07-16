from django.contrib.admin import AdminSite
from django.contrib.admin.widgets import AdminTextInputWidget
from django.forms.fields import CharField
from django.test import TestCase
from django.test.client import Client
from django.contrib.auth.models import User
from rest_framework.reverse import reverse

from core.admin import CustomUserAdmin
from core.admin.widgets import AdminArrayFieldWidget, AdminArrayField, NoneReadOnlyAdminArrayFieldWidget
from country.forms import CountryFieldAdminForm
from country.models import CountryField, Country
from user.models import UserProfile
from django.utils.translation import ugettext_lazy as _
from .utils import lazyJSONDumps, LazyEncoder
from mock import patch
from django.core.serializers.json import DjangoJSONEncoder # noqa


class AuthTest(TestCase):
    def setUp(self):
        self.password = 'mypassword'

        self.admin = User.objects.create_superuser('myuser', 'myemail@test.com', self.password)

        self.client = Client()

        self.site = AdminSite()
        self.user = User.objects.create(username="alma", password="korte")
        self.userprofile = UserProfile.objects.create(user=self.user, name="almakorte",
                                                      country=Country.objects.get(id=1))

    def test_email_authentication(self):
        self.assertTrue(self.client.login(username=self.admin.email, password=self.password))
        self.assertTrue('core.auth.EmailBackend' in self.client.session.values())

    def test_user_authentication_should_fail(self):
        self.assertFalse(self.client.login(username=self.admin.username, password=self.password))
        self.assertFalse('core.auth.EmailBackend' in self.client.session.values())

    def test_hide_fields_from_user_change_form(self):
        ma = CustomUserAdmin(User, self.site)
        ma.get_form(None)
        self.assertEqual(
            ma.get_list_filter(None), ('is_staff', 'is_superuser', 'is_active', 'groups', 'userprofile__account_type'))
        self.assertEqual(ma.country(self.user), self.userprofile.country)
        self.assertEqual(ma.type(self.user), self.userprofile.get_account_type_display())
        self.assertIsNone(ma.organisation(self.user))


class TestAdminWidgets(TestCase):
    def setUp(self):
        super(TestAdminWidgets, self).setUp()
        self.widget = AdminArrayFieldWidget(AdminTextInputWidget())

    def test_render_empty(self):
        rendered_output = self.widget.render('test', [])
        self.assertEqual(rendered_output,
                         '<ul id="test" data-element-counter="1" class="arrayfield-list"style="padding: 0; margin: 0; '
                         'display: none;"><input type="text" name="test_0" class="vTextField" />'
                         '<li style="list-style-type: none;"><a href="#" '
                         'class="add-arraywidget-item">Add new entry</a></li></ul>')

    def test_render_values(self):
        rendered_output = self.widget.render('test', ['first value'])
        self.assertEqual(rendered_output,
                         '<ul id="test" data-element-counter="1" class="arrayfield-list"style="padding: 0; margin: 0; '
                         'display: none;"><input type="text" name="test_0" value="first value" class="vTextField" />'
                         '<li style="list-style-type: none;"><a href="#" '
                         'class="add-arraywidget-item">Add new entry</a></li></ul>')

    def test_format_output(self):
        formatted_output = self.widget.format_output(['First widget', 'Second widget'])
        self.assertEqual(formatted_output,
                         '<li style="list-style-type: none;">First widget<a href="#" class="delete-arraywidget-item" '
                         'style="color: #CC3434; padding-left: 8px">Delete</a></li>\n'
                         '<li style="list-style-type: none;">Second widget<a href="#" class="delete-arraywidget-item" '
                         'style="color: #CC3434; padding-left: 8px">Delete</a></li>')

    def test_values_from_datadict(self):
        data = {'country_0': '0',
                'country_1': '1',
                'country_3': '3',
                'country_4': None,
                'name': 'Test'}
        values = self.widget.value_from_datadict(data, None, 'country')
        self.assertEqual(values, ['0', '1', '3'])

    def test_decompress_none(self):
        decompressed_value = self.widget.decompress(None)
        self.assertEqual(decompressed_value, [])

    def test_decompress_not_none(self):
        with self.assertRaises(TypeError):
            self.widget.decompress(12)


class TestNoneReadOnlyAdminArrayFieldWidget(TestCase):
    def setUp(self):
        super(TestNoneReadOnlyAdminArrayFieldWidget, self).setUp()
        self.widget = NoneReadOnlyAdminArrayFieldWidget(AdminTextInputWidget())

    def test_render_none(self):
        rendered_value = self.widget.render('test', None)
        self.assertEqual(rendered_value, '-')

    def test_render_values(self):
        args = ('test', ['1', '2', '3'])

        normal_widget = AdminArrayFieldWidget(AdminTextInputWidget())
        normal_render = normal_widget.render(*args)

        rendered_output = self.widget.render(*args)
        self.assertEqual(rendered_output, normal_render)


class TestAdminArrayField(TestCase):
    def setUp(self):
        super(TestAdminArrayField, self).setUp()
        self.field = AdminArrayField(base_field=CharField())

    def test_prepare_value(self):
        prepared_values = self.field.prepare_value([1, 2, 3])
        self.assertEqual(prepared_values, [1, 2, 3])

    def test_to_python(self):
        value = ['first', 'second', 'last']
        python_value = self.field.to_python(value)
        self.assertEqual(python_value, ['first', 'second', 'last'])

    def test_delimiter(self):
        value = ['first', 'some, with, comas']
        python_value = self.field.to_python(value)
        self.assertEqual(python_value, ['first', 'some, with, comas'])

        native_value = self.field.prepare_value(python_value)
        self.assertEqual(native_value, value)


class TestCountryFieldAdmin(TestCase):
    def test_cleaning_create(self):
        data = {'type': CountryField.TEXT,
                'question': 'WHO let the dogs out?'}
        form = CountryFieldAdminForm(data=data)
        self.assertTrue(form.is_valid())

    def test_cleaning_update(self):
        country = Country.objects.create(name='Hungary',
                                         code='HUN')
        country_field = CountryField.objects.create(country=country,
                                                    type=CountryField.TEXT,
                                                    question='')
        data = {'question': 'What is love?'}
        form = CountryFieldAdminForm(instance=country_field, data=data)
        form.fields.pop('type')

        self.assertTrue(form.is_valid())

    def test_missing_options(self):
        data = {'type': CountryField.MULTI,
                'question': 'WHO let the dogs out?'}
        form = CountryFieldAdminForm(data=data)
        self.assertFalse(form.is_valid())
        self.assertEqual(form.errors,
                         {'__all__': ['Options is a required field']})


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
                          {'code': 'pt', 'flag': 'pt.png', 'name': 'Portuguese'}])

    def test_name_translation(self):
        response = self.client.get(reverse('static-data'), HTTP_ACCEPT_LANGUAGE='en')
        self.assertEqual(response.status_code, 200)
        name_list = [l['name'] for l in response.json()['languages']]
        self.assertEqual(name_list, ['English', 'French', 'Spanish', 'Portuguese'])

        response = self.client.get(reverse('static-data'), HTTP_ACCEPT_LANGUAGE='fr')
        self.assertEqual(response.status_code, 200)
        name_list = [l['name'] for l in response.json()['languages']]
        self.assertEqual(name_list, ['Anglais', 'Français', 'Espagnol', 'Portugais'])


class TestUtils(TestCase):

    def test_lazy_encoder_default(self):
        with patch('django.core.serializers.json.DjangoJSONEncoder.default') as mock:
            le = LazyEncoder()
            le.default(1)
            self.assertTrue(mock.called)

    def test_lazy_json_dumps_normal_json(self):
        obj = dict(a=1, b=2)
        json = lazyJSONDumps(obj)
        self.assertEqual(json, '{"a": 1, "b": 2}')

    def test_lazy_json_dumps_translated_json(self):
        obj = dict(a=_('test1'), b=_('test2'))
        json = lazyJSONDumps(obj)
        self.assertEqual(json, '{"a": "test1", "b": "test2"}')
