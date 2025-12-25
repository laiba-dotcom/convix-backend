from django.db import models

# Create your models here.
from django.db import models

class Template(models.Model):
    name = models.CharField(max_length=255)
    category = models.CharField(max_length=50, default='MARKETING')
    language = models.CharField(max_length=10, default='en')
    header_type = models.CharField(max_length=20, default='none')
    header_text = models.TextField(blank=True, null=True)
    body_text = models.TextField()
    footer_text = models.TextField(blank=True, null=True)
    status = models.CharField(max_length=20, default='draft')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name