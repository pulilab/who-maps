from django.contrib import admin

from user.models import UserProfile


class UserAdmin(admin.ModelAdmin):
    list_display = ('name', 'organisation', 'account_type', 'country')
    search_fields = ('name', 'organisation__name')
    list_filter = ('account_type', 'country')

admin.site.register(UserProfile, UserAdmin)
