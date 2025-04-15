from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import UserViewSet, RoomViewSet, MessageViewSet, login_view, register_view

router = DefaultRouter()
router.register(r'users', UserViewSet)
router.register(r'rooms', RoomViewSet)
router.register(r'messages', MessageViewSet)


urlpatterns = [
    path('', include(router.urls)),  # tất cả API sẽ nằm ở đây
    # Đăng nhập và làm mới token
    path('login/', login_view),
    path('register/', register_view),
]