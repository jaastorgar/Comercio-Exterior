from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, generics, permissions
from rest_framework_simplejwt.tokens import RefreshToken
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
    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "Usuario creado correctamente"}, status=201)
        return Response(serializer.errors, status=400)


class LoginView(APIView):
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


class ProfileView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        serializer = UserProfileSerializer(request.user.profile)
        return Response(serializer.data)


class CourseListView(generics.ListAPIView):
    queryset = Course.objects.all()
    serializer_class = CourseSerializer


class LessonListView(generics.ListAPIView):
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
        serializer.save(user=self.request.user)
    
    def perform_create(self, serializer):
        # Lógica para actualizar si ya existe o crear si es nuevo
        lesson = serializer.validated_data.get('lesson')
        UserProgress.objects.update_or_create(
            user=self.request.user, 
            lesson=lesson,
            defaults={'score': serializer.validated_data.get('score')}
        )