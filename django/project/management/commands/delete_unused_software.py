from django.core.management.base import BaseCommand
from django.db.models import Q

from project.models import TechnologyPlatform, Project


class Command(BaseCommand):
    help = "Remove unused software"

    def handle(self, *args, **options):
        approved = TechnologyPlatform.objects.filter(state=TechnologyPlatform.APPROVED)
        to_delete = []
        for software in approved:
            if Project.objects.filter(Q(data__software__contains=[software.id]) |
                                      Q(draft__software__contains=[software.id])).count() == 0:
                print(software.name)
                to_delete.append(software.id)

        print(f"\nDeleting {len(to_delete)} software")
        TechnologyPlatform.objects.filter(state=TechnologyPlatform.APPROVED).filter(id__in=to_delete).delete()
