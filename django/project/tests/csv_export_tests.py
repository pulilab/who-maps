from rest_framework.reverse import reverse

from project.models import Project


def test_csv_export_failed(self):
    url = reverse("csv-export")
    response = self.test_user_client.post(url, {"ids": [1, 2]}, format="json")
    self.assertEqual(response.status_code, 404)
