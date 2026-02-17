from rest_framework import serializers
from .models import ImportSimulation


class ImportSimulationSerializer(serializers.ModelSerializer):

    class Meta:
        model = ImportSimulation
        fields = "__all__"
        read_only_fields = (
            "user",
            "cif",
            "ad_valorem",
            "iva",
            "total_cost",
            "created_at",
        )

    def create(self, validated_data):
        request = self.context["request"]

        fob = validated_data["fob_value"]
        freight = validated_data["freight"]
        insurance = validated_data["insurance"]
        exchange_rate = validated_data["exchange_rate"]

        # Cálculo financiero
        cif = fob + freight + insurance
        cif_clp = cif * exchange_rate

        ad_valorem = cif_clp * 0.06  # 6% estándar Chile
        iva = (cif_clp + ad_valorem) * 0.19  # 19%

        total_cost = cif_clp + ad_valorem + iva

        simulation = ImportSimulation.objects.create(
            user=request.user,
            fob_value=fob,
            freight=freight,
            insurance=insurance,
            exchange_rate=exchange_rate,
            cif=cif_clp,
            ad_valorem=ad_valorem,
            iva=iva,
            total_cost=total_cost,
        )

        return simulation