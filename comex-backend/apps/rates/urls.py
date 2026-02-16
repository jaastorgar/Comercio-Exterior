from django.urls import path
from .views import ExchangeRateListView, LatestExchangeRateView

urlpatterns = [
    path("", ExchangeRateListView.as_view(), name="rates-list"),
    path("latest/<str:rate_type>/", LatestExchangeRateView.as_view(), name="latest-rate"),
]