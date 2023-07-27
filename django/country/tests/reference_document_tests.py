import random
import string

from django.conf import settings
from django.core.files.base import ContentFile
from django.core.files.uploadedfile import SimpleUploadedFile
from django.test import override_settings
from django.urls import reverse
from rest_framework import status
from datetime import date
from datetime import timedelta
from rest_framework.test import APIClient

from country.models import Country, ReferenceDocument
from country.tests.base import CountryBaseTests


class PolicyRegistryTests(CountryBaseTests):

    def test_list_documents_for_a_country(self):
        country = Country.objects.first()
        country.super_admins.add(self.test_user['user_profile_id'])

        self.assertEqual(country.documents.count(), 0)

        for i in range(2):
            ReferenceDocument.objects.create(
                country=country,
                title=f'{i} test',
                author_id=self.test_user['user_profile_id'],
                language=ReferenceDocument.Language.ENGLISH,
                purpose=f'{i} test purpose',
                featured=True,
                types=[ReferenceDocument.Type.FRAMEWORK, ReferenceDocument.Type.STRATEGY],
                valid_from=date.today(),
                valid_until=date.today(),
                document=ContentFile('test_content', name=f'test_file_{i}.xls')
            )
        self.assertEqual(country.documents.count(), 2)

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

    def test_upload_document_success(self):
        country = Country.objects.first()
        country.super_admins.add(self.test_user['user_profile_id'])

        file = SimpleUploadedFile("test_file.xls", b"test_content")
        url = reverse('reference-document-list')
        data = {
            'country': country.id,
            'title': 'test document',
            'document': file,
            'language': ReferenceDocument.Language.ENGLISH,
            'types': [ReferenceDocument.Type.FRAMEWORK, ReferenceDocument.Type.STRATEGY],
            'purpose': "test purpose",
            'valid_from': date.today(),
        }
        response = self.test_user_client.post(url, data, format='multipart')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED, response.json())
        data = response.json()
        self.assertEqual(data['country'], country.id)
        self.assertEqual(data['title'], 'test document')
        self.assertIn(file.name, data['document'])

    def test_upload_document_without_permission(self):
        country = Country.objects.first()

        self.assertEqual(country.admins.count(), 0)

        file = SimpleUploadedFile("test_file.xls", b"test_content")
        url = reverse('reference-document-list')
        data = {
            'country': country.id,
            'title': 'test document',
            'document': file,
            'language': ReferenceDocument.Language.ENGLISH,
            'types': [ReferenceDocument.Type.FRAMEWORK, ReferenceDocument.Type.STRATEGY],
            'purpose': "test purpose",
            'valid_from': date.today(),
        }
        response = self.test_user_client.post(url, data, format='multipart')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN, response.json())

    def test_upload_document_wrong_dates(self):
        country = Country.objects.first()
        country.super_admins.add(self.test_user['user_profile_id'])

        file = SimpleUploadedFile("test_file.xls", b"test_content")
        url = reverse('reference-document-list')
        data = {
            'country': country.id,
            'title': 'test document',
            'document': file,
            'language': ReferenceDocument.Language.ENGLISH,
            'types': [ReferenceDocument.Type.FRAMEWORK, ReferenceDocument.Type.STRATEGY],
            'purpose': "test purpose",
            'valid_from': date.today(),
            'valid_until': date.today() - timedelta(days=1),
        }
        response = self.test_user_client.post(url, data, format='multipart')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST, response.json())
        self.assertEqual(response.json(), {'valid_from': ["Valid from can't be greater than valid until"]})

    def test_upload_document_with_invalid_extension(self):
        country = Country.objects.first()
        country.super_admins.add(self.test_user['user_profile_id'])

        file = SimpleUploadedFile("test_file.abc", b"test_content")
        url = reverse('reference-document-list')
        data = {
            'country': country.id,
            'title': 'test document',
            'document': file,
            'language': ReferenceDocument.Language.ENGLISH,
            'types': [ReferenceDocument.Type.FRAMEWORK, ReferenceDocument.Type.STRATEGY],
            'purpose': "test purpose",
            'valid_from': date.today(),
        }
        response = self.test_user_client.post(url, data, format='multipart')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST, response.json())
        self.assertEqual(
            response.json(),
            {'document': [f'Invalid file type. Allowed formats: '
                          f'{", ".join(settings.VALID_ROAD_MAP_DOCUMENT_FILE_TYPES)}']}
        )

    @override_settings(MAX_ROAD_MAP_DOCUMENT_UPLOAD_SIZE=1024 * 1024)  # 1 MB
    def test_upload_too_big_document(self):
        letters = string.ascii_lowercase
        content = ''.join(random.choice(letters) for _ in range(settings.MAX_ROAD_MAP_DOCUMENT_UPLOAD_SIZE + 10))
        file = SimpleUploadedFile("test_file.txt", content.encode())

        country = Country.objects.first()
        country.super_admins.add(self.test_user['user_profile_id'])

        url = reverse('reference-document-list')
        data = {
            'country': country.id,
            'title': 'test document',
            'document': file,
            'language': ReferenceDocument.Language.ENGLISH,
            'types': [ReferenceDocument.Type.FRAMEWORK, ReferenceDocument.Type.STRATEGY],
            'purpose': "test purpose",
            'valid_from': date.today(),
        }
        response = self.test_user_client.post(url, data, format='multipart')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST, response.json())
        self.assertEqual(response.json(), {'document': ['The file exceeds the maximum allowed size: 1 MB.']})

    def test_document_search(self):
        client = APIClient()

        country = Country.objects.first()
        country.super_admins.add(self.test_user['user_profile_id'])

        upload_url = reverse('reference-document-list')
        data = {
            'country': country.id,
            'title': 'excel',
            'document': SimpleUploadedFile("01.xls", b"test_content_for_pdf"),
            'language': ReferenceDocument.Language.ENGLISH,
            'types': [ReferenceDocument.Type.FRAMEWORK, ReferenceDocument.Type.STRATEGY],
            'purpose': "test purpose",
            'featured': True,
            'valid_from': date.today() + timedelta(days=1),
        }
        response = self.test_user_client.post(upload_url, data, format='multipart')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED, response.json())

        data['document'] = SimpleUploadedFile("02.pdf", b"test_content_for_pdf"),
        data['title'] = 'presentation'
        data['featured'] = False
        data['valid_from'] = date.today(),
        data['valid_until'] = date.today() + timedelta(days=1),
        response = self.test_user_client.post(upload_url, data, format='multipart')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED, response.json())

        self.assertEqual(ReferenceDocument.objects.count(), 2)

        # search by title
        url = reverse('document-search-list') + '?search=presentation'
        response = client.get(url, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK, response.json())
        data = response.json()
        self.assertEqual(len(data), 1)
        self.assertEqual(data[0]['title'], 'presentation')

        # search by file name
        url = reverse('document-search-list') + '?search=xls'
        response = client.get(url, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK, response.json())
        data = response.json()
        self.assertEqual(len(data), 1)
        self.assertEqual(data[0]['title'], 'excel')

        # filter by featured
        url = reverse('document-search-list') + '?valid=false'
        response = client.get(url, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK, response.json())
        data = response.json()
        self.assertEqual(len(data), 1)
        self.assertEqual(data[0]['title'], 'excel')

        url = reverse('document-search-list') + '?valid=true'
        response = client.get(url, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK, response.json())
        data = response.json()
        self.assertEqual(len(data), 1)
        self.assertEqual(data[0]['title'], 'presentation')
