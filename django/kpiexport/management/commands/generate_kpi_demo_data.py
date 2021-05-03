from __future__ import unicode_literals

from django.core.management.base import BaseCommand
from datetime import datetime, timedelta

from django.contrib.auth.models import User
from rest_framework.authtoken.models import Token
import random


class Command(BaseCommand):
    help = 'Clears User KPI data and regenerates them for the past year'

    def handle(self, *args, **options):
        self.stdout.write("-- Modifying user data --")
        generate_date = datetime.now().astimezone() - timedelta(days=366)
        old_inactive_users = User.objects.filter(last_login__lt=generate_date.date())
        if len(old_inactive_users) > 500:
            old_inactive_users = old_inactive_users[:500]
        for user in old_inactive_users:
            random_date = datetime.now().astimezone() - timedelta(days=random.randint(1, 360))
            user.last_login = random_date
            user.save()

            token, _ = Token.objects.get_or_create(user=user)
            token.created = datetime.now().astimezone() - timedelta(days=random.randint(1, 360))
            token.save()

            self.stdout.write(f'{user.email}: Login: {user.last_login}, Token created: {token.created}')

        self.stdout.write('-- Finished --')
