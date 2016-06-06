from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated
from rest_framework.exceptions import APIException

from project.permissions import InTeamOrReadOnly


class TokenAuthMixin(object):
    """
    Mixin class for defining general permission and authentication settings on
    REST Framework Class Based Views.
    """
    authentication_classes = (TokenAuthentication,)
    permission_classes = (IsAuthenticated,)


class TeamTokenAuthMixin(object):
    authentication_classes = (TokenAuthentication,)
    permission_classes = (IsAuthenticated, InTeamOrReadOnly)


class Http400(APIException):
    """
    Represents 400 error to be raised inside APIs for immediate error response.
    """
    status_code = 400
    detail = {"details": "No such object."}

    def __init__(self, detail=None):
        if detail:
            self.detail = {"details": detail}


def get_object_or_400(cls, error_message="No such object.", select_for_update=False, **kwargs):
    """
    Gets an object, raises Http400 with custom message if no such object.

    Args:
        cls: type of entity
        select_for_update: locks object for update
        error_message: to be used in the error response if no such object
        kwargs: filter parameters for object query
    """
    obj = cls.objects.get_object_or_none(select_for_update, **kwargs)
    if obj:
        return obj
    else:
        raise Http400(error_message)
