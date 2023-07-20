from django.contrib import admin

from user.models import UserProfile


@admin.register(UserProfile)
class ReferenceDocumentAdmin(admin.ModelAdmin):
    search_fields = ('name', 'user__email')
    raw_id_fields = ('user', 'organisation', 'country', 'donor')
