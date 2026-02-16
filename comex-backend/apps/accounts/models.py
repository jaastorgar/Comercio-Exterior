from django.db import models
from django.contrib.auth.models import User

class UserProfile(models.Model):
    ROLE_CHOICES = [
        ('Cadete', 'Cadete'),
        ('Especialista', 'Especialista'),
        ('Senior', 'Senior'),
    ]
    
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='commerce_profile')
    role = models.CharField(max_length=50, choices=ROLE_CHOICES, default='Cadete')
    xp = models.IntegerField(default=0)
    join_date = models.DateTimeField(auto_now_add=True)
    preferences = models.JSONField(default=dict, blank=True)
    
    def __str__(self):
        return f"{self.user.email} - {self.role}"
    
    class Meta:
        verbose_name = "User Profile"
        verbose_name_plural = "User Profiles"
