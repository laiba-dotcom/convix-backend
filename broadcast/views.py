from django.shortcuts import render

# Create your views here.
from rest_framework import generics
from .models import Template
from .seriallizer import TemplateSerializer

class TemplateListCreateAPIView(generics.ListCreateAPIView):
    queryset = Template.objects.all().order_by('-created_at')
    serializer_class = TemplateSerializer

class TemplateDetailAPIView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Template.objects.all()
    serializer_class = TemplateSerializer