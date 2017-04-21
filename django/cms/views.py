from rest_framework import mixins, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet, GenericViewSet

from cms.models import Post, Comment
from cms.permissions import IsOwnerOrReadOnly
from cms.serializers import CmsSerializer, CommentSerializer


class FlagMixin(object):

    def partial_update(self, request, *args, **kwargs):
        """
        PATCH endpoint used for flagging content (eg: post, comment)
        """
        instance = self.get_object()
        instance.flag()
        return Response(dict(detail="Content flagged."), status=status.HTTP_202_ACCEPTED)


class CmsViewSet(FlagMixin, ModelViewSet):
    queryset = Post.objects.showable().order_by('-id')
    serializer_class = CmsSerializer
    permission_classes = (IsAuthenticated, IsOwnerOrReadOnly)


class CommentViewSet(FlagMixin, mixins.CreateModelMixin, mixins.UpdateModelMixin,
                     mixins.DestroyModelMixin, GenericViewSet):
    queryset = Comment.objects.showable().order_by('-id')
    serializer_class = CommentSerializer
    permission_classes = (IsAuthenticated, IsOwnerOrReadOnly)
