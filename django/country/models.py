from django.conf import settings
from django.contrib.contenttypes.fields import GenericForeignKey
from django.contrib.contenttypes.models import ContentType
from django.contrib.postgres.fields.array import ArrayField
from django.db import models
from django.db.models.signals import pre_save, post_save
from django.dispatch import receiver
from django.forms import MultipleChoiceField
from django import forms
from django.utils.translation import gettext_lazy as _
from django.core.validators import MinLengthValidator
from ordered_model.models import OrderedModel, OrderedModelManager
from taggit.managers import TaggableManager

from country.tasks import update_gdhi_data_task
from core.models import ExtendedModel, ExtendedMultilingualModel, SoftDeleteModel
from country.validators import file_size
from user.models import UserProfile


class ArchitectureRoadMap(models.Model):
    road_map_enabled = models.BooleanField(default=False)

    class Meta:
        abstract = True


class GDHI(models.Model):
    PHASE_CHOICES = (
        (1, _('Phase 1')),
        (2, _('Phase 2')),
        (3, _('Phase 3')),
        (4, _('Phase 4')),
        (5, _('Phase 5')),
    )

    alpha_3_code = models.CharField(max_length=3, blank=True, null=True)

    total_population = models.DecimalField(max_digits=7, decimal_places=2, null=True, blank=True,
                                           verbose_name='Total population in Millions')
    gni_per_capita = models.DecimalField(max_digits=7, decimal_places=2, null=True, blank=True,
                                         verbose_name='GNI per capita in Thousands')
    life_expectancy = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True,
                                          verbose_name='Life expectancy at birth (years)')
    health_expenditure = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True,
                                             verbose_name='Health expenditure (% of GDP)')

    leadership_and_governance = models.PositiveSmallIntegerField(choices=PHASE_CHOICES, null=True, blank=True,)
    strategy_and_investment = models.PositiveSmallIntegerField(choices=PHASE_CHOICES, null=True, blank=True,)
    legislation_policy_compliance = models.PositiveSmallIntegerField(choices=PHASE_CHOICES, null=True, blank=True,)
    workforce = models.PositiveSmallIntegerField(choices=PHASE_CHOICES, null=True, blank=True,)
    standards_and_interoperability = models.PositiveSmallIntegerField(choices=PHASE_CHOICES, null=True, blank=True,)
    infrastructure = models.PositiveSmallIntegerField(choices=PHASE_CHOICES, null=True, blank=True,)
    services_and_applications = models.PositiveSmallIntegerField(choices=PHASE_CHOICES, null=True, blank=True,)

    gdhi_enabled = models.BooleanField(default=True)

    class Meta:
        abstract = True


class LandingPageCommon(ExtendedMultilingualModel):
    name = models.CharField(max_length=255, unique=True)
    logo = models.ImageField(blank=True, null=True)
    cover = models.ImageField(blank=True, null=True)
    cover_text = models.TextField(blank=True, null=True)
    footer_title = models.CharField(max_length=128, blank=True, null=True)
    footer_text = models.CharField(max_length=128, blank=True, null=True)

    class Meta:
        abstract = True

    def __str__(self):
        return self.name

    @property
    def cover_url(self):
        return self.cover.url if self.cover else None

    @property
    def logo_url(self):
        return self.logo.url if self.logo else None


class UserManagement(models.Model):
    users = models.ManyToManyField(UserProfile, help_text="User/viewer who can read confidential answers", blank=True,
                                   related_name='%(class)s_viewers')
    admins = models.ManyToManyField(UserProfile, help_text="User who can write questionnaire", blank=True,
                                    related_name='%(class)s_admins')
    super_admins = models.ManyToManyField(UserProfile, help_text="User who can update landing and all above",
                                          blank=True, related_name='%(class)s_super_admins')

    class Meta:
        abstract = True

    def user_in_admin_groups(self, profile):
        return self.admins.filter(id=profile.id).exists() or \
               self.super_admins.filter(id=profile.id).exists()

    def user_in_groups(self, profile):
        return self.user_in_admin_groups(profile) or \
               self.users.filter(id=profile.id).exists()


class Country(UserManagement, LandingPageCommon, GDHI, ArchitectureRoadMap):
    REGIONS = [
        (0, _('African Region')),
        (1, _('Region of the Americas')),
        (2, _('South-East Asia Region')),
        (3, _('European Region')),
        (4, _('Eastern Mediterranean Region')),
        (5, _('Western Pacific Region'))
    ]

    code = models.CharField(max_length=4, default="NULL", help_text="ISO3166-1 country code", unique=True)
    region = models.IntegerField(choices=REGIONS, null=True, blank=True)
    map_data = models.JSONField(default=dict, blank=True)
    map_activated_on = models.DateTimeField(blank=True, null=True,
                                            help_text="WARNING: this field is for developers only")
    project_approval = models.BooleanField(default=False)
    lat = models.DecimalField(null=True, blank=True, max_digits=18, decimal_places=15)
    lon = models.DecimalField(null=True, blank=True, max_digits=18, decimal_places=15)

    is_global = models.BooleanField(default=False)

    class Meta:
        verbose_name_plural = "Countries"
        ordering = ('id',)


@receiver(pre_save, sender=Country)
def save_coordinates(sender, instance, **kwargs):
    if instance.map_data:
        try:
            instance.lat = instance.map_data['polylabel']['lat']
            instance.lon = instance.map_data['polylabel']['lng']
        except (TypeError, KeyError, ValueError):
            pass


@receiver(post_save, sender=Country)
def update_gdhi_data(sender, instance, created, **kwargs):
    if all([settings.ENABLE_GDHI_UPDATE_ON_COUNTRY_SAVE, instance.gdhi_enabled, instance.code]):
        update_gdhi_data_task.apply_async((instance.code, True))


class MultiArrayField(ArrayField):
    def formfield(self, **kwargs):  # pragma: no cover
        defaults = {
            "form_class": MultipleChoiceField,
            "choices": self.base_field.choices,
            "widget": forms.CheckboxSelectMultiple,
            **kwargs
        }
        return super(ArrayField, self).formfield(**defaults)


class ReferenceDocumentType(models.Model):
    name = models.CharField(max_length=64)
    external_id = models.IntegerField(verbose_name='Better eHealth ID', blank=True, null=True)

    def __str__(self):  # pragma: no cover
        return self.name


class ReferenceDocument(ExtendedModel):
    class Language(models.TextChoices):
        ENGLISH = "en", _("English")
        FRENCH = "fr", _("French")
        SPANISH = "es", _("Spanish")
        PORTUGUESE = "pt", _("Portuguese")
        ARABIC = "ar", _("Arabic")
        CHINESE = "cn", _("Chinese")
        RUSSIAN = "ru", _("Russian")
        OTHER = "xx", _("Other")

    country = models.ForeignKey(Country, related_name='documents', on_delete=models.CASCADE)
    document = models.FileField(null=True, upload_to='documents/', validators=[file_size])
    author = models.ForeignKey(UserProfile, related_name='documents', on_delete=models.CASCADE)
    language = models.CharField(choices=Language.choices)

    title = models.CharField(max_length=128)
    purpose = models.TextField()
    valid_from = models.DateField()
    valid_until = models.DateField(blank=True, null=True)
    featured = models.BooleanField(default=False)
    document_types = models.ManyToManyField(ReferenceDocumentType)
    tags = TaggableManager(blank=True)

    class Meta:
        ordering = ('featured', 'id', 'title')

    def __str__(self):  # pragma: no cover
        return self.title


class Donor(UserManagement, LandingPageCommon):
    code = models.CharField(max_length=10, default="NULL", help_text="Acronym for Donor", unique=True,
                            validators=[MinLengthValidator(3)])

    # generic foreign key related fields
    content_type = models.ForeignKey(ContentType, on_delete=models.CASCADE, blank=True, null=True)
    object_id = models.PositiveIntegerField(blank=True, null=True)
    content_object = GenericForeignKey()

    class Meta:
        verbose_name_plural = "Donors"
        ordering = ('name',)


class PartnerLogo(ExtendedModel):
    country = models.ForeignKey(Country, related_name="partner_logos", on_delete=models.CASCADE)
    image = models.ImageField(null=True)

    @property
    def image_url(self):
        return self.image.url if self.image else None


class DonorPartnerLogo(ExtendedModel):
    donor = models.ForeignKey(Donor, related_name="partner_logos", on_delete=models.CASCADE)
    image = models.ImageField(null=True)

    @property
    def image_url(self):
        return self.image.url if self.image else None


class MapFile(ExtendedModel):
    country = models.ForeignKey(Country, on_delete=models.CASCADE, related_name='map_files')
    map_file = models.FileField(null=True, upload_to='uploaded_maps/')


class CustomQuestion(SoftDeleteModel, ExtendedModel, OrderedModel):
    TEXT = 1
    NUMBER = 2
    YESNO = 3
    SINGLE = 4
    MULTI = 5

    TYPE_CHOICES = (
        (TEXT, _("Text answer")),
        (NUMBER, _("Numeric answer")),
        (YESNO, _("Yes/No answer")),
        (SINGLE, _("Single choice")),
        (MULTI, _("Multiple choice")),
    )

    type = models.IntegerField(choices=TYPE_CHOICES, default=TEXT)
    question = models.CharField(max_length=256, blank=False)
    options = ArrayField(models.CharField(max_length=256), blank=True, null=True)

    private = models.BooleanField(default=False)
    required = models.BooleanField(default=False)

    class Meta:
        abstract = True
        default_manager_name = 'objects'
        base_manager_name = 'objects'


class DonorCustomQuestion(CustomQuestion):
    donor = models.ForeignKey(Donor, related_name='donor_questions', on_delete=models.CASCADE)
    order_with_respect_to = 'donor'

    objects = OrderedModelManager()

    class Meta(OrderedModel.Meta):
        pass

    def get_order(self):
        return self.__class__.objects.filter(donor=self.donor).values('id', 'order')


class CountryCustomQuestion(CustomQuestion):
    country = models.ForeignKey(Country, related_name='country_questions', on_delete=models.CASCADE)
    order_with_respect_to = 'country'

    objects = OrderedModelManager()

    class Meta(OrderedModel.Meta):
        pass

    def get_order(self):
        return self.__class__.objects.filter(country=self.country).values('id', 'order')
