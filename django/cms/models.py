import itertools
from django.db import models
from django.template.defaultfilters import slugify

from core.models import ExtendedModel
from user.models import UserProfile


class StateManager(models.QuerySet):

    def normal(self):
        return self.filter(state=State.NORMAL)

    def flagged(self):
        return self.filter(state=State.FLAGGED)

    def banned(self):
        return self.filter(state=State.BANNED)

    def showable(self):
        return self.exclude(state=State.BANNED)


class State(ExtendedModel):
    NORMAL = 1
    FLAGGED = 2
    BANNED = 3

    STATE_CHOICES = (
        (1, "Resources"),
        (2, "Lessons & Tips"),
        (3, "Experiences"),
    )

    state = models.IntegerField(choices=STATE_CHOICES, default=NORMAL)

    objects = StateManager.as_manager()

    class Meta:
        abstract = True

    def flag(self):
        self.state = self.FLAGGED
        self.save()

    def ban(self):
        self.state = self.BANNED
        self.save()

    def normalize(self):
        self.state = self.NORMAL
        self.save()


class Post(State):
    RESOURCE = 1
    LESSON = 2
    EXPERIENCE = 3

    TYPE_CHOICES = (
        (RESOURCE, "Resources"),
        (LESSON, "Lessons & Tips"),
        (EXPERIENCE, "Experiences"),
    )

    DOMAIN_CHOICES = (
        (1, "Parameters of Scale"),
        (2, "Contextual Environment"),
        (3, "Scientific Basis"),
        (4, "Strategic Engagement"),
        (5, "Partnership Sustainability"),
        (6, "Financial Management"),
        (7, "Financial Model"),
        (8, "Data"),
        (9, "Interoperability"),
        (10, "Adaptability"),
        (11, "Personnel"),
        (12, "Training and Support"),
        (13, "Outreach and Sensitization"),
        (14, "Contingency Planning"),
        (15, "Process Monitoring"),
        (16, "Evaluation Research"),
    )

    name = models.CharField(max_length=128)
    slug = models.SlugField(unique=True)
    body = models.TextField(max_length=5000)
    type = models.IntegerField(choices=TYPE_CHOICES)
    domain = models.IntegerField(choices=DOMAIN_CHOICES)
    cover = models.ImageField(null=True, blank=True)
    author = models.ForeignKey(UserProfile)

    def __str__(self):
        return self.name

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)

        for counter in itertools.count(1):
            if not Post.objects.filter(slug=self.slug).exists():
                break
            self.slug = '%s-%d' % (self.slug.rsplit('-', 1)[0], counter)

        super(Post, self).save(*args, **kwargs)


class Comment(State):
    text = models.TextField(max_length=5000)
    user = models.ForeignKey(UserProfile)
    post = models.ForeignKey(Post, related_name='comments')

    def __str__(self):
        return self.text
