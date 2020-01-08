import factory
from django.contrib.auth.models import User
from django.utils import timezone
from factory.faker import faker
from factory.fuzzy import FuzzyDateTime

from user.models import UserProfile


class UserFactory(factory.DjangoModelFactory):
    class Meta:
        model = User
        django_get_or_create = ('username',)

    username = factory.LazyAttribute(
        lambda a: '{}'.format(faker.Faker().profile()['name'].lower().replace(' ', '_')))
    email = factory.LazyAttribute(lambda a: f'{a.username}@example.com')
    password = factory.PostGenerationMethodCall('set_password', 'test')
    is_active = True
    date_joined = FuzzyDateTime(
        start_dt=timezone.now() - timezone.timedelta(days=10),
        end_dt=timezone.now()
    )

    @factory.post_generation
    def password(self, create, extracted, **kwargs):
        if extracted:
            self.set_password(extracted)


class UserProfileFactory(factory.DjangoModelFactory):
    class Meta:
        model = UserProfile
        django_get_or_create = ('name',)

    user = factory.SubFactory(UserFactory)
    name = factory.LazyAttribute(lambda a: f'{a.user.username}')
