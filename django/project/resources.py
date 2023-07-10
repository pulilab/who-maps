from import_export.fields import Field
from import_export import resources

from project.models import Project


class ProjectResource(resources.ModelResource):  # pragma: no cover
    id = Field(column_name='ID')
    name = Field(column_name='Name')
    country = Field(column_name='Country')
    published = Field(column_name='Published?')
    editors = Field(column_name='Editors')
    editor_emails = Field(column_name='Editor Emails')

    class Meta:
        model = Project
        fields = export_order = ('id', 'name', 'country', 'published', 'editors', 'editor_emails')

    def dehydrate_id(self, project: Project):
        return project.pk

    def dehydrate_name(self, project: Project):
        return project.name

    def dehydrate_country(self, project: Project):
        return project.get_country() if project.public_id else project.get_country(draft_mode=True)

    def dehydrate_published(self, project: Project):
        return 'Published' if project.is_published else 'Draft'

    def dehydrate_editor_emails(self, project: Project):
        return ", ".join(project.team.values_list('user__email', flat=True))

    def dehydrate_editors(self, project: Project):
        return ", ".join([str(p) for p in project.team.all()])
