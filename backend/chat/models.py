from django.contrib.auth import get_user_model
from django.db import models

User = get_user_model()


class Contact(models.Model):
    user    = models.ForeignKey(User, related_name='friends', on_delete=models.CASCADE)
    friends = models.ManyToManyField('self', blank=True)

    def __str__(self):
        return self.user.username

# 메시지 모델(contact 정보, 내용, 시간)
class Message(models.Model):
    contact   = models.ForeignKey(Contact, related_name='messages', on_delete=models.CASCADE)
    content   = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.contact.user.username

    def last_20_messages(self):
        return Message.objects.order_by('-id').all()[:20]

# 채팅방 모델(참여자, 메시지)
class Chat(models.Model):
    participants = models.ManyToManyField(
        Contact, related_name='chats', blank=True)
    messages = models.ManyToManyField(Message, blank=True)

    def __str__(self):
        return "{}".format(self.pk)


# 채팅서비스가 있는 서비스(인스타그램, 페이스북, 등등 앱서비스까지 포함한다면 카카오톡 등 아주 많다) 에서 유저가 채팅방을 한두개만 사용하는 경우는 드물다
# 보통은 수십개, 수백개의 채팅방에 연결되어 있다, 모든 채팅방에 대해 모두 실시간 채팅을 받으려면 모두 접속해 있어야 하는데 그러면 서버, 클라이언트 측 모두에게 리소스 낭비

# 방법 1
# 유저가 http 요청을 주기적으로 함
# 프론트엔드에서 getUserChats 을 주기적으로 하게 함

# 방법 2
# 유저가 페이지에 접속해 있을 때 유저에 채팅에 대한 웹소켓을 만들어 연결 시키고 유저에게 채팅이 갔을 때 웹소켓을 통해 받음
# 유저가 해당 채팅에 들어갈 때 해당 채팅 웹소켓 연결
# 
# 모든 채팅에 대해 웹소켓 연결을 하지 않고 하나의 웹소켓으로 데이터를 받을 수 있음
# 현재 프론트엔드의 getUserChats 부분을 웹소켓화

# 방법 3
# 방법 2와 비슷하나 하나의 웹소켓으로 모든 채팅데이터를 통신
# 유저 한명이 여러 채팅 웹소켓을 갖는게 아니라 유저 한명이 하나의 웹소켓을 갖고 데이터를 주고 받음, 주고 받는 데이터에 유저가 누구에게 보냈는지 등을 넣어 전송하면 서버에서는 해당 유저에게 메시지 전송
# 클라이언트에서는 하나의 웹소켓에서 받은 데이터를 유저로 분류하여 여러 채팅방에서 채팅하는 것처럼 보이게

# 모든 유저를 한 그룹에 넣고 그 안에서 유저 아이디로 찾아 보내게 해야 하나?

