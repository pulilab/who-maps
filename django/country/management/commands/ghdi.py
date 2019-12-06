import requests
from django.core.management.base import BaseCommand
from pycountry import countries
from rest_framework import status

from country.models import Country


class Command(BaseCommand):
    help = "Updates GHDI data."

    def add_arguments(self, parser):
        parser.add_argument('--override', dest="override", required=False, default=False,
                            help='Override existing data')
        parser.add_argument('--country-code', dest="country_code", required=False, default=None,
                            help='2 character long country code')

    def get_context_and_health_data_for_countries(self, options):
        override = options['override']
        country_code = options['country_code']
        countries_qs = Country.objects.order_by('name')
        if country_code:
            countries_qs = countries_qs.filter(code=country_code)
        for country in countries_qs:
            py_country = countries.get(alpha_2=country.code)
            alpha_3_code = py_country.alpha_3
            print(f'Processing context and health data for country: {country}')
            url = f'http://index.digitalhealthindex.org/api/countries/{alpha_3_code}/development_indicators'
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
        country_code = options['country_code']
        url = 'http://index.digitalhealthindex.org/api/countries_health_indicator_scores'
        response = requests.get(url)
        if response.status_code == status.HTTP_200_OK:
            data = response.json()

            for country_data in data['countryHealthScores']:
                if country_code and country_data['countryAlpha2Code'] != country_code:
                    continue

                categories = country_data.get('categories')
                if categories:
                    py_country = countries.get(alpha_3=country_data['countryId'])
                    alpha_2_code = py_country.alpha_2
                    try:
                        country = Country.objects.get(code=alpha_2_code)
                    except Country.DoesNotExist:
                        pass
                    else:
                        print(f'Processing indicator data for country: {country}')
                        save = False

                        for category in categories:
                            category_name = category['name']
                            score = category['overallScore']
                            if category_name == 'Leadership and Governance':
                                if country.leadership_and_governance is None or override:
                                    save = True
                                    country.leadership_and_governance = score
                            elif category_name == 'Strategy and Investment':
                                if country.strategy_and_investment is None or override:
                                    save = True
                                    country.strategy_and_investment = score
                            elif category_name == 'Legislation, Policy, and Compliance':
                                if country.legislation_policy_compliance is None or override:
                                    save = True
                                    country.legislation_policy_compliance = score
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
        self.get_context_and_health_data_for_countries(options)

        self.get_health_indicator_scores(options)
