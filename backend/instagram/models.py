import re
from django.conf import settings
from django.db import models
from django.urls import reverse
# from taggit.managers import TaggableManager
from imagekit.models import ProcessedImageField
from imagekit.processors import ResizeToFit

class TimestampedModel(models.Model):
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        # 모델 테이블을 직접 생성하지 않고 상속하여 사용하려면 abstract = True 를 주면 된다
        abstract = True


class Post(TimestampedModel):
    author = models.ForeignKey(
        settings.AUTH_USER_MODEL, related_name="my_post_set", on_delete=models.CASCADE
    )
    # photo = models.ImageField(upload_to="instagram/post/%Y/%m/%d")
    caption = models.CharField(max_length=500)
    tag_set = models.ManyToManyField("Tag", blank=True)
    # tag_set = TaggableManager()
    location = models.CharField(max_length=100)
    like_user_set = models.ManyToManyField(
        settings.AUTH_USER_MODEL, blank=True, related_name="like_post_set"
    )

    def __str__(self):
        return self.caption

    # def extract_tag_list(self):
        # tag_name_list = re.findall(r"#([a-zA-Z\dㄱ-힣]+)", self.caption)
        # tag_list = []
        # for tag_name in tag_name_list:
            # tag, _ = Tag.objects.get_or_create(name=tag_name)
            # tag_list.append(tag)
        # return tag_list

    def get_absolute_url(self):
        return reverse("instagram:post_detail", args=[self.pk])

    def is_like_user(self, user):
        return self.like_user_set.filter(pk=user.pk).exists()

    class Meta:
        ordering = ["-id"]


class Comment(TimestampedModel):
    author = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    post = models.ForeignKey(Post, on_delete=models.CASCADE)
    message = models.TextField()
    
    class Meta:
        ordering = ["id"]

class Tag(TimestampedModel):
    name = models.CharField(max_length=50, unique=True)

    def __str__(self):
        return self.name

# 사진을 여러장 올리려고 사진 모델을 따로 만드는 게 비효율적으로 보이긴 함(조금:검색이 아니라 몇번몇번 사진을 가져가는 거니 많은 비용이 들진 않을듯)
# 어차피 사진을 포스트 외에 다른 곳에서 사용할 일은 없음
# 근데 1:N 모델을 사용하여 모델을 연결 시키면 포스트를 볼 때 마다 관련된 사진을 포스트이미지 모델에서도 찾아야 하니까
class PostImage(models.Model):
    post = models.ForeignKey(Post, on_delete=models.CASCADE, related_name='image_set')
    image = ProcessedImageField(
        upload_to="instagram/post/%Y/%m/%d",
        processors = [ResizeToFit(1920, 1080, False)],
        format = 'JPEG',
		options = {'quality': 60}
    )
