import tempfile
from io import BytesIO

from PIL import Image
from allauth.account.models import EmailConfirmation
from django.contrib.auth.models import User
from django.test import TestCase
from rest_framework.reverse import reverse
from rest_framework.test import APITestCase, APIClient

from cms.models import Post, Comment, State
from country.models import Country
from user.models import UserProfile, Organisation


class CmsTest(TestCase):
    def setUp(self):
        self.user = User.objects.create(username="test@who.who", password="secure1234")
        self.userprofile = UserProfile.objects.create(name="Test User1", user=self.user)

        self.post_data = {
            "name": "Test Post 1",
            "body": "<strong>TEST</strong>",
            "type": Post.RESOURCE,
            "domain": 1,
            "author": self.userprofile
        }

        self.post = Post.objects.create(**self.post_data)

        self.assertEqual(self.post.__str__(), self.post_data['name'])
        self.assertEqual(self.post.author.__str__(), "Test User1")

    def test_comments(self):
        self.assertEqual(self.post.comments.all().count(), 0)

    def test_cover_optional(self):
        self.post.cover = tempfile.NamedTemporaryFile(suffix=".jpg").name
        self.post.save()

        self.assertTrue(self.post.cover.name)

    def test_add_comments(self):
        self.post.comments.create(user=self.userprofile, text="Test Comment 1")
        Comment.objects.create(post=self.post, user=self.userprofile, text="Test Comment 2")

        self.assertEqual(self.post.comments.all().count(), 2)
        self.assertEqual(self.post.comments.first().__str__(), "Test Comment 1")
        self.assertEqual(self.post.comments.first().text, "Test Comment 1")
        self.assertEqual(self.post.comments.last().text, "Test Comment 2")

    def test_delete_comments(self):
        Comment.objects.create(post=self.post, user=self.userprofile, text="Test Comment 1")
        Comment.objects.create(post=self.post, user=self.userprofile, text="Test Comment 2")

        self.post.comments.all().delete()

        self.assertEqual(self.post.comments.all().count(), 0)

    def test_slug(self):
        self.assertEqual(self.post.slug, 'test-post-1')

    def test_states(self):
        self.assertEqual(Post.objects.normal().count(), 1)
        self.assertEqual(Post.objects.showable().count(), 1)
        self.assertEqual(Post.objects.flagged().count(), 0)
        self.assertEqual(Post.objects.banned().count(), 0)

        self.post.flag()

        self.assertEqual(Post.objects.normal().count(), 0)
        self.assertEqual(Post.objects.showable().count(), 1)
        self.assertEqual(Post.objects.flagged().count(), 1)
        self.assertEqual(Post.objects.banned().count(), 0)

        self.post.ban()

        self.assertEqual(Post.objects.normal().count(), 0)
        self.assertEqual(Post.objects.flagged().count(), 0)
        self.assertEqual(Post.objects.showable().count(), 0)
        self.assertEqual(Post.objects.banned().count(), 1)

        self.post.normalize()

        self.assertEqual(Post.objects.normal().count(), 1)
        self.assertEqual(Post.objects.showable().count(), 1)
        self.assertEqual(Post.objects.flagged().count(), 0)
        self.assertEqual(Post.objects.banned().count(), 0)

        Comment.objects.create(post=self.post, user=self.userprofile, text="Test Comment 1")
        Comment.objects.create(post=self.post, user=self.userprofile, text="Test Comment 2", state=State.FLAGGED)
        Comment.objects.create(post=self.post, user=self.userprofile, text="Test Comment 3", state=State.BANNED)

        self.assertEqual(self.post.comments.normal().count(), 1)
        self.assertEqual(self.post.comments.showable().count(), 2)
        self.assertEqual(self.post.comments.flagged().count(), 1)
        self.assertEqual(self.post.comments.banned().count(), 1)

        self.post.comments.first().ban()

        self.assertEqual(self.post.comments.normal().count(), 0)
        self.assertEqual(self.post.comments.showable().count(), 1)
        self.assertEqual(self.post.comments.flagged().count(), 1)
        self.assertEqual(self.post.comments.banned().count(), 2)

        self.post.comments.first().flag()

        self.assertEqual(self.post.comments.normal().count(), 0)
        self.assertEqual(self.post.comments.showable().count(), 2)
        self.assertEqual(self.post.comments.flagged().count(), 2)
        self.assertEqual(self.post.comments.banned().count(), 1)

        self.post.comments.first().normalize()

        self.assertEqual(self.post.comments.normal().count(), 1)
        self.assertEqual(self.post.comments.showable().count(), 2)
        self.assertEqual(self.post.comments.flagged().count(), 1)
        self.assertEqual(self.post.comments.banned().count(), 1)


class CmsApiTest(APITestCase):

    def setUp(self):
        # Create a test user with profile.
        url = reverse("rest_register")
        data = {
            "email": "test_user@gmail.com",
            "password1": "123456",
            "password2": "123456"}
        self.client.post(url, data)

        # Validate the account.
        key = EmailConfirmation.objects.get(email_address__email="test_user@gmail.com").key
        url = reverse("rest_verify_email")
        data = {
            "key": key,
        }
        self.client.post(url, data)

        # Log in the user.
        url = reverse("api_token_auth")
        data = {
            "username": "test_user@gmail.com",
            "password": "123456"}
        response = self.client.post(url, data)
        self.test_user_key = response.json().get("token")
        self.test_user_client = APIClient(HTTP_AUTHORIZATION="Token {}".format(self.test_user_key), format="json")
        self.user_profile_id = response.json().get('user_profile_id')

        # Update profile.
        self.org = Organisation.objects.create(name="org1")
        url = reverse("userprofile-detail", kwargs={"pk": self.user_profile_id})
        data = {
            "name": "Test Name",
            "organisation": self.org.id,
            "country": "test_country"}
        response = self.test_user_client.put(url, data)
        self.user_profile_id = response.json().get('id')

        self.country = Country.objects.create(name="country1")
        self.country_id = self.country.id

    def test_create(self):
        self.post_data = {
            "name": "Test Post 1",
            "body": "<strong>TEST</strong>",
            "type": Post.RESOURCE,
            "domain": 1,
            "author": self.user_profile_id
        }

        url = reverse("post-list")
        response = self.test_user_client.post(url, self.post_data, format="json")
        self.post_id = response.json().get("id")

        self.assertEqual(response.json()['name'], self.post_data['name'])
        self.assertEqual(response.json()['body'], self.post_data['body'])
        self.assertEqual(response.json()['type'], self.post_data['type'])
        self.assertEqual(response.json()['domain'], self.post_data['domain'])
        self.assertEqual(response.json()['author'], self.post_data['author'])
        self.assertEqual(response.json()['state'], Post.NORMAL)
        self.assertTrue(response.json()['created'])
        self.assertTrue(response.json()['modified'])
        self.assertEqual(response.json()['comments'], [])

    def test_retrieve(self):
        self.test_create()
        url = reverse("post-detail", kwargs={"pk": self.post_id})
        response = self.test_user_client.get(url)

        self.assertEqual(response.json()['id'], self.post_id)
        self.assertEqual(response.json()['name'], self.post_data['name'])
        self.assertEqual(response.json()['body'], self.post_data['body'])
        self.assertEqual(response.json()['type'], self.post_data['type'])
        self.assertEqual(response.json()['domain'], self.post_data['domain'])
        self.assertEqual(response.json()['author'], self.post_data['author'])
        self.assertTrue(response.json()['slug'])
        self.assertTrue(response.json()['created'])
        self.assertTrue(response.json()['modified'])
        self.assertEqual(response.json()['comments'], [])

    def test_update(self):
        self.test_create()

        self.post_data = {
            "name": "Test Post Updated",
            "body": "<strong>TEST</strong>",
            "type": Post.RESOURCE,
            "domain": 1,
            "author": self.user_profile_id
        }

        url = reverse("post-detail", kwargs={"pk": self.post_id})
        response = self.test_user_client.put(url, self.post_data, format="json")

        self.assertEqual(response.json()['id'], self.post_id)
        self.assertEqual(response.json()['name'], self.post_data['name'])
        self.assertEqual(response.json()['body'], self.post_data['body'])
        self.assertEqual(response.json()['type'], self.post_data['type'])
        self.assertEqual(response.json()['domain'], self.post_data['domain'])
        self.assertEqual(response.json()['author'], self.post_data['author'])
        self.assertTrue(response.json()['created'])
        self.assertTrue(response.json()['modified'])
        self.assertEqual(response.json()['comments'], [])

    def test_destroy(self):
        self.test_create()

        url = reverse("post-detail", kwargs={"pk": self.post_id})
        response = self.test_user_client.delete(url)

        self.assertEqual(response.status_code, 204)
        self.assertEqual(Post.objects.filter(id=self.post_id).count(), 0)

    def test_flag_post(self):
        self.test_create()

        url = reverse("post-detail", kwargs={"pk": self.post_id})
        response = self.test_user_client.patch(url)

        self.assertEqual(response.status_code, 202)
        self.assertEqual(response.json()['detail'], "Content flagged.")

    def test_list(self):
        self.test_create()

        self.post_data = {
            "name": "Test Post 2",
            "body": "<strong>TEST</strong>",
            "type": Post.RESOURCE,
            "domain": 1,
            "author_id": self.user_profile_id
        }

        self.post = Post.objects.create(**self.post_data)

        url = reverse("post-list")
        response = self.test_user_client.get(url)
        self.assertEqual(len(response.json()), Post.objects.all().count())
        self.assertEqual(response.json()[1]['name'], "Test Post 1")
        self.assertEqual(response.json()[0]['id'], self.post.id)
        self.assertEqual(response.json()[0]['name'], self.post_data['name'])
        self.assertEqual(response.json()[0]['body'], self.post_data['body'])
        self.assertEqual(response.json()[0]['type'], self.post_data['type'])
        self.assertEqual(response.json()[0]['domain'], self.post_data['domain'])
        self.assertEqual(response.json()[0]['author'], self.post_data['author_id'])
        self.assertTrue(response.json()[0]['created'])
        self.assertTrue(response.json()[0]['modified'])
        self.assertEqual(response.json()[0]['comments'], [])

    def test_list_with_states(self):
        self.post_data = {
            "name": "Test Post 2",
            "body": "<strong>TEST</strong>",
            "type": Post.RESOURCE,
            "domain": 1,
            "author_id": self.user_profile_id
        }

        self.post = Post.objects.create(**self.post_data)
        self.post_data.update(name="Test Post 1")
        self.post2 = Post.objects.create(**self.post_data)
        self.post_data.update(name="Test Post 3")
        self.post3 = Post.objects.create(**self.post_data)

        url = reverse("post-list")
        response = self.test_user_client.get(url)

        self.assertEqual(len(response.json()), Post.objects.all().count())

        self.post.flag()
        self.post3.ban()

        response = self.test_user_client.get(url)

        self.assertEqual(len(response.json()), Post.objects.showable().count())
        self.assertNotEqual(len(response.json()), Post.objects.normal().count())
        self.assertNotEqual(Post.objects.normal().count(), Post.objects.all().count())

    def test_cant_add_comment_through_post(self):
        self.post_data = {
            "name": "Test Post 1",
            "body": "<strong>TEST</strong>",
            "type": Post.RESOURCE,
            "domain": 1,
            "author": self.user_profile_id,
            "comments": [{
                "text": "Comment 1",
                "user": self.user_profile_id,
            }]
        }

        url = reverse("post-list")
        response = self.test_user_client.post(url, self.post_data, format="json")
        self.post_id = response.json().get("id")

        self.assertEqual(response.json()['name'], self.post_data['name'])
        self.assertEqual(response.json()['body'], self.post_data['body'])
        self.assertEqual(response.json()['type'], self.post_data['type'])
        self.assertEqual(response.json()['domain'], self.post_data['domain'])
        self.assertEqual(response.json()['author'], self.post_data['author'])
        self.assertTrue(response.json()['created'])
        self.assertTrue(response.json()['modified'])
        self.assertEqual(response.json()['comments'], [])

        comment = Comment.objects.create(text="Comment 2",
                                         user_id=self.user_profile_id,
                                         post=Post.objects.get(id=self.post_id))

        url = reverse("post-detail", kwargs={"pk": self.post_id})
        response = self.test_user_client.get(url)

        self.assertEqual(len(response.json()['comments']), 1)
        self.assertEqual(response.json()['comments'][0]['text'], comment.text)

    def test_comment_api_list_not_allowed(self):
        url = reverse("comment-list")
        response = self.test_user_client.get(url)

        self.assertEqual(response.status_code, 405)
        self.assertEqual(response.json()['detail'], 'Method "GET" not allowed.')

    def test_add_comment(self):
        self.test_create()

        self.comment_data = {
            "text": "Comment 1",
            "user": self.user_profile_id,
            "post": self.post_id
        }

        url = reverse("comment-list")
        response = self.test_user_client.post(url, self.comment_data, format="json")
        self.comment_id = response.json()['id']

        self.assertEqual(response.json()['text'], self.comment_data['text'])
        self.assertEqual(response.json()['user'], self.comment_data['user'])
        self.assertEqual(response.json()['post'], self.comment_data['post'])
        self.assertEqual(response.json()['state'], Comment.NORMAL)
        self.assertTrue(response.json()['id'])
        self.assertTrue(response.json()['created'])
        self.assertTrue(response.json()['modified'])

    def test_delete_comment(self):
        self.test_add_comment()

        url = reverse("comment-detail", kwargs={"pk": self.comment_id})
        response = self.test_user_client.delete(url)

        self.assertEqual(response.status_code, 204)
        self.assertEqual(response.status_text, 'No Content')
        self.assertEqual(Comment.objects.all().count(), 0)

    def test_update_comment(self):
        self.test_add_comment()

        self.comment_data = {
            "text": "Comment Updated",
            "user": self.user_profile_id,
            "post": self.post_id
        }

        url = reverse("comment-detail", kwargs={"pk": self.comment_id})
        response = self.test_user_client.put(url, self.comment_data, format="json")

        self.assertEqual(response.json()['text'], self.comment_data['text'])
        self.assertEqual(response.json()['user'], self.comment_data['user'])
        self.assertEqual(response.json()['post'], self.comment_data['post'])
        self.assertEqual(response.json()['state'], Comment.NORMAL)
        self.assertTrue(response.json()['id'])
        self.assertTrue(response.json()['created'])
        self.assertTrue(response.json()['modified'])

    def test_flag_comment(self):
        self.test_add_comment()

        url = reverse("comment-detail", kwargs={"pk": self.comment_id})
        response = self.test_user_client.patch(url)

        self.assertEqual(response.status_code, 202)
        self.assertEqual(response.json()['detail'], "Content flagged.")

    def test_flagged_comment_shows(self):
        self.test_flag_comment()

        comment = Comment.objects.create(text="Comment 2",
                                         user_id=self.user_profile_id,
                                         post=Post.objects.get(id=self.post_id))

        url = reverse("post-detail", kwargs={"pk": self.post_id})
        response = self.test_user_client.get(url)

        self.assertEqual(len(response.json()['comments']), 2)
        self.assertEqual(response.json()['comments'][1]['text'], "Comment 1")
        self.assertEqual(response.json()['comments'][1]['state'], Comment.FLAGGED)
        self.assertEqual(response.json()['comments'][0]['text'], comment.text)
        self.assertEqual(response.json()['comments'][0]['state'], Comment.NORMAL)

        Comment.objects.flagged()[0].normalize()

        url = reverse("post-detail", kwargs={"pk": self.post_id})
        response = self.test_user_client.get(url)

        self.assertEqual(len(response.json()['comments']), 2)
        self.assertEqual(response.json()['comments'][1]['text'], "Comment 1")
        self.assertEqual(response.json()['comments'][1]['state'], Comment.NORMAL)
        self.assertEqual(response.json()['comments'][0]['text'], comment.text)
        self.assertEqual(response.json()['comments'][0]['state'], Comment.NORMAL)

    def test_banned_comment_doesnt_show(self):
        self.test_add_comment()

        comment = Comment.objects.create(text="Comment 2",
                                         user_id=self.user_profile_id,
                                         post=Post.objects.get(id=self.post_id))

        url = reverse("post-detail", kwargs={"pk": self.post_id})
        response = self.test_user_client.get(url)

        self.assertEqual(len(response.json()['comments']), 2)
        self.assertEqual(response.json()['comments'][1]['text'], "Comment 1")
        self.assertEqual(response.json()['comments'][0]['text'], comment.text)

        Comment.objects.showable()[0].ban()

        url = reverse("post-detail", kwargs={"pk": self.post_id})
        response = self.test_user_client.get(url)

        self.assertEqual(len(response.json()['comments']), 1)
        self.assertEqual(response.json()['comments'][0]['text'], comment.text)
        self.assertEqual(response.json()['comments'][0]['state'], Comment.NORMAL)

    def test_cover_upload(self):
        cover = BytesIO()
        image = Image.new('RGBA', size=(100, 100))
        image.save(cover, 'png')
        cover.name = 'test.png'
        cover.seek(0)

        self.post_data = {
            "name": "Test Post 1",
            "body": "<strong>TEST</strong>",
            "type": Post.RESOURCE,
            "domain": 1,
            "author": self.user_profile_id,
            "cover": cover
        }

        url = reverse("post-list")
        response = self.test_user_client.post(url, self.post_data, format='multipart')
        self.post_id = response.json().get("id")
        self.assertEqual(response.json()['name'], self.post_data['name'])
        self.assertEqual(response.json()['body'], self.post_data['body'])
        self.assertEqual(response.json()['type'], self.post_data['type'])
        self.assertEqual(response.json()['domain'], self.post_data['domain'])
        self.assertEqual(response.json()['author'], self.post_data['author'])
        self.assertTrue(response.json()['created'])
        self.assertTrue(response.json()['modified'])
        self.assertEqual(response.json()['comments'], [])
        self.assertIn(cover.name, response.json()['cover'])

    def test_two_posts_with_same_name(self):
        self.test_create()

        self.post_data = {
            "name": "Test Post 1",
            "body": "<strong>TEST</strong>",
            "type": Post.RESOURCE,
            "domain": 1,
            "author": self.user_profile_id
        }

        url = reverse("post-list")
        response = self.test_user_client.post(url, self.post_data, format="json")
        self.post_id = response.json().get("id")

        self.assertEqual(response.json()['name'], self.post_data['name'])
        self.assertEqual(response.json()['body'], self.post_data['body'])
        self.assertEqual(response.json()['type'], self.post_data['type'])
        self.assertEqual(response.json()['domain'], self.post_data['domain'])
        self.assertEqual(response.json()['author'], self.post_data['author'])
        self.assertTrue(response.json()['slug'])
        self.assertTrue(response.json()['created'])
        self.assertTrue(response.json()['modified'])
        self.assertEqual(response.json()['comments'], [])

        self.assertEqual(Post.objects.all().first().name, Post.objects.all().last().name)
        self.assertNotEqual(Post.objects.all().first().id, Post.objects.all().last().id)
        self.assertNotEqual(Post.objects.all().first().slug, Post.objects.all().last().slug)

        self.assertEqual(Post.objects.all().first().slug, 'test-post-1')
        self.assertEqual(Post.objects.all().last().slug, 'test-post-1--1')


class PermissionTest(APITestCase):

    def setUp(self):
        # user 1 signup
        url = reverse("rest_register")
        data = {
            "email": "test@who.who",
            "password1": "secure1234",
            "password2": "secure1234"}
        response = self.client.post(url, data)
        self.user_profile_id = response.json()['user_profile_id']

        # user 2 signup
        url = reverse("rest_register")
        data = {
            "email": "test2@who.who",
            "password1": "secure1234",
            "password2": "secure1234"}
        response = self.client.post(url, data)
        self.user_profile_id_2 = response.json()['user_profile_id']

        self.post_data = {
            "name": "Test Post 1",
            "body": "<strong>TEST</strong>",
            "type": Post.RESOURCE,
            "domain": 1,
            "author_id": self.user_profile_id
        }

        self.post = Post.objects.create(**self.post_data)
        self.post_data.update(author_id=self.user_profile_id_2)
        self.post2 = Post.objects.create(**self.post_data)

        # Log in user 1.
        url = reverse("api_token_auth")
        data = {
            "username": "test@who.who",
            "password": "secure1234"
        }
        response = self.client.post(url, data)
        self.test_user_key = response.json().get("token")
        self.test_user_client = APIClient(HTTP_AUTHORIZATION="Token {}".format(self.test_user_key), format="json")

        self.assertEqual(self.user_profile_id, response.json()['user_profile_id'])

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
        url = reverse("api_token_auth")
        data = {
            "username": "test2@who.who",
            "password": "secure1234"
        }
        response = self.client.post(url, data)
        test_user_key = response.json().get("token")
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
        url = reverse("api_token_auth")
        data = {
            "username": "test2@who.who",
            "password": "secure1234"
        }
        response = self.client.post(url, data)
        test_user_key = response.json().get("token")
        test_user_client = APIClient(HTTP_AUTHORIZATION="Token {}".format(test_user_key), format="json")

        url = reverse("post-detail", kwargs={"pk": self.post_id})
        response = test_user_client.delete(url)

        self.assertEqual(response.status_code, 403)
        self.assertEqual(response.status_text, 'Forbidden')
        self.assertEqual(response.json()['detail'], 'You do not have permission to perform this action.')

    def test_retrieve_works_with_login_different_author(self):
        self.test_create_with_login()

        # Log in user 2.
        url = reverse("api_token_auth")
        data = {
            "username": "test2@who.who",
            "password": "secure1234"
        }
        response = self.client.post(url, data)
        test_user_key = response.json().get("token")
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

        self.post = Post.objects.create(**self.post_data)

        self.comment_data = {
            "text": "Comment 1",
            "user": self.user_profile_id,
            "post": self.post.id
        }

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

        self.post = Post.objects.create(**self.post_data)

        self.comment_data = {
            "text": "Comment 1",
            "user": self.user_profile_id_2,
            "post": self.post.id
        }

        # Log in user 2.
        url = reverse("api_token_auth")
        data = {
            "username": "test2@who.who",
            "password": "secure1234"
        }
        response = self.client.post(url, data)
        test_user_key = response.json().get("token")
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

        self.post = Post.objects.create(**self.post_data)

        self.comment_data = {
            "text": "Comment 1",
            "user": self.user_profile_id,
            "post": self.post.id
        }

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
        url = reverse("api_token_auth")
        data = {
            "username": "test2@who.who",
            "password": "secure1234"
        }
        response = self.client.post(url, data)
        test_user_key = response.json().get("token")
        test_user_client = APIClient(HTTP_AUTHORIZATION="Token {}".format(test_user_key), format="json")

        self.comment_data = {
            "text": "Comment Updated",
            "user": self.user_profile_id_2,
            "post": self.post.id
        }

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

        self.post = Post.objects.create(**self.post_data)

        self.comment_data = {
            "text": "Comment 1",
            "user": self.user_profile_id,
            "post": self.post.id
        }

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
        url = reverse("api_token_auth")
        data = {
            "username": "test2@who.who",
            "password": "secure1234"
        }
        response = self.client.post(url, data)
        test_user_key = response.json().get("token")
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
