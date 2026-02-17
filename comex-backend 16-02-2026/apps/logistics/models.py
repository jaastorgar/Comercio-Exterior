from django.db import models
from django.conf import settings


class Container(models.Model):
    name = models.CharField(max_length=50)  # 20FT, 40FT, HC
    length = models.DecimalField(max_digits=6, decimal_places=2)
    width = models.DecimalField(max_digits=6, decimal_places=2)
    height = models.DecimalField(max_digits=6, decimal_places=2)
    max_weight = models.DecimalField(max_digits=10, decimal_places=2)

    def volume(self):
        return self.length * self.width * self.height

    def __str__(self):
        return self.name


class Pallet(models.Model):
    name = models.CharField(max_length=50)  # Europeo, Americano
    length = models.DecimalField(max_digits=6, decimal_places=2)
    width = models.DecimalField(max_digits=6, decimal_places=2)
    height = models.DecimalField(max_digits=6, decimal_places=2)

    def volume(self):
        return self.length * self.width * self.height

    def __str__(self):
        return self.name


class CargoSimulation(models.Model):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="cargo_simulations"
    )

    container = models.ForeignKey(Container, on_delete=models.CASCADE)

    box_length = models.DecimalField(max_digits=6, decimal_places=2)
    box_width = models.DecimalField(max_digits=6, decimal_places=2)
    box_height = models.DecimalField(max_digits=6, decimal_places=2)
    quantity = models.IntegerField()

    total_box_volume = models.DecimalField(max_digits=12, decimal_places=2)
    container_volume = models.DecimalField(max_digits=12, decimal_places=2)
    usage_percentage = models.DecimalField(max_digits=5, decimal_places=2)
    fits = models.BooleanField()

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Simulación logística {self.id}"