from django.contrib import admin
from django.contrib.admin import SimpleListFilter
from cms.models import Post, State


class StateFilter(SimpleListFilter):
    title = 'State'

    parameter_name = 'state'

    def lookups(self, request, model_admin):
        return ((0, "All"),) + State.STATE_CHOICES

    def choices(self, cl):  # pragma: no cover
        for lookup, title in self.lookup_choices:
            try:
                selected = int(self.value()) == lookup
            except TypeError:
                selected = State.FLAGGED == lookup

            yield {
                'selected': selected,
                'query_string': cl.get_query_string({
                    self.parameter_name: lookup,
                }, []),
                'display': title,
            }
@admin.register(Post)
class PostAdmin(admin.ModelAdmin):
    list_display = ('name', 'type', 'domain', 'state', 'modified', 'author')
    list_filter = (StateFilter, 'type')
    search_fields = ('name', 'body', 'author__name', 'author__user__email')
    ordering = ('name',)

    def has_add_permission(self, request):
        return False
