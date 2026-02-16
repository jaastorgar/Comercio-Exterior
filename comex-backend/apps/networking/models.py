from django.db import models
from django.conf import settings


class ProfessionalProfile(models.Model):

    ROLE_CHOICES = (
        ("student", "Estudiante"),
        ("agent", "Agente de Aduana"),
        ("forwarder", "Freight Forwarder"),
        ("exporter", "Exportador"),
    )

    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="professional_profile"
    )

    role = models.CharField(max_length=50, choices=ROLE_CHOICES)
    skills = models.TextField(blank=True)
    certifications = models.TextField(blank=True)
    bio = models.TextField(blank=True)
    company = models.CharField(max_length=200, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.email} - {self.role}"


class ConnectionRequest(models.Model):

    STATUS_CHOICES = (
        ("pending", "Pendiente"),
        ("accepted", "Aceptada"),
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

    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default="pending"
    )

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