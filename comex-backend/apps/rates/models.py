from django.db import models


class ExchangeRate(models.Model):

    RATE_TYPES = (
        ("observed", "Dólar Observado"),
        ("customs", "Dólar Aduanero"),
    )

    rate_type = models.CharField(max_length=20, choices=RATE_TYPES)
    value = models.DecimalField(max_digits=10, decimal_places=4)
    date = models.DateField()

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-date"]
        unique_together = ("rate_type", "date")

    def __str__(self):
        return f"{self.rate_type} - {self.value} ({self.date})"