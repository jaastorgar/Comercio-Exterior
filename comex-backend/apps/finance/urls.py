from django.urls import path
from .views import ImportSimulationListCreateView

urlpatterns = [
    path("simulations/", ImportSimulationListCreateView.as_view(), name="import-simulations"),
]