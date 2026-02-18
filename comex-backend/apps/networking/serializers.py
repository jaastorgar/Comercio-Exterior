from rest_framework import serializers
from .models import StudentProfile, ConnectionRequest, Post, Comment, Message
from django.contrib.auth import get_user_model

User = get_user_model()

class StudentProfileSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(source="user.email", read_only=True)
    full_name = serializers.SerializerMethodField()

    class Meta:
        model = StudentProfile
        fields = "__all__"
        read_only_fields = ("user", "created_at")
    
    def get_full_name(self, obj):
        # Retorna Nombre + Apellido o el email si no tienen nombre configurado
        name = f"{obj.user.first_name} {obj.user.last_name}".strip()
        return name if name else obj.user.email.split('@')[0]

class CommentSerializer(serializers.ModelSerializer):
    author_name = serializers.SerializerMethodField()
    
    class Meta:
        model = Comment
        fields = "__all__"
        read_only_fields = ("user", "post", "created_at")

    def get_author_name(self, obj):
        if hasattr(obj.user, 'student_profile'):
            return f"{obj.user.first_name} {obj.user.last_name}" or obj.user.email
        return obj.user.email

class PostSerializer(serializers.ModelSerializer):
    author_name = serializers.SerializerMethodField()
    author_institution = serializers.SerializerMethodField()
    comments = CommentSerializer(many=True, read_only=True)
    comments_count = serializers.SerializerMethodField()

    class Meta:
        model = Post
        fields = "__all__"
        read_only_fields = ("user", "created_at")

    def get_author_name(self, obj):
        if hasattr(obj.user, 'student_profile'):
            return f"{obj.user.first_name} {obj.user.last_name}"
        return obj.user.email

    def get_author_institution(self, obj):
        if hasattr(obj.user, 'student_profile'):
            return obj.user.student_profile.institution
        return ""
    
    def get_comments_count(self, obj):
        return obj.comments.count()

class ConnectionRequestSerializer(serializers.ModelSerializer):
    from_email = serializers.EmailField(source="from_user.email", read_only=True)
    to_email = serializers.EmailField(source="to_user.email", read_only=True)
    from_institution = serializers.SerializerMethodField()

    class Meta:
        model = ConnectionRequest
        fields = "__all__"
        read_only_fields = ("from_user", "status", "created_at")

    def get_from_institution(self, obj):
        if hasattr(obj.from_user, 'student_profile'):
            return obj.from_user.student_profile.institution
        return ""

class ConnectionRequestUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = ConnectionRequest
        fields = ("status",)

class MessageSerializer(serializers.ModelSerializer):
    sender_email = serializers.EmailField(source="sender.email", read_only=True)
    
    class Meta:
        model = Message
        fields = "__all__"
        read_only_fields = ("sender", "timestamp", "is_read")