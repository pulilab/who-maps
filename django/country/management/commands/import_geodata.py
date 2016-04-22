import os
import shutil
import logging
import tarfile
import json
from xml.dom import minidom

import requests
from django.core.management.base import BaseCommand
from django.conf import settings

from country.models import Country

logging.getLogger("requests").setLevel(logging.WARNING)


class Command(BaseCommand):
    help = "Imports geodata of countries from Mapzen."

    def add_arguments(self, parser):
        # Named (optional) arguments
        parser.add_argument(
            '--selected',
            action='store_true',
            help="Only import selected files, according to settings.SELECTED_FILE_LIST.")

    def handle(self, *args, **options):
        # Create a session so we'll have connection pooling.
        session = requests.Session()

        if "selected" in options.keys():
            self.stdout.write("-- Getting pre-selected country files from Mapzen...")
            # Use pre-selected countries.
            file_list = settings.SELECTED_FILE_LIST
        else:
            self.stdout.write("-- Getting available country files from Mapzen...")
            # Getting a file list from Mapzen S3 bucket.
            request = requests.Request(method="GET", url=settings.MAPZEN_S3_URL)
            prepared_request = session.prepare_request(request)
            response = session.send(prepared_request)

            file_list_xml = response.text
            file_list_nodes = minidom.parseString(file_list_xml).getElementsByTagName("Key")
            file_list = [x.firstChild.nodeValue for x in file_list_nodes]

            # The first element is an info tag so we're removing that key.
            file_list.remove("LastUpdatedAt")

        # Recreating temporary folder for the files.
        try:
            os.mkdir(settings.GEOJSON_TEMP_DIR)
        except FileExistsError:
            shutil.rmtree(settings.GEOJSON_TEMP_DIR)
            os.mkdir(settings.GEOJSON_TEMP_DIR)

        # Getting the files one by one and saving to the temp folder.
        for filename in file_list:
            request = requests.Request(method="GET", url=settings.MAPZEN_S3_URL+filename)
            prepared_request = session.prepare_request(request)
            response = session.send(prepared_request)

            with open(settings.GEOJSON_TEMP_DIR + filename, "wb") as f:
                f.write(response.content)
            self.stdout.write(filename + " saved.")

            # Extracting tar files to folders.
            tfile = tarfile.open(settings.GEOJSON_TEMP_DIR + filename, "r:gz")
            tfile.extractall(settings.GEOJSON_TEMP_DIR)

            os.remove(settings.GEOJSON_TEMP_DIR + filename)

        self.stdout.write("-- Importing geodata to the database...")
        for folder in os.listdir(settings.GEOJSON_TEMP_DIR):
            geodata = {}
            for filename in settings.ADMIN_LEVELS_TO_IMPORT:
                with open(os.path.join(settings.GEOJSON_TEMP_DIR, folder, filename)) as f:
                    content = f.read()
                    json_content = json.loads(content)
                    geodata[filename.strip(".geojson")] = json_content
            country, created = Country.objects.get_or_create(name=folder)
            country.geodata = geodata
            country.save()
            self.stdout.write("{} imported.".format(country.name))

        self.stdout.write("-- Removing temporary files...")
        shutil.rmtree(settings.GEOJSON_TEMP_DIR)
        self.stdout.write("-- Done!")
