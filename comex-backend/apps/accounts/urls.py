from django.urls import path
from .views import (
    RegisterView,
    LoginView,
    ProfileView,
    CourseListView,
    LessonListView,
    UserProgressView,
)

urlpatterns = [
    path("register/", RegisterView.as_view()),
    path("login/", LoginView.as_view()),
    path("profile/", ProfileView.as_view()),
    path("courses/", CourseListView.as_view()),
    path("lessons/", LessonListView.as_view()),
    path("progress/", UserProgressView.as_view()),
]