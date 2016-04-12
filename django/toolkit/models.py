import itertools
from statistics import mean

from django.db import models
from django.contrib.postgres.fields import JSONField

from core.models import ExtendedModel
from project.models import Project


class Toolkit(ExtendedModel):
    project = models.ForeignKey(Project)
    data = JSONField()

    def update_score(self, axis, domain, question, answer, value):
        # Save the new score to the answer.
        self.data[axis]["domains"][domain]["questions"][question]["answers"][answer] = value

        # Update the question score sum (sum of answers).
        question_sum = sum(self.data[axis]["domains"][domain]["questions"][question]["answers"])
        self.data[axis]["domains"][domain]["questions"][question]["question_sum"] = question_sum

        # Update the domain score sum (sum of question sums).
        domain_sum = sum(x["question_sum"] for x in self.data[axis]["domains"][domain]["questions"])
        self.data[axis]["domains"][domain]["domain_sum"] = domain_sum

        # Update the domain percentage (sum/max*100).
        domain_percentage = (domain_sum / self.data[axis]["domains"][domain]["domain_max"]) * 100
        self.data[axis]["domains"][domain]["domain_percentage"] = domain_percentage

        # Update the axis score (average of domain percentages).
        axis_score = mean([x["domain_percentage"] for x in self.data[axis]["domains"]])
        self.data[axis]["axis_score"] = axis_score

        self.save()
