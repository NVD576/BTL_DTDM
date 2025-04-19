from rest_framework import serializers
from .models import User, Message, Room

class MessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Message
        fields = '__all__'  # Hoặc liệt kê các trường cần thiết


class UserSerializer(serializers.ModelSerializer):
    # avatar = serializers.SerializerMethodField()
    class Meta:
        model = User
        fields = ['id','username', 'avatar', 'email', 'password']
        extra_kwargs = {'password': {'write_only': True}}

    def get_avatar(self, obj):
        request = self.context.get('request')
        if obj.avatar and request:
            return request.build_absolute_uri(obj.avatar.url)
    def create(self, validated_data):
        password = validated_data.pop('password')
        user = User(**validated_data)
        user.set_password(password)  # Băm mật khẩu tại đây
        user.save()
        return user

class RoomSerializer(serializers.ModelSerializer):
    participants = serializers.PrimaryKeyRelatedField(queryset=User.objects.all(), many=True)
    class Meta:
        model = Room
        fields = '__all__'

