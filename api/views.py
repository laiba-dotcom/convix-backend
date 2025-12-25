from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Contact, ConvixUser, Team , Template
from .serializers import ContactSerializer, ConvixUserSerializer, TeamSerializer   ,TemplateSerializer         #import serializer for contacts/users
import pandas as pd
from rest_framework import generics

 

class ContactViewSet(viewsets.ModelViewSet):
    queryset = Contact.objects.all()
    serializer_class = ContactSerializer

    @action(detail=False, methods=['post'])
    def upload(self, request):
        file = request.FILES.get('file') or request.FILES.get('csv')
        if not file:
            return Response({'error': 'No file'}, status=400)
        try:
            df = pd.read_csv(file) if file.name.endswith('.csv') else pd.read_excel(file)
            imported = 0
            for _, row in df.iterrows():
                phone = str(row.get('phone', '')).strip()
                if phone.startswith('+'):
                    Contact.objects.create(
                        name=str(row.get('name', '') or ''),
                        phone=phone,
                        source='Import',
                        lead_stage='New Lead',
                        allow_broadcast=True,
                        allow_sms=True,
                    )
                    imported += 1
            return Response({'imported': imported})
        except Exception as e:
            return Response({'error': str(e)}, status=400)
        
#  FOR USERS MANAGEMENT (ADD USER)
class ConvixUserViewSet(viewsets.ModelViewSet):
    queryset = ConvixUser.objects.all()
    serializer_class = ConvixUserSerializer
 
# FOR USERS MANAGEMENT (ADD TEAMS)
class TeamViewSet(viewsets.ModelViewSet):
    queryset = Team.objects.all()
    serializer_class = TeamSerializer


# For new template ( add template message)
from rest_framework import generics
from .models import Template
from .serializers import TemplateSerializer

class TemplateListCreateAPIView(generics.ListCreateAPIView):
    queryset = Template.objects.all().order_by('-created_at')
    serializer_class = TemplateSerializer

class TemplateDetailAPIView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Template.objects.all()
    serializer_class = TemplateSerializer