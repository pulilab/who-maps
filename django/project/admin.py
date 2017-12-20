from django.contrib import admin
# from django.utils.html import mark_safe
from django.conf import settings
from django.core import mail
from django.utils.translation import ugettext
from django.template import loader

from core.admin import AllObjectsAdmin
# from country.models import Country
from user.models import UserProfile
from .models import TechnologyPlatform, InteroperabilityLink, DigitalStrategy, HealthFocusArea, \
    HealthCategory, Licence, InteroperabilityStandard, HISBucket, HSCGroup, HSCChallenge


class ChangeNotificationMixin(object):
    def save_form(self, request, form, change):
        if change:
            if form.has_changed():
                self.send_changed_notification(form)
        else:
            self.send_created_notification(form)
        return super(ChangeNotificationMixin, self).save_form(request, form, change)

    def send_changed_notification(self, form):
        subject = ugettext('{} - {} was changed').format(form.instance._meta.verbose_name.title(),
                                                         str(form.instance))
        html_template = loader.get_template('email/data_model_changed.html')
        html_message = html_template.render({'text': subject})
        self.send_notification_email(subject, html_message)

    def send_created_notification(self, form):
        subject = ugettext('New {} was created: {}').format(form.instance._meta.verbose_name,
                                                            str(form.instance))
        html_template = loader.get_template('email/new_data_model_created.html')
        html_message = html_template.render({'text': subject})
        self.send_notification_email(subject, html_message)

    def send_notification_email(self, subject, html_message):
        for profile in UserProfile.objects.all():
            mail.send_mail(subject=subject,
                           message='',
                           from_email=settings.FROM_EMAIL,
                           recipient_list=[profile.user.email],
                           html_message=html_message)


class TechnologyPlatformAdmin(ChangeNotificationMixin, AllObjectsAdmin):
    list_display = [
        'name',
    ]


class InteroperabilityLinkAdmin(ChangeNotificationMixin, AllObjectsAdmin):
    list_display = [
        'pre',
        'name',
    ]


class DigitalStrategyAdmin(ChangeNotificationMixin, AllObjectsAdmin):
    list_display = [
        '__str__',
    ]


class HealthFocusAreaAdmin(ChangeNotificationMixin, admin.ModelAdmin):
    pass


class HealthCategoryAdmin(ChangeNotificationMixin, admin.ModelAdmin):
    pass


class LicenceAdmin(ChangeNotificationMixin, admin.ModelAdmin):
    pass


class InteroperabilityStandardAdmin(ChangeNotificationMixin, admin.ModelAdmin):
    pass


class HISBucketAdmin(ChangeNotificationMixin, admin.ModelAdmin):
    pass


class HSCGroupAdmin(ChangeNotificationMixin, admin.ModelAdmin):
    pass


class HSCChallengeAdmin(ChangeNotificationMixin, admin.ModelAdmin):
    pass


# class ProjectApprovalAdmin(admin.ModelAdmin):
#     list_display = ['project', 'user', 'approved', 'reason']
#     readonly_fields = ['link']
#
#     def link(self, obj):
#         return mark_safe("<a href='/app/{}/edit-project'>See project</a>".format(obj.id))
#
#     def get_queryset(self, request):
#         qs = super(ProjectApprovalAdmin, self).get_queryset(request)
#         if not request.user.is_superuser:
#             country_ids = Country.objects.filter(user=request.user.userprofile).values_list('id', flat=True)
#             qs = qs.filter(project__data__country__contained_by=list(country_ids))
#         return qs


admin.site.register(TechnologyPlatform, TechnologyPlatformAdmin)
admin.site.register(InteroperabilityLink, InteroperabilityLinkAdmin)
admin.site.register(DigitalStrategy, DigitalStrategyAdmin)
# admin.site.register(ProjectApproval, ProjectApprovalAdmin)
admin.site.register(HealthFocusArea, HealthFocusAreaAdmin)
admin.site.register(HealthCategory, HealthCategoryAdmin)
admin.site.register(Licence, LicenceAdmin)
admin.site.register(InteroperabilityStandard, InteroperabilityStandardAdmin)
admin.site.register(HISBucket, HISBucketAdmin)
admin.site.register(HSCGroup, HSCGroupAdmin)
admin.site.register(HSCChallenge, HSCChallengeAdmin)
