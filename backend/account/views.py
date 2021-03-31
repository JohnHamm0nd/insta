from django.contrib.auth import get_user_model
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.permissions import AllowAny
from rest_framework.generics import CreateAPIView, ListAPIView, get_object_or_404
from rest_framework.response import Response
from .serializers import SignupSerializer, SuggestionUserSerializer, UserSerializer


# APIVEW 클래스 사용
class SignupView(CreateAPIView):
    model              = get_user_model()
    serializer_class   = SignupSerializer
    permission_classes = [AllowAny, ]


class SuggestionListAPIView(ListAPIView):
    queryset         = get_user_model().objects.all()
    serializer_class = SuggestionUserSerializer
    
    # pk 값이 request.user.pk 와 같으면 제외(요청을 보낸 유저 제외)
    # 요청을 보낸 유저의 following_set 에 있으면 제외(이미 follow 한 유저 제외)
    def get_queryset(self):
        # qs = super().get_queryset()
        # qs = qs.exclude(pk=self.request.user.pk)
        # qs = qs.exclude(pk__in=self.request.user.following_set.all())

        # 같은코드
        qs = (super()
            .get_queryset()
            .exclude(pk=self.request.user.pk)
            .exclude(pk__in=self.request.user.following_set.all())
        )
        return qs
    
    def get_serializer_context(self):
        context            = super().get_serializer_context()
        context['request'] = self.request
        return context

# 함수형 뷰 사용, api_view 데코레이터 사용
@api_view(['POST'])
def user_follow(request):
    username    = request.data['profileUserName']
    follow_user = get_object_or_404(get_user_model(), username=username, is_active=True)
    request.user.following_set.add(follow_user)
    follow_user.follower_set.add(request.user)
    serializer  = SuggestionUserSerializer(follow_user, context={"request": request})
    
    return Response(serializer.data)

@api_view(['POST'])
def user_unfollow(request):
    username    = request.data['profileUserName']
    follow_user = get_object_or_404(get_user_model(), username=username, is_active=True)
    request.user.following_set.remove(follow_user)
    follow_user.follower_set.remove(request.user)
    return Response(status.HTTP_204_NO_CONTENT)

@api_view(['GET'])
def following_user(request):
    serializer = SuggestionUserSerializer(request.user.following_set.all(), many=True, context={"request": request})
    return Response(serializer.data)

# 프로필수정
# 포스트 수정과 같은 기능, 포스트는 ModelViewSet 를 상속받은 클래스뷰를 수정하여 사용
# 프로필은 api_view 데코레이터 사용, 함수형 뷰 사용
@api_view(['PUT'])
def user_profile(request):
    user       = get_object_or_404(get_user_model(), username=request.user)
    serializer = UserSerializer(user, data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(status.HTTP_200_OK)

@api_view(['GET'])
def user_search(request):
    User       = get_user_model()
    search     = request.query_params.get('search', None)
    # 프론트에서 입력받는 키워드로 유저 검색, 유저 본인은 제외
    users      = User.objects.filter(username__istartswith=search).exclude(username=request.user)
    serializer = UserSerializer(users, many=True, context={"request": request})
    return Response(serializer.data)
