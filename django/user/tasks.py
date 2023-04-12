from celery.utils.log import get_task_logger

from core.utils import send_mail_wrapper
from scheduler.celery import app

logger = get_task_logger(__name__)


@app.task(name="send_user_request_to_admins")
def send_user_request_to_admins(profile_id):
    """
    Sends user requests for donor and country user types to the admins.
    """
    from country.models import Country, Donor
    from .models import UserProfile

    admins = []
    admin_type = ""
    for_what = ""
    profile = UserProfile.objects.get(id=profile_id)

    if not any([profile.donor, profile.country]):
        return

    superusers = UserProfile.objects.filter(user__is_superuser=True).filter(role_request_notification=True)
    if profile.is_government_type():
        country = Country.objects.get(id=profile.country.id)
        receiver_country_admins = country.admins.filter(role_request_notification=True)
        receiver_country_super_admins = country.super_admins.filter(role_request_notification=True)
        admins = receiver_country_admins | receiver_country_super_admins | superusers
        admin_type = 'country'
        for_what = country.name
    elif profile.is_investor_type():
        donor = Donor.objects.get(id=profile.donor.id)
        receiver_donor_admins = donor.admins.filter(role_request_notification=True)
        receiver_donor_super_admins = donor.super_admins.filter(role_request_notification=True)
        admins = receiver_donor_admins | receiver_donor_super_admins | superusers
        admin_type = 'donor'
        for_what = donor.name

    for admin in admins:
        subject = "Request: {} has requested to be a {} for {}".format(str(profile),
                                                                       profile.get_account_type_display(),
                                                                       for_what)
        context = {
            "full_name": admin.name,
            "requester": str(profile),
            "requester_title": profile.title,
            "requester_linkedin": profile.linkedin,
            "requester_type": profile.get_account_type_display(),
            "admin_type": admin_type,
        }
        send_mail_wrapper(subject=subject,
                          email_type="admin_request",
                          to=admin.user.email,
                          language=admin.language,
                          context=context)
