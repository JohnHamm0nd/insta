import re
from django.contrib.auth import get_user_model
from django.db.models import Q
from django.shortcuts import render
from rest_framework import status
from rest_framework.decorators import action, api_view
from rest_framework.generics import get_object_or_404
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet
from .models import Post, PostImage, Comment, Tag
from .serializers import PostSerializer, CommentSerializer, TagSerializer
from account.serializers import UserSerializer 

class PostViewSet(ModelViewSet):
    # queryset 지정
    queryset = Post.objects.all().select_related('author').prefetch_related('tag_set', 'like_user_set', 'image_set')
    # serializer 지정
    serializer_class = PostSerializer
    serializer_class_user = UserSerializer
    
    # permission_class 지정
    # permission_classes = [AllowAny]  # FIXME: 인증 적용하기
    
    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['request'] = self.request
        return context
    
    
    # 뷰셋이나 API뷰 등 클래스 기반의 뷰에서는 get_queryset 이라는 멤버 함수를 지원
    # get_queryset 함수를 재정의 하여 사용
    def get_queryset(self):
        qs = super().get_queryset()
        # qs = qs.filter(
            # Q(author=self.request.user) |
            # Q(author__in=self.request.user.following_set.all())
        # )
        
        search = self.request.query_params.get('search', None)
        username = self.request.query_params.get('username', None)
        # mypost = self.request.query_params.get('mypost', None)
        
        if search:
            # qqs = Q()
            tag = Tag.objects.get(name=search)
            qs = qs.filter(tag_set=tag)
        elif username:
            user = get_user_model().objects.get(username=username)
            qs = qs.filter(author=user)
        # elif mypost:
            # qs = qs.filter(author=self.request.user)
        return qs

    # perform_create 함수 재정의(기본동작은 그냥 serializer 를 받아서 바로 저장함)
    # 그렇기 때문에 author 가 지정이 안되는 것, 장고 폼에서 했던 것처럼(form.save(commit=False) 를 주고 author 를 넣은 뒤 save)
    # 비슷한 동작 필요(serializer 에서는 그냥 save 시 인자를 주어 저장하면 된다)
    # def perform_create(self, serializer):
        # print(serializer['caption'])
        # print(self.request.POST['caption'])
        # print(self.request.data['caption'])
        # post.tag_set.add(*post.extract_tag_list())
        # serializer.save(author=self.request.user)
        # return super().perform_create(serializer)
        # rest API 에서 태그셋을 넣을 방법을 모르겠음
        # print(self.get_object())
        
        # print(tag_name_list)
        # tag_list = []
        # 방법 1과 2의 차이는 정규식으로 태그를 뽑고, 모델 인스턴스를 가져오는 기능 구현을
        # 여기에 해놓냐 model 에 해놓냐 차이밖엔 없는듯
        # 방법1: 여기서 구현
        # tag_name_list = re.findall(r"#([a-zA-Z\dㄱ-힣]+)", self.request.data['caption'])
        # tag_list = []
        # for tag_name in tag_name_list:
            # tag, _ = Tag.objects.get_or_create(name=tag_name)
            # tag_list.append(tag)

        # serializer.save(author=self.request.user, tag_set=tag_list)
        # return super().perform_create(serializer)
        # or
        # instance = serializer.save(author=self.request.user, tag_set=tag_list)
        # instance.tag_set.set(tag_list)

        # 방법2:models 에 구현하고 여기서 사용
        # instance = serializer.save(author=self.request.user)
        # instance.tag_set.set(instance.extract_tag_list())
        # images_data = self.request.FILES
        # for image_data in images_data.getlist('image'):
            # PostImage.objects.create(post=instance, image=image_data)
        # serializer.save(author=self.request.user)
        # return super().perform_create(instance)

    # list 함수를 오버라이드하여 쿼리파라미터에 username 이 있는 경우 처리
    # 쿼리셋을 오버라이드하여 사용하고 있는데 lsit, retrieve 등을 모두 오버라이드하여 사용하면 굳이 쿼리셋까지 오버라이드하여 사용할 필요가 있나 싶음
    # 그래도 차이점은 쿼리셋은 말그대로 쿼리셋을 변경(실제 데이터는 아님), list, retrieve 는 데이터를 변경시킬수 있다는것?
    
    def list(self, request):
        res = super().list(request)
        username = self.request.query_params.get('username', None)
        
        # 쿼리에 username 이 있는 경우(프론트에서 유저를 클릭 시 유저의 프로필과 유저의 포스트를 보여준다)
        # 포스트 데이터에 유저에 관한 데이터 넣어서 보내주기(account 의 User model, User serializer) 
        if username:
            user = get_user_model().objects.get(username=username)
            serializer = self.serializer_class_user(user, context={"request": request})
            res.data.update(serializer.data)
        return Response(res.data)
        
    def perform_create(self, serializer):
        # get_serializer_context 보다 먼저 작동하는건지 self.context 가 없다고 나온다.
        # images_data = self.context['request'].FILES
        # post = Post.objects.create(**validated_data)
        # post.author = self.request.user
        
        post = serializer.save(author=self.request.user)
        # post.tag_set.set(post.extract_tag_list())
        tag_name_list = re.findall(r"#([a-zA-Z\dㄱ-힣]+)", self.request.data['tags'])
        tag_list = []
        for tag_name in tag_name_list:
            tag, _ = Tag.objects.get_or_create(name=tag_name)
            tag_list.append(tag)
            
        post.tag_set.set(tag_list)
        
        print(self.request.FILES)
        images_data = self.request.FILES
        for image_data in images_data.getlist('image'):
            PostImage.objects.create(post=post, image=image_data)
        
        return super().perform_create(post)
        
    # put 메소드 오버라이딩 하여
    # 사진이 그대로인 경우(id 와 url 로만 이루어져 있음, id 로 이미지 모델에서 찾기) 해당 모델객체를 넣어주고 
    # 아닌 경우(새로운 사진 업로드나 삭제후 다른사진 업로드)
    # self.request.FILES 에서 찾아서 새로운 객체를 만들어 저장
    
    # 이미지를 찾아서 수정, 삭제하는 방법이 비효율적으로 보이긴 함
    # self.request.data 에서 'image' 를 가져오면 프론트에서 넘긴 이미지의 id 값과 이미지를 새로 업로드 했을 시 새로운 이미지 파일이 있음
    # 모두 리스트에 담은 후 기존에 있던 이미지에서 id 값이 있는지 찾고 없으면 이미지객체 삭제
    # request.FILES 에는 파일만 있음(새로 업로드시), 파일을 새로운 이미지 객체로 저장
    
    # FIXME: 아직 이미지 외 다른 필드들 업데이트 안하고 있음
    
    def update(self, request, pk=None):
        
        post = self.get_object()
        post.caption = self.request.data['caption']
        
        post.location = self.request.data['location']
        
        tag_name_list = re.findall(r"#([a-zA-Z\dㄱ-힣]+)", self.request.data['tags'])
        print(self.request.data['tags'])
        tag_list = []
        
        for tag_name in tag_name_list:
            tag, _ = Tag.objects.get_or_create(name=tag_name)
            tag_list.append(tag)
        
        post.tag_set.set(tag_list)
        
        post.save()
        
        images_data = self.request.data
        
        post_images = PostImage.objects.filter(post=post)
        origin_images = []
        
        for image_data in images_data.getlist('image'):
            origin_images.append(image_data)
        
        for post_image in post_images:
            if str(post_image.pk) not in origin_images:
                post_image.delete()

        images_data = self.request.FILES
        for image_data in images_data.getlist('image'):
            PostImage.objects.create(post=post, image=image_data)
        
        return Response(status.HTTP_200_OK)
    
    @action(detail=True, methods=['POST'])
    def like(self, request, pk):
        post = self.get_object()
        post.like_user_set.add(self.request.user)
        return Response(status.HTTP_201_CREATED)
    
    @like.mapping.delete
    def unlike(self, request, pk):
        post = self.get_object()
        post.like_user_set.remove(self.request.user)
        return Response(status.HTTP_204_NO_CONTENT)


class CommentViewSet(ModelViewSet):
    queryset = Comment.objects.all()
    serializer_class = CommentSerializer
    
    
    # url 로 부터 받은 인자(캡쳐된 인자, 여기에서는 post_pk) 는 kwargs 를 통해서 접근할 수 있다
    def get_queryset(self):
        qs = super().get_queryset()
        qs = qs.filter(post__pk=self.kwargs["post_pk"])
        return qs 

    def perform_create(self, serializer):
        post = get_object_or_404(Post, pk=self.kwargs["post_pk"])
        serializer.save(author=self.request.user, post=post)
        return super().perform_create(serializer)

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['request'] = self.request
        return context


@api_view(['GET'])
def get_tag(request):
    
    search = request.query_params.get('search', None)
    tags = Tag.objects.filter(name__istartswith=search)
    serializer = TagSerializer(tags, many=True)
    
    return Response(serializer.data)
