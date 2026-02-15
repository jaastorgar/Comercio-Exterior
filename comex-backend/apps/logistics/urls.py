from django.urls import path
from .views import (
    ContainerListView,
    PalletListView,
    CargoSimulationListCreateView,
)

urlpatterns = [
    path("containers/", ContainerListView.as_view(), name="containers"),
    path("pallets/", PalletListView.as_view(), name="pallets"),
    path("simulations/", CargoSimulationListCreateView.as_view(), name="cargo-simulations"),
]