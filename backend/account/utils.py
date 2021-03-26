from .serializers import UserSerializer

# 기본 response payload handler 는 로그인, 인증시 jwt token 만 응답으로 보냄. 
# token + 인증 유저의 유저정보를 같이 보내도록 커스텀
def jwt_response_payload_handler(token, user=None, request=None):
    return {
        'token': token,
        'user': UserSerializer(user, context={'request': request}).data
    }
