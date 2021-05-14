from django.db import models
from core.models import GetObjectOrNoneQueryset
from country.models import Country
from django.contrib.postgres.fields import JSONField, ArrayField
from setfield import SetField


class AuditLogBase(models.Model):
    """
    Basic properties and functions required by all AuditLog models
    - date: Year and Month of the DB entry
    - country: Country of the entry
    - data: JSONField. All KPI classes store the per-investor data in a JSONField

    Data is updated each day by a celery task running at midnight
    """
    date = models.DateField(blank=False, help_text='WARNING: Only use the year and month of this', null=False)
    country = models.ForeignKey(Country, blank=True, null=True, on_delete=models.CASCADE)
    data = JSONField(blank=True, default=dict)  # JSONField containing data on a per-investor basis

    objects = GetObjectOrNoneQueryset.as_manager()

    class Meta:
        abstract = True
        unique_together = ['date', 'country']
        indexes = [
            models.Index(fields=['date', 'country']),
            models.Index(fields=['date'],),
            # Country is a foreign key, index is automatically generated for it
        ]


class AuditLogUsers(AuditLogBase):
    """
    AuditLog model tracking the user KPIs in the DB
    Important: we track user logins on a per-day basis, not as "total number of individual users logged in during the
               month"

    data format:
      {
        "<investor_name_1>":
          {
            "<role_1>": {
              "registered": (int),
              "active": (int),
            },
            "<role_2>": {
              "registered": (int),
              "active": (int),
            },
          },
        "<investor_name_2>":
          {
            "registered": (int),
            "active": (int),
          },
      }
    """

    registered = models.IntegerField(default=0)  # Total number of registered users in month
    active = models.IntegerField(default=0)  # Total number of users logged in month

    class Meta:
        verbose_name = "User KPI"
        verbose_name_plural = "User KPIs"

    def __str__(self):  # pragma: no cover
        return f'{self.date.year}-{self.date.month} - {str(self.data)}'


class AuditLogTokens(AuditLogBase):
    """
    AuditLog model tracking the token KPIs in the DB
    Important: We do not track token usage, only their existence

    data format:
      {
        "<investor_name_1>":
          {
            "<role_1>": (int),
            "<role_2>": (int),
            "total": (int)
          },
        "<investor_name_2>":
          {
            "<role_1>": (int),
            "<role_2>": (int),
            "total": (int)
          },
      }
    """

    tokens = models.IntegerField(default=0)  # Total number of tokens

    class Meta:
        verbose_name = "Token KPI"
        verbose_name_plural = "Token KPIs"

    def __str__(self):  # pragma: no cover
        return f'{self.date.year}-{self.date.month} - {str(self.data)}'


class AuditLogProjectStatus(AuditLogBase):
    """
    AuditLog model tracking the project KPIs in the DB
    Needs to track project state changes and run the validator to determine if a project is publishable

    data format:
      {
        "<investor_id_1>":
          {
            "published": {(int)},
            "ready_to_publish": {(int)},
            "unpublished": {(int)},
            "to_delete": {(int)},
            "growth": (int)
          },
        "<investor_id_2>":
          {
            "published": {(int)},
            "ready_to_publish": {(int)},
            "unpublished": {(int)},
            "to_delete": {(int)},
            "growth": (int)
          },
      }
    """

    published = ArrayField(models.IntegerField(null=True, blank=True), blank=True, default=list)
    ready_to_publish = ArrayField(models.IntegerField(null=True, blank=True), blank=True, default=list)
    unpublished = ArrayField(models.IntegerField(null=True, blank=True), blank=True, default=list)
    to_delete = ArrayField(models.IntegerField(null=True, blank=True), blank=True, default=list)
    growth = models.IntegerField(default=0)  # Total number of new projects

    class Meta:
        verbose_name = "Project Status KPI"
        verbose_name_plural = "Project Status KPIs"

    def __str__(self):  # pragma: no cover
        return f'{self.date.year}-{self.date.month}-{self.country} - P: {self.published}, ' \
               f'RP: {self.ready_to_publish}, U: {self.unpublished}, TD: {self.to_delete}, G:{self.growth}'
