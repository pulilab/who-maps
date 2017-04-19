from rest_framework import mixins
from rest_framework.viewsets import ModelViewSet, GenericViewSet

from cms.models import Post, Comment
from cms.serializers import CmsSerializer, CommentSerializer


class CmsViewSet(ModelViewSet):
    queryset = Post.objects.normal()
    serializer_class = CmsSerializer
    permission_classes = ()

    def get_serializer_class(self):
        lol = super(CmsViewSet, self).get_serializer_class()
        return lol

    def get_serializer(self, *args, **kwargs):
        lol = super(CmsViewSet, self).get_serializer(*args, **kwargs)
        return lol

    def retrieve(self, request, *args, **kwargs):
        return super(CmsViewSet, self).retrieve(request, *args, **kwargs)

    def create(self, request, *args, **kwargs):
        return super(CmsViewSet, self).create(request, *args, **kwargs)

    def update(self, request, *args, **kwargs):
        return super(CmsViewSet, self).update(request, *args, **kwargs)

    def destroy(self, request, *args, **kwargs):
        return super(CmsViewSet, self).destroy(request, *args, **kwargs)

    def partial_update(self, request, *args, **kwargs):
        return super(CmsViewSet, self).partial_update(request, *args, **kwargs)

    def list(self, request, *args, **kwargs):
        return super(CmsViewSet, self).list(request, *args, **kwargs)


class CommentViewSet(mixins.CreateModelMixin, mixins.UpdateModelMixin,
                     mixins.DestroyModelMixin, GenericViewSet):
    queryset = Comment.objects.normal()
    serializer_class = CommentSerializer
