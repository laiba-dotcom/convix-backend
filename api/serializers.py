from rest_framework import serializers                           
from .models import Contact, ConvixUser, Team  #contacts, user, team

class ContactSerializer(serializers.ModelSerializer):     
    class Meta:
        model = Contact
        fields = '__all__'

from rest_framework import serializers                            #Users 


class ConvixUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = ConvixUser
        fields = '__all__'

class TeamSerializer(serializers.ModelSerializer):
    class Meta:
        model = Team
        fields = '__all__'

       
# for new template ( add template message )
from rest_framework import serializers
from .models import Template

class TemplateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Template
        fields = '__all__'