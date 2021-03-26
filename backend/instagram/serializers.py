import re
from django.contrib.auth import get_user_model
from rest_framework import serializers
from .models import Post, PostImage, Comment, Tag


class AuthorSerializer(serializers.ModelSerializer):
    avatar_url = serializers.SerializerMethodField('avatar_url_field')
    
    def avatar_url_field(self, author):
        if re.match(r"^https?://", author.avatar_url):
            return author.avatar_url

        if "request" in self.context:
            scheme = self.context["request"].scheme
            host   = self.context["request"].get_host()
            return scheme + "://" + host + author.avatar_url
        
    class Meta:
        model  = get_user_model()
        fields = ['username', 'avatar_url']


class TagSerializer(serializers.ModelSerializer):
    value = serializers.CharField(source='name')
    class Meta:
        model = Tag
        fields = ['value']


class PostImageSerializer(serializers.ModelSerializer):
   class Meta:
      model  = PostImage
      fields = ['id', 'image']

    
class PostSerializer(serializers.ModelSerializer):
    author    = AuthorSerializer(read_only=True)
    is_like   = serializers.SerializerMethodField('is_like_field')
    tag_set   = TagSerializer(many=True, read_only=True)
    image_set = PostImageSerializer(many=True, read_only=True)
    
    def is_like_field(self, post):
        if 'request' in self.context:
            user = self.context['request'].user
            return post.like_user_set.filter(pk=user.pk).exists()
        return False
   
    class Meta:
        model = Post
        fields = [
            'id',
            'author',
            'image_set',
            'caption',
            'location',
            'tag_set',
            'is_like',
            'like_user_set',
            'created_at'
        ]
        # FIXME: tag_set, like_user_set 은 읽기만 가능하게


class CommentSerializer(serializers.ModelSerializer):
    author = AuthorSerializer(read_only=True)

    class Meta:
        model  = Comment
        fields = ["id", "author", "message", "created_at"]
