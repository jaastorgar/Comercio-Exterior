from rest_framework import generics, permissions
from .models import Container, Pallet, CargoSimulation
from .serializers import (
    ContainerSerializer,
    PalletSerializer,
    CargoSimulationSerializer
)


class ContainerListView(generics.ListAPIView):
    permission_classes = [permissions.AllowAny]
    queryset = Container.objects.all()
    serializer_class = ContainerSerializer


class PalletListView(generics.ListAPIView):
    permission_classes = [permissions.AllowAny]
    queryset = Pallet.objects.all()
    serializer_class = PalletSerializer


class CargoSimulationListCreateView(generics.ListCreateAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = CargoSimulationSerializer

    def get_queryset(self):
        return CargoSimulation.objects.filter(user=self.request.user).order_by("-created_at")

    def get_serializer_context(self):
        return {"request": self.request}