from rest_framework.serializers import ModelSerializer

from cms.models import Post, Comment


class CommentSerializer(ModelSerializer):

    class Meta:
        model = Comment
        fields = '__all__'


class CmsSerializer(ModelSerializer):
    comments = CommentSerializer(many=True, read_only=True)

    class Meta:
        model = Post
        fields = ('id', 'name', 'body', 'type', 'domain', 'author', 'comments', 'created', 'modified')
