from rest_framework.fields import SerializerMethodField
from rest_framework.serializers import ModelSerializer

from cms.models import Post, Comment


class CommentSerializer(ModelSerializer):

    class Meta:
        model = Comment
        fields = '__all__'


class CmsSerializer(ModelSerializer):
    comments = SerializerMethodField()

    class Meta:
        model = Post
        fields = ('id', 'name', 'body', 'type', 'domain', 'cover', 'author', 'comments', 'created', 'modified')

    @staticmethod
    def get_comments(post):
        comments = Comment.objects.filter(post=post).normal()
        serializer = CommentSerializer(instance=comments, many=True)
        return serializer.data
