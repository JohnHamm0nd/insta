import re
from rest_framework import serializers
from django.contrib.auth import get_user_model


User = get_user_model()

class SignupSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    
    # 비밀번호는 암호화 해야 하기 때문에 create 함수를 오버라이드 하여
    # 비밀번호를 암호화 해서 저장
    def create(self, validated_data):
        user = User.objects.create(username=validated_data['username'])
        # user.password = validated_data['password']
        user.set_password(validated_data['password'])
        user.save()
        return user

    class Meta:
        model = User
        fields = ['pk', 'username', 'password']


class SuggestionUserSerializer(serializers.ModelSerializer):
    avatar_url = serializers.SerializerMethodField('avatar_url_field')
    
    def avatar_url_field(self, user):
        if re.match(r"^https?://", user.avatar_url):
            return user.avatar_url

        if "request" in self.context:
            scheme = self.context["request"].scheme
            host = self.context["request"].get_host()
            return scheme + "://" + host + user.avatar_url

        # request
    
    class Meta:
        model = User
        fields = ['username', 'name', 'avatar_url']


# class FollowingUserSerializer(serializers.ModelSerializer):
    # class Meta:
        # model = User
        # fields = ['username', 'avatar_url']


class UserSerializer(serializers.ModelSerializer):
    avatar_url = serializers.SerializerMethodField('avatar_url_field')
    
    def avatar_url_field(self, user):
        if re.match(r"^https?://", user.avatar_url):
            return user.avatar_url

        if "request" in self.context:
            scheme = self.context["request"].scheme
            host = self.context["request"].get_host()
            return scheme + "://" + host + user.avatar_url
    
    class Meta:
        model = User
        fields = ['username', 'avatar_url', 'bio']

