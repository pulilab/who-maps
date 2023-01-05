from __future__ import unicode_literals

from django.core.management.base import BaseCommand
from django.utils import timezone
from user.models import UserProfile
from django.conf import settings

import csv


class Command(BaseCommand):
    help = 'Converts the UserProfile DB into CSV format'

    fieldnames = ['Name', 'Email', 'Country', 'Title', 'LinkedIn', 'Language', 'Role', 'Investor']

    def write_data_to_csv(self, data: list):
        timestamp = timezone.now().strftime("%Y-%m-%d_%H-%M")

        with open(f'{timestamp}.csv', mode='w') as csv_file:
            writer = csv.DictWriter(csv_file, fieldnames=self.fieldnames)
            writer.writeheader()
            for user_data in data:
                writer.writerow(user_data)

    @staticmethod
    def get_data_from_db():
        profiles = UserProfile.objects.all()
        user_data = list()
        type_mapper = {x: y for x, y in UserProfile.ACCOUNT_TYPE_CHOICES}
        type_mapper[None] = 'Unknown'
        lang_mapper = {x: y for x, y in settings.LANGUAGES}
        lang_mapper[None] = 'Unknown'
        for profile in profiles:
            user_data.append({
                'Name': profile.name,
                'Email': profile.user.email,
                'Country': profile.country.name if profile.country else None,
                'Title': profile.title,
                'LinkedIn': profile.linkedin,
                'Language': lang_mapper[profile.language],
                'Role': type_mapper[profile.account_type],
                'Investor': profile.donor.name if profile.donor else None
            })
        return user_data

    def handle(self, *args, **options):
        self.stdout.write("-- Grabbing user data from DB --")
        self.write_data_to_csv(self.get_data_from_db())

        self.stdout.write('-- Finished --')
