from typing import Dict, List, Tuple, Union


def remove_keys(data_dict: Dict, keys: Union[List, Tuple]) -> Dict:
    for key in keys:
        if key in data_dict:
            data_dict.pop(key, None)
    return data_dict


def update_project_stages(project, validated_data):
    from project.models import ProjectStage

    stages_data = validated_data.get('stages', [])
    project.stages.all().delete()
    for stage_data in stages_data:
        ProjectStage.objects.create(project=project, **stage_data)
