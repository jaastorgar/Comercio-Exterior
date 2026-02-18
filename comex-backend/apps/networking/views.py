from rest_framework import generics, permissions, filters, serializers
from rest_framework.views import APIView
from rest_framework.response import Response
from django.db import models
from django.shortcuts import get_object_or_404
from django.contrib.auth import get_user_model
from .models import StudentProfile, ConnectionRequest, Post, Comment, Message
from .serializers import (
    StudentProfileSerializer,
    ConnectionRequestSerializer,
    PostSerializer,
    ConnectionRequestUpdateSerializer,
    CommentSerializer,
    MessageSerializer
)

User = get_user_model()

# --- PERFIL Y BÚSQUEDA ---

class StudentProfileView(generics.RetrieveUpdateAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = StudentProfileSerializer

    def get_object(self):
        profile, created = StudentProfile.objects.get_or_create(user=self.request.user)
        return profile

class StudentListView(generics.ListAPIView):
    """ Busca otros estudiantes por nombre o institución """
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = StudentProfileSerializer
    queryset = StudentProfile.objects.all()
    filter_backends = [filters.SearchFilter]
    search_fields = ['institution', 'career', 'user__email', 'user__first_name', 'user__last_name']

    def get_queryset(self):
        return StudentProfile.objects.exclude(user=self.request.user)

# --- CONEXIONES ---

class ConnectionRequestCreateView(generics.CreateAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = ConnectionRequestSerializer

    def perform_create(self, serializer):
        # Ahora sí reconocerá 'serializers.ValidationError'
        if self.request.user == serializer.validated_data['to_user']:
            raise serializers.ValidationError("No puedes enviarte solicitud a ti mismo.")
        serializer.save(from_user=self.request.user)

class ConnectionRequestListView(generics.ListAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = ConnectionRequestSerializer

    def get_queryset(self):
        return ConnectionRequest.objects.filter(to_user=self.request.user, status="pending")

class ConnectionRequestUpdateView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def patch(self, request, pk):
        try:
            connection = ConnectionRequest.objects.get(pk=pk, to_user=request.user)
        except ConnectionRequest.DoesNotExist:
            return Response({"detail": "Solicitud no encontrada"}, status=404)

        serializer = ConnectionRequestUpdateSerializer(connection, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "Estado actualizado"})
        return Response(serializer.errors, status=400)

class AcceptedConnectionsView(generics.ListAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = ConnectionRequestSerializer

    def get_queryset(self):
        return ConnectionRequest.objects.filter(
            models.Q(from_user=self.request.user) | models.Q(to_user=self.request.user),
            status="accepted"
        )

# --- SOCIAL Y POSTS ---

class PostListCreateView(generics.ListCreateAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = PostSerializer

    def get_queryset(self):
        return Post.objects.all().order_by("-created_at")

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class CommentCreateView(generics.CreateAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = CommentSerializer

    def perform_create(self, serializer):
        post_id = self.kwargs.get('post_id')
        post = get_object_or_404(Post, pk=post_id)
        serializer.save(user=self.request.user, post=post)

# --- CHAT / MENSAJERÍA ---

class MessageListCreateView(generics.ListCreateAPIView):
    """
    GET: Obtiene la conversación con un usuario específico (user_id).
    POST: Envía un mensaje a ese usuario.
    """
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = MessageSerializer

    def get_queryset(self):
        other_user_id = self.kwargs['user_id']
        # Trae mensajes donde (Yo soy emisor Y El otro es receptor) O (Yo soy receptor Y El otro es emisor)
        return Message.objects.filter(
            models.Q(sender=self.request.user, receiver_id=other_user_id) |
            models.Q(sender_id=other_user_id, receiver=self.request.user)
        ).order_by('timestamp')

    def perform_create(self, serializer):
        other_user_id = self.kwargs['user_id']
        receiver = get_object_or_404(User, pk=other_user_id)
        serializer.save(sender=self.request.user, receiver=receiver)