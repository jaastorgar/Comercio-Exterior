from django.urls import path
from .views import (
    ProfessionalProfileView,
    CreateConnectionRequestView,
    PostListCreateView,
)

urlpatterns = [
    path("profile/", ProfessionalProfileView.as_view(), name="professional-profile"),
    path("connections/", CreateConnectionRequestView.as_view(), name="connection-request"),
    path("posts/", PostListCreateView.as_view(), name="posts"),
]