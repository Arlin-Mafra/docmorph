
from django.urls import path
from .views import ConversionView

urlpatterns = [
    path('convert/', ConversionView.as_view(), name='convert'),
]
