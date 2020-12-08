import re
from django.contrib.auth import get_user_model
from rest_framework import serializers
from .models import Post, PostImage, Comment, Tag
# from taggit_serializer.serializers import (TagListSerializerField, TaggitSerializer)

class AuthorSerializer(serializers.ModelSerializer):
    avatar_url = serializers.SerializerMethodField('avatar_url_field')
    
    def avatar_url_field(self, author):
        if re.match(r"^https?://", author.avatar_url):
            return author.avatar_url

        if "request" in self.context:
            scheme = self.context["request"].scheme
            host = self.context["request"].get_host()
            return scheme + "://" + host + author.avatar_url

        request
        
    class Meta:
        model = get_user_model()
        fields = ['username', 'avatar_url']


class TagSerializer(serializers.ModelSerializer):
    value = serializers.CharField(source='name')
    class Meta:
        model = Tag
        fields = ['value']


class PostImageSerializer(serializers.ModelSerializer):
   class Meta:
      model = PostImage
      fields = ['id', 'image']

    
class PostSerializer(serializers.ModelSerializer):
    author = AuthorSerializer(read_only=True)
    is_like = serializers.SerializerMethodField('is_like_field')
    # tag_set = TagListSerializerField()
    tag_set = TagSerializer(many=True, read_only=True)
    # tag_set = serializers.SerializerMethodField('tag_set_field')
    image_set = PostImageSerializer(many=True, read_only=True)
    
    # 좋아요를 눌렀는지 체크를 해서 결과를 보내줌(서버사이드 에서 계산)
    # 다른 방법: like_user_set 을 모두 클라이언트로 보낸 후 클라이언트사이드 에서 계산
    def is_like_field(self, post):
        if 'request' in self.context:
            user = self.context['request'].user
            return post.like_user_set.filter(pk=user.pk).exists()
        return False
    
    # def create(self, validated_data):
        # images_data = self.context['request'].FILES
        # print(validated_data)
        # post = Post.objects.create(**validated_data)
        # post.author = self.request.user
        # post.tag_set.set(post.extract_tag_list())
        # for image_data in images_data.getlist('image'):
            # PostImage.objects.create(post=post, image=image_data)
        # return super().create(post)
    
    
    # ManyToMany 필드가 있어서 이 방법으로 안되는 것 같다.
    # _set.set() 으로 처리하라고 함(하지만 Post 모델에는 이미지를 담는 필드가 없어서 여기서 해결 방법은 모르겠음)
    # View 에서 perform_create 를 변경하는 방법으로는 된다.(이 둘의 차이는?)
    # def create(self, validated_data):
        # images_data = self.context['request'].FILES
        # post = Post.objects.create(**validated_data)
        # post.author = self.request.user
        # post.tag_set.set(post.extract_tag_list())
        # for image_data in images_data.getlist('image'):
            # PostImage.objects.create(post=post, image=image_data)
        # return post
    
    # def tag_set_field(self, post):
        # if 'request' in self.context:
            # print(self.context['request'].data['caption'])
            # tag_name_list = re.findall(r"#([a-zA-Z\dㄱ-힣]+)", self.context['request'].data['caption'])
            # tag_list = []
            # for tag_name in tag_name_list:
                # tag, _ = Tag.objects.get_or_create(name=tag_name)
                # tag_list.append(tag)
            # print(tag_list)
            # return tag_list
    
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
        model = Comment
        fields = ["id", "author", "message", "created_at"]
