from allauth.account.models import EmailConfirmation

from core.factories import UserFactory, UserProfileFactory, OrganisationFactory, CountryFactory, PostFactory, \
    CommentFactory
from core.tests import get_temp_image
from django.core import mail
from rest_framework.reverse import reverse
from rest_framework.test import APITestCase, APIClient

from cms.models import Post, Comment


class CmsApiTest(APITestCase):
    def setUp(self):
        # Create a test user with profile.
        url = reverse("rest_register")
        data = {"email": "test_user@gmail.com", "password1": "123456hetNYOLC", "password2": "123456hetNYOLC"}
        response = self.client.post(url, data)
        self.user_profile_id = response.json().get('user_profile_id')

        # Validate the account.
        key = EmailConfirmation.objects.get(email_address__email="test_user@gmail.com").key
        url = reverse("rest_verify_email")
        data = {
            "key": key,
        }
        self.client.post(url, data)

        # Log in the user.
        url = reverse("token_obtain_pair")
        data = {"username": "test_user@gmail.com", "password": "123456hetNYOLC"}
        response = self.client.post(url, data)
        self.test_user_key = response.json().get("access")
        self.test_user_client = APIClient(HTTP_AUTHORIZATION="Token {}".format(self.test_user_key), format="json")

        # Update profile.
        self.org = OrganisationFactory(name="org1")
        url = reverse("userprofile-detail", kwargs={"pk": self.user_profile_id})
        self.country = CountryFactory(name="country1", code='XX')
        self.country_id = self.country.id
        data = {"name": "Test Name", "organisation": self.org.id, "country": self.country_id}
        response = self.test_user_client.put(url, data)
        self.user_profile_id = response.json().get('id')

    def test_create_cms_post(self):
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
        self.assertEqual(response.json()['author_name'], "Test Name")
        self.assertEqual(response.json()['state'], Post.NORMAL)
        self.assertTrue(response.json()['created'])
        self.assertTrue(response.json()['modified'])
        self.assertEqual(response.json()['comments'], [])

    def test_retrieve_cms_post(self):
        self.test_create_cms_post()
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

    def test_update_cms_post(self):
        self.test_create_cms_post()

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

    def test_destroy_cms_post(self):
        self.test_create_cms_post()

        url = reverse("post-detail", kwargs={"pk": self.post_id})
        response = self.test_user_client.delete(url)

        self.assertEqual(response.status_code, 204)
        self.assertEqual(Post.objects.filter(id=self.post_id).count(), 0)

    def test_flag_post(self):
        self.test_create_cms_post()

        url = reverse("post-detail", kwargs={"pk": self.post_id})
        response = self.test_user_client.patch(url)

        self.assertEqual(response.status_code, 202)
        self.assertEqual(response.json()['detail'], "Content flagged.")

    def test_list_cms_posts(self):
        self.test_create_cms_post()

        self.post_data = {
            "name": "Test Post 2",
            "body": "<strong>TEST</strong>",
            "type": Post.RESOURCE,
            "domain": 1,
            "author_id": self.user_profile_id
        }

        self.post = PostFactory(**self.post_data)

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

        self.post = PostFactory(**self.post_data)
        self.post_data.update(name="Test Post 1")
        self.post2 = PostFactory(**self.post_data)
        self.post_data.update(name="Test Post 3")
        self.post3 = PostFactory(**self.post_data)

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

        comment = CommentFactory(
            text="Comment 2", user_id=self.user_profile_id, post=Post.objects.get(id=self.post_id))

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
        self.test_create_cms_post()

        self.comment_data = {"text": "Comment 1", "user": self.user_profile_id, "post": self.post_id}

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

        self.comment_data = {"text": "Comment Updated", "user": self.user_profile_id, "post": self.post_id}

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

        comment = CommentFactory(
            text="Comment 2", user_id=self.user_profile_id, post=Post.objects.get(id=self.post_id))

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

        comment = CommentFactory(
            text="Comment 2", user_id=self.user_profile_id, post=Post.objects.get(id=self.post_id))

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
        cover = get_temp_image()

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
        self.test_create_cms_post()

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

    def test_flag_post_sends_email(self):
        self.test_create_cms_post()
        self.password = 'mypassword'
        self.admin = UserFactory(username='myuser', email='f@pulilab.com', password=self.password,
                                 is_staff=True, is_superuser=True)
        UserProfileFactory(user=self.admin, language='fr')

        url = reverse("post-detail", kwargs={"pk": self.post_id})
        response = self.test_user_client.patch(url)

        self.assertEqual(response.status_code, 202)
        self.assertEqual(response.json()['detail'], "Content flagged.")

        first_en = '<meta http-equiv="content-language" content="en">' in mail.outbox[-2].message().as_string()
        en_index = -2 if first_en else -1
        fr_index = -1 if first_en else -2

        outgoing_en_email = mail.outbox[en_index].message()
        outgoing_en_email_text = outgoing_en_email.as_string()

        self.maxDiff = None
        self.assertTrue('Content has been flagged.' in outgoing_en_email.values())
        self.assertTrue('path_user@dhatlas.org' in outgoing_en_email.values())
        self.assertTrue('Content has been flagged as inappropriate. Please take action.' in outgoing_en_email_text)
        self.assertTrue('/admin/cms/post/{}/change/'.format(self.post_id) in outgoing_en_email_text)
        self.assertTrue('<meta http-equiv="content-language" content="en">' in outgoing_en_email_text)

        outgoing_fr_email = mail.outbox[fr_index].message()
        outgoing_fr_email_text = outgoing_fr_email.as_string()

        self.assertTrue('f@pulilab.com' in outgoing_fr_email.values())
        self.assertTrue('<meta http-equiv="content-language" content="fr">' in outgoing_fr_email_text)
