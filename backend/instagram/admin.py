from django.contrib import admin
from django.utils.safestring import mark_safe
from .models import Post, PostImage, Comment, Tag


@admin.register(Post)
class PostAdmin(admin.ModelAdmin):
    pass
    # admin 페이지에서 글 리스트를 보는 방법
    # list_display 에 넣는 필드가 보여진다
    # list_display_links 는 어떤 필드에 글의 디테일을 보여주는 링크를 걸어줄지 설정
    # list_display = ['image_tag', 'caption']
    # list_display_links = ['caption']

    # 리스트 페이지에서 사진 바로 보기(model 이나 admin 에서 함수를 만들어 사용)
    # 사진 개수(한번에 보여지는?) 만큼 함수 호출이 된다
    # 장고에서 HTML 태그나 자바스크립트 등의 실행을 막기위해(안전, 보안) 문자열로 나타냄
    # mark_safe 를 주어(사용자가 안전하다고 판단) 동작하게 함
    # def image_tag(self, post):
        # return mark_safe(f'<img src={post.image.url} style="width: 100px;"/>')


@admin.register(PostImage)
class PostImageAdmin(admin.ModelAdmin):
    pass


@admin.register(Comment)
class CommentAdmin(admin.ModelAdmin):
    pass


@admin.register(Tag)
class TagAdmin(admin.ModelAdmin):
    list_display = ['id', 'name']
    list_display_links = ['name']
