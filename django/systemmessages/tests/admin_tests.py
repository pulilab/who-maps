from django.contrib.admin import AdminSite

from rest_framework.test import APITestCase

from systemmessages.admin import SystemMessageAdmin
from systemmessages.models import SystemMessage


class SystemMessageAdminTests(APITestCase):

    def test_system_message_admin_get_readonly_fields_without_object(self):
        admin = SystemMessageAdmin(model=SystemMessage, admin_site=AdminSite())
        self.assertEqual(admin.get_readonly_fields(request=None, obj=None), ['receivers_number'])

    def test_system_message_admin_get_readonly_fields_with_object(self):
        system_message = SystemMessage.objects.create(
            subject='test subject',
            message='test message',
            receiver_type=SystemMessage.ALL_USERS,
        )

        admin = SystemMessageAdmin(model=SystemMessage, admin_site=AdminSite())
        self.assertEqual(admin.get_readonly_fields(request=None, obj=system_message),
                         ['message', 'receiver_type', 'receivers_number', 'subject'])
