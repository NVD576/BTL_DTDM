from django.conf import settings
from django.db import models
from django.contrib.auth.models import AbstractUser
import os
import uuid
# Kế thừa lại user của Django để tùy chỉnh dễ hơn


def rename_avatar(instance, filename):
    ext = filename.split('.')[-1]
    filename = f"{uuid.uuid4().hex}.{ext}"  # tên ảnh mới duy nhất
    return os.path.join("avatars/", filename)

class User(AbstractUser):
    # Bạn có thể thêm thêm avatar, bio, hoặc role sau nếu cần
    avatar = models.ImageField(upload_to=rename_avatar, null=True, blank=True)
    email = models.EmailField(unique=True)
    groups = models.ManyToManyField(
        'auth.Group',
        related_name='chat_user_set',  # Thêm related_name
        blank=True
    )
    user_permissions = models.ManyToManyField(
        'auth.Permission',
        related_name='chat_user_permissions',  # Thêm related_name
        blank=True
    )
    @property
    def avatar_url(self):
        if self.avatar:
            return self.avatar.url
        # Trả về ảnh mặc định nếu chưa upload avatar
        return settings.MEDIA_URL + 'avatars/default.jpg'


    def __str__(self):
        return self.username

class Room(models.Model):
    name = models.CharField(max_length=100)
    participants = models.ManyToManyField(User, related_name='rooms')
    created_at = models.DateTimeField(auto_now_add=True)
    description=models.CharField(max_length=200,blank=True, null=True)

    def __str__(self):
        return self.name


class Message(models.Model):
    room = models.ForeignKey(Room, on_delete=models.CASCADE, related_name='messages')
    sender = models.ForeignKey(User, on_delete=models.CASCADE)
    content = models.TextField(blank=True)
    image = models.ImageField(upload_to='chat_images/', null=True, blank=True)
    file = models.FileField(upload_to='chat_files/', null=True, blank=True)
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'{self.sender.username}: {self.content[:30]}'
