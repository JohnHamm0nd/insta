from django.conf import settings
from django.db import models
from django.urls import reverse
from imagekit.models import ProcessedImageField
from imagekit.processors import ResizeToFit

# 타임스탬프
class TimestampedModel(models.Model):
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        # 실제로 테이블이 생성되지 않는다, 상속관계도 없음(다른모델들에서 공통된 필드가 많을 때 사용)
        abstract = True

# 포스트
class Post(TimestampedModel):
    author        = models.ForeignKey(settings.AUTH_USER_MODEL, related_name="my_post_set", on_delete=models.CASCADE)
    caption       = models.CharField(max_length=500)
    tag_set       = models.ManyToManyField("Tag", blank=True)
    location      = models.CharField(max_length=100)
    like_user_set = models.ManyToManyField(settings.AUTH_USER_MODEL, blank=True, related_name="like_post_set")

    def __str__(self):
        return self.caption

    def get_absolute_url(self):
        return reverse("instagram:post_detail", args=[self.pk])

    def is_like_user(self, user):
        return self.like_user_set.filter(pk=user.pk).exists()

    class Meta:
        ordering = ["-id"]

# 댓글
class Comment(TimestampedModel):
    author  = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    post    = models.ForeignKey(Post, on_delete=models.CASCADE)
    message = models.TextField()
    
    class Meta:
        ordering = ["id"]

# 태그
class Tag(models.Model):
    name = models.CharField(max_length=50, unique=True)

    def __str__(self):
        return self.name

# 포스트이미지
class PostImage(models.Model):
    post  = models.ForeignKey(Post, on_delete=models.CASCADE, related_name='image_set')
    image = ProcessedImageField(upload_to="instagram/post/%Y/%m/%d", processors = [ResizeToFit(1920, 1080, False)], format = 'JPEG', options = {'quality': 60})
