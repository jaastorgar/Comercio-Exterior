from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny, IsAuthenticated
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User
from django.middleware.csrf import get_token

from .serializers import RegisterSerializer, LoginSerializer, UserProfileSerializer
from .models import UserProfile

class CsrfTokenView(APIView):
    permission_classes = [AllowAny]
    
    def get(self, request):
        token = get_token(request)
        return Response({'csrfToken': token})

class RegisterView(APIView):
    permission_classes = [AllowAny]
    
    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            try:
                user = serializer.save()
                profile = UserProfile.objects.get(user=user)
                login(request, user)
                return Response({
                    'success': True,
                    'message': 'Registro exitoso.',
                    'user': UserProfileSerializer(profile).data
                }, status=status.HTTP_201_CREATED)
            except Exception as e:
                return Response({
                    'success': False,
                    'error': str(e)
                }, status=status.HTTP_400_BAD_REQUEST)
        return Response({
            'success': False,
            'errors': serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)

class LoginView(APIView):
    permission_classes = [AllowAny]
    
    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        if serializer.is_valid():
            email = serializer.validated_data['email']
            password = serializer.validated_data['password']
            
            try:
                user = User.objects.get(email=email)
            except User.DoesNotExist:
                return Response(
                    {'success': False, 'error': 'Correo o contraseña incorrectos.'},
                    status=status.HTTP_401_UNAUTHORIZED
                )
            
            user = authenticate(username=user.username, password=password)
            if user is None:
                return Response(
                    {'success': False, 'error': 'Correo o contraseña incorrectos.'},
                    status=status.HTTP_401_UNAUTHORIZED
                )
            
            login(request, user)
            profile = UserProfile.objects.get(user=user)
            
            return Response({
                'success': True,
                'message': 'Login exitoso.',
                'user': UserProfileSerializer(profile).data
            }, status=status.HTTP_200_OK)
        
        return Response({
            'success': False,
            'errors': serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)

class CurrentUserView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        try:
            profile = UserProfile.objects.get(user=request.user)
            return Response({
                'success': True,
                'user': UserProfileSerializer(profile).data
            }, status=status.HTTP_200_OK)
        except UserProfile.DoesNotExist:
            profile = UserProfile.objects.create(user=request.user)
            return Response({
                'success': True,
                'user': UserProfileSerializer(profile).data
            }, status=status.HTTP_200_OK)
    
    def put(self, request):
        try:
            profile = UserProfile.objects.get(user=request.user)
            serializer = UserProfileSerializer(profile, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response({
                    'success': True,
                    'user': serializer.data
                }, status=status.HTTP_200_OK)
            return Response({
                'success': False,
                'errors': serializer.errors
            }, status=status.HTTP_400_BAD_REQUEST)
        except UserProfile.DoesNotExist:
            return Response({
                'success': False,
                'error': 'Perfil no encontrado'
            }, status=status.HTTP_404_NOT_FOUND)

class LogoutView(APIView):
    permission_classes = [IsAuthenticated]
    
    def post(self, request):
        logout(request)
        return Response(
            {'success': True, 'message': 'Logout exitoso.'},
            status=status.HTTP_200_OK
        )
