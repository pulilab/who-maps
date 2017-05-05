from django.db import models
from core.models import NameByIDMixin, ExtendedModel
from user.models import UserProfile


class Country(NameByIDMixin, ExtendedModel):
    name = models.CharField(max_length=255, unique=True)
    code = models.CharField(max_length=4, default="NULL", help_text="ISO3166-1 country code", unique=True)
    logo = models.ImageField(blank=True, null=True)
    cover = models.ImageField(blank=True, null=True)
    cover_text = models.TextField(blank=True, null=True)
    footer_title = models.CharField(max_length=128, blank=True, null=True)
    footer_text = models.CharField(max_length=128, blank=True, null=True)
    user = models.ForeignKey(UserProfile, help_text="User who can update the country", null=True, blank=True,
                             related_name="country_admin")

    class Meta:
        verbose_name_plural = "Countries"

    def __str__(self):  # pragma: no cover
        return self.name


class PartnerLogo(ExtendedModel):
    country = models.ForeignKey(Country)
    image = models.ImageField(null=True)

    @property
    def image_url(self):
        return self.image.url if self.image else None


class CountryFieldManager(models.Manager):
    def get_schema(self, country_id):
        return self.get_queryset().filter(country_id=country_id, schema=True, enabled=True)

    def get_answers(self, country_id, project_id):
        return self.get_queryset().filter(country_id=country_id, project_id=project_id, schema=False)


class CountryField(models.Model):
    TEXT = 1
    NUMBER = 2
    YESNO = 3

    TYPE_CHOICES = (
        (TEXT, "Text field"),
        (NUMBER, "Numeric field"),
        (YESNO, "Yes - no field"),
    )

    country = models.ForeignKey(Country)
    type = models.IntegerField(choices=TYPE_CHOICES)
    question = models.CharField(max_length=256, blank=False)
    answer = models.TextField(max_length=2000, blank=True)
    project = models.ForeignKey('project.Project', null=True)
    enabled = models.BooleanField(default=True, help_text="This field will show up on the project page if enabled")
    objects = CountryFieldManager()

    def __str__(self):
        return ""

    def to_representation(self):
        return {
            "country": self.country.id,
            "type": self.type,
            "question": self.question,
            "answer": self.answer,
            "project": self.project.id
        }
