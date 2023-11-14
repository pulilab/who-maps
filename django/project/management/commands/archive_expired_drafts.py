from __future__ import unicode_literals

from django.core.management.base import BaseCommand

from project.tasks import archive_expired_drafts


class Command(BaseCommand):
    help = """
    Archive expired drafts manual execution. Will run the original task that's executed by celery.
    """

    def handle(self, *args, **options):
        self.stdout.write('-- Listing projects to be archived --')
        print(archive_expired_drafts(dry_run=True, force_run=True))

        result = input("Confirm to continue to archive these projects: y/N ")
        if result and result[0].lower() == "y":
            print(archive_expired_drafts(force_run=True))
        self.stdout.write('-- Finished --')
