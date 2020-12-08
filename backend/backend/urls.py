from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import path, include
from django_pydenticon.views import image as pydenticon_image

urlpatterns = [
    path('chat/', include('chat.urls')),
    path('admin/', admin.site.urls),
    path('account/', include('account.urls')),
    path('identicon/image/<path:data>.png', pydenticon_image, name = 'pydenticon_image'),
    path('', include('instagram.urls')),
]

# MEDIA_URL 로 시작되는 요청이 오면 MEDIA_ROOT 에서 찾아서 서빙(settings 에 MEDIA_URL, MEDIA_ROOT 설정) 
# if 문을 적용하지 않아도 DEBUG 에서만 동작하긴 함
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    
    import debug_toolbar
    urlpatterns += [
        path('__debug__/', include(debug_toolbar.urls)),
    ]
