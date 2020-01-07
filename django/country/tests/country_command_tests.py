import os
from fnmatch import fnmatch

from django.conf import settings
from django.utils.six import StringIO

from django.core.management import call_command
from django.test import TestCase


class CountryManagementCommandTest(TestCase):
    null_topo = os.path.join(settings.STATIC_ROOT, 'country-geodata', 'null.json')
    backup_folder = os.path.join(settings.MEDIA_ROOT, 'topojson-backups')

    def setUp(self):
        call_command('loaddata', 'null_land.json', verbosity=0)
        try:
            open(self.null_topo, 'x')
        except Exception:  # pragma: no cover
            pass

    def tearDown(self):
        if os.path.isfile(self.null_topo):  # pragma: no cover
            os.remove(self.null_topo)
        for file in os.listdir(self.backup_folder):
            if fnmatch(file, '*null.json'):
                os.remove(os.path.join(self.backup_folder, file))

    def test_country_management_command_clean_maps(self):
        out = StringIO()
        call_command('clean_maps', stdout=out)
        output = out.getvalue().strip()
        self.assertEqual(output, 'No country code provided')

        out = StringIO()
        call_command('clean_maps', 'something', stdout=out)
        output = out.getvalue().strip()
        self.assertEqual(output, 'Selected country does not exist')

        out = StringIO()
        call_command('clean_maps', 'NULL', stdout=out)
        output = out.getvalue().strip()
        self.assertEqual(output, 'Removing unused features from Null Land geojson')

        topo_stats = os.stat(self.null_topo)
        self.assertTrue(topo_stats.st_size > 10)
