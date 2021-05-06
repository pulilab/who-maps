from project.models import ProjectVersion


def project_status_change(version_1: ProjectVersion, version_2: ProjectVersion) -> dict:
    return dict(
        published=not version_1.published and version_2.published,
        unpublished=not version_2.published and version_1.published,
        data_changed=version_1.data != version_2.data,
        name_changed=version_1.name != version_2.name,
        research_changed=version_1.research != version_2.research
    )


def project_status_change_str(status_dict: dict) -> str:  # pragma: no cover
    changes = list()
    if status_dict.get('published'):
        changes.append('published')
    if status_dict.get('unpublished'):
        changes.append('unpublished')
    if status_dict.get('data_changed'):
        changes.append('data was changed')
    if status_dict.get('name_changed'):
        changes.append('name was changed')
    if status_dict.get('research_changed'):
        changes.append('research was changed')

    return ', '.join(changes)
