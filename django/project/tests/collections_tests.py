import json
import copy

from rest_framework.reverse import reverse
from project.models import Collection, ImportRow, ProjectImportV2, Project
from project.tests.setup import SetupTests
from user.models import User
from rest_framework.test import APIClient


class CollectionsTests(SetupTests):

    def setUp(self):
        super(CollectionsTests, self).setUp()
        self.test_user = User.objects.get(userprofile__id=self.user_profile_id)
        self.userprofile_2, self.test_user_key_2, self.test_user_client_2 = \
            self.create_user(user_email="test_user_2@pulilab.com")
        self.test_user_2 = User.objects.get(userprofile=self.userprofile_2)
        """
        Create a number of collections and add it to user 1"""
        self.user_1_collections = []
        for i in range(5):
            c = Collection.objects.create(name=f"collection_{i}", user=self.test_user)
            self.user_1_collections.append(c)
        """
        Create some more collections and add them to user 2"""
        self.user_2_collections = []
        for i in range(3):
            c = Collection.objects.create(name=f"collection_{i}", user=self.test_user_2)
            self.user_2_collections.append(c)
        """
        load the test data"""
        f = open("project/tests/test_data/collection_test_data_01.json", "r")
        self.test_data_01 = json.load(f)
        f = open("project/tests/test_data/collection_test_data_02.json", "r")
        self.test_data_02 = json.load(f)

    def test_collections_list(self):
        url = reverse("my-collections")
        response = self.test_user_client.get(url, format='json')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.json()), 5)

    def test_collection_create_failed_validation(self):
        url = reverse("collection-list")
        test_data = copy.deepcopy(self.test_data_01)
        test_data.update({"name": "Collection Test"})
        response = self.test_user_client.post(url, test_data, format='json')
        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.json(), ["'add_me_as_editor' missing or invalid. Required: bool"])

    def test_collections_create_add_me(self):
        url = reverse("collection-list")
        test_data = copy.deepcopy(self.test_data_01)
        test_data.update({"name": "Projects about ponies", 'add_me_as_editor': True})
        response = self.test_user_client.post(url, test_data, format='json')
        self.assertEqual(response.status_code, 201)
        self.assertEqual(response.json()['name'], "Projects about ponies")
        self.assertNotEqual(response.json()['url'], "")
        collections = Collection.objects.filter(name='Projects about ponies')
        self.assertEqual(collections.count(), 1)
        pimport = ProjectImportV2.objects.get(collection=collections[0])
        self.assertEqual(pimport.user, self.test_user)
        importrows = ImportRow.objects.filter(parent=pimport)
        for ir in importrows:
            self.assertIn(self.test_user.email, ir.data['Team'])
        self.assertEqual(importrows.count(), 2)

    def test_collections_create_do_not_add(self):
        url = reverse("collection-list")
        test_data = copy.deepcopy(self.test_data_01)
        test_data.update({"name": "Projects about ponies", 'add_me_as_editor': False})
        response = self.test_user_client.post(url, test_data, format='json')
        self.assertEqual(response.status_code, 201)
        self.assertEqual(response.json()['name'], "Projects about ponies")
        collections = Collection.objects.filter(name='Projects about ponies')
        self.assertEqual(collections.count(), 1)
        pimport = ProjectImportV2.objects.get(collection=collections[0])
        self.assertEqual(pimport.user, self.test_user)
        self.assertEqual(pimport.donor, None)
        importrows = ImportRow.objects.filter(parent=pimport)
        self.assertEqual(importrows.count(), 2)
        for ir in importrows:
            self.assertNotIn(self.test_user.email, ir.data['Team'])

    def test_collections_create_no_project_import(self):
        url = reverse("collection-list")
        test_data = copy.deepcopy(self.test_data_01)
        test_data.update({"name": "Projects about ponies", 'add_me_as_editor': False})
        response = self.test_user_client.post(url, test_data, format='json')
        self.assertEqual(response.status_code, 201)
        self.assertEqual(response.json()['name'], "Projects about ponies")
        collections = Collection.objects.filter(name='Projects about ponies')
        self.assertEqual(collections.count(), 1)
        pimport = ProjectImportV2.objects.get(collection=collections[0])
        self.assertEqual(pimport.user, self.test_user)
        self.assertEqual(pimport.donor, None)
        importrows = ImportRow.objects.filter(parent=pimport)
        self.assertEqual(importrows.count(), 2)
        for ir in importrows:
            self.assertNotIn(self.test_user.email, ir.data['Team'])

    def test_collections_create_set_country(self):
        url = reverse("collection-list")
        test_data = copy.deepcopy(self.test_data_01)
        test_data.update({"name": "Projects about ponies", 'add_me_as_editor': True, 'country': self.country1.id})
        response = self.test_user_client.post(url, test_data, format='json')
        self.assertEqual(response.status_code, 201)
        self.assertEqual(response.json()['name'], "Projects about ponies")
        collections = Collection.objects.filter(name='Projects about ponies')
        self.assertEqual(collections.count(), 1)
        pimport = ProjectImportV2.objects.get(collection=collections[0])
        self.assertEqual(pimport.user, self.test_user)
        self.assertEqual(pimport.country, self.country1)
        self.assertEqual(pimport.donor, None)

        importrows = ImportRow.objects.filter(parent=pimport)
        self.assertEqual(importrows.count(), 2)
        for ir in importrows:
            self.assertEqual(ir.data['Country'], self.country1.name)

    def test_collections_create_set_donor(self):
        url = reverse("collection-list")
        test_data = copy.deepcopy(self.test_data_01)
        test_data.update({"name": "Projects about ponies", 'add_me_as_editor': True, 'donor': self.d1.id})
        response = self.test_user_client.post(url, test_data, format='json')
        self.assertEqual(response.status_code, 201)
        self.assertEqual(response.json()['name'], "Projects about ponies")
        collections = Collection.objects.filter(name='Projects about ponies')
        self.assertEqual(collections.count(), 1)
        pimport = ProjectImportV2.objects.get(collection=collections[0])
        self.assertEqual(pimport.user, self.test_user)
        self.assertEqual(pimport.country, None)
        self.assertEqual(pimport.donor, self.d1)
        importrows = ImportRow.objects.filter(parent=pimport)
        self.assertEqual(importrows.count(), 2)
        for ir in importrows:
            self.assertEqual(ir.data['Donor'], self.d1.name)

    def test_collections_create_double_fail(self):
        url = reverse("collection-list")
        test_data = copy.deepcopy(self.test_data_01)
        test_data.update({"name": "Projects about ponies", 'add_me_as_editor': True, 'donor': self.d1.id})
        response = self.test_user_client.post(url, test_data, format='json')
        self.assertEqual(response.status_code, 201)
        self.assertEqual(response.json()['name'], "Projects about ponies")
        collections = Collection.objects.filter(name='Projects about ponies')
        self.assertEqual(collections.count(), 1)
        test_data_2 = copy.deepcopy(self.test_data_02)
        test_data_2.update({"name": "Projects about ponies", 'add_me_as_editor': True, 'donor': self.d1.id})
        response_2 = self.test_user_client.post(url, test_data_2, format='json')
        self.assertEqual(response_2.status_code, 400)
        self.assertEqual(response_2.json(), {'non_field_errors': ['The fields user, name must make a unique set.']})
        collections = Collection.objects.filter(name='Projects about ponies')
        self.assertEqual(collections.count(), 1)

    def test_collection_patch_name_change_success(self):
        url = reverse("collection-list")
        test_data = copy.deepcopy(self.test_data_01)
        test_data.update({"name": "Projects about ponies", 'add_me_as_editor': True})
        response = self.test_user_client.post(url, test_data, format='json')
        self.assertEqual(response.status_code, 201)
        self.assertEqual(response.json()['name'], "Projects about ponies")
        self.assertNotEqual(response.json()['url'], "")
        collections = Collection.objects.filter(name='Projects about ponies')
        self.assertEqual(collections.count(), 1)
        pimport = ProjectImportV2.objects.get(collection=collections[0])
        self.assertEqual(pimport.user, self.test_user)
        importrows = ImportRow.objects.filter(parent=pimport)
        for ir in importrows:
            self.assertIn(self.test_user.email, ir.data['Team'])
        self.assertEqual(importrows.count(), 2)
        collection_url = response.json()['url']
        url_update = reverse("collection-detail", kwargs={'url': collection_url})
        response = self.test_user_client.patch(url_update, {'name': "Projects about bronies"})
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()['name'], "Projects about bronies")

    def test_collection_patch_same_file_fail(self):
        url = reverse("collection-list")
        test_data = copy.deepcopy(self.test_data_01)
        test_data.update({"name": "Projects about ponies", 'add_me_as_editor': True})
        response = self.test_user_client.post(url, test_data, format='json')
        self.assertEqual(response.status_code, 201)
        self.assertEqual(response.json()['name'], "Projects about ponies")
        self.assertNotEqual(response.json()['url'], "")
        collections = Collection.objects.filter(name='Projects about ponies')
        self.assertEqual(collections.count(), 1)
        pimport = ProjectImportV2.objects.get(collection=collections[0])
        self.assertEqual(pimport.user, self.test_user)
        importrows = ImportRow.objects.filter(parent=pimport)
        for ir in importrows:
            self.assertIn(self.test_user.email, ir.data['Team'])
        self.assertEqual(importrows.count(), 2)
        collection_url = response.json()['url']
        url_update = reverse("collection-detail", kwargs={'url': collection_url})
        test_data_2 = copy.deepcopy(self.test_data_02)
        # make it seem as if we're trying to overwrite the same xls
        test_data_2['project_import']['filename'] = test_data['project_import']['filename']
        response = self.test_user_client.patch(url_update, data=test_data_2, format='json')
        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.json(),
                         ['Uploading the same file multiple times is not allowed: "DHA_Import_template.xlsx"'])

    def test_collection_patch_another_file_success(self):
        url = reverse("collection-list")
        test_data = copy.deepcopy(self.test_data_01)
        test_data.update({"name": "Projects about ponies", 'add_me_as_editor': True})
        response = self.test_user_client.post(url, test_data, format='json')
        self.assertEqual(response.status_code, 201)
        self.assertEqual(response.json()['name'], "Projects about ponies")
        self.assertNotEqual(response.json()['url'], "")
        collections = Collection.objects.filter(name='Projects about ponies')
        self.assertEqual(collections.count(), 1)
        pimport = ProjectImportV2.objects.get(collection=collections[0])
        self.assertEqual(pimport.user, self.test_user)
        importrows = ImportRow.objects.filter(parent=pimport)
        for ir in importrows:
            self.assertIn(self.test_user.email, ir.data['Team'])
        self.assertEqual(importrows.count(), 2)
        collection_url = response.json()['url']
        url_update = reverse("collection-detail", kwargs={'url': collection_url})
        test_data_2 = copy.deepcopy(self.test_data_02)
        # make it seem as if we're trying to overwrite the same xls
        response = self.test_user_client.patch(url_update, data=test_data_2, format='json')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.json()['project_imports']), 2)

    def test_project_team_can_be_empty_if_has_collection(self):
        # Create a collection
        url = reverse("collection-list")
        test_data = copy.deepcopy(self.test_data_01)
        test_data.update({"name": "Projects about ponies", 'add_me_as_editor': False})
        response = self.test_user_client.post(url, test_data, format='json')
        self.assertEqual(response.status_code, 201)
        self.assertEqual(response.json()['name'], "Projects about ponies")
        collections = Collection.objects.filter(name='Projects about ponies')
        self.assertEqual(collections.count(), 1)
        pimport = ProjectImportV2.objects.get(collection=collections[0])
        self.assertEqual(pimport.user, self.test_user)
        self.assertEqual(pimport.donor, None)
        importrows = ImportRow.objects.filter(parent=pimport)
        # Create a project by setting a related import row
        url = reverse("project-create", kwargs={"country_id": self.country1.id})
        data = copy.deepcopy(self.project_data)
        data['project']['import_row'] = importrows[0].pk
        data['project'].update(name="Test Project in Collection")
        data['project']['team'] = []
        response = self.test_user_client.post(url, data, format="json")
        self.assertEqual(response.status_code, 201)
        project = Project.objects.get(id=response.json()['id'])
        project_data = self.generate_project_data(project_name=project.name)

        self.assertEqual(project.team.all().count(), 0)

        # try to publish it - it should fail
        url = reverse("project-publish", kwargs={"project_id": project.id, "country_id": self.country1.id})
        response = self.test_user_client.put(url, {'project': project_data}, format="json")
        self.assertEqual(response.status_code, 403)
        self.assertEqual(response.json(), {'detail': 'You do not have permission to perform this action.'})

        # add the user to the project team
        url = reverse("project-groups", kwargs={"pk": project.id})

        groups = {
            "team": [self.userprofile.id],
            "viewers": []
        }

        response = self.test_user_client.put(url, groups)
        self.assertTrue("team" in response.json())
        self.assertTrue("viewers" in response.json())
        self.assertEqual(response.json()['team'], [self.userprofile.id])
        self.assertEqual(response.json()['viewers'], [])

        # try to publish it - it should succeed
        url = reverse("project-publish", kwargs={"project_id": project.id, "country_id": self.country1.id})
        response = self.test_user_client.put(url, project_data, format="json")
        self.assertEqual(response.status_code, 200)

    def test_collections_can_be_accessed_unathorized(self):
        url = reverse("collection-list")
        test_data = copy.deepcopy(self.test_data_01)
        test_data.update({"name": "Projects about ponies", 'add_me_as_editor': False})
        response = self.test_user_client.post(url, test_data, format='json')
        self.assertEqual(response.status_code, 201)
        self.assertEqual(response.json()['name'], "Projects about ponies")
        collections = Collection.objects.filter(name='Projects about ponies')
        self.assertEqual(collections.count(), 1)
        pimport = ProjectImportV2.objects.get(collection=collections[0])
        self.assertEqual(pimport.user, self.test_user)
        self.assertEqual(pimport.donor, None)
        importrows = ImportRow.objects.filter(parent=pimport)
        self.assertEqual(importrows.count(), 2)
        for ir in importrows:
            self.assertNotIn(self.test_user.email, ir.data['Team'])
        collection_url = response.json()['url']
        url_collection = reverse("collection-detail", kwargs={'url': collection_url})
        test_anon_client = APIClient(format="json")
        response = test_anon_client.get(url_collection)
        self.assertEqual(response.status_code, 200)

        url_collection_list = reverse("my-collections")
        response = test_anon_client.get(url_collection_list)
        self.assertEqual(response.status_code, 401)

    def test_collections_create_access_project_import(self):
        url = reverse("collection-list")
        test_data = copy.deepcopy(self.test_data_01)
        test_data.update({"name": "Projects about ponies", 'add_me_as_editor': False})
        response = self.test_user_client.post(url, test_data, format='json')
        self.assertEqual(response.status_code, 201)
        self.assertEqual(response.json()['name'], "Projects about ponies")
        collections = Collection.objects.filter(name='Projects about ponies')
        self.assertEqual(collections.count(), 1)
        pimport = ProjectImportV2.objects.get(collection=collections[0])
        self.assertEqual(pimport.user, self.test_user)
        self.assertEqual(pimport.donor, None)
        url = reverse('projectimportv2-list')
        response = self.test_user_client.get(url)
        self.assertEqual(response.status_code, 200)
        url = reverse('is-collection-data-available')
        data = {
            'filename': 'List of greenleaf projects',
            'sheet_name': 'Precise Sheet'
        }
        response = self.test_user_client.post(url, data)
        self.assertEqual(response.json()['available'], True)
        data_2 = {
            "filename": "DHA_Import_template.xlsx",
            "sheet_name": "Import Example"
        }
        response = self.test_user_client.post(url, data_2)
        self.assertEqual(response.json()['available'], False)
        # Check the new add-me-as-editor api
        project = Project.objects.create(name='Test project stuff')
        project.import_rows.set([pimport.rows.all()[0]])  # added to collection!
        url = reverse('add-me-as-editor', kwargs={'pk': project.id, 'collection_url': collections[0].url})
        response = self.test_user_client.post(url)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()['team'], [self.test_user.userprofile.id])
