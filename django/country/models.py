from django.contrib.postgres.fields import JSONField
from django.contrib.postgres.fields.array import ArrayField
from django.db import models

from core.models import NameByIDMixin, ExtendedModel, ExtendedMultilingualModel
from user.models import UserProfile


class Country(NameByIDMixin, ExtendedMultilingualModel):
    name = models.CharField(max_length=255, unique=True)
    code = models.CharField(max_length=4, default="NULL", help_text="ISO3166-1 country code", unique=True)
    logo = models.ImageField(blank=True, null=True)
    cover = models.ImageField(blank=True, null=True)
    cover_text = models.TextField(blank=True, null=True)
    footer_title = models.CharField(max_length=128, blank=True, null=True)
    footer_text = models.CharField(max_length=128, blank=True, null=True)
    users = models.ManyToManyField(UserProfile, help_text="User who can update the country", blank=True,
                                   related_name='+', limit_choices_to={'user__groups__name': 'Country Admin'})
    project_approval = models.BooleanField(default=False)
    map_data = JSONField(default=dict(), blank=True)
    map_activated_on = models.DateTimeField(blank=True, null=True,
                                            help_text="WARNING: this field is for developers only")

    class Meta:
        verbose_name_plural = "Countries"
        ordering = ('id',)

    def __str__(self):
        return self.name


class PartnerLogo(ExtendedModel):
    country = models.ForeignKey(Country)
    image = models.ImageField(null=True)

    @property
    def image_url(self):
        return self.image.url if self.image else None


class MapFile(ExtendedModel):
    country = models.ForeignKey(Country)
    map_file = models.FileField(null=True, upload_to='uploaded_maps/')


class CountryFieldManager(models.Manager):
    def get_schema(self, country_id):
        return self.filter(country_id=country_id, schema=True, enabled=True)

    def get_answers(self, country_id, project_id):
        return self.filter(country_id=country_id, project_id=project_id, enabled=True, schema=False)


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

    country = models.ForeignKey(Country, related_name='fields')
    type = models.IntegerField(choices=TYPE_CHOICES)
    question = models.CharField(max_length=256, blank=False)
    options = ArrayField(models.CharField(max_length=256), blank=True, null=True)
    answer = models.TextField(max_length=2000, blank=True)
    draft = models.TextField(max_length=2000, blank=True)
    project = models.ForeignKey('project.Project', null=True)
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

    @classmethod
    def get_for_project(cls, project, draft_mode=False):
        """
        Return all the country fields available for a country filled with the answers (if present)
        """
        country = project.get_country(draft_mode)
        if not country:  # pragma: no cover
            return []

        schema = cls.objects.get_schema(country.id)
        answers = cls.objects.get_answers(country_id=country.id, project_id=project.id)
        country_fields = []

        for field in schema:
            found = answers.filter(question=field.question, type=field.type).first()
            if found:
                country_fields.append(found)

        return country_fields

    @classmethod
    def get_schema_for_answer(cls, country, question):
        return cls.objects.filter(schema=True, enabled=True, country=country, question=question).first()

    def to_representation(self, draft_mode=False):
        return {
            "schema_id": getattr(self.schema_instance, 'pk', None),
            "country": self.country.id,
            "type": self.type,
            "question": self.question,
            "answer": self.draft if draft_mode else self.answer,
            "project": self.project.id
        }
