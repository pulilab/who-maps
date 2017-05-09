from django.contrib import admin
from django.contrib.admin import SimpleListFilter
from cms.models import Post, State

# Register your models here.
@admin.register(Post)
class PostAdmin(admin.ModelAdmin):
    list_display = ('name', 'type', 'domain', 'state', 'modified', 'author')
    list_filter = (StateFilter, 'type')
    search_fields = ('name', 'body', 'author__name', 'author__user__email')
    ordering = ('name',)

    def has_add_permission(self, request):
        return False
