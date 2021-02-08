from rest_framework.permissions import BasePermission


class IsAuthenticated(BasePermission):
    """
    The request is authenticated as a user
    """

    def has_permission(self, request, view):
        return (
            request.user and
            request.user.is_authenticated
        )
