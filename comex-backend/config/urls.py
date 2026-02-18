from django.contrib import admin
from django.urls import path, include
from django.http import JsonResponse

def health_check(request):
    return JsonResponse({
        "estado": "ok",
        "mensaje": "Backend de Comercio Exterior operativo"
    })

urlpatterns = [
    path('admin/', admin.site.urls),
    
    # Módulos Base
    path("api/accounts/", include("apps.accounts.urls")),
    path("api/finance/", include("apps.finance.urls")),
    path("api/logistics/", include("apps.logistics.urls")),
    path("api/rates/", include("apps.rates.urls")),
    path("api/networking/", include("apps.networking.urls")),
    path("api/regulatory/", include("apps.regulatory.urls")),
]