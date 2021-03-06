import re
from django.contrib.auth import get_user_model
from rest_framework import status
from rest_framework.decorators import action, api_view
from rest_framework.generics import get_object_or_404
from rest_framework.permissions import BasePermission, IsAuthenticated, SAFE_METHODS
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet
from .models import Post, PostImage, Comment, Tag
from .serializers import PostSerializer, CommentSerializer, TagSerializer
from account.serializers import UserSerializer


# TODO: 작성자가 아닐 경우 수정.삭제 막기, 댓글수정.삭제

# 읽기만 가능하게
class ReadOnly(BasePermission):
    def has_permission(self, request, view):
        return request.method in SAFE_METHODS


class PostViewSet(ModelViewSet):
    
    queryset              = Post.objects.all().select_related('author').prefetch_related('tag_set', 'like_user_set', 'image_set')
    serializer_class      = PostSerializer
    serializer_class_user = UserSerializer
    # 인증되지 않았으면 읽기만 가능하게
    permission_classes    = [IsAuthenticated|ReadOnly]
    
    def get_serializer_context(self):
        context            = super().get_serializer_context()
        context['request'] = self.request
        return context

    # 포스트모델에서 태그명으로 검색 or 유저이름으로 검색
    def get_queryset(self):
        qs       = super().get_queryset()       
        search   = self.request.query_params.get('search', None)
        username = self.request.query_params.get('username', None)
                
        if search:
            tag  = Tag.objects.get(name=search)
            qs   = qs.filter(tag_set=tag)
        elif username:
            user = get_user_model().objects.get(username=username)
            qs   = qs.filter(author=user)
        return qs
    
    # 쿼리셋에 유저이름검색이 있는데?
    def list(self, request):
        res      = super().list(request)
        username = self.request.query_params.get('username', None)
        
        if username:
            user       = get_user_model().objects.get(username=username)
            serializer = self.serializer_class_user(user, context={"request": request})
            res.data.update(serializer.data)
        return Response(res.data)

    # perform_create 는 create 함수내에서 저장시 호출(perform_create가 serializer.save()함)
    # 저장시 해야할 작업이 있으면 perform_create를 오버라이드하여 사용
    # 포스트 외에 태그와, 이미지를 추가로 저장해야 하기 때문에 사용
    def perform_create(self, serializer):      
        post          = serializer.save(author=self.request.user)
        
        # 태그찾기
        tag_name_list = re.findall(r"#([a-zA-Z\dㄱ-힣]+)", self.request.data['tags'])
        tag_list      = []
        
        for tag_name in tag_name_list:
            tag, _ = Tag.objects.get_or_create(name=tag_name)
            tag_list.append(tag)
            
        post.tag_set.set(tag_list)
        images_data = self.request.FILES

        for image_data in images_data.getlist('image'):
            PostImage.objects.create(post=post, image=image_data)
        return super().perform_create(post)

    # Update(수정)
    # 사진이 그대로인 경우(id 와 url 로만 이루어져 있음, id 로 이미지 모델에서 찾기) 해당 모델객체를 넣어주고 
    # 아닌 경우(새로운 사진 업로드나 삭제후 다른사진 업로드)
    # self.request.FILES 에서 찾아서 새로운 객체를 만들어 저장
    
    # 이미지를 찾아서 수정, 삭제하는 방법이 비효율적으로 보임
    # self.request.data 의 'image' 에 프론트에서 넘긴 이미지의 id 값과 이미지 파일이 있음
    # 이것도 조금 더 효율적으로 변경한다면 프론트에서 이미지 변경이 없을 때 이미지의 id 값만 보내면 됨
    # 모두 리스트에 담은 후 기존에 있던 모델(데이터)에서 id 값이 있는지 찾고 없으면 이미지객체 삭제
    # request.FILES 에는 파일만 있음(새로 업로드시), 파일을 새로운 이미지 객체로 저장
 
    def update(self, request, pk=None):
        post          = self.get_object()
        post.caption  = self.request.data['caption']
        post.location = self.request.data['location']
        tag_name_list = re.findall(r"#([a-zA-Z\dㄱ-힣]+)", self.request.data['tags'])
        tag_list      = []
        
        for tag_name in tag_name_list:
            tag, _ = Tag.objects.get_or_create(name=tag_name)
            tag_list.append(tag)
        
        post.tag_set.set(tag_list)        
        post.save()

        images_data   = self.request.data        
        post_images   = PostImage.objects.filter(post=post)
        origin_images = []
        
        for image_data in images_data.getlist('image'):
            origin_images.append(image_data)
        
        for post_image in post_images:
            if str(post_image.pk) not in origin_images:
                post_image.delete()

        images = self.request.FILES
        
        for image in images.getlist('image'):
            PostImage.objects.create(post=post, image=image)
        
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
    
    # url 로 부터 받은 인자(post_pk)는 kwargs 를 통해서 접근할 수 있다
    def get_queryset(self):
        qs = super().get_queryset()
        qs = qs.filter(post__pk=self.kwargs["post_pk"])
        return qs 

    def perform_create(self, serializer):
        post = get_object_or_404(Post, pk=self.kwargs["post_pk"])
        serializer.save(author=self.request.user, post=post)
        return super().perform_create(serializer)

    def get_serializer_context(self):
        context            = super().get_serializer_context()
        context['request'] = self.request
        return context

# 태그검색
@api_view(['GET'])
def get_tag(request):
    search     = request.query_params.get('search', None)
    tags       = Tag.objects.filter(name__istartswith=search)
    serializer = TagSerializer(tags, many=True)
    return Response(serializer.data)
