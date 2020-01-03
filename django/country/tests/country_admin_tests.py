from django.conf import settings
from django.contrib.admin import AdminSite
from django.contrib.auth.models import User
from django.test import TestCase

from country.admin import CountryAdmin
from country.models import Country


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
        self.assertEqual(ma.get_queryset(self.request).count(), Country.objects.all().count())

    def test_superuser_readonlies(self):
        ma = CountryAdmin(Country, self.site)
        self.user.is_superuser = True
        self.user.is_staff = True
        self.user.save()
        self.request.user = self.user
        self.assertEqual(ma.get_readonly_fields(self.request), (
            'code',
            'name'
        ))

    def test_country_get_fields(self):
        ma = CountryAdmin(Country, self.site)
        self.user.is_superuser = True
        self.user.is_staff = True
        self.user.save()
        self.request.user = self.user
        self.assertTrue('map_data' not in ma.get_fields(self.request))

    def test_list_admin(self):
        ma = CountryAdmin(Country, self.site)
        self.assertEqual(ma.get_queryset(self.request).count(), Country.objects.all().count())
        translate_bools = ['is_translated_{}'.format(language_code) for language_code, _ in settings.LANGUAGES]
        self.assertEqual(ma.get_list_display(self.request), ['name', 'code', 'region',
                                                             'project_approval'] + translate_bools)
