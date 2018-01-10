import os
import json

from django.core.management.base import BaseCommand
from django.conf import settings

from country.models import Country
from country.models import MapFile
from pathlib import Path



class Command(BaseCommand):
    help = "Removed unused features from geojson."

    def add_arguments(self, parser):
        parser.add_argument('code', nargs='*', type=str)

    def handle(self, *args, **options):
        country_code = options['code']

        if country_code:
            country_code = country_code[0]
            c = Country.objects.get(code=country_code.upper())
            map_file = MapFile.objects.get(country_id=c.id)
            self.stdout.write('{}'.format(country_code))
            with open(os.path.join(settings.MEDIA_ROOT, '{}'.format(map_file.map_file))) as f:
                content = f.read()
                json_content = json.loads(content)

                level = c.map_data['first_sub_level']['name']
                json_content['features'] = [f for f in json_content['features']
                                            if f['properties']['wof:placetype'] == level]
                folder = os.path.join(settings.MEDIA_ROOT, 'processed_maps/')
                Path(folder).mkdir(parents=True, exist_ok=True)
                with open(os.path.join(folder,'{}_slim.geojson'.format(country_code)), 'w') as out:
                    json.dump(json_content, out)
