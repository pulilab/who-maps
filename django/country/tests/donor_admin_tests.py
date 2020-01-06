from django.contrib.auth.models import User
from django.test import TestCase
from django.urls import reverse


class DonorAdminTests(TestCase):
    def setUp(self):
        self.user = User.objects.create(username="alma", email="test@test.com", is_staff=True, is_superuser=True)
        self.user.set_password('korte')
        self.user.save()

    def test_donor_code_min_length(self):
        self.assertTrue(self.client.login(username='test@test.com', password='korte'))
        url = reverse('admin:country_donor_add')
        data = {
            'name': 'Some donor',
            'code': 'aa',
        }
        response = self.client.post(url, data, follow=True)
        self.assertContains(response, "Ensure this value has at least 3 characters")
