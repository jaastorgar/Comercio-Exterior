from django.db import models
from django.conf import settings
from django.db.models import Q

class StudentProfile(models.Model):

    STUDY_LEVEL_CHOICES = (
        ("1", "1er Año / Semestre 1-2"),
        ("2", "2do Año / Semestre 3-4"),
        ("3", "3er Año / Semestre 5-6"),
        ("4", "4to Año / Semestre 7-8"),
        ("egresado", "Egresado / Titulado"),
        ("practica", "En Práctica Profesional"),
    )

    AREA_CHOICES = (
        ("comex", "Comercio Exterior"),
        ("logistica", "Logística y Transporte"),
        ("ambas", "Ambas"),
    )

    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="student_profile"
    )

    institution = models.CharField(max_length=200, blank=True, help_text="Universidad o Instituto")
    career = models.CharField(max_length=200, blank=True, help_text="Ej: Téc. en Comex, Ingeniería en Logística")
    study_level = models.CharField(max_length=20, choices=STUDY_LEVEL_CHOICES, default="1")
    area_interest = models.CharField(max_length=20, choices=AREA_CHOICES, default="comex")
    bio = models.TextField(blank=True, help_text="Breve presentación para tus compañeros")

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.email} - {self.institution}"


class ConnectionRequest(models.Model):
    STATUS_CHOICES = (
        ("pending", "Pendiente"),
        ("accepted", "Conectados"),
        ("rejected", "Rechazada"),
    )

    from_user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="sent_connections"
    )
    to_user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="received_connections"
    )
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="pending")
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ("from_user", "to_user")


class Post(models.Model):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="posts"
    )
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Post de {self.user.email}"


class Comment(models.Model):
    post = models.ForeignKey(Post, on_delete=models.CASCADE, related_name="comments")
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Comentario de {self.user.email}"


class Message(models.Model):
    sender = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="sent_messages")
    receiver = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="received_messages")
    content = models.TextField()
    is_read = models.BooleanField(default=False)
    timestamp = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['timestamp']

    def __str__(self):
        return f"De {self.sender} para {self.receiver}"