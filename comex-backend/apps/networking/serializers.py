from rest_framework import serializers
from .models import ProfessionalProfile, ConnectionRequest, Post


class ProfessionalProfileSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(source="user.email", read_only=True)

    class Meta:
        model = ProfessionalProfile
        fields = "__all__"
        read_only_fields = ("user", "created_at")


class ConnectionRequestSerializer(serializers.ModelSerializer):
    from_email = serializers.EmailField(source="from_user.email", read_only=True)
    to_email = serializers.EmailField(source="to_user.email", read_only=True)

    class Meta:
        model = ConnectionRequest
        fields = "__all__"
        read_only_fields = ("from_user", "status", "created_at")


class PostSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(source="user.email", read_only=True)

    class Meta:
        model = Post
        fields = "__all__"
        read_only_fields = ("user", "created_at")

class ConnectionRequestUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = ConnectionRequest
        fields = ("status",)