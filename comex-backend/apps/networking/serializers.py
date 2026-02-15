from rest_framework import serializers
from django.conf import settings
from .models import ProfessionalProfile, ConnectionRequest, Post


class ProfessionalProfileSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(source="user.email", read_only=True)

    class Meta:
        model = ProfessionalProfile
        fields = (
            "id",
            "email",
            "role",
            "skills",
            "certifications",
            "bio",
        )


class ConnectionRequestSerializer(serializers.ModelSerializer):
    class Meta:
        model = ConnectionRequest
        fields = "__all__"
        read_only_fields = ("from_user", "status", "created_at")


class PostSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(source="user.email", read_only=True)

    class Meta:
        model = Post
        fields = (
            "id",
            "email",
            "content",
            "created_at",
        )