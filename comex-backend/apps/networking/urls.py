from django.urls import path
from .views import (
    StudentProfileView,
    StudentListView,
    ConnectionRequestCreateView,
    ConnectionRequestListView,
    ConnectionRequestUpdateView,
    AcceptedConnectionsView,
    PostListCreateView,
    CommentCreateView,
    MessageListCreateView
)

urlpatterns = [
    # Perfil y Comunidad
    path("profile/", StudentProfileView.as_view(), name="my-profile"),
    path("students/", StudentListView.as_view(), name="student-list"), # Buscador
    
    # Conexiones
    path("connections/", ConnectionRequestCreateView.as_view(), name="send-connection"),
    path("connections/pending/", ConnectionRequestListView.as_view(), name="pending-connections"),
    path("connections/<int:pk>/update/", ConnectionRequestUpdateView.as_view(), name="update-connection"),
    path("connections/accepted/", AcceptedConnectionsView.as_view(), name="accepted-connections"),
    
    # Muro y Comentarios
    path("posts/", PostListCreateView.as_view(), name="posts"),
    path("posts/<int:post_id>/comment/", CommentCreateView.as_view(), name="add-comment"),

    # Chat
    # Ejemplo: GET /api/networking/chat/5/ -> Ver chat con usuario ID 5
    # Ejemplo: POST /api/networking/chat/5/ -> Enviar mensaje a usuario ID 5
    path("chat/<int:user_id>/", MessageListCreateView.as_view(), name="chat-detail"),
]