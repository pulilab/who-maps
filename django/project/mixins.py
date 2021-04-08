from collections import OrderedDict
from django.db.models import QuerySet


class CheckRequiredMixin:
    @staticmethod
    def check_required(queryset: QuerySet, answers: OrderedDict):
        required_ids = set(queryset.filter(required=True).values_list('id', flat=True))
        present_ids = {answer['question_id'] for answer in answers}
        missing_ids = required_ids - present_ids
        if missing_ids:
            return {i: ['This field is required'] for i in missing_ids}
