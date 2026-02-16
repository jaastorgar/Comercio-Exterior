from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.db import models
<<<<<<< HEAD
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
=======
from django.utils import timezone


class UserManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError("El usuario debe tener un correo electrónico")

        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)
        extra_fields.setdefault("is_active", True)

        return self.create_user(email, password, **extra_fields)


class User(AbstractBaseUser, PermissionsMixin):
    email = models.EmailField(unique=True)
    first_name = models.CharField(max_length=100, blank=True)
    last_name = models.CharField(max_length=100, blank=True)

    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)

    date_joined = models.DateTimeField(default=timezone.now)

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = []

    objects = UserManager()

    def __str__(self):
        return self.email


class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="profile")
    level = models.IntegerField(default=1)
    points = models.IntegerField(default=0)
    ranking_score = models.IntegerField(default=0)

    def __str__(self):
        return f"Perfil académico de {self.user.email}"


class Course(models.Model):
    title = models.CharField(max_length=200)
    level_order = models.IntegerField()

    def __str__(self):
        return self.title


class Lesson(models.Model):
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name="lessons")
    title = models.CharField(max_length=200)
    content = models.TextField()
    order = models.IntegerField()

    def __str__(self):
        return self.title


class UserProgress(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="progress")
    lesson = models.ForeignKey(Lesson, on_delete=models.CASCADE)
    completed = models.BooleanField(default=False)
    score = models.IntegerField(default=0)

    class Meta:
        unique_together = ("user", "lesson")

    def __str__(self):
        return f"{self.user.email} - {self.lesson.title}"
>>>>>>> 704dbf14bf2ed1755f16132ff763cddc7f7e6a1e
