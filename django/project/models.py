from django.db import models

from core.models import ExtendedModel


class Strategy(ExtendedModel):
    project_specific = models.BooleanField(default=False)
    name = models.CharField(max_length=100)


class Technology(ExtendedModel):
    project_specific = models.BooleanField(default=False)
    type = models.CharField(max_length=100)
    name = models.CharField(max_length=100)


class Application(ExtendedModel):
    name = models.CharField(max_length=100)


class Pipeline(ExtendedModel):
    project_specific = models.BooleanField(default=False)
    name = models.CharField(max_length=100)


class Project(ExtendedModel):
    date = models.DateTimeField()
    name = models.CharField(max_length=255, unique=True)
    organisation = models.CharField(max_length=100)
    strategy = models.ManyToManyField(Strategy, blank=True)
    technology = models.ManyToManyField(Technology, blank=True)
    application = models.ManyToManyField(Application, blank=True)
    clients = models.PositiveIntegerField()
    health_workers = models.PositiveIntegerField()
    facilities = models.PositiveIntegerField()
    started = models.DateTimeField()
    donors = models.TextField()
    pipeline = models.ManyToManyField(Pipeline, blank=True)
    goals_to_scale = models.TextField()
    anticipated_time = models.TextField()


class Report(ExtendedModel):
    project = models.ForeignKey(Project, related_name="reports")
    url = models.URLField(blank=True)
    filename = models.CharField(max_length=100, blank=True)
    file = models.BinaryField(null=True)


class Publication(ExtendedModel):
    project = models.ForeignKey(Project, related_name="publications")
    url = models.URLField(blank=True)
    filename = models.CharField(max_length=100, blank=True)
    file = models.BinaryField(null=True)
