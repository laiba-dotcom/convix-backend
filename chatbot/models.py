from django.db import models
import uuid

class Chatbot(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    triggered = models.IntegerField(default=0)
    steps_finished = models.IntegerField(default=0)
    finished = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    flow = models.JSONField(default=dict, blank=True)  

    def __str__(self):
        return self.name

    
class ChatbotNode(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    chatbot = models.ForeignKey('Chatbot', on_delete=models.CASCADE)
    type = models.CharField(max_length=50)   
    content = models.JSONField()   
    position_x = models.FloatField(default=0)
    position_y = models.FloatField(default=0)
    parent_id = models.UUIDField(null=True, blank=True)

    def __str__(self):
        return f"{self.type} in {self.chatbot.name}"

