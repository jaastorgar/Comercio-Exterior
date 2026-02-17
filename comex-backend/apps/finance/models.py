from django.db import models
from django.conf import settings


class ImportSimulation(models.Model):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="import_simulations"
    )

    fob_value = models.DecimalField(max_digits=12, decimal_places=2)
    freight = models.DecimalField(max_digits=12, decimal_places=2)
    insurance = models.DecimalField(max_digits=12, decimal_places=2)
    exchange_rate = models.DecimalField(max_digits=10, decimal_places=4)

    cif = models.DecimalField(max_digits=12, decimal_places=2)
    ad_valorem = models.DecimalField(max_digits=12, decimal_places=2)
    iva = models.DecimalField(max_digits=12, decimal_places=2)
    total_cost = models.DecimalField(max_digits=12, decimal_places=2)

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Simulación {self.id} - {self.user.email}"