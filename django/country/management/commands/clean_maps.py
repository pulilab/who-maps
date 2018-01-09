import os
import json

from django.core.management.base import BaseCommand
from django.conf import settings

from country.models import Country


class Command(BaseCommand):
    help = "Removed unused features from geojson."

    def add_arguments(self, parser):
        parser.add_argument('code', nargs='*', type=str)

    def handle(self, *args, **options):
        country_code = options['code']

        if country_code:
            country_code = country_code[0]
            self.stdout.write('{}'.format(country_code))
            with open(os.path.join(settings.BASE_DIR, 'media/uploaded_maps', '{}.geojson'.format(country_code))) as f:
                content = f.read()
                json_content = json.loads(content)
                c = Country.objects.get(code=country_code.upper())
                level = c.map_data['first_sub_level']['name']
                json_content['features'] = [f for f in json_content['features']
                                            if f['properties']['wof:placetype'] == level]
                with open(os.path.join(settings.BASE_DIR, 'media/uploaded_maps', '{}_slim.geojson'.format(country_code)), 'w') as out:
                    json.dump(json_content, out)
