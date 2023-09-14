from django.core.management.base import BaseCommand
from django.db.models import Q

from project.models import DigitalStrategy, HSCChallenge, Project


class Command(BaseCommand):
    help = """
    Merge objects in projects by deleting from_id from all projects and adding to_id instead.
    usage: manage.py merge_model_objects <dhi|hsc> <from_id> <to_id>
    usage eg: manage.py merge_model_objects dhi 999 10
    """

    def add_arguments(self, parser):
        parser.add_argument('class')
        parser.add_argument('from_id')
        parser.add_argument('to_id')

    def handle(self, *args, **options):
        class_name = options.get('class')
        from_id = int(options.get('from_id'))
        to_id = int(options.get('to_id'))
        if class_name == 'dhi':
            klass = DigitalStrategy
            klass_serialized = 'dhis'
            if not klass.objects.filter(id=from_id).exists() and not klass.objects.filter(id=to_id).exists():
                self.stdout.write(f"ERROR: objects id doesn't exist: {from_id} or {to_id}")
        elif class_name == 'hsc':
            klass = HSCChallenge
            klass_serialized = 'hsc_challenges'
            if not klass.objects.filter(id=from_id).exists() and not klass.objects.filter(id=to_id).exists():
                self.stdout.write(f"ERROR: objects id doesn't exist: {from_id} or {to_id}")
        else:
            self.stdout.write(f"ERROR: wrong class {class_name} [available options are: dhi, hsc]")
            return

        projects = Project.objects.filter(
            Q(**{f'data__{klass_serialized}__contains': [from_id]}) |
            Q(**{f'draft__{klass_serialized}__contains': [from_id]})
        )

        for project in projects:
            if project.public_id and klass_serialized in project.data:
                project.data[klass_serialized] = \
                    [object_id for object_id in project.data[klass_serialized]
                     if object_id != from_id]
            if klass_serialized in project.draft:
                project.draft[klass_serialized] = \
                    [object_id for object_id in project.draft[klass_serialized]
                     if object_id != from_id]

            if project.public_id and klass_serialized in project.data \
                    and to_id not in project.data[klass_serialized]:
                project.data[klass_serialized].append(to_id)
            if klass_serialized in project.draft and to_id not in project.draft[klass_serialized]:
                project.draft[klass_serialized].append(to_id)

            project.save(update_fields=['data', 'draft'])

        self.stdout.write(f"{projects.count()} projects have been updated")
        klass.objects.get(id=from_id).delete()
