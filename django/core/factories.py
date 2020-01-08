import factory
from django.contrib.auth.models import User
from django.utils import timezone
from factory.faker import faker
from factory.fuzzy import FuzzyDateTime, FuzzyChoice

from country.models import Donor, DonorCustomQuestion
from project.models import TechnologyPlatform, DigitalStrategy
from user.models import UserProfile, Organisation


DIGITAL_STRATEGY_GROUP_CHOICES = [item[0] for item in DigitalStrategy.GROUP_CHOICES]


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


class OrganisationFactory(factory.DjangoModelFactory):
    class Meta:
        model = Organisation
        django_get_or_create = ('name',)

    name = factory.LazyAttribute(lambda s: '{}'.format(faker.Faker().profile()['company']))


class DonorFactory(factory.DjangoModelFactory):
    class Meta:
        model = Donor
        django_get_or_create = ('name',)

    name = factory.LazyAttribute(lambda s: '{}'.format(faker.Faker().profile()['company']))


class TechnologyPlatformFactory(factory.DjangoModelFactory):
    class Meta:
        model = TechnologyPlatform
        django_get_or_create = ('name',)

    name = factory.LazyAttribute(lambda s: '{}'.format(faker.Faker().word().title()))


class DonorCustomQuestionFactory(factory.DjangoModelFactory):
    class Meta:
        model = DonorCustomQuestion
        django_get_or_create = ('question', 'donor')

    donor = factory.SubFactory(DonorFactory)
    question = factory.LazyAttribute(
        lambda s: '{}'.format(faker.Faker().sentence().replace('.', '?'))
    )


class DigitalStrategyFactory(factory.DjangoModelFactory):
    class Meta:
        model = DigitalStrategy
        django_get_or_create = ('name',)

    group = FuzzyChoice(DIGITAL_STRATEGY_GROUP_CHOICES)
    name = factory.LazyAttribute(lambda s: '{}'.format(faker.Faker().sentence()))
