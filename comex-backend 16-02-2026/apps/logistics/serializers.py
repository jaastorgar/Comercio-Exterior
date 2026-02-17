from rest_framework import serializers
from .models import Container, Pallet, CargoSimulation


class ContainerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Container
        fields = "__all__"


class PalletSerializer(serializers.ModelSerializer):
    class Meta:
        model = Pallet
        fields = "__all__"


class CargoSimulationSerializer(serializers.ModelSerializer):

    class Meta:
        model = CargoSimulation
        fields = "__all__"
        read_only_fields = (
            "user",
            "total_box_volume",
            "container_volume",
            "usage_percentage",
            "fits",
            "created_at",
        )

    def create(self, validated_data):
        request = self.context["request"]
        container = validated_data["container"]

        box_volume = (
            validated_data["box_length"] *
            validated_data["box_width"] *
            validated_data["box_height"]
        )

        total_box_volume = box_volume * validated_data["quantity"]
        container_volume = container.length * container.width * container.height

        usage_percentage = (total_box_volume / container_volume) * 100
        fits = total_box_volume <= container_volume

        simulation = CargoSimulation.objects.create(
            user=request.user,
            container=container,
            box_length=validated_data["box_length"],
            box_width=validated_data["box_width"],
            box_height=validated_data["box_height"],
            quantity=validated_data["quantity"],
            total_box_volume=total_box_volume,
            container_volume=container_volume,
            usage_percentage=usage_percentage,
            fits=fits,
        )

        return simulation