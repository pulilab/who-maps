from django.core.management.base import BaseCommand

from project.models import Project


class Command(BaseCommand):
    help = """
    Lists projects which are "orphaned" (i. e.: they have no team members assigned)
    """

    def handle(self, *args, **options):
        self.stdout.write("-- Gathering data")

        projects = Project.objects.filter(team=None)

        for p in projects:
            self.stdout.write(f"  - {p.id} - {p.name}")

        self.stdout.write("-- Done")
