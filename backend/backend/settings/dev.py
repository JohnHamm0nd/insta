from .common import *

# 장고 디버그 툴바
INSTALLED_APPS += [
    'debug_toolbar',
]

MIDDLEWARE = [
    'debug_toolbar.middleware.DebugToolbarMiddleware',
] + MIDDLEWARE

INTERNAL_IPS = ['127.0.0.1']

# 다른 도메인에 요청 허용 설정(CORS)
# 등록된 URL 에서의 접근만 허용
CORS_ORIGIN_WHITELIST = ['http://localhost:3000']
# 모든 URL 에서 접근 허용
# CORS_ORIGIN_ALLOW_ALL = True
