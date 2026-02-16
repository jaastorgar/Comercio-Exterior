from rest_framework import generics
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import ExchangeRate
from .serializers import ExchangeRateSerializer


class ExchangeRateListView(generics.ListAPIView):
    queryset = ExchangeRate.objects.all()
    serializer_class = ExchangeRateSerializer


class LatestExchangeRateView(APIView):

    def get(self, request, rate_type):
        rate = ExchangeRate.objects.filter(rate_type=rate_type).order_by("-date").first()

        if not rate:
            return Response({"detail": "No rate found"}, status=404)

        serializer = ExchangeRateSerializer(rate)
        return Response(serializer.data)