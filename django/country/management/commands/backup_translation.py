import os
import shutil
import subprocess

from django.core.management.base import BaseCommand
from django.conf import settings
from django.utils import timezone


class Command(BaseCommand):

    def handle(self, *args, **options):
        timestamp = timezone.now().strftime('%Y_%m_%d__%H_%M_%S')
        backup_base_dir = 'backup'
        if not os.path.exists(backup_base_dir):
            os.mkdir(backup_base_dir)
        backup_dir = f'{backup_base_dir}/backup_translations_{timestamp}'
        if not os.path.exists(backup_dir):
            os.mkdir(backup_dir)

        base_dir = settings.BASE_DIR
        dirs = [name for name in os.listdir(base_dir) if os.path.isdir(os.path.join(base_dir, name))]
        app_dirs = sorted([name for name in dirs if 'apps.py' in os.listdir(name)])

        for app_dir in app_dirs:
            if 'locale' in os.listdir(app_dir):
                dest = f'{backup_dir}/{app_dir}/locale'
                shutil.copytree(f'{app_dir}/locale', dest)

        if 'locale' in os.listdir(base_dir):
            dest = f'{backup_dir}//locale'
            shutil.copytree(f'{base_dir}/locale', dest)

        subprocess.run(["tar", "-czvf", f'{backup_base_dir}/backup_translations_{timestamp}.tar.gz', backup_dir])
