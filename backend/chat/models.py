from django.contrib.auth import get_user_model
from django.db import models

User = get_user_model()

# Contact 모델
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
