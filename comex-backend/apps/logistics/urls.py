from django.urls import path
from .views import PackView

urlpatterns = [
    path("pack/", PackView.as_view(), name="logistics-pack"),
]