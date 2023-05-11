import uuid
from django.db import DataError
from project.models import TechnologyPlatform as S
from country.models import Donor
from project.models import Project
from django.db.models import Q


def list_duplicate_software():
    for s in S.objects.exclude(name_en='R').exclude(state=3):
        try:
            for x in S.objects.exclude(id=s.id).exclude(state=3).exclude(name_en='R').filter(name_en__icontains=s.name_en):
                print(f'{x.name_en} [{x.id}]-{x.get_state_display()} -- dupe of --> {s.name_en} [{s.id}]-{s.get_state_display()}')
        except ValueError:
            print(f"--- NO EN NAME FOR: {s} {s.id} {s.get_state_display()}")


def list_duplicate_donors():
    for s in Donor.objects.all():
        for x in Donor.objects.exclude(id=s.id).filter(name__icontains=s.name):
            print(f'{x.name} [{x.code}] -- dupe of --> {s.name} [{s.code}]')

# DEPRECATED: `platforms` decoupled into `software` and `dhis`
def sub_software(from_this_id, to_this_id):
    projects = Project.objects.filter(
        Q(data__platforms__contains=[{'id': from_this_id}]) | Q(draft__platforms__contains=[{'id': from_this_id}])
    )
    for project in projects:
        if project.public_id and 'platforms' in project.data:
            for index, platform in enumerate(project.data['platforms']):
                if platform['id'] == from_this_id:
                    project.data['platforms'][index]['id'] = to_this_id
        if 'platforms' in project.draft:
            for index, platform in enumerate(project.draft['platforms']):
                if platform['id'] == from_this_id:
                    project.draft['platforms'][index]['id'] = to_this_id
        project.save()

# from_to_pairs = \
#     [
#         (3,2),
#     ]

def run_subs(from_to_pairs):
    for elem in from_to_pairs:
        sub_software(elem[0], elem[1])
        S.objects.filter(id=elem[0]).update(state=3)


def import_donors_from_list(donor_list):
    for d in donor_list:
        if not Donor.objects.filter(name__iexact=d):
            try:
                Donor.objects.create(name=d, code=f'NS_{uuid.uuid4().hex[-4:]}')
            except DataError:
                print(d)
