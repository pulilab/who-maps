from django.contrib.admin import AdminSite
from django.contrib.auth.models import User
from django.test import TestCase, Client
from rest_framework.reverse import reverse

from cms.admin import PostAdmin, CommentAdmin
from cms.models import Post, Comment, State
from core.factories import UserFactory
from user.models import UserProfile


class MockRequest:
    pass


class CmsAdminTests(TestCase):
    def setUp(self):
        self.site = AdminSite()
        self.request = MockRequest()
        self.user = UserFactory(username='alma', password='korte')
        self.userprofile = UserProfile.objects.create(user=self.user, name="almakorte")

    def test_admin_list_filters(self):
        ma = PostAdmin(Post, self.site)
        self.user.is_superuser = True
        self.user.is_staff = True
        self.user.save()
        self.request.user = self.user

        state_filter_class = ma.list_filter[0]
        state_filter_obj = state_filter_class(self.request, {}, Post, ma)

        self.assertEqual(
            state_filter_obj.lookups(self.request, ma), ((0, 'All'), (1, 'Normal'), (2, 'Flagged'), (3, 'Banned')))
        self.assertFalse(ma.has_add_permission(self.request))

        Post.objects.create(name="Test1", body="test", domain=1, type=1, author=self.userprofile)
        Post.objects.create(name="Test2", body="test", domain=1, type=1, author=self.userprofile, state=Post.FLAGGED)

        posts = state_filter_obj.queryset(self.request, Post.objects.all())

        self.assertEqual(posts.count(), 1)
        self.assertEqual(posts[0].name, "Test2")

        state_filter_obj = state_filter_class(self.request, {"state": Post.NORMAL}, Post, ma)

        posts = state_filter_obj.queryset(self.request, Post.objects.all())

        self.assertEqual(posts.count(), 1)
        self.assertEqual(posts[0].name, "Test1")

        state_filter_obj = state_filter_class(self.request, {"state": 0}, Post, ma)

        posts = state_filter_obj.queryset(self.request, Post.objects.all())
        self.assertEqual(posts.count(), 2)
        self.assertEqual(posts[0].name, "Test1")
        self.assertEqual(posts[1].name, "Test2")

    def test_comment_admin_and_actions(self):
        ma = CommentAdmin(Comment, self.site)
        self.password = 'mypassword'

        self.admin = User.objects.create_superuser('myuser', 'myemail@test.com', self.password)

        self.client = Client()
        self.request.user = self.admin

        self.assertFalse(ma.has_add_permission(self.request))

        post = Post.objects.create(name="Test1", body="test", domain=1, type=1, author=self.userprofile)
        Comment.objects.create(post=post, text="test comment 1", user=self.userprofile, state=State.FLAGGED)
        Comment.objects.create(post=post, text="test comment 2", user=self.userprofile, state=State.FLAGGED)
        Comment.objects.create(post=post, text="test comment 3", user=self.userprofile, state=State.NORMAL)

        self.assertEqual(Comment.objects.flagged().count(), 2)
        self.assertEqual(Comment.objects.banned().count(), 0)

        change_url = reverse('admin:cms_comment_changelist')
        data = {
            'action': 'ban',
            '_selected_action': Comment.objects.filter(state=State.FLAGGED).values_list('pk', flat=True)
        }
        self.client.login(username=self.admin.email, password=self.password)
        response = self.client.post(change_url, data, follow=True)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(Comment.objects.flagged().count(), 0)
        self.assertEqual(Comment.objects.banned().count(), 2)
        self.assertEqual(Comment.objects.normal().count(), 1)

        # can't call the other action with normalize now, because the default queryset is showing the flagged posts only
        ma.actions[1](ma, self.request, Comment.objects.filter(state=State.BANNED))
        self.assertEqual(Comment.objects.flagged().count(), 0)
        self.assertEqual(Comment.objects.banned().count(), 0)
        self.assertEqual(Comment.objects.normal().count(), 3)
