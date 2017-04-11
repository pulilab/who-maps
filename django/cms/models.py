from django.db import models
from django.template.defaultfilters import slugify

from core.models import ExtendedModel
from user.models import UserProfile


class Post(ExtendedModel):
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
    body = models.TextField(max_length=512)
    type = models.IntegerField(choices=TYPE_CHOICES)
    domain = models.IntegerField(choices=DOMAIN_CHOICES)
    cover = models.ImageField()
    author = models.ForeignKey(UserProfile)

    def __str__(self):
        return self.name

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super(Post, self).save(*args, **kwargs)


class Comment(ExtendedModel):
    NORMAL = 1
    FLAGGED = 2
    BANNED = 3

    STATE_CHOICES = (
        (1, "Resources"),
        (2, "Lessons & Tips"),
        (3, "Experiences"),
    )

    text = models.TextField(max_length=512)
    user = models.ForeignKey(UserProfile)
    post = models.ForeignKey(Post, related_name='comments')
    state = models.IntegerField(choices=STATE_CHOICES, default=NORMAL)

    def __str__(self):
        return self.text
