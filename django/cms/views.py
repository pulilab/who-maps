from rest_framework import mixins, status
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet, GenericViewSet

from cms.models import Post, Comment
from cms.serializers import CmsSerializer, CommentSerializer


class FlagMixin(object):

    def partial_update(self, request, *args, **kwargs):
        instance = self.get_object()
        instance.flag()
        return Response(dict(detail="Comment flagged."), status=status.HTTP_202_ACCEPTED)


class CmsViewSet(FlagMixin, ModelViewSet):
    queryset = Post.objects.normal()
    serializer_class = CmsSerializer
    permission_classes = ()


class CommentViewSet(FlagMixin, mixins.CreateModelMixin, mixins.UpdateModelMixin,
                     mixins.DestroyModelMixin, GenericViewSet):
    queryset = Comment.objects.normal()
    serializer_class = CommentSerializer
