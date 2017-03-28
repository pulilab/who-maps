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
