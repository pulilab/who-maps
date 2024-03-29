from django.contrib.admin import AdminSite
from django.test import TestCase, Client
from rest_framework.reverse import reverse

from cms.admin import PostAdmin, CommentAdmin
from cms.models import Post, Comment, State
from core.factories import UserFactory, UserProfileFactory, PostFactory, CommentFactory


class MockRequest:
    pass


class CmsAdminTests(TestCase):
    def setUp(self):
        self.site = AdminSite()
        self.request = MockRequest()
        self.user = UserFactory(username='alma', password='korte')
        self.userprofile = UserProfileFactory(user=self.user, name="almakorte")

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

        PostFactory(name="Test1", body="test", domain=1, type=1, author=self.userprofile)
        PostFactory(name="Test2", body="test", domain=1, type=1, author=self.userprofile, state=Post.FLAGGED)

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

        self.admin = UserFactory(username='myuser', email='myemail@test.com', password=self.password,
                                 is_staff=True, is_superuser=True)

        self.client = Client()
        self.request.user = self.admin

        self.assertFalse(ma.has_add_permission(self.request))

        post = PostFactory(name="Test1", body="test", domain=1, type=1, author=self.userprofile)
        CommentFactory(post=post, text="test comment 1", user=self.userprofile, state=State.FLAGGED)
        CommentFactory(post=post, text="test comment 2", user=self.userprofile, state=State.FLAGGED)
        CommentFactory(post=post, text="test comment 3", user=self.userprofile, state=State.NORMAL)

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
