from django.core.management.base import BaseCommand
from django.db.models import Q

from project.models import TechnologyPlatform, Project


class Command(BaseCommand):
    help = """
    Remove duplicate software by removing duplicates while making sure the project 
    will reference the one that stays active.
    """

    def handle(self, *args, **options):
        self.stdout.write("Print duplicate software")
        already_checked = []
        deleted = []
        for software in TechnologyPlatform.objects.filter(state=TechnologyPlatform.APPROVED):
            already_checked.append(software.id)

            for duplicate in TechnologyPlatform.objects.filter(name__iexact=software.name)\
                    .exclude(id=software.id)\
                    .exclude(id__in=already_checked):
                print(f"{duplicate.name} (id: {duplicate.id}) is duplicate of {software.name} (id: {software.id})")

                projects = Project.objects.filter(
                    Q(data__software__contains=[duplicate.id]) | Q(draft__software__contains=[duplicate.id])
                )

                projects_original = Project.objects.filter(
                    Q(data__software__contains=[software.id]) | Q(draft__software__contains=[software.id])
                )
                print(f"Original {software.name} (id: {software.id}) found in {projects_original.count()} projects")
                print(f"Duplicate {duplicate.name} (id: {duplicate.id}) found in {projects.count()} projects")

                if projects:
                    print("Removing duplicate from projects and adding original if needed.")

                    for project in projects:
                        if project.public_id and 'software' in project.data:
                            project.data['software'] = \
                                [software_id for software_id in project.data['software']
                                 if software_id != duplicate.id]
                        if 'software' in project.draft:
                            project.draft['software'] = \
                                [software_id for software_id in project.draft['software']
                                 if software_id != duplicate.id]

                        if project.public_id and 'software' in project.data \
                                and software.id not in project.data['software']:
                            project.data['software'].append(software.id)
                        if 'software' in project.draft and software.id not in project.draft['software']:
                            project.draft['software'].append(software.id)

                        project.save(update_fields=['data', 'draft'])

                else:
                    print("No projects listed this duplicate")

                print(f"Deleting duplicate: {duplicate.name} (id: {duplicate.id}) \n")
                duplicate.delete()
                deleted.append(duplicate)

        print(f"Successfully eliminated {len(deleted)} duplicates")
