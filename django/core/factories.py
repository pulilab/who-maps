import pycountry
from django.contrib.auth.models import User
from django.utils import timezone
from factory import LazyAttribute, PostGenerationMethodCall, SubFactory
from factory.helpers import post_generation
from factory.faker import faker
from factory.django import DjangoModelFactory
from factory.fuzzy import FuzzyDateTime, FuzzyChoice

from cms.models import Post, Comment
from country.models import Donor, DonorCustomQuestion, Country, CountryCustomQuestion
from project.models import TechnologyPlatform, DigitalStrategy, HSCGroup, HSCChallenge, HealthCategory, \
    HealthFocusArea, Project, Licence, InteroperabilityStandard, HISBucket, InteroperabilityLink
from user.models import UserProfile, Organisation


DIGITAL_STRATEGY_GROUP_CHOICES = [item[0] for item in DigitalStrategy.GROUP_CHOICES]
COUNTRY_NAMES = [country.name for country in pycountry.countries]
POST_TYPES = [item[0] for item in Post.TYPE_CHOICES]
POST_DOMAINS = [item[0] for item in Post.DOMAIN_CHOICES]


class UserFactory(DjangoModelFactory):
    class Meta:
        model = User
        django_get_or_create = ('username',)

    username = LazyAttribute(
        lambda a: '{}'.format(faker.Faker().profile()['name'].lower().replace(' ', '_')))
    email = LazyAttribute(lambda a: f'{a.username}@example.com')
    password = PostGenerationMethodCall('set_password', 'test')
    is_active = True
    date_joined = FuzzyDateTime(
        start_dt=timezone.now() - timezone.timedelta(days=10),
        end_dt=timezone.now()
    )

    @post_generation
    def password(self, create, extracted, **kwargs):
        if extracted:
            self.set_password(extracted)


class UserProfileFactory(DjangoModelFactory):
    class Meta:
        model = UserProfile
        django_get_or_create = ('name',)

    user = SubFactory(UserFactory)
    name = LazyAttribute(lambda a: f'{a.user.username}')


class OrganisationFactory(DjangoModelFactory):
    class Meta:
        model = Organisation
        django_get_or_create = ('name',)

    name = LazyAttribute(lambda s: '{}'.format(faker.Faker().profile()['company']))


class DonorFactory(DjangoModelFactory):
    class Meta:
        model = Donor
        django_get_or_create = ('name',)

    name = LazyAttribute(lambda s: '{}'.format(faker.Faker().profile()['company']))


class TechnologyPlatformFactory(DjangoModelFactory):
    class Meta:
        model = TechnologyPlatform
        django_get_or_create = ('name',)

    name = LazyAttribute(lambda s: '{}'.format(faker.Faker().word().title()))


class DonorCustomQuestionFactory(DjangoModelFactory):
    class Meta:
        model = DonorCustomQuestion
        django_get_or_create = ('question', 'donor')

    donor = SubFactory(DonorFactory)
    question = LazyAttribute(
        lambda s: '{}'.format(faker.Faker().sentence().replace('.', '?'))
    )


class DigitalStrategyFactory(DjangoModelFactory):
    class Meta:
        model = DigitalStrategy
        django_get_or_create = ('name',)

    group = FuzzyChoice(DIGITAL_STRATEGY_GROUP_CHOICES)
    name = LazyAttribute(lambda s: '{}'.format(faker.Faker().sentence()))


class CountryFactory(DjangoModelFactory):
    class Meta:
        model = Country
        django_get_or_create = ('name',)

    name = FuzzyChoice(COUNTRY_NAMES)
    code = LazyAttribute(
        lambda s: '{}'.format(pycountry.countries.get(name=s.name).alpha_2)
    )


class CountryCustomQuestionFactory(DjangoModelFactory):
    class Meta:
        model = CountryCustomQuestion
        django_get_or_create = ('question', 'country')

    country = SubFactory(CountryFactory)
    question = LazyAttribute(
        lambda s: '{}'.format(faker.Faker().sentence().replace('.', '?'))
    )


class HSCGroupFactory(DjangoModelFactory):
    class Meta:
        model = HSCGroup
        django_get_or_create = ('name',)

    name = LazyAttribute(lambda s: '{}'.format(faker.Faker().profile()['company']))


class HSCChallengeFactory(DjangoModelFactory):
    class Meta:
        model = HSCChallenge
        django_get_or_create = ('name', 'group')

    name = LazyAttribute(lambda s: '{}'.format(faker.Faker().word().title()))
    group = SubFactory(HSCGroupFactory)


class HealthCategoryFactory(DjangoModelFactory):
    class Meta:
        model = HealthCategory
        django_get_or_create = ('name',)

    name = LazyAttribute(lambda s: '{}'.format(faker.Faker().word().title()))


class HealthFocusAreaFactory(DjangoModelFactory):
    class Meta:
        model = HealthFocusArea
        django_get_or_create = ('name',)

    name = LazyAttribute(lambda s: '{}'.format(faker.Faker().word().title()))
    health_category = SubFactory(HealthCategoryFactory)


class PostFactory(DjangoModelFactory):
    class Meta:
        model = Post

    name = LazyAttribute(lambda s: '{}'.format(faker.Faker().word().title()))
    body = LazyAttribute(lambda s: '{}'.format(faker.Faker().sentence()))
    type = FuzzyChoice(POST_TYPES)
    domain = FuzzyChoice(POST_DOMAINS)
    author = SubFactory(UserProfileFactory)


class ProjectFactory(DjangoModelFactory):
    class Meta:
        model = Project
        django_get_or_create = ('name',)

    name = LazyAttribute(lambda s: '{}'.format(faker.Faker().word().title()))

    @post_generation
    def team(self, create, extracted, **kwargs):
        if extracted:
            for user_profile in extracted:
                self.team.add(user_profile)


class CommentFactory(DjangoModelFactory):
    class Meta:
        model = Comment
        django_get_or_create = ('text', 'user')

    text = LazyAttribute(lambda s: '{}'.format(faker.Faker().sentence()))
    user = SubFactory(UserProfileFactory)
    post = SubFactory(PostFactory)


class LicenceFactory(DjangoModelFactory):
    class Meta:
        model = Licence
        django_get_or_create = ('name',)

    name = LazyAttribute(lambda s: '{}'.format(faker.Faker().word().title()))


class InteroperabilityStandardFactory(DjangoModelFactory):
    class Meta:
        model = InteroperabilityStandard
        django_get_or_create = ('name',)

    name = LazyAttribute(lambda s: '{}'.format(faker.Faker().word().title()))


class HISBucketFactory(DjangoModelFactory):
    class Meta:
        model = HISBucket
        django_get_or_create = ('name',)

    name = LazyAttribute(lambda s: '{}'.format(faker.Faker().word().title()))


class InteroperabilityLinkFactory(DjangoModelFactory):
    class Meta:
        model = InteroperabilityLink
        django_get_or_create = ('name', 'pre')

    name = LazyAttribute(lambda s: '{}'.format(faker.Faker().word().title()))
    pre = LazyAttribute(lambda s: '{}'.format(faker.Faker().word().title()))
