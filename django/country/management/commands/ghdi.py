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
                print(f'Processing context and health data for country: {country}')
                url = f'http://index.digitalhealthindex.org/api/countries/{country.alpha_3_code}/development_indicators'
                response = requests.get(url)
                if response.status_code == status.HTTP_200_OK:
                    data = response.json()

                    save = False
                    if country.total_population is None or override:
                        save = True
                        country.total_population = data['totalPopulation']
                    if country.gni_per_capita is None or override:
                        save = True
                        country.gni_per_capita = data['gniPerCapita']
                    if country.life_expectancy is None or override:
                        save = True
                        country.life_expectancy = data['lifeExpectancy']
                    if country.health_expenditure is None or override:
                        save = True
                        country.health_expenditure = data['healthExpenditure']

                    if save:
                        country.save()
                else:
                    print(f'Error getting context and health data for country: {response.content}')

    def get_health_indicator_scores(self, options):
        override = options['override']
        url = 'http://index.digitalhealthindex.org/api/countries_health_indicator_scores'
        response = requests.get(url)
        if response.status_code == status.HTTP_200_OK:
            data = response.json()

            for country_data in data['countryHealthScores']:
                categories = country_data.get('categories')
                if categories:
                    try:
                        country = Country.objects.get(alpha_3_code=country_data['countryId'])
                    except Country.DoesNotExist:
                        pass
                    else:
                        print(f'Processing indicator data for country: {country}')
                        save = False

                        for category in categories:
                            category_name = category['name']
                            score = category['overallScore']
                            if category_name == 'Leadership and Governance':
                                if country.leadership_and_governance_score is None or override:
                                    save = True
                                    country.leadership_and_governance_score = score
                            elif category_name == 'Strategy and Investment':
                                if country.strategy_and_investment_score is None or override:
                                    save = True
                                    country.strategy_and_investment_score = score
                            elif category_name == 'Legislation, Policy, and Compliance':
                                if country.legislation_policy_compliance_score is None or override:
                                    save = True
                                    country.legislation_policy_compliance_score = score
                            elif category_name == 'Workforce':
                                if country.workforce is None or override:
                                    save = True
                                    country.workforce = score
                            elif category_name == 'Standards and Interoperability':
                                if country.standards_and_interoperability is None or override:
                                    save = True
                                    country.standards_and_interoperability = score
                            elif category_name == 'Infrastructure':
                                if country.infrastructure is None or override:
                                    save = True
                                    country.infrastructure = score
                            elif category_name == 'Services and Applications':
                                if country.services_and_applications is None or override:
                                    save = True
                                    country.services_and_applications = score

                        if save:
                            country.save()
        else:
            print(f'Error getting indicator data for country: {response.content}')

    def handle(self, *args, **options):
        self.fill_aplha_3_codes()

        self.get_context_and_health_data_for_countries(options)

        self.get_health_indicator_scores(options)
