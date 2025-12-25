from django.db import models

# For contacts field
class Contact(models.Model):
    name = models.CharField(max_length=100, blank=True)
    phone = models.CharField(max_length=20, unique=True)
    source = models.CharField(max_length=50, default='Manual')
    lead_stage = models.CharField(max_length=50, default='New Lead')
    allow_broadcast = models.BooleanField(default=True)
    allow_sms = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)


# For user management (add user)
class ConvixUser(models.Model):
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100, blank=True)
    email = models.EmailField(unique=True)
    phone = models.CharField(max_length=20, blank=True)
    role = models.CharField(max_length=50)
    team = models.CharField(max_length=50, default='All Teams')
    online = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.first_name} {self.last_name}"
    
# For user management (add teams)
class Team(models.Model):
    name = models.CharField(max_length=100)
    members = models.JSONField(default=list)  # stores user IDs

    def __str__(self):
        return self.name
    

# for new template ( add template message)
from django.db import models

class Template(models.Model):
    CATEGORY_CHOICES = [
        ('MARKETING', 'Marketing'),
        ('UTILITY', 'Utility'),
        ('AUTHENTICATION', 'Authentication'),
    ]

    name = models.CharField(max_length=255)
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES, default='MARKETING')
    language = models.CharField(max_length=10, default='en')
    header_type = models.CharField(max_length=20, default='none')
    header_text = models.TextField(blank=True, null=True)
    body_text = models.TextField()
    footer_text = models.TextField(blank=True, null=True)
    buttons = models.JSONField(default=list, blank=True)  # for future buttons
    status = models.CharField(max_length=20, default='draft')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name} ({self.status})"