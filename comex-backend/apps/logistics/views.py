from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from rest_framework import status
from .serializers import PackRequestSerializer
from .services.packing import pack_positions

class PackView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        ser = PackRequestSerializer(data=request.data)
        ser.is_valid(raise_exception=True)

        data = ser.validated_data
        box = data["box"]
        result = pack_positions(
            container_code=data["container_code"],
            box_lwh_cm=(box["length_cm"], box["width_cm"], box["height_cm"]),
            quantity=data["quantity"],
            allow_rotation=data["allow_rotation"],
            max_positions=500,
        )
        return Response(result, status=status.HTTP_200_OK)