import re
from django.contrib.auth import get_user_model
from asgiref.sync import async_to_sync
from channels.generic.websocket import WebsocketConsumer
import json
from .models import Message, Chat, Contact
from .views import get_avatar_url, get_previous_messages, get_last_30_messages, get_user_contact, get_current_chat

User = get_user_model()


class ChatConsumer(WebsocketConsumer):
    
    # 채팅방 점속시 채팅 내용을 불러오는 fetch_messages(가장 최근 메시지 30개)
    # 새로운 메시지 전송시 new_message
    # 이전 메시지 내용을 불러오는 previous_messages
    
    def previous_messages(self, data):
        messages = get_previous_messages(data['chatId'], data['messageCount'])
        content  = {'command': 'previous_messages', 'messages': self.messages_to_json(messages)}
        self.send_message(content)
        
    def fetch_messages(self, data):
        
        # 장고 channels 에서는 scope 로 장고 view의 request 에서 찾을 수 있는 데이터들을 볼 수 있다.(완전 같지는 않음)
        # scope 에서는 scheme 정보가 없어서(http 요청이 아니라서 그런가?) 수동으로 만들어줌(아바타 URL)

        messages = get_last_30_messages(data['chatId'])
        avatar   = get_avatar_url(data['username'], data['chatId']) 
        
        if re.match(r"^https?://", avatar):
            avatar_url = avatar
        else :
            avatar_url = 'http://' + self.scope["headers"][0][1].decode('ascii') + avatar
        
        content  = {'command': 'messages', 'avatar_url': avatar_url, 'messages': self.messages_to_json(messages)}
        self.send_message(content)

    def new_message(self, data):
        user_contact = get_user_contact(data['from'])
        message      = Message.objects.create(contact=user_contact, content=data['message'])
        current_chat = get_current_chat(data['chatId'])
        
        current_chat.messages.add(message)
        current_chat.save()
        
        content      = {'command': 'new_message', 'message': self.message_to_json(message)}
        return self.send_chat_message(content)


    commands = {
        'fetch_messages': fetch_messages,
        'new_message': new_message,
        'previous_messages': previous_messages
    }
    
    
    def messages_to_json(self, messages):
        result = []
        for message in messages:
            result.append(self.message_to_json(message))
        return result

    def message_to_json(self, message):
        return {
            'id': message.id,
            'author': message.contact.user.username,
            'content': message.content,
            'timestamp': str(message.timestamp)
        }


    def connect(self):
        self.room_name       = self.scope['url_route']['kwargs']['room_name']
        self.room_group_name = 'chat_%s' % self.room_name
        async_to_sync(self.channel_layer.group_add)(
            self.room_group_name,
            self.channel_name
        )
        self.accept()

    def disconnect(self, close_code):
        async_to_sync(self.channel_layer.group_discard)(
            self.room_group_name,
            self.channel_name
        )

    def receive(self, text_data):
        data = json.loads(text_data)
        self.commands[data['command']](self, data)

    def send_chat_message(self, message):
        async_to_sync(self.channel_layer.group_send)(
            self.room_group_name,
            {
                'type': 'chat_message',
                'message': message
            }
        )

    def send_message(self, message):
        self.send(text_data=json.dumps(message))

    def chat_message(self, event):
        message = event['message']
        self.send(text_data=json.dumps(message))
