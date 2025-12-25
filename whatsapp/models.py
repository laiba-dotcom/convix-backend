 
    

# whatsapp/models.py — FINAL CLEAN VERSION
from django.db import models

class WhatsAppMessage(models.Model):
    message_id = models.CharField(max_length=100, unique=True)
    from_phone = models.CharField(max_length=30)
    body = models.TextField()
    timestamp = models.DateTimeField()

    def __str__(self):
        return f"{self.from_phone}: {self.body[:30]}"