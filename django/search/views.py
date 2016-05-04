from django.db.models import Q, Func, TextField, fields
from rest_framework import status
from rest_framework.response import Response
from rest_framework.authentication import TokenAuthentication
from rest_framework.decorators import api_view, authentication_classes
from rest_framework.decorators import permission_classes
from rest_framework.permissions import IsAuthenticated

from project.models import Project
from .serializers import SearchSerializer


@api_view(['POST'])
@authentication_classes((TokenAuthentication,))
@permission_classes((IsAuthenticated,))
def search_project(request):
    """
    View for providing search functionality for projects.
    """
    serializer = SearchSerializer(data=request.data)
    if serializer.is_valid():
        result = search(**serializer.validated_data)
        return Response(result)
    else:
        return Response()

# https://code.djangoproject.com/ticket/26511#comment:3
class Cast(Func):
    """
    Coerce an expression to a new field type.
    """
    function = 'CAST'
    template = '%(function)s(%(expressions)s AS %(db_type)s)'

    mysql_types = {
        fields.CharField: 'char',
        fields.IntegerField: 'signed integer',
        fields.FloatField: 'signed',
    }

    def __init__(self, expression, output_field):
        super(Cast, self).__init__(expression, output_field=output_field)

    def as_sql(self, compiler, connection, **extra_context):
        if 'db_type' not in extra_context:
            extra_context['db_type'] = self._output_field.db_type(connection)
        return super(Cast, self).as_sql(compiler, connection, **extra_context)

    def as_mysql(self, compiler, connection):
        extra_context = {}
        output_field_class = type(self._output_field)
        if output_field_class in self.mysql_types:
            extra_context['db_type'] = self.mysql_types[output_field_class]
        return self.as_sql(compiler, connection, **extra_context)

    def as_postgresql(self, compiler, connection):
        # CAST would be valid too, but the :: shortcut syntax is more readable.
        return self.as_sql(compiler, connection, template='%(expressions)s::%(db_type)s')

# Still won't work - Cannot resolve keyword 'name' into field. Join on 'data' not permitted.
def search(**kwargs):
    return Project.objects.annotate(
                        name_as_textfield=Cast("data__name", TextField()),
                    ).filter(name_as_textfield__contains=kwargs["query"])
