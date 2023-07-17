import random
import string

from django.conf import settings
from django.core.files.base import ContentFile
from django.core.files.uploadedfile import SimpleUploadedFile
from django.test import override_settings
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIClient

from country.models import Country
from country.tests.base import CountryBaseTests


class CountryRoadMapTests(CountryBaseTests):

    def test_list_road_map_documents_for_a_country(self):
        country = Country.objects.first()
        country.super_admins.add(self.test_user['user_profile_id'])

        # self.assertEqual(country.documents.count(), 0)
        #
        # for i in range(2):
        #     ArchitectureRoadMapDocument.objects.create(
        #         country=country,
        #         title=f'{i} test',
        #         document=ContentFile('test_content', name=f'test_file_{i}.xls')
        #     )
        # self.assertEqual(country.documents.count(), 2)

        url = reverse('country-detail', args=[country.id])
        response = self.test_user_client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK, response.json())
        self.assertEqual(len(response.json()['documents']), 2)
        self.assertEqual(response.json()['documents'][0]['title'], '0 test')
        self.assertEqual(response.json()['documents'][0]['document'], 'documents/test_file_0.xls')
        self.assertEqual(response.json()['documents'][1]['title'], '1 test')
        self.assertEqual(response.json()['documents'][1]['document'], 'documents/test_file_1.xls')
        self.assertTrue(response.json()['documents'][0]['title'] < response.json()['documents'][1]['title'])
        for document in response.json()['documents']:
            self.assertEqual(document['size'], 12)

    def test_upload_road_map_document_success(self):
        country = Country.objects.first()
        country.super_admins.add(self.test_user['user_profile_id'])

        road_map_file = SimpleUploadedFile("test_file.xls", b"test_content")
        url = reverse('architecture-roadmap-document-list')
        data = {
            'country': country.id,
            'title': 'test document',
            'document': road_map_file,
        }
        response = self.test_user_client.post(url, data, format='multipart')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED, response.json())
        data = response.json()
        self.assertEqual(data['country'], country.id)
        self.assertEqual(data['title'], 'test document')
        self.assertIn(road_map_file.name, data['document'])

    def test_upload_road_map_document_without_permission(self):
        country = Country.objects.first()

        self.assertEqual(country.admins.count(), 0)

        url = reverse('architecture-roadmap-document-list')
        data = {
            'country': country.id,
            'title': 'test document',
            'document': SimpleUploadedFile("test_file.txt", b"test_content"),
        }
        response = self.test_user_client.post(url, data, format='multipart')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN, response.json())

    def test_upload_road_map_document_with_invalid_extension(self):
        country = Country.objects.first()
        country.super_admins.add(self.test_user['user_profile_id'])

        url = reverse('architecture-roadmap-document-list')
        data = {
            'country': country.id,
            'title': 'test document',
            'document': SimpleUploadedFile("test_file.abc", b"test_content"),
        }
        response = self.test_user_client.post(url, data, format='multipart')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST, response.json())
        self.assertEqual(
            response.json(),
            {'document': ['Invalid file type. Allowed formats: .pdf, .xls, .xlsx']}
        )

    @override_settings(MAX_ROAD_MAP_DOCUMENT_UPLOAD_SIZE=1024 * 1024)  # 1 MB
    def test_upload_too_big_road_map_document(self):
        letters = string.ascii_lowercase
        content = ''.join(random.choice(letters) for _ in range(settings.MAX_ROAD_MAP_DOCUMENT_UPLOAD_SIZE + 10))
        road_map_file = SimpleUploadedFile("test_file.txt", content.encode())

        country = Country.objects.first()
        country.super_admins.add(self.test_user['user_profile_id'])

        url = reverse('architecture-roadmap-document-list')
        data = {
            'country': country.id,
            'title': 'test document',
            'document': road_map_file,
        }
        response = self.test_user_client.post(url, data, format='multipart')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST, response.json())
        self.assertEqual(response.json(), {'document': ['The file exceeds the maximum allowed size: 1 MB.']})

    @override_settings(MAX_ROAD_MAP_DOCUMENT_PER_COUNTRY=2)
    def test_upload_too_many_road_map_documents(self):
        country = Country.objects.first()
        country.super_admins.add(self.test_user['user_profile_id'])
        url = reverse('architecture-roadmap-document-list')

        data = {'country': country.id, }
        # document upload should work within the limit
        for i in range(settings.MAX_ROAD_MAP_DOCUMENT_PER_COUNTRY):
            data['document'] = SimpleUploadedFile(f"test_file_{i}.xls", b"test_content")
            data['title'] = f'test document {i}'
            response = self.test_user_client.post(url, data, format='multipart')
            self.assertEqual(response.status_code, status.HTTP_201_CREATED, response.json())

        # next upload should fail
        data['document'] = SimpleUploadedFile("test_file_100.xls", b"test_content")
        data['title'] = 'test document 100'
        response = self.test_user_client.post(url, data, format='multipart')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST, response.json())
        self.assertEqual(
            response.json(), {'non_field_errors': ['The country already has 2 related road map documents']})

    # def test_document_search(self):
    #     client = APIClient()
    #     ArchitectureRoadMapDocument.objects.all().delete()
    #
    #     country = Country.objects.first()
    #     country.super_admins.add(self.test_user['user_profile_id'])
    #
    #     upload_url = reverse('architecture-roadmap-document-list')
    #
    #     data = {
    #         'country': country.id,
    #         'document': SimpleUploadedFile("test.xls", b"test_content_for_xls"),
    #         'title': 'excel',
    #     }
    #     response = self.test_user_client.post(upload_url, data, format='multipart')
    #     self.assertEqual(response.status_code, status.HTTP_201_CREATED, response.json())
    #
    #     data['document'] = SimpleUploadedFile("01.pdf", b"test_content_for_pdf"),
    #     data['title'] = 'presentation'
    #     response = self.test_user_client.post(upload_url, data, format='multipart')
    #     self.assertEqual(response.status_code, status.HTTP_201_CREATED, response.json())
    #
    #     self.assertEqual(ArchitectureRoadMapDocument.objects.count(), 2)
    #
    #     # search by title
    #     url = reverse('document-search-list') + '?search=presentation'
    #     response = client.get(url, format='json')
    #     self.assertEqual(response.status_code, status.HTTP_200_OK, response.json())
    #     data = response.json()
    #     self.assertEqual(len(data), 1)
    #     self.assertEqual(data[0]['title'], 'presentation')
    #
    #     # search by file name
    #     url = reverse('document-search-list') + '?search=xls'
    #     response = client.get(url, format='json')
    #     self.assertEqual(response.status_code, status.HTTP_200_OK, response.json())
    #     data = response.json()
    #     self.assertEqual(len(data), 1)
    #     self.assertEqual(data[0]['title'], 'excel')
    #
    # def test_soft_delete_road_map_document_success(self):
    #     ArchitectureRoadMapDocument.objects.all().delete()
    #
    #     country = Country.objects.first()
    #     country.super_admins.add(self.test_user['user_profile_id'])
    #
    #     # upload documents
    #     url = reverse('architecture-roadmap-document-list')
    #
    #     data = {
    #         'country': country.id,
    #         'document': SimpleUploadedFile("test.xls", b"test_content_for_xls"),
    #         'title': 'excel',
    #     }
    #     response = self.test_user_client.post(url, data, format='multipart')
    #     self.assertEqual(response.status_code, status.HTTP_201_CREATED, response.json())
    #
    #     data['document'] = SimpleUploadedFile("01.pdf", b"test_content_for_pdf"),
    #     data['title'] = 'presentation'
    #     response = self.test_user_client.post(url, data, format='multipart')
    #     self.assertEqual(response.status_code, status.HTTP_201_CREATED, response.json())
    #
    #     self.assertEqual(ArchitectureRoadMapDocument.objects.count(), 2)
    #
    #     last_doc_id = response.json()['id']
    #
    #     # check country
    #     country_detail_url = reverse("country-detail", kwargs={"pk": country.id})
    #     response = self.test_user_client.get(country_detail_url, format='json')
    #     self.assertEqual(response.status_code, status.HTTP_200_OK, response.json())
    #     self.assertEqual(len(response.json()['documents']), 2)
    #
    #     # delete last document
    #     url = reverse('architecture-roadmap-document-detail', args=(last_doc_id,))
    #     response = self.test_user_client.delete(url, data, format='json')
    #     self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
    #
    #     self.assertEqual(ArchitectureRoadMapDocument.objects.count(), 1)
    #     self.assertEqual(ArchitectureRoadMapDocument.all_objects.count(), 2)
    #
    #     # check country again
    #     response = self.test_user_client.get(country_detail_url, format='json')
    #     self.assertEqual(response.status_code, status.HTTP_200_OK, response.json())
    #     self.assertEqual(len(response.json()['documents']), 1)
