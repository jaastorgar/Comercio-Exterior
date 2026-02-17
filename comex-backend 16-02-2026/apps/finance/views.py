from rest_framework import generics, permissions
from .models import ImportSimulation
from .serializers import ImportSimulationSerializer


class ImportSimulationListCreateView(generics.ListCreateAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = ImportSimulationSerializer

    def get_queryset(self):
        return ImportSimulation.objects.filter(user=self.request.user).order_by("-created_at")

    def get_serializer_context(self):
        return {"request": self.request}