from rest_framework import serializers
from .models import ImportSimulation

class ImportSimulationSerializer(serializers.ModelSerializer):
    class Meta:
        model = ImportSimulation
        fields = "__all__"
        read_only_fields = (
            "user", "cif_usd", "cif_clp", 
            "ad_valorem", "iva", "total_cost", "created_at"
        )

    def create(self, validated_data):
        # El usuario se extrae del token de la petición
        validated_data['user'] = self.context['request'].user
        return super().create(validated_data)