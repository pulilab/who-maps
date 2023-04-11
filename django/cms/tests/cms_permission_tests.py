from rest_framework.reverse import reverse
from rest_framework.test import APITestCase, APIClient

from cms.models import Post, Comment
from core.factories import PostFactory
from user.models import UserProfile


class PermissionTest(APITestCase):
    def setUp(self):
        # user 1 signup
        url = reverse("rest_register")
        data = {"email": "test@who.who", "password1": "secure1234", "password2": "secure1234"}
        response = self.client.post(url, data)
        self.user_profile_id = response.json()['user_profile_id']

        # user 2 signup
        url = reverse("rest_register")
        data = {"email": "test2@who.who", "password1": "secure1234", "password2": "secure1234"}
        response = self.client.post(url, data)
        self.user_profile_id_2 = response.json()['user_profile_id']

        self.post_data = {
            "name": "Test Post 1",
            "body": "<strong>TEST</strong>",
            "type": Post.RESOURCE,
            "domain": 1,
            "author_id": self.user_profile_id
        }

        self.post = PostFactory(**self.post_data)
        self.post_data.update(author_id=self.user_profile_id_2)
        self.post2 = PostFactory(**self.post_data)

        # Log in user 1.
        url = reverse("token_obtain_pair")
        data = {"username": "test@who.who", "password": "secure1234"}
        response = self.client.post(url, data)
        self.test_user_key = response.json().get("access")
        self.test_user_client = APIClient(HTTP_AUTHORIZATION="Token {}".format(self.test_user_key), format="json")

    def test_create_without_login(self):
        self.post_data = {
            "name": "Test Post 1",
            "body": "<strong>TEST</strong>",
            "type": Post.RESOURCE,
            "domain": 1,
            "author": self.user_profile_id
        }

        url = reverse("post-list")
        response = self.client.post(url, self.post_data, format="json")

        self.assertEqual(response.status_code, 401)
        self.assertEqual(response.status_text, 'Unauthorized')
        self.assertEqual(response.json()['detail'], 'Authentication credentials were not provided.')

    def test_create_with_login(self):
        self.post_data = {
            "name": "Test Post 1",
            "body": "<strong>TEST</strong>",
            "type": Post.RESOURCE,
            "domain": 1,
            "author": self.user_profile_id
        }

        url = reverse("post-list")
        response = self.test_user_client.post(url, self.post_data, format="json")
        self.post_id = response.json()['id']

        self.assertEqual(response.status_code, 201)
        self.assertEqual(response.status_text, 'Created')
        self.assertEqual(response.json()['name'], self.post_data['name'])

    def test_update_with_login_different_author(self):
        self.test_create_with_login()

        # Log in user 2.
        url = reverse("token_obtain_pair")
        data = {"username": "test2@who.who", "password": "secure1234"}
        response = self.client.post(url, data)
        test_user_key = response.json().get("access")
        test_user_client = APIClient(HTTP_AUTHORIZATION="Token {}".format(test_user_key), format="json")

        self.post_data.update(name="Test Post 2")

        url = reverse("post-detail", kwargs={"pk": self.post_id})
        response = test_user_client.put(url, self.post_data, format="json")

        self.assertEqual(response.status_code, 403)
        self.assertEqual(response.status_text, 'Forbidden')
        self.assertEqual(response.json()['detail'], 'You do not have permission to perform this action.')

    def test_destroy_with_login_different_author(self):
        self.test_create_with_login()

        # Log in user 2.
        url = reverse("token_obtain_pair")
        data = {"username": "test2@who.who", "password": "secure1234"}
        response = self.client.post(url, data)
        test_user_key = response.json().get("access")
        test_user_client = APIClient(HTTP_AUTHORIZATION="Token {}".format(test_user_key), format="json")

        url = reverse("post-detail", kwargs={"pk": self.post_id})
        response = test_user_client.delete(url)

        self.assertEqual(response.status_code, 403)
        self.assertEqual(response.status_text, 'Forbidden')
        self.assertEqual(response.json()['detail'], 'You do not have permission to perform this action.')

    def test_retrieve_works_with_login_different_author(self):
        self.test_create_with_login()

        # Log in user 2.
        url = reverse("token_obtain_pair")
        data = {"username": "test2@who.who", "password": "secure1234"}
        response = self.client.post(url, data)
        test_user_key = response.json().get("access")
        test_user_client = APIClient(HTTP_AUTHORIZATION="Token {}".format(test_user_key), format="json")

        url = reverse("post-detail", kwargs={"pk": self.post_id})
        response = test_user_client.get(url)

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.status_text, 'OK')

    def test_create_comment_without_login(self):
        self.post_data = {
            "name": "Test Post 1",
            "body": "<strong>TEST</strong>",
            "type": Post.RESOURCE,
            "domain": 1,
            "author_id": self.user_profile_id
        }

        self.post = PostFactory(**self.post_data)

        self.comment_data = {"text": "Comment 1", "user": self.user_profile_id, "post": self.post.id}

        url = reverse("comment-list")
        response = self.client.post(url, self.comment_data, format="json")

        self.assertEqual(response.status_code, 401)
        self.assertEqual(response.status_text, 'Unauthorized')
        self.assertEqual(response.json()['detail'], 'Authentication credentials were not provided.')

    def test_create_comment_with_login_different_user(self):
        self.post_data = {
            "name": "Test Post 1",
            "body": "<strong>TEST</strong>",
            "type": Post.RESOURCE,
            "domain": 1,
            "author_id": self.user_profile_id
        }

        self.post = PostFactory(**self.post_data)

        self.comment_data = {"text": "Comment 1", "user": self.user_profile_id_2, "post": self.post.id}

        # Log in user 2.
        url = reverse("token_obtain_pair")
        data = {"username": "test2@who.who", "password": "secure1234"}
        response = self.client.post(url, data)
        test_user_key = response.json().get("access")
        test_user_client = APIClient(HTTP_AUTHORIZATION="Token {}".format(test_user_key), format="json")

        url = reverse("comment-list")
        response = test_user_client.post(url, self.comment_data, format="json")

        self.assertEqual(response.status_code, 201)
        self.assertEqual(response.status_text, 'Created')

        self.comment_id = response.json()['id']

        self.assertEqual(response.json()['text'], self.comment_data['text'])
        self.assertEqual(response.json()['user'], self.comment_data['user'])
        self.assertNotEqual(response.json()['user'], self.post_data['author_id'])
        self.assertEqual(response.json()['post'], self.comment_data['post'])
        self.assertEqual(response.json()['state'], Comment.NORMAL)
        self.assertTrue(response.json()['id'])
        self.assertTrue(response.json()['created'])
        self.assertTrue(response.json()['modified'])

    def test_update_comment_with_login_different_user(self):
        self.post_data = {
            "name": "Test Post 1",
            "body": "<strong>TEST</strong>",
            "type": Post.RESOURCE,
            "domain": 1,
            "author_id": self.user_profile_id
        }

        self.post = PostFactory(**self.post_data)

        self.comment_data = {"text": "Comment 1", "user": self.user_profile_id, "post": self.post.id}

        url = reverse("comment-list")
        response = self.test_user_client.post(url, self.comment_data, format="json")

        self.assertEqual(response.status_code, 201)
        self.assertEqual(response.status_text, 'Created')

        self.comment_id = response.json()['id']

        self.assertEqual(response.json()['text'], self.comment_data['text'])
        self.assertEqual(response.json()['user'], self.comment_data['user'])
        self.assertEqual(response.json()['user'], self.post_data['author_id'])
        self.assertEqual(response.json()['post'], self.comment_data['post'])
        self.assertEqual(response.json()['state'], Comment.NORMAL)
        self.assertTrue(response.json()['id'])
        self.assertTrue(response.json()['created'])
        self.assertTrue(response.json()['modified'])

        # Log in user 2.
        url = reverse("token_obtain_pair")
        data = {"username": "test2@who.who", "password": "secure1234"}
        response = self.client.post(url, data)
        test_user_key = response.json().get("access")
        test_user_client = APIClient(HTTP_AUTHORIZATION="Token {}".format(test_user_key), format="json")

        self.comment_data = {"text": "Comment Updated", "user": self.user_profile_id_2, "post": self.post.id}

        url = reverse("comment-detail", kwargs={"pk": self.comment_id})
        response = test_user_client.put(url, self.comment_data, format="json")

        self.assertEqual(response.status_code, 403)
        self.assertEqual(response.status_text, 'Forbidden')
        self.assertEqual(response.json()['detail'], 'You do not have permission to perform this action.')

    def test_delete_comment_with_login_different_user(self):
        self.post_data = {
            "name": "Test Post 1",
            "body": "<strong>TEST</strong>",
            "type": Post.RESOURCE,
            "domain": 1,
            "author_id": self.user_profile_id
        }

        self.post = PostFactory(**self.post_data)

        self.comment_data = {"text": "Comment 1", "user": self.user_profile_id, "post": self.post.id}

        url = reverse("comment-list")
        response = self.test_user_client.post(url, self.comment_data, format="json")

        self.assertEqual(response.status_code, 201)
        self.assertEqual(response.status_text, 'Created')

        self.comment_id = response.json()['id']

        self.assertEqual(response.json()['text'], self.comment_data['text'])
        self.assertEqual(response.json()['user'], self.comment_data['user'])
        self.assertEqual(response.json()['user'], self.post_data['author_id'])
        self.assertEqual(response.json()['post'], self.comment_data['post'])
        self.assertEqual(response.json()['state'], Comment.NORMAL)
        self.assertTrue(response.json()['id'])
        self.assertTrue(response.json()['created'])
        self.assertTrue(response.json()['modified'])

        # Log in user 2.
        url = reverse("token_obtain_pair")
        data = {"username": "test2@who.who", "password": "secure1234"}
        response = self.client.post(url, data)
        test_user_key = response.json().get("access")
        test_user_client = APIClient(HTTP_AUTHORIZATION="Token {}".format(test_user_key), format="json")

        url = reverse("comment-detail", kwargs={"pk": self.comment_id})
        response = test_user_client.delete(url)

        self.assertEqual(response.status_code, 403)
        self.assertEqual(response.status_text, 'Forbidden')
        self.assertEqual(response.json()['detail'], 'You do not have permission to perform this action.')

    def test_only_admins_can_create_lessons_with_no_admin(self):
        self.post_data = {
            "name": "Test Post 1",
            "body": "<strong>TEST</strong>",
            "type": Post.LESSON,
            "domain": 1,
            "author": self.user_profile_id
        }

        url = reverse("post-list")
        response = self.test_user_client.post(url, self.post_data, format="json")

        self.assertEqual(response.status_code, 403)
        self.assertEqual(response.status_text, 'Forbidden')
        self.assertEqual(response.json()['detail'], 'You do not have permission to perform this action.')

    def test_only_admins_can_create_lessons_with_superuser(self):
        self.post_data = {
            "name": "Test Post 1",
            "body": "<strong>TEST</strong>",
            "type": Post.LESSON,
            "domain": 1,
            "author": self.user_profile_id
        }
        user = UserProfile.objects.get(id=self.user_profile_id).user
        user.is_superuser = True
        user.save()

        url = reverse("post-list")
        response = self.test_user_client.post(url, self.post_data, format="json")
        self.post_id = response.json()['id']

        self.assertEqual(response.status_code, 201)
        self.assertEqual(response.status_text, 'Created')
        self.assertEqual(response.json()['name'], self.post_data['name'])

    def test_only_admins_can_update_lessons_with_no_admin(self):
        self.test_only_admins_can_create_lessons_with_superuser()

        user = UserProfile.objects.get(id=self.user_profile_id).user
        user.is_superuser = False
        user.save()

        self.post_data = {
            "name": "Test Post 1 Updated",
            "body": "<strong>TEST</strong>",
            "type": Post.LESSON,
            "domain": 1,
            "author": self.user_profile_id
        }

        url = reverse("post-detail", kwargs={"pk": self.post_id})
        response = self.test_user_client.put(url, self.post_data, format="json")

        self.assertEqual(response.status_code, 403)
        self.assertEqual(response.status_text, 'Forbidden')
        self.assertEqual(response.json()['detail'], 'You do not have permission to perform this action.')

    def test_only_admins_can_update_lessons_with_superuser(self):
        self.test_only_admins_can_create_lessons_with_superuser()

        self.post_data = {
            "name": "Test Post 1 Updated",
            "body": "<strong>TEST</strong>",
            "type": Post.LESSON,
            "domain": 1,
            "author": self.user_profile_id
        }

        url = reverse("post-detail", kwargs={"pk": self.post_id})
        response = self.test_user_client.put(url, self.post_data, format="json")
        self.post_id = response.json()['id']

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.status_text, 'OK')
        self.assertEqual(response.json()['name'], self.post_data['name'])

    def test_only_admins_can_delete_lessons_with_no_admin(self):
        self.test_only_admins_can_create_lessons_with_superuser()

        user = UserProfile.objects.get(id=self.user_profile_id).user
        user.is_superuser = False
        user.save()

        url = reverse("post-detail", kwargs={"pk": self.post_id})
        response = self.test_user_client.delete(url)

        self.assertEqual(response.status_code, 403)
        self.assertEqual(response.status_text, 'Forbidden')
        self.assertEqual(response.json()['detail'], 'You do not have permission to perform this action.')

    def test_only_admins_can_delete_lessons_with_superuser(self):
        self.test_only_admins_can_create_lessons_with_superuser()

        url = reverse("post-detail", kwargs={"pk": self.post_id})
        response = self.test_user_client.delete(url)

        self.assertEqual(response.status_code, 204)
        self.assertEqual(response.status_text, 'No Content')
