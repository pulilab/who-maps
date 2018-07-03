import paramiko

from django.conf import settings
from celery.utils.log import get_task_logger
from scheduler.celery import app
from .models import UserProfile

logger = get_task_logger(__name__)


@app.task(name="sync_users_to_odk")
def sync_users_to_odk():
    ssh = paramiko.SSHClient()
    ssh.load_system_host_keys()
    ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    ssh.connect(username=settings.ODK_SERVER_USER, hostname=settings.ODK_SERVER_HOST)

    for profile in UserProfile.objects.all():
        user_line = "{} '{}'".format(profile.user.email, profile.user.password)
        ssh_stdin, ssh_stdout, ssh_stderr = ssh.exec_command(
            "python odk_sync_user.py {}".format(user_line))

        out = ssh_stdout.read().decode('utf-8')
        error = ssh_stderr.read().decode('utf-8')
        print(out)
        print(error)
    ssh.close()
