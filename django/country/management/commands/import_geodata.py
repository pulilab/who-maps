import os
import shutil
import json

from django.core.management.base import BaseCommand
from django.conf import settings

from country.models import Country

class Command(BaseCommand):
    help = "Imports geodata of countries from Mapzen."

    def handle(self, *args, **options):
        self.stdout.write("-- Importing geodata to the database...")
        for folder in os.listdir(settings.GEOJSON_TEMP_DIR):
            geodata = {}
            for filename in settings.ADMIN_LEVELS_TO_IMPORT:
                with open(os.path.join(settings.GEOJSON_TEMP_DIR, folder, "topojson_"+filename)) as f:
                    content = f.read()
                    json_content = json.loads(content)
                    geodata[filename.strip(".geojson")] = json_content
            country, created = Country.objects.get_or_create(name=folder)
            country.geodata = geodata
            country.save()
            self.stdout.write("{} imported.".format(country.name))

        self.stdout.write("-- Removing temporary files...")
        shutil.rmtree(settings.GEOJSON_TEMP_DIR)
        self.stdout.write("-- Import is done!")
