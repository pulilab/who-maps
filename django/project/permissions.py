from rest_framework import permissions


class InTeamOrReadOnly(permissions.BasePermission):
    """
    Object-level permission to only allow team members of a project to edit it.
    """

    def has_object_permission(self, request, view, obj):
        # Read permissions are allowed to any request,
        # so we'll always allow GET, HEAD or OPTIONS requests.
        if request.method in permissions.SAFE_METHODS:
            return True

        return obj.team.filter(id=request.user.userprofile.id).exists()
