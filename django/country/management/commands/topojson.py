import os
import json

from django.core.management.base import BaseCommand
from django.conf import settings


class Command(BaseCommand):
    help = "Transforms geodata files with Topojson."

    def handle(self, *args, **options):
        self.stdout.write("-- Transforming geodata files with Topojson...")
        for folder in os.listdir(settings.GEOJSON_TEMP_DIR):
            os.chdir(os.path.join(settings.GEOJSON_TEMP_DIR, folder))
            for filename in settings.ADMIN_LEVELS_TO_IMPORT:
                os.system("topojson -p -o {} {}".format("topojson_"+filename, filename))
            self.stdout.write("{} transformed.".format(filename))

        self.stdout.write("-- Transforming is done!")
