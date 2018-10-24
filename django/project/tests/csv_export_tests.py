from rest_framework.reverse import reverse

from project.models import Project


def test_csv_export_failed(self):
    url = reverse("csv-export")
    response = self.test_user_client.post(url, {"ids": [1, 2]}, format="json")
    self.assertEqual(response.status_code, 404)

def test_csv_export_success(self):
    url = reverse("csv-export")
    response = self.test_user_client.post(url, {"ids": [1, 2, Project.objects.get().id]}, format="json")
    self.assertEqual(response.status_code, 200)
    headers = dict(response.items())
    self.assertEqual(headers['Content-Type'], 'text/csv')
    self.assertEqual(headers['Content-Disposition'], 'attachment; filename="csv.csv"')
    self.assertContains(response, "Test Project1")
    self.assertContains(response, "a@a.com")
    self.assertContains(response, "National Level Deployment: [Clients: 20000, Health Workers: 0, Facilities: 0]")
    self.assertContains(response, "District: dist1 [Clients: 20, Health Workers: 5, Facilities: 4], "
                                  "District: dist2 [Clients: 10, Health Workers: 2, Facilities: 8]")
    self.assertContains(response, "District: ward1 [Clients: 209, Health Workers: 59, Facilities: 49], "
                                  "District: ward2 [Clients: 109, Health Workers: 29, Facilities: 89]")
    self.assertContains(response, "Donor1, Donor2")

def test_csv_export_success_without_coverage(self):
    url = reverse("csv-export")
    p = Project.objects.get()
    p.data.pop('coverage')
    p.data.pop('coverage_second_level')
    p.data.pop('national_level_deployment')
    p.save()
    response = self.test_user_client.post(url, {"ids": [1, 2, Project.objects.get().id]}, format="json")
    self.assertEqual(response.status_code, 200)
    headers = dict(response.items())
    self.assertEqual(headers['Content-Type'], 'text/csv')
    self.assertEqual(headers['Content-Disposition'], 'attachment; filename="csv.csv"')
    self.assertContains(response, "Test Project1")
    self.assertContains(response, "a@a.com")
    self.assertNotContains(response, "National Level Deployment: [Clients: 20000, Health Workers: 0, "
                                     "Facilities: 0]")
    self.assertNotContains(response, "District: dist1 [Clients: 20, Health Workers: 5, Facilities: 4], "
                                     "District: dist2 [Clients: 10, Health Workers: 2, Facilities: 8]")
    self.assertNotContains(response, "District: ward1 [Clients: 209, Health Workers: 59, Facilities: 49], "
                                     "District: ward2 [Clients: 109, Health Workers: 29, Facilities: 89]")
