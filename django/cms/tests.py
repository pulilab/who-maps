import tempfile
from django.contrib.auth.models import User
from django.test import TestCase

from cms.models import Post, Comment, State
from user.models import UserProfile


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
