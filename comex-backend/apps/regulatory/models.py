from django.db import models


class RegulatoryBody(models.Model):
    name = models.CharField(max_length=150)
    country = models.CharField(max_length=100)
    description = models.TextField()

    def __str__(self):
        return self.name


class ProductCategory(models.Model):
    name = models.CharField(max_length=150)
    description = models.TextField(blank=True)

    def __str__(self):
        return self.name


class Regulation(models.Model):
    title = models.CharField(max_length=200)
    description = models.TextField()

    body = models.ForeignKey(
        RegulatoryBody,
        on_delete=models.CASCADE,
        related_name="regulations"
    )

    categories = models.ManyToManyField(
        ProductCategory,
        related_name="regulations"
    )

    is_international = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title