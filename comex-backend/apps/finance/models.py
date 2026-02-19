from django.db import models
from django.conf import settings
from decimal import Decimal

class ImportSimulation(models.Model):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="import_simulations"
    )
    name = models.CharField(max_length=100, default="Simulación de Importación")

    # Valores de entrada
    fob_value = models.DecimalField(max_digits=12, decimal_places=2)
    freight = models.DecimalField(max_digits=12, decimal_places=2)
    insurance = models.DecimalField(max_digits=12, decimal_places=2)
    exchange_rate = models.DecimalField(max_digits=10, decimal_places=4)

    # Resultados calculados automáticamente
    cif_usd = models.DecimalField(max_digits=12, decimal_places=2, blank=True, null=True)
    cif_clp = models.DecimalField(max_digits=12, decimal_places=2, blank=True, null=True)
    ad_valorem = models.DecimalField(max_digits=12, decimal_places=2, blank=True, null=True)
    iva = models.DecimalField(max_digits=12, decimal_places=2, blank=True, null=True)
    total_cost = models.DecimalField(max_digits=12, decimal_places=2, blank=True, null=True)

    created_at = models.DateTimeField(auto_now_add=True)

    def save(self, *args, **kwargs):
        # Lógica de cálculo profesional
        self.cif_usd = self.fob_value + self.freight + self.insurance
        self.cif_clp = self.cif_usd * self.exchange_rate
        
        # 6% Arancel y 19% IVA
        self.ad_valorem = self.cif_clp * Decimal('0.06')
        self.iva = (self.cif_clp + self.ad_valorem) * Decimal('0.19')
        self.total_cost = self.cif_clp + self.ad_valorem + self.iva
        
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.name} - {self.user.email}"