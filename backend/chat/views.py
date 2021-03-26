from django.contrib.auth import get_user_model
from django.shortcuts import render, get_object_or_404
from rest_framework.response import Response
from .models import Chat, Contact


User = get_user_model()

def get_avatar_url(username, chatId):
    chat = get_object_or_404(Chat, id=chatId)    
    contacts = chat.participants.all()
    for contact in contacts:
        if contact.user.username != username:
            user = get_object_or_404(User, username=username)
            return user.avatar_url

def get_previous_messages(chatId, messageCount):
    chat = get_object_or_404(Chat, id=chatId)
    return chat.messages.order_by('-timestamp').all()[messageCount:messageCount+30]

def get_last_30_messages(chatId):
    chat = get_object_or_404(Chat, id=chatId)
    return chat.messages.order_by('-timestamp').all()[:30]

def get_user_contact(username):
    user = get_object_or_404(User, username=username)
    contact, flag = Contact.objects.get_or_create(user=user)
    return contact


def get_current_chat(chatId):
    return get_object_or_404(Chat, id=chatId)
