import re
from rest_framework import serializers
from django.contrib.auth import get_user_model

User = get_user_model()


# 회원가입 Serializer
class SignupSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    
    # 비밀번호 암호화 하여 저장
    def create(self, validated_data):
        user = User.objects.create(username=validated_data['username'])
        # user.password = validated_data['password']
        user.set_password(validated_data['password'])
        user.save()
        return user

    class Meta:
        model = User
        fields = ['pk', 'username', 'password']

# 유저 추천 Serializer
class SuggestionUserSerializer(serializers.ModelSerializer):
    avatar_url = serializers.SerializerMethodField('avatar_url_field')

    # 아바타 URL(http(s) 로 시작하면 그대로 사용하고 그렇지 않으면 URL 을 http(s) 로 시작하게 변경)
    def avatar_url_field(self, user):
        if re.match(r"^https?://", user.avatar_url):
            return user.avatar_url

        if "request" in self.context:
            scheme = self.context["request"].scheme
            host = self.context["request"].get_host()
            return scheme + "://" + host + user.avatar_url

    class Meta:
        model = User
        fields = ['username', 'name', 'avatar_url']

# 유저 정보 Serializer
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
        fields = ['username', 'avatar', 'avatar_url', 'bio']
    
        # UserSerializer 의 경우 로그인, 인증 시 유저의 데이터를 보낼 때, 유저가 개인정보를 수정시 사용함
        # 로그인, 인증시에는 데이터를 읽는 것(R, 보내주는 것)이기 때문에 username 데이터가 있어야 함(프론트엔드에서 username 데이터를 사용)
        # 하지만 개인정보 수정 시에 유저는 username 은 수정할수 없고, 프론트에서 username 데이터를 받지도 않음, 이 필드에 대한 조건을 extra_kwargs 를 사용해 변경
        extra_kwargs = {'username': {'required': False}}

