from rest_framework import generics, permissions
from rest_framework.response import Response
from django.conf import settings

from .models import ProfessionalProfile, ConnectionRequest, Post
from .serializers import (
    ProfessionalProfileSerializer,
    ConnectionRequestSerializer,
    PostSerializer,
)


class ProfessionalProfileView(generics.RetrieveUpdateAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = ProfessionalProfileSerializer

    def get_object(self):
        return ProfessionalProfile.objects.get(user=self.request.user)


class CreateConnectionRequestView(generics.CreateAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = ConnectionRequestSerializer

    def perform_create(self, serializer):
        serializer.save(from_user=self.request.user)


class PostListCreateView(generics.ListCreateAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = PostSerializer

    def get_queryset(self):
        return Post.objects.all().order_by("-created_at")

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)