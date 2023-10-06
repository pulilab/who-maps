from rest_framework import permissions

from project.models import ProjectApproval, Project


class InTeamOrReadOnly(permissions.BasePermission):
    """
    Object-level permission to only allow team members of a project to edit it.

    `obj` needs to be a `Project` instance
    """

    def has_object_permission(self, request, view, obj):
        # Read permissions are allowed to any request,
        # so we'll always allow GET, HEAD or OPTIONS requests.
        if request.method in permissions.SAFE_METHODS:
            return True

        return request.user.is_superuser or obj.team.filter(id=request.user.userprofile.id).exists()


class InTeamOrCollectionOwnerOrReadOnly(permissions.BasePermission):
    """
    Object-level permission which editing projects if they are draft and in collection
    """

    def has_object_permission(self, request, view, obj):
        # Read permissions are allowed to any request,
        # so we'll always allow GET, HEAD or OPTIONS requests.
        if request.method in permissions.SAFE_METHODS:  # pragma: no cover
            return True

        # had to separate these due to LINTER dying on 3 'or'-s
        in_team = obj.team.filter(id=request.user.userprofile.id).exists()
        in_collection = obj.import_rows.filter(parent__collection__isnull=False).exists()

        return request.user.is_superuser or in_team or in_collection


class CountryAdminTeamCollectionOwnerOrReadOnly(permissions.BasePermission):
    def has_object_permission(self, request, view, obj: Project):
        # Read permissions are allowed to any request,
        # so we'll always allow GET, HEAD or OPTIONS requests.
        if request.method in permissions.SAFE_METHODS:
            return True

        in_team = obj.team.filter(id=request.user.userprofile.id).exists()
        in_collection = obj.import_rows.filter(parent__collection__isnull=False).exists()
        is_admin = obj.is_country_admin(request.user)

        return request.user.is_superuser or in_team or in_collection or is_admin


class CollectionOwnerOrReadOnly(permissions.BasePermission):
    """
    Object-level permission which allows team members or collection owners to edit projects
    """

    def has_object_permission(self, request, view, obj):
        # Read permissions are allowed to any request,
        # so we'll always allow GET, HEAD or OPTIONS requests.
        if request.method in permissions.SAFE_METHODS:  # pragma: no cover
            return True

        return request.user.is_superuser or obj.user == request.user


class InCountryAdminForApproval(permissions.BasePermission):
    def has_object_permission(self, request, view, obj: ProjectApproval):
        if hasattr(obj.project, 'search') and hasattr(obj.project.search, 'country'):
            return request.user.is_superuser \
                   or obj.project.search.country.admins.filter(id=request.user.userprofile.id).exists() \
                   or obj.project.search.country.super_admins.filter(id=request.user.userprofile.id).exists()


class IsOwnerShipModifiable(permissions.BasePermission):
    """
    Ownership of the project is modifiable IF it's draft AND in a collection AND we're using the correct collection
    url
    """

    def has_object_permission(self, request, view, obj):
        if obj.public_id != "":  # pragma: no cover
            return False

        in_collection = obj.import_rows.filter(parent__collection__url=view.kwargs.get('collection_url')).exists()

        return request.user.is_superuser or in_collection
