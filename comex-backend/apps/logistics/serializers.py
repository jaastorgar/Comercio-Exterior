from rest_framework import serializers

class BoxSerializer(serializers.Serializer):
    length_cm = serializers.FloatField(min_value=0.1)
    width_cm = serializers.FloatField(min_value=0.1)
    height_cm = serializers.FloatField(min_value=0.1)

class PackRequestSerializer(serializers.Serializer):
    container_code = serializers.ChoiceField(choices=["20DV", "40DV", "40HC"])
    box = BoxSerializer()
    quantity = serializers.IntegerField(min_value=1, max_value=20000)
    allow_rotation = serializers.BooleanField(default=True)

class PackResponseSerializer(serializers.Serializer):
    container = serializers.DictField()
    box = serializers.DictField()
    fit_count = serializers.IntegerField()
    requested = serializers.IntegerField()
    positions = serializers.ListField(child=serializers.DictField())
    note = serializers.CharField()