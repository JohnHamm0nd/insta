from django.contrib.auth import get_user_model
from django.shortcuts import render
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.permissions import AllowAny
from rest_framework.generics import CreateAPIView, ListAPIView, get_object_or_404
from rest_framework.response import Response
from .serializers import SignupSerializer, SuggestionUserSerializer, UserSerializer


class SignupView(CreateAPIView):
    model = get_user_model()
    serializer_class = SignupSerializer
    permission_classes = [
        AllowAny,
    ]


class SuggestionListAPIView(ListAPIView):
    queryset = get_user_model().objects.all()
    serializer_class = SuggestionUserSerializer
    
    # get_queryset 재정의
    # 부모 함수를 받고, pk 값이 request.user.pk 와 같으면 제외(요청을 보낸 유저 제외)
    # 요청을 보낸 유저의 following_set 에 있으면 제외(이미 follow 한 유저 제외)
    def get_queryset(self):
        # qs = super().get_queryset()
        # qs = qs.exclude(pk=self.request.user.pk)
        # qs = qs.exclude(pk__in=self.request.user.following_set.all())
        
        # 같은코드
        qs = (
            super()
            .get_queryset()
            .exclude(pk=self.request.user.pk)
            .exclude(pk__in=self.request.user.following_set.all())
        )
        return qs
    
    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['request'] = self.request
        return context

@api_view(['POST'])
def user_follow(request):
    username = request.data['profileUserName']
    follow_user = get_object_or_404(get_user_model(), username=username, is_active=True)
    request.user.following_set.add(follow_user)
    follow_user.follower_set.add(request.user)
    # return Response(status.HTTP_204_NO_CONTENT)
    serializer = SuggestionUserSerializer(follow_user, context={"request": request})
    return Response(serializer.data)

@api_view(['POST'])
def user_unfollow(request):
    username = request.data['profileUserName']
    follow_user = get_object_or_404(get_user_model(), username=username, is_active=True)
    request.user.following_set.remove(follow_user)
    follow_user.follower_set.remove(request.user)
    return Response(status.HTTP_204_NO_CONTENT)

@api_view(['GET'])
def following_user(request):
    serializer = SuggestionUserSerializer(request.user.following_set.all(), many=True, context={"request": request})
    return Response(serializer.data)

