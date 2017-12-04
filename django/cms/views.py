from django.conf import settings
from django.contrib.auth.models import User
from django.core import mail, urlresolvers
from django.template import loader

from rest_framework import mixins, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet, GenericViewSet

from cms.models import Post, Comment, State
from cms.permissions import IsOwnerOrReadOnly, OnlyAdminForLessons
from cms.serializers import CmsSerializer, CommentSerializer


class FlagMixin(object):
    def partial_update(self, request, *args, **kwargs):
        """
        PATCH endpoint used for flagging content (eg: post, comment)
        """
        instance = self.get_object()
        if instance.state == State.NORMAL:
            instance.flag()
            self._notify_admins(instance)
        return Response(dict(detail="Content flagged."), status=status.HTTP_202_ACCEPTED)

    @staticmethod
    def _notify_admins(instance):
        html_template = loader.get_template("email/flag_content.html")
        change_url = urlresolvers.reverse('admin:cms_{}_change'.format(instance._meta.model_name), args=(instance.id,))
        html_message = html_template.render({'change_url': change_url})

        admins = User.objects.filter(is_superuser=True)
        if admins:
            mail.send_mail(
                subject="Content has been flagged.",
                message="",
                from_email=settings.FROM_EMAIL,
                recipient_list=[admin.email for admin in admins],
                html_message=html_message,
                fail_silently=True)


class CmsViewSet(FlagMixin, ModelViewSet):
    queryset = Post.objects.showable().order_by('-id')
    serializer_class = CmsSerializer
    permission_classes = (IsAuthenticated, IsOwnerOrReadOnly, OnlyAdminForLessons)

    def perform_create(self, serializer):
        obj = Post()
        for key, value in serializer.validated_data.items():
            setattr(obj, key, value)
        self.check_object_permissions(self.request, obj)
        super(CmsViewSet, self).perform_create(serializer)


class CommentViewSet(FlagMixin, mixins.CreateModelMixin, mixins.UpdateModelMixin, mixins.DestroyModelMixin,
                     GenericViewSet):
    queryset = Comment.objects.showable().order_by('-id')
    serializer_class = CommentSerializer
    permission_classes = (IsAuthenticated, IsOwnerOrReadOnly)
