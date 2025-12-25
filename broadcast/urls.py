# broadcast/urls.py
from django.urls import path
from .views import TemplateListCreateAPIView, TemplateDetailAPIView

urlpatterns = [
    path('templates/', TemplateListCreateAPIView.as_view(), name='template-list'),
    path('templates/<int:pk>/', TemplateDetailAPIView.as_view(), name='template-detail'),
]