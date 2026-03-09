from rest_framework import serializers
from .models import Chatbot, ChatbotNode

class ChatbotNodeSerializer(serializers.ModelSerializer):
    class Meta:
        model = ChatbotNode
        fields = '__all__'

class ChatbotSerializer(serializers.ModelSerializer):
    nodes = ChatbotNodeSerializer(many=True, read_only=True)

    class Meta:
        model = Chatbot
        fields = '__all__'

class ChatbotSerializer(serializers.ModelSerializer):
    nodes = ChatbotNodeSerializer(many=True, read_only=True)

    class Meta:
        model = Chatbot
        fields = '__all__'

    def create(self, validated_data):
        flow = validated_data.pop('flow', {})
        chatbot = Chatbot.objects.create(**validated_data, flow=flow)
        return chatbot

    def update(self, instance, validated_data):
        flow = validated_data.pop('flow', instance.flow)
        instance.name = validated_data.get('name', instance.name)
        instance.description = validated_data.get('description', instance.description)
        instance.flow = flow
        instance.save()
        return instance
    
class ChatbotSerializer(serializers.ModelSerializer):
    class Meta:
        model = Chatbot
        fields = '__all__'
  