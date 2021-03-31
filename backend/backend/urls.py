from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import path, include
from django_pydenticon.views import image as pydenticon_image # 프로필 이미지를 설정하지 않았을 때 깃허브같은 기본 프로필 이미지 라이브러리

urlpatterns = [
    path('chat/', include('chat.api.urls')),
    path('admin/', admin.site.urls),
    path('account/', include('account.urls')),
    path('identicon/image/<path:data>.png', pydenticon_image, name = 'pydenticon_image'),
    path('', include('instagram.urls')),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    
    import debug_toolbar
    urlpatterns += [
        path('__debug__/', include(debug_toolbar.urls)),
    ]
