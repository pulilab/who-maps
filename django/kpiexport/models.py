from django.db import models
from django.db.models import QuerySet
from django.db.models.query_utils import Q
from core.models import GetObjectOrNoneQueryset
from country.models import Country, Donor
from user.models import UserProfile
from rest_framework.authtoken.models import Token
from django.contrib.postgres.fields import JSONField
from project.models import Stage


class AuditLogBase(models.Model):
    """
    Basic properties and functions required by all AuditLog models
    - date: Year and Month of the DB entry
    - country: Country of the entry
    - data: JSONField. All KPI classes store the per-investor data in a JSONField

    Data is updated each day by a celery task running at midnight
    """
    date = models.DateField(blank=False, help_text='WARNING: Only use the year and month of this', null=False)
    country = models.ForeignKey(Country, blank=False, null=False, on_delete=models.CASCADE)
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

    def __str__(self):
        return f'{self.date.year}-{self.date.month} - {str(self.data)}'
