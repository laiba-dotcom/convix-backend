 
    

# whatsapp/models.py — FINAL CLEAN VERSION
from django.db import models
direction = models.CharField(max_length=10, default='incoming')

class WhatsAppMessage(models.Model):
    message_id = models.CharField(max_length=255, unique=True)
    from_phone = models.CharField(max_length=20)
    body = models.TextField()
    timestamp = models.DateTimeField()
    direction = models.CharField(max_length=10, default='incoming')  #recieving messages 

class WhatsAppMessage(models.Model):
    message_id = models.CharField(max_length=100, unique=True)
    from_phone = models.CharField(max_length=30)
    body = models.TextField()
    timestamp = models.DateTimeField()

    def __str__(self):
        return f"{self.from_phone}: {self.body[:30]}"