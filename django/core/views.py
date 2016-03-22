from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated


class TokenAuthMixin(object):
    """
    Mixin class for defining general permission and authentication settings on
    REST Framework Class Based Views.
    """
    authentication_classes = (TokenAuthentication,)
    permission_classes = (IsAuthenticated,)
