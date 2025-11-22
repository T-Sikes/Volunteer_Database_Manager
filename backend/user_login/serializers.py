from rest_framework import serializers
from django.contrib.auth import get_user_model

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'password']
        extra_kwargs = {
            'password': {'write_only': True},
            'username': {'required': False}  # Make username optional
        }

    def create(self, validated_data):
        email = validated_data.get('email')
        username = validated_data.get('username', email)  # Default to email if username not provided
        user = User.objects.create_user(
            email=email,
            username=username,
            password=validated_data['password']
        )
        return user
