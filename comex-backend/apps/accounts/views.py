from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, generics, permissions
from rest_framework_simplejwt.tokens import RefreshToken
from django.shortcuts import get_object_or_404
from rest_framework.parsers import MultiPartParser, FormParser
from .serializers import (
    RegisterSerializer,
    LoginSerializer,
    UserProfileSerializer,
    CourseSerializer,
    LessonSerializer,
    UserProgressSerializer,
)
from .models import Course, Lesson, UserProgress

class RegisterView(APIView):
    # Esta línea permite que cualquiera se registre sin estar logueado
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "Usuario creado correctamente"}, status=201)
        return Response(serializer.errors, status=400)


class LoginView(APIView):
    # Esta línea permite que cualquiera intente iniciar sesión
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.validated_data
            refresh = RefreshToken.for_user(user)

            return Response({
                "refresh": str(refresh),
                "access": str(refresh.access_token),
            })
        return Response(serializer.errors, status=400)

# --- VISTAS PRIVADAS (Requieren estar logueado) ---

class ProfileView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    parser_classes = (MultiPartParser, FormParser)

    def get(self, request):
        if hasattr(request.user, 'profile'):
            serializer = UserProfileSerializer(request.user.profile)
            return Response(serializer.data)
        return Response({"detail": "Perfil no encontrado"}, status=404)

    def patch(self, request):
        user = request.user
        profile = user.profile
        
        # Actualizamos el perfil con los datos recibidos (bio, avatar)
        serializer = UserProfileSerializer(profile, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=400)


class CourseListView(generics.ListAPIView):
    permission_classes = [permissions.IsAuthenticated]
    queryset = Course.objects.all()
    serializer_class = CourseSerializer


class LessonListView(generics.ListAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = LessonSerializer

    def get_queryset(self):
        course_id = self.request.query_params.get("course")
        if course_id:
            return Lesson.objects.filter(course_id=course_id)
        return Lesson.objects.all()


class UserProgressView(generics.ListCreateAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = UserProgressSerializer

    def get_queryset(self):
        return UserProgress.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        # Lógica para actualizar si ya existe o crear si es nuevo
        # (Se eliminó la función duplicada que tenías antes)
        lesson = serializer.validated_data.get('lesson')
        score = serializer.validated_data.get('score', 0)
        
        UserProgress.objects.update_or_create(
            user=self.request.user, 
            lesson=lesson,
            defaults={'score': score}
        )