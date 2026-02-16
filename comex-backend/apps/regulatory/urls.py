from django.urls import path
from .views import (
    RegulatoryBodyListView,
    ProductCategoryListView,
    RegulationListView,
)

urlpatterns = [
    path("bodies/", RegulatoryBodyListView.as_view(), name="regulatory-bodies"),
    path("categories/", ProductCategoryListView.as_view(), name="product-categories"),
    path("regulations/", RegulationListView.as_view(), name="regulations"),
]