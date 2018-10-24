from django.contrib.postgres.fields import JSONField
from django.contrib.postgres.fields.array import ArrayField
from django.db import models
from django.utils.translation import ugettext_lazy as _
from django.core.validators import MinLengthValidator
from ordered_model.models import OrderedModel

from core.models import NameByIDMixin, ExtendedModel, ExtendedMultilingualModel, SoftDeleteModel
from user.models import UserProfile


class LandingPageCommon(NameByIDMixin, ExtendedMultilingualModel):
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

    def user_in_groups(self, profile):
        return self.admins.filter(id=profile.id).exists() or \
               self.super_admins.filter(id=profile.id).exists() or \
               self.users.filter(id=profile.id).exists()


class Country(UserManagement, LandingPageCommon):
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
    map_data = JSONField(default=dict, blank=True)
    map_activated_on = models.DateTimeField(blank=True, null=True,
                                            help_text="WARNING: this field is for developers only")
    project_approval = models.BooleanField(default=False)

    class Meta:
        verbose_name_plural = "Countries"
        ordering = ('id',)


class Donor(UserManagement, LandingPageCommon):
    code = models.CharField(max_length=10, default="NULL", help_text="Acronym for Donor", unique=True,
                            validators=[MinLengthValidator(3)])

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




class CountryField(models.Model):
    TEXT = 1
    NUMBER = 2
    YESNO = 3
    SINGLE = 4
    MULTI = 5

    TYPE_CHOICES = (
        (TEXT, "Text field"),
        (NUMBER, "Numeric field"),
        (YESNO, "Yes - no field"),
        (SINGLE, "Single choice"),
        (MULTI, "Multiple choice"),
    )

    country = models.ForeignKey(Country, related_name='fields', on_delete=models.CASCADE)
    type = models.IntegerField(choices=TYPE_CHOICES)
    question = models.CharField(max_length=256, blank=False)
    options = ArrayField(models.CharField(max_length=256), blank=True, null=True)
    answer = models.TextField(max_length=2000, blank=True)
    draft = models.TextField(max_length=2000, blank=True)
    project = models.ForeignKey('project.Project', null=True, on_delete=models.CASCADE)
    enabled = models.BooleanField(default=True, help_text="This field will show up on the project page if enabled")
    schema = models.BooleanField(default=True, help_text="Determines if this is treated as the schema for country")
    schema_instance = models.ForeignKey('self', null=True, on_delete=models.CASCADE)
    required = models.BooleanField(default=False)

    objects = CountryFieldManager()

    class Meta:
        ordering = ['id']

    def save(self, *args, **kwargs):
        if self.type in [CountryField.TEXT, CountryField.NUMBER, CountryField.YESNO]:
            self.options = None
        super(CountryField, self).save(*args, **kwargs)

    def __str__(self):
        return ""


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

    class Meta(OrderedModel.Meta):
        pass


class CountryCustomQuestion(CustomQuestion):
    country = models.ForeignKey(Country, related_name='country_questions', on_delete=models.CASCADE)
    order_with_respect_to = 'country'

    class Meta(OrderedModel.Meta):
        pass
