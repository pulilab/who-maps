import factory
import pycountry
from django.contrib.auth.models import User
from django.utils import timezone
from factory.faker import faker
from factory.fuzzy import FuzzyDateTime, FuzzyChoice

from cms.models import Post, Comment
from country.models import Donor, DonorCustomQuestion, Country, CountryCustomQuestion
from project.models import TechnologyPlatform, DigitalStrategy, HSCGroup, HSCChallenge, HealthCategory, \
    HealthFocusArea, Project
from user.models import UserProfile, Organisation


DIGITAL_STRATEGY_GROUP_CHOICES = [item[0] for item in DigitalStrategy.GROUP_CHOICES]
COUNTRY_NAMES = [country.name for country in pycountry.countries]
POST_TYPES = [item[0] for item in Post.TYPE_CHOICES]
POST_DOMAINS = [item[0] for item in Post.DOMAIN_CHOICES]


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


class CountryFactory(factory.DjangoModelFactory):
    class Meta:
        model = Country
        django_get_or_create = ('name',)

    name = FuzzyChoice(COUNTRY_NAMES)
    code = factory.LazyAttribute(
        lambda s: '{}'.format(pycountry.countries.get(name=s.name).alpha_2)
    )


class CountryCustomQuestionFactory(factory.DjangoModelFactory):
    class Meta:
        model = CountryCustomQuestion
        django_get_or_create = ('question', 'country')

    country = factory.SubFactory(CountryFactory)
    question = factory.LazyAttribute(
        lambda s: '{}'.format(faker.Faker().sentence().replace('.', '?'))
    )


class HSCGroupFactory(factory.DjangoModelFactory):
    class Meta:
        model = HSCGroup
        django_get_or_create = ('name',)

    name = factory.LazyAttribute(lambda s: '{}'.format(faker.Faker().profile()['company']))


class HSCChallengeFactory(factory.DjangoModelFactory):
    class Meta:
        model = HSCChallenge
        django_get_or_create = ('name', 'group')

    name = factory.LazyAttribute(lambda s: '{}'.format(faker.Faker().word().title()))
    group = factory.SubFactory(HSCGroupFactory)


class HealthCategoryFactory(factory.DjangoModelFactory):
    class Meta:
        model = HealthCategory
        django_get_or_create = ('name',)

    name = factory.LazyAttribute(lambda s: '{}'.format(faker.Faker().word().title()))


class HealthFocusAreaFactory(factory.DjangoModelFactory):
    class Meta:
        model = HealthFocusArea
        django_get_or_create = ('name',)

    name = factory.LazyAttribute(lambda s: '{}'.format(faker.Faker().word().title()))
    health_category = factory.SubFactory(HealthCategoryFactory)


class PostFactory(factory.DjangoModelFactory):
    class Meta:
        model = Post

    name = factory.LazyAttribute(lambda s: '{}'.format(faker.Faker().word().title()))
    body = factory.LazyAttribute(lambda s: '{}'.format(faker.Faker().sentence()))
    type = FuzzyChoice(POST_TYPES)
    domain = FuzzyChoice(POST_DOMAINS)
    author = factory.SubFactory(UserProfileFactory)


class ProjectFactory(factory.DjangoModelFactory):
    class Meta:
        model = Project
        django_get_or_create = ('name',)

    name = factory.LazyAttribute(lambda s: '{}'.format(faker.Faker().word().title()))

    @factory.post_generation
    def team(self, create, extracted, **kwargs):
        if extracted:
            for user_profile in extracted:
                self.team.add(user_profile)


class CommentFactory(factory.DjangoModelFactory):
    class Meta:
        model = Comment
        django_get_or_create = ('text', 'user')

    text = factory.LazyAttribute(lambda s: '{}'.format(faker.Faker().sentence()))
    user = factory.SubFactory(UserProfileFactory)
    post = factory.SubFactory(PostFactory)
