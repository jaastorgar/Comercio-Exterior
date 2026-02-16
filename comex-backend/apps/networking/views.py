from rest_framework import generics, permissions
from .models import ProfessionalProfile, ConnectionRequest, Post
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status
from django.db import models
from .serializers import (
    ProfessionalProfileSerializer,
    ConnectionRequestSerializer,
    PostSerializer,
    ConnectionRequestUpdateSerializer
)


class ProfessionalProfileView(generics.RetrieveUpdateAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = ProfessionalProfileSerializer

    def get_object(self):
        return ProfessionalProfile.objects.get(user=self.request.user)


class ProfessionalProfileCreateView(generics.CreateAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = ProfessionalProfileSerializer

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class ConnectionRequestCreateView(generics.CreateAPIView):
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

class ConnectionRequestListView(generics.ListAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = ConnectionRequestSerializer

    def get_queryset(self):
        return ConnectionRequest.objects.filter(
            to_user=self.request.user,
            status="pending"
        )


class ConnectionRequestUpdateView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def patch(self, request, pk):
        try:
            connection = ConnectionRequest.objects.get(pk=pk, to_user=request.user)
        except ConnectionRequest.DoesNotExist:
            return Response({"detail": "Solicitud no encontrada"}, status=404)

        serializer = ConnectionRequestUpdateSerializer(
            connection,
            data=request.data,
            partial=True
        )

        if serializer.is_valid():
            serializer.save()
            return Response({"message": "Estado actualizado"})
        return Response(serializer.errors, status=400)


class AcceptedConnectionsView(generics.ListAPIView):
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return ConnectionRequest.objects.filter(
            models.Q(from_user=self.request.user) |
            models.Q(to_user=self.request.user),
            status="accepted"
        )