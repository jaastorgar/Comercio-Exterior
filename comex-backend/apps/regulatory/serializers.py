from rest_framework import serializers
from .models import RegulatoryBody, ProductCategory, Regulation


class RegulatoryBodySerializer(serializers.ModelSerializer):
    class Meta:
        model = RegulatoryBody
        fields = "__all__"


class ProductCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductCategory
        fields = "__all__"


class RegulationSerializer(serializers.ModelSerializer):
    body = RegulatoryBodySerializer(read_only=True)
    categories = ProductCategorySerializer(many=True, read_only=True)

    class Meta:
        model = Regulation
        fields = "__all__"