from collections import OrderedDict
from django.db.models import QuerySet


class CheckRequiredMixin:  # pragma: no cover
    """
    This is actually not used anymore, but I'm leaving this in the code for historical reasons
    (removed checkrequired due to introduction of Collection and Orphan projects)
    """
    @staticmethod
    def check_required(queryset: QuerySet, answers: OrderedDict):
        required_ids = set(queryset.filter(required=True).values_list('id', flat=True))
        present_ids = {answer['question_id'] for answer in answers}
        missing_ids = required_ids - present_ids
        if missing_ids:
            return {i: ['This field is required'] for i in missing_ids}
