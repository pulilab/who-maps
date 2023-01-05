import os

from celery import Celery
from django.conf import settings
from who_maps import load_env

load_env.load_env()
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "who_maps.settings")

app = Celery("scheduler", set_as_current=True)

app.config_from_object("django.conf:settings")
app.autodiscover_tasks(lambda: settings.INSTALLED_APPS)
