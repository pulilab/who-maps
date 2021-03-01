from django.db import models
from django.db.models import QuerySet
from django.db.models.query_utils import Q
from core.models import GetObjectOrNoneQueryset
from country.models import Country
from user.models import UserProfile
from rest_framework.authtoken.models import Token
from django.contrib.postgres.fields import JSONField
from project.models import Stage


class AuditLogBase(models.Model):
    """
    Basic properties and functions required by all AuditLog models
    - date: Year and Month of the DB entry
    - country: Country of the entry

    Data is filled each day by a celery task running at midnight
    """
    date = models.DateField(blank=False, help_text='WARNING: Only use the year and month of this', null=False)
    country = models.ForeignKey(Country, blank=False, null=False, on_delete=models.CASCADE)
    objects = GetObjectOrNoneQueryset.as_manager()

    class Meta:
        abstract = True


class AuditLogUsers(AuditLogBase):
    """
    AuditLog model tracking the user KPIs in the DB
    Pre-implementation historical data may be filled via searching through the DB for registrations
    User activity historical information is only available for post-implementation dates
    """
    role = UserProfile.ACCOUNT_TYPE_CHOICES
    registered = models.IntegerField(default=0)
    logged_in = models.IntegerField(default=0)  # "active" is a django keyword for non-disabled accounts

    class Meta:
        verbose_name = "User KPI"
        verbose_name_plural = "User KPIs"

    def __str__(self):
        return f'{self.date.year}-{self.date.month} - R{self.registered}/A{self.logged_in}'


class AuditLogApi(AuditLogBase):
    """
    AuditLog model tracking the usage of API keys
    Pre-implementation data: not available
    Important: Implementing token usage tracking needs to extend token api calls to update this model
               Tracking token IDs is important to get the actual number of tokens used
    """
    created = models.IntegerField(default=0)
    total = models.IntegerField(default=0)  # TODO: field calculated from the previous day's entry (?)
    used = models.ManyToManyField(Token, blank=True, related_name='usage')

    class Meta:
        verbose_name = "API KPI"
        verbose_name_plural = "API KPIs"

    def __str__(self):
        return f'{self.date.year}-{self.date.month} - C{self.total}/T{self.total}'


class AuditLogProjects(AuditLogBase):
    """
    AuditLog model tracking the project KPIs
    Pre-implementation historical data cannot be acquired
    """
    published = models.IntegerField(default=0)
    ready_to_publish = models.IntegerField(default=0)
    unpublished = models.IntegerField(default=0)
    to_delete = models.IntegerField(default=0)

    class Meta:
        verbose_name = "Project KPI"
        verbose_name_plural = "Project KPIs"

    @property
    def total(self):
        return self.published + self.unpublished

    def __str__(self):
        return f'{self.date.year}-{self.date.month} - P{self.published}/T{self.total}'


class AuditLogInvestor(AuditLogBase):
    """
    AuditLog model tracking the responses to the Investor choices question
    Pre-implementation historical data cannot be acquired
    data is stored in a dictionary, like:
    data = {<choice_n>: number_n, ...}
    """
    data = JSONField(default=dict)

    class Meta:
        verbose_name = "Investor KPI"
        verbose_name_plural = "Investor KPIs"

    def __str__(self):
        return f'{self.date.year}-{self.date.month} - {str(self.data)}'


class AuditLogDataStandards(AuditLogBase):
    """
    AuditLog model tracking the responses for the "interoperability_standards" property
    Pre-implementation historical data cannot be acquired
    data is stored in a dictionary, like:
    data = {<choice_n>: number_n, ...}
    """
    data = JSONField(default=dict)

    class Meta:
        verbose_name = "Data Standards KPI"
        verbose_name_plural = "Data Standards KPIs"

    def __str__(self):
        return f'{self.date.year}-{self.date.month} - {str(self.data)}'


class AuditLogProjectStages(AuditLogBase):
    """
    AuditLog model tracking the responses for the project stages
    Pre-implementation historical data can be acquired
    """
    data = JSONField(default=dict)

    class Meta:
        verbose_name = "Project Stages KPI"
        verbose_name_plural = "Project Stages KPIs"


class AuditLogProjectStatuses(AuditLogBase):
    """
    AuditLog model tracking the status of projects
    """
    active = models.IntegerField(default=0)  # projects which are active (qs supports it)
    ended = models.IntegerField(default=0)
    complete = models.IntegerField(default=0)
    discontinued = models.IntegerField(default=0)

    class Meta:
        verbose_name = "Project Statuses KPI"
        verbose_name_plural = "Project Statuses KPIs"


class AuditLogHFA(AuditLogBase):
    """
    AuditLog model tracking the health categories and health focus areas
    In order to support coverage, it stores data in a dict - all health categories with all hfa-s, with number of
    occurrences.
    TODO: check if this is feasible and makes sense in practice
    """
    data = JSONField(default=dict)

    class Meta:
        verbose_name = "Health Focus Areas KPI"
        verbose_name_plural = "Health Focus Areas KPIs"

