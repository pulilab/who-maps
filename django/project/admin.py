from django.contrib import admin

from .forms import ProjectInventoryForm
from .models import Project


class ProjectInventoryAdmin(admin.ModelAdmin):
    form = ProjectInventoryForm


admin.site.register(Project, ProjectInventoryAdmin)
