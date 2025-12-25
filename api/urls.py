# api/urls.py — ONLY THIS CODE
from django.urls import path, include # noqa
from rest_framework.routers import DefaultRouter # noqa
from .views import ContactViewSet, ConvixUserViewSet, TeamViewSet

router = DefaultRouter()
router.register(r'contacts', ContactViewSet)
router.register(r'users', ConvixUserViewSet)
router.register(r'teams', TeamViewSet)

urlpatterns = [
    path('', include(router.urls)),   # ← ONLY THIS LINE
]

