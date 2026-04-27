# whatsapp/urls.py — FINAL CLEAN VERSION


from django.urls import path
from .views import webhook, get_messages, send_message

urlpatterns = [
    path('webhook/', webhook),
    path('messages/', get_messages), 
    path('send-message/', send_message), #for reciving messages 
]
 
 