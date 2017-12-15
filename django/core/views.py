from django.conf import settings
from django.utils.translation import ugettext

from rest_framework.authentication import TokenAuthentication
from rest_framework.generics import GenericAPIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.exceptions import APIException
from rest_framework.response import Response

from project.permissions import InTeamOrReadOnly
from project.models import Project


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


class CheckProjectAccessMixin(object):
    """
    This method needs to be used with an APIView (or ViewSet) that implements `check_object_permissions`
    """

    def check_project_permission(self, request, project_id):
        project = get_object_or_400(Project, "No such project.", id=project_id)
        self.check_object_permissions(request, project)


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


class StaticDataView(GenericAPIView):
    flag_mapping = {'en': 'gb.png',
                    'fr': 'fr.png',
                    'es': 'es.png',
                    'pt': 'pt.png'}

    def get(self, request):
        data = {}
        language_data = self.get_language_data()
        data['languages'] = language_data

        return Response(data)

    def get_language_data(self):
        languages = []
        for code, name in settings.LANGUAGES:
            languages.append({'code': code,
                              'name': ugettext(name),
                              'flag': self.flag_mapping.get(code, '')})
        return languages
