from rest_framework import permissions

from .models import Country, Donor


class InAdminOrReadOnly(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True

        return obj.admins.filter(id=request.user.userprofile.id).exists() \
            or obj.super_admins.filter(id=request.user.userprofile.id).exists()


class InSuperAdmin(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        return obj.super_admins.filter(id=request.user.userprofile.id).exists()


class InCountryAdminOrReadOnly(permissions.BasePermission):
    def has_permission(self, request, view):
        if request.method == 'POST':
            country = request.data.get('country')
            return Country.objects.get(pk=country).admins.filter(id=request.user.userprofile.id).exists()
        return True

    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True

        return obj.country.admins.filter(id=request.user.userprofile.id).exists()


class InCountrySuperAdmin(permissions.BasePermission):
    def has_permission(self, request, view):
        if request.method == 'POST':
            country = request.data.get('country')
            return Country.objects.get(pk=country).super_admins.filter(id=request.user.userprofile.id).exists()
        return True

    def has_object_permission(self, request, view, obj):
        return obj.country.super_admins.filter(id=request.user.userprofile.id).exists()


class InDonorSuperAdmin(permissions.BasePermission):
    def has_permission(self, request, view):
        if request.method == 'POST':
            donor = request.data.get('donor')
            return Donor.objects.get(pk=donor).super_admins.filter(id=request.user.userprofile.id).exists()
        return True

    def has_object_permission(self, request, view, obj):
        return obj.donor.super_admins.filter(id=request.user.userprofile.id).exists()
