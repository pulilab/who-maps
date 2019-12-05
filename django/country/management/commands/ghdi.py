import requests
from django.core.management.base import BaseCommand
from rest_framework import status

from country.models import Country


class Command(BaseCommand):
    help = "Remove unused features from geojson."

    def add_arguments(self, parser):
        parser.add_argument('override', nargs='*', type=str, help='Override existing data')
        parser.add_argument('country', nargs='*', type=str, help='Country')

    def fill_aplha_3_codes(self):
        if Country.objects.filter(alpha_3_code__isnull=True).count() > 0:
            url = 'http://index.digitalhealthindex.org/api/countries/'
            response = requests.get(url)
            if response.status_code == status.HTTP_200_OK:
                for item in response.json():
                    try:
                        country = Country.objects.get(code=item['alpha2Code'])
                    except Country.DoesNotExist:
                        pass
                    else:
                        if country.alpha_3_code is None:
                            country.alpha_3_code = item['id']
                            country.save()
            else:
                print(f'Error getting alpha 3 codes: {response.content}')

    def get_context_and_health_data_for_countries(self, options):
        override = options['override']
        for country in Country.objects.order_by('name'):
            if country.alpha_3_code:
                print(f'Processing country: {country}')
                url = f'http://index.digitalhealthindex.org/api/countries/{country.alpha_3_code}/development_indicators'
                response = requests.get(url)
                if response.status_code == status.HTTP_200_OK:
                    data = response.json()

                    if country.total_population is None or override:
                        country.total_population = data['totalPopulation']
                    if country.gni_per_capita is None or override:
                        country.gni_per_capita = data['gniPerCapita']
                    if country.life_expectancy is None or override:
                        country.life_expectancy = data['lifeExpectancy']
                    if country.health_expenditure is None or override:
                        country.health_expenditure = data['healthExpenditure']

                    country.save()
                else:
                    print(f'Error getting data for country: {response.content}')

    def handle(self, *args, **options):
        self.fill_aplha_3_codes()

        self.get_context_and_health_data_for_countries(options)
