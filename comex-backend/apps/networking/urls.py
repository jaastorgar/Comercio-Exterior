from django.urls import path
from .views import (
    ProfessionalProfileView,
    ProfessionalProfileCreateView,
    ConnectionRequestCreateView,
    ConnectionRequestListView,
    ConnectionRequestUpdateView,
    AcceptedConnectionsView,
    PostListCreateView,
)

urlpatterns = [
    path("profile/", ProfessionalProfileView.as_view()),
    path("profile/create/", ProfessionalProfileCreateView.as_view()),
    path("connections/", ConnectionRequestCreateView.as_view()),
    path("connections/pending/", ConnectionRequestListView.as_view()),
    path("connections/<int:pk>/update/", ConnectionRequestUpdateView.as_view()),
    path("connections/accepted/", AcceptedConnectionsView.as_view()),
    path("posts/", PostListCreateView.as_view()),
]