from allauth.account.models import EmailConfirmation
from django.test import TestCase
from django.utils.translation import override
from django.core.cache import cache
from rest_framework.reverse import reverse
from rest_framework.test import APIClient

from core.factories import TechnologyPlatformFactory, DigitalStrategyFactory, HSCGroupFactory, HSCChallengeFactory, \
    HealthCategoryFactory, HealthFocusAreaFactory
from project.models import TechnologyPlatform, DigitalStrategy, HealthFocusArea, HealthCategory, HSCChallenge, HSCGroup
from user.models import UserProfile


class TestModelTranslations(TestCase):
    def setUp(self):
        # Create a test user with profile.
        url = reverse('rest_register')
        data = {
            'email': 'test_user@gmail.com',
            'password1': '123456hetNYOLC',
            'password2': '123456hetNYOLC'}
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, 201)
        user_profile = UserProfile.objects.get(id=response.json().get('user_profile_id'))
        self.user = user_profile.user

        # Validate the account.
        key = EmailConfirmation.objects.get(email_address__email='test_user@gmail.com').key
        url = reverse('rest_verify_email')
        data = {
            'key': key,
        }
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, 200)

        key = EmailConfirmation.objects.get(email_address__email='test_user@gmail.com').key
        url = reverse('rest_verify_email')
        data = {
            'key': key,
        }
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, 200)

        # Log in the user.
        data = {
            'username': 'test_user@gmail.com',
            'password': '123456hetNYOLC'}
        response = self.client.post(reverse('token_obtain_pair'), data)
        self.assertEqual(response.status_code, 200)
        self.test_user_key = response.json().get('access')
        self.test_user_client = APIClient(HTTP_AUTHORIZATION='Token {}'.format(self.test_user_key), format='json')
        self.platform = TechnologyPlatformFactory(name='Test platform', name_en='English name', name_fr='French name')

    def test_model_translations(self):
        self.assertEqual(self.platform.name, 'English name')

        with override('en'):
            self.assertEqual(self.platform.name, 'English name')

        with override('fr'):
            self.assertEqual(self.platform.name, 'French name')

    def test_translation_through_api(self):
        TechnologyPlatform.objects.exclude(id=self.platform.id).delete()
        cache.clear()

        url = reverse('get-project-structure')

        # Getting the english version
        response = self.test_user_client.get(url, HTTP_ACCEPT_LANGUAGE='en')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()['technology_platforms'][0]['name'], 'English name')

        # Getting the french version
        response = self.test_user_client.get(url, HTTP_ACCEPT_LANGUAGE='fr')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()['technology_platforms'][0]['name'], 'French name')

    def test_innermost_translation(self):
        DigitalStrategy.objects.all().delete()
        HealthFocusArea.objects.all().delete()
        HealthCategory.objects.all().delete()
        cache.clear()

        strategy = DigitalStrategyFactory(name='Test strategy', group=DigitalStrategy.GROUP_CHOICES[0][0],
                                          name_en='English name', name_fr='French name')

        child_strategy = DigitalStrategyFactory(
            name='Child strategy', parent=strategy, group=DigitalStrategy.GROUP_CHOICES[0][0],
            name_en='Child name', name_fr='Omlette du fromage')

        health_category = HealthCategoryFactory(name='Parent category', name_en='English name', name_fr='French name')

        health_focus_area = HealthFocusAreaFactory(name='Health focus area', health_category=health_category,
                                                   name_en='English area', name_fr='French area')

        url = reverse('get-project-structure')
        # Getting the english version
        response = self.test_user_client.get(url, HTTP_ACCEPT_LANGUAGE='en')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()['strategies'][0],
                         {'name': 'Client',
                          'subGroups': [{'id': strategy.id,
                                         'name': 'English name',
                                         'strategies': [{'id': child_strategy.id,
                                                         'name': 'Child name'}]}]})
        self.assertEqual(response.json()['health_focus_areas'][0],
                         {'id': health_category.id,
                          'name': 'English name',
                          'health_focus_areas': [{'id': health_focus_area.id,
                                                  'name': 'English area',
                                                  'donors': None}]})

        # Getting the french version
        response = self.test_user_client.get(url, HTTP_ACCEPT_LANGUAGE='fr')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()['strategies'][0],
                         {'name': 'Client',
                          'subGroups': [{'id': strategy.id,
                                         'name': 'French name',
                                         'strategies': [{'id': child_strategy.id,
                                                         'name': 'Omlette du fromage'}]}]})
        self.assertEqual(response.json()['health_focus_areas'][0],
                         {'id': health_category.id,
                          'name': 'French name',
                          'health_focus_areas': [{'id': health_focus_area.id,
                                                  'name': 'French area',
                                                  'donors': None}]})

    def test_health_system_challenges(self):
        self.maxDiff = None
        HSCChallenge.objects.all().delete()
        HSCGroup.objects.all().delete()
        cache.clear()

        hsc_group = HSCGroupFactory(name='First group', name_en='First group', name_fr='Omlette du fromage')

        hsc = HSCChallengeFactory(name='Solve an issue', group=hsc_group, name_en='Solve an issue',
                                  name_fr="l'Solve an issue")
        hsc_2 = HSCChallengeFactory(name='Other problem appeared', group=hsc_group)
        hsc_3 = HSCChallengeFactory(name='Third failure here', group=hsc_group)

        url = reverse('get-project-structure')
        response = self.test_user_client.get(url, HTTP_ACCEPT_LANGUAGE='en')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()['hsc_challenges'][0],
                         {'name': 'First group',
                          'challenges': [
                              {'id': hsc_2.id,
                               'challenge': 'Other problem appeared', 'description': ''},
                              {'id': hsc.id,
                               'challenge': 'Solve an issue', 'description': ''},
                              {'id': hsc_3.id,
                               'challenge': 'Third failure here', 'description': ''}
                          ]})

        response = self.test_user_client.get(url, HTTP_ACCEPT_LANGUAGE='fr')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()['hsc_challenges'][0],
                         {'name': 'Omlette du fromage',
                          'challenges': [
                              {'id': hsc.id,
                               'challenge': "l'Solve an issue", 'description': ''},
                              {'id': hsc_2.id,
                               'challenge': 'Other problem appeared', 'description': ''},
                              {'id': hsc_3.id,
                               'challenge': 'Third failure here', 'description': ''}
                          ]})
