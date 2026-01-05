# whatsapp/views.py — FINAL CLEAN & WORKING VERSION
from django.http import JsonResponse  # noqa: F401
from django.views.decorators.csrf import csrf_exempt  # noqa: F401
from .models import WhatsAppMessage
from rest_framework.decorators import api_view
from rest_framework.response import Response
import json
from datetime import datetime

# WEBHOOK — RECEIVE MESSAGES FROM META
@csrf_exempt
def webhook(request):
    if request.method == 'GET':
        verify_token = "convix_secret_token_123"   
        mode = request.GET.get('hub.mode')
        token = request.GET.get('hub.verify_token')
        challenge = request.GET.get('hub.challenge')

        if mode == 'subscribe' and token == verify_token:
            return JsonResponse({'hub.challenge': challenge})
        return JsonResponse({'error': 'Invalid token'}, status=403)

    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            print("NEW MESSAGE FROM WHATSAPP:", data)

            # Save every message
            for entry in data.get('entry', []):
                for change in entry.get('changes', []): 
                    value = change.get('value', {})
                    if 'messages' in value:
                        for msg in value['messages']:
                            WhatsAppMessage.objects.create(
                                message_id=msg['id'],
                                from_phone=msg['from'],
                                body=msg.get('text', {}).get('body', '(Media)'),
                                timestamp=datetime.fromtimestamp(int(msg['timestamp']))
                            )

            return JsonResponse({'status': 'ok'})
        except Exception as e:
            print("Error saving message:", e)
            return JsonResponse({'status': 'error'})

    return JsonResponse({'error': 'method not allowed'}, status=405)


# API — GET MESSAGES FOR FRONTEND
@api_view(['GET'])
def get_messages(request):
    # Get last 50 messages
    messages = WhatsAppMessage.objects.all().order_by('-timestamp')[:50]

    data = []
    for msg in messages:
        data.append({
            'id': msg.message_id,
            'from': msg.from_phone,
            'body': msg.body,
            'time': msg.timestamp.strftime('%H:%M')
        })

    return Response(data)