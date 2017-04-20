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
        self.assertEqual(Post.objects.flagged().count(), 0)
        self.assertEqual(Post.objects.banned().count(), 0)

        self.post.flag()

        self.assertEqual(Post.objects.normal().count(), 0)
        self.assertEqual(Post.objects.flagged().count(), 1)
        self.assertEqual(Post.objects.banned().count(), 0)

        self.post.ban()

        self.assertEqual(Post.objects.normal().count(), 0)
        self.assertEqual(Post.objects.flagged().count(), 0)
        self.assertEqual(Post.objects.banned().count(), 1)

        self.post.normalize()

        self.assertEqual(Post.objects.normal().count(), 1)
        self.assertEqual(Post.objects.flagged().count(), 0)
        self.assertEqual(Post.objects.banned().count(), 0)

        Comment.objects.create(post=self.post, user=self.userprofile, text="Test Comment 1")
        Comment.objects.create(post=self.post, user=self.userprofile, text="Test Comment 2", state=State.FLAGGED)
        Comment.objects.create(post=self.post, user=self.userprofile, text="Test Comment 3", state=State.BANNED)

        self.assertEqual(self.post.comments.normal().count(), 1)
        self.assertEqual(self.post.comments.flagged().count(), 1)
        self.assertEqual(self.post.comments.banned().count(), 1)

        self.post.comments.first().ban()

        self.assertEqual(self.post.comments.normal().count(), 0)
        self.assertEqual(self.post.comments.flagged().count(), 1)
        self.assertEqual(self.post.comments.banned().count(), 2)

        self.post.comments.first().flag()

        self.assertEqual(self.post.comments.normal().count(), 0)
        self.assertEqual(self.post.comments.flagged().count(), 2)
        self.assertEqual(self.post.comments.banned().count(), 1)

        self.post.comments.first().normalize()

        self.assertEqual(self.post.comments.normal().count(), 1)
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
        response = self.client.post(url, data)

        # Validate the account.
        key = EmailConfirmation.objects.get(email_address__email="test_user@gmail.com").key
        url = reverse("rest_verify_email")
        data = {
            "key": key,
        }
        response = self.client.post(url, data)

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

    def test_partial_update(self):
        self.test_create()

        url = reverse("post-detail", kwargs={"pk": self.post_id})
        response = self.test_user_client.patch(url)

        self.assertEqual(response.status_code, 202)
        self.assertEqual(response.json()['detail'], "Comment flagged.")

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
        self.assertEqual(response.json()[0]['name'], "Test Post 1")
        self.assertEqual(response.json()[1]['id'], self.post.id)
        self.assertEqual(response.json()[1]['name'], self.post_data['name'])
        self.assertEqual(response.json()[1]['body'], self.post_data['body'])
        self.assertEqual(response.json()[1]['type'], self.post_data['type'])
        self.assertEqual(response.json()[1]['domain'], self.post_data['domain'])
        self.assertEqual(response.json()[1]['author'], self.post_data['author_id'])
        self.assertTrue(response.json()[1]['created'])
        self.assertTrue(response.json()[1]['modified'])
        self.assertEqual(response.json()[1]['comments'], [])

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

        url = reverse("post-list")
        response = self.test_user_client.get(url)

        self.assertEqual(len(response.json()), Post.objects.all().count())

        self.post.flag()

        response = self.test_user_client.get(url)

        self.assertEqual(len(response.json()), Post.objects.normal().count())
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
        self.assertEqual(response.json()['detail'], "Comment flagged.")

    def test_flagged_comment_doesnt_show(self):
        self.test_flag_comment()

        comment = Comment.objects.create(text="Comment 2",
                                         user_id=self.user_profile_id,
                                         post=Post.objects.get(id=self.post_id))

        url = reverse("post-detail", kwargs={"pk": self.post_id})
        response = self.test_user_client.get(url)

        self.assertEqual(len(response.json()['comments']), 1)
        self.assertEqual(response.json()['comments'][0]['text'], comment.text)

        Comment.objects.flagged()[0].normalize()

        url = reverse("post-detail", kwargs={"pk": self.post_id})
        response = self.test_user_client.get(url)

        self.assertEqual(len(response.json()['comments']), 2)
        self.assertEqual(response.json()['comments'][0]['text'], "Comment 1")
        self.assertEqual(response.json()['comments'][1]['text'], comment.text)

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
