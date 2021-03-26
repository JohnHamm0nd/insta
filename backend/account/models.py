from django.conf import settings
from django.contrib.auth.models import AbstractUser
from django.core.mail import send_mail
from django.core.validators import RegexValidator
from django.db import models
from django.template.loader import render_to_string
from django.shortcuts import resolve_url
from imagekit.models import ProcessedImageField
from imagekit.processors import ResizeToFit


class User(AbstractUser):
    
    class GenderChoices(models.TextChoices):
        MALE   = "M", "남성"
        FEMALE = "F", "여성"

    website_url   = models.URLField(blank=True)
    bio           = models.TextField(blank=True)
    phone_number  = models.CharField(max_length=13, blank=True, validators=[RegexValidator(r"^010-?[1-9]\d{3}-?\d{4}$")])
    gender        = models.CharField(max_length=1, blank=True, choices=GenderChoices.choices)
    avatar        = ProcessedImageField(blank=True, upload_to="accounts/avatar/%Y/%m/%d", processors = [ResizeToFit(472, 472, False)], format = 'JPEG', ooptions = {'quality': 60})
    follower_set  = models.ManyToManyField("self", blank=True)
    following_set = models.ManyToManyField("self", blank=True)
    
    @property
    def name(self):
        return f"{self.first_name} {self.last_name}".strip()

    @property
    def avatar_url(self):
        if self.avatar:
            return self.avatar.url
        else:
            return resolve_url("pydenticon_image", self.username)

    def send_welcome_email(self):
        subject = render_to_string(
            "accounts/welcome_email_subject.txt", {"user": self,}
        )
        content = render_to_string(
            "accounts/welcome_email_content.txt", {"user": self,}
        )
        sender_email = settings.WELCOME_EMAIL_SENDER
        send_mail(subject, content, sender_email, [self.email], fail_silently=False)

    class Meta:
        ordering = ["-id"]
