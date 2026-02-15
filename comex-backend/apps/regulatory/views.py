from rest_framework import generics
from .models import RegulatoryBody, ProductCategory, Regulation
from .serializers import (
    RegulatoryBodySerializer,
    ProductCategorySerializer,
    RegulationSerializer
)


class RegulatoryBodyListView(generics.ListAPIView):
    queryset = RegulatoryBody.objects.all()
    serializer_class = RegulatoryBodySerializer


class ProductCategoryListView(generics.ListAPIView):
    queryset = ProductCategory.objects.all()
    serializer_class = ProductCategorySerializer


class RegulationListView(generics.ListAPIView):
    serializer_class = RegulationSerializer

    def get_queryset(self):
        queryset = Regulation.objects.all()

        category = self.request.query_params.get("category")
        body = self.request.query_params.get("body")

        if category:
            queryset = queryset.filter(categories__id=category)

        if body:
            queryset = queryset.filter(body__id=body)

        return queryset