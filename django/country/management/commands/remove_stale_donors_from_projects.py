from django.core.management.base import BaseCommand

from country.models import Donor
from project.models import Project


class Command(BaseCommand):
    help = "Remove stale donors from projects and rebuild search"

    def handle(self, *args, **options):
        stale_ids = []
        donor_ids = set(Donor.objects.values_list('id', flat=True))

        for p in Project.objects.all():
            if p.data and 'donors' in p.data:
                published_donors = set(p.data.get('donors', []))
                stale_ids.extend(list(published_donors - donor_ids))
                p.data['donors'] = list(published_donors & donor_ids)
            if p.draft and 'donors' in p.draft:
                draft_donors = set(p.draft.get('donors', []))
                stale_ids.extend(list(draft_donors - donor_ids))
                p.draft['donors'] = list(draft_donors & donor_ids)
            p.save()

        self.stdout.write('Removed {} donors'.format(len(set(stale_ids))))
