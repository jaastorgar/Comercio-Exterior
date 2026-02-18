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
    path("register/", RegisterView.as_view(), name="register"),
    path("login/", LoginView.as_view(), name="login"),
    path("profile/", ProfileView.as_view(), name="profile"),
    path("courses/", CourseListView.as_view(), name="courses"),
    path("lessons/", LessonListView.as_view(), name="lessons"),
    path("progress/", UserProgressView.as_view(), name="progress"),
]