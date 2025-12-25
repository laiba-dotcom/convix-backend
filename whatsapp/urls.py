# whatsapp/urls.py — FINAL CLEAN VERSION


from django.urls import path
from .views import webhook, get_messages

urlpatterns = [
    path('webhook/', webhook),
    path('messages/', get_messages),  # ✅ ADD THIS
]
