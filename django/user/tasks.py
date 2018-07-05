import paramiko

from django.conf import settings
from celery.utils.log import get_task_logger
from scheduler.celery import app

logger = get_task_logger(__name__)


@app.task(name="sync_users_to_odk")
def sync_user_to_odk(user_profile_id, update_user=False):  # pragma: no cover
    from .models import UserProfile

    ssh = paramiko.SSHClient()
    ssh.load_system_host_keys()
    ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    ssh.connect(username=settings.ODK_SERVER_USER, hostname=settings.ODK_SERVER_HOST)

    if not user_profile_id:
        queryset = UserProfile.objects.exclude(odk_sync=True)
    else:
        queryset = UserProfile.objects.filter(id=user_profile_id)

    for profile in queryset:
        user_line = "{} '{}'".format(profile.user.email, profile.user.password)
        command = "python odk_sync_user.py {} {}".format(user_line, "update" if update_user else "")
        ssh_stdin, ssh_stdout, ssh_stderr = ssh.exec_command(command)

        out = ssh_stdout.read().decode('utf-8')
        error = ssh_stderr.read().decode('utf-8')

        if "created" in out:
            profile.odk_sync = True
            profile.save()
        print(out)
        print(error)
    ssh.close()
