# whatsapp/views.py — FINAL CLEAN & WORKING VERSION

from django.http import HttpResponse, JsonResponse
from django.views.decorators.csrf import csrf_exempt
from .models import WhatsAppMessage
from rest_framework.decorators import api_view  
from rest_framework.response import Response
import json
from datetime import datetime
from django.http import HttpResponse, JsonResponse, HttpRequest
from django.utils import timezone


def webhook(request: HttpRequest):
    VERIFY_TOKEN = "convix_secret_token_123"

    if request.method == "GET":
        mode = request.GET.get("hub.mode")
        token = request.GET.get("hub.verify_token")
        challenge = request.GET.get("hub.challenge")

        print(f"WEBHOOK GET - mode={mode}, token={token}, challenge={challenge}")

        if mode == "subscribe" and token == VERIFY_TOKEN:
            return HttpResponse(challenge, content_type="text/plain")

        return HttpResponse(status=403)


        

    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            print("NEW MESSAGE FROM WHATSAPP:", json.dumps(data, indent=2))

            # Save every message (your original code — kept unchanged)
            for entry in data.get('entry', []):
                for change in entry.get('changes', []): 
                    value = change.get('value', {})
                    if 'messages' in value:
                        for msg in value['messages']:
                            WhatsAppMessage.objects.create(
                                message_id=msg['id'],
                                from_phone=msg['from'],
                                body=msg.get('text', {}).get('body', '(Media)'),
                                timestamp=datetime.fromtimestamp(int(msg['timestamp']), tz=timezone.utc)
                            )

            return JsonResponse({'status': 'ok'})
        except Exception as e:
            print("Error saving message:", e)
            return JsonResponse({'status': 'error'})

    return JsonResponse({'error': 'method not allowed'}, status=405)


# API — GET MESSAGES FOR FRONTEND (unchanged — working)
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


import requests
from django.conf import settings

@api_view(['POST'])
def send_message(request):
    to_phone = request.data.get('to')
    text = request.data.get('text')

    PHONE_NUMBER_ID = "979251638611436"
    ACCESS_TOKEN = "YOUR_TOKEN"

    url = f"https://graph.facebook.com/v19.0/{PHONE_NUMBER_ID}/messages"

    payload = {
        "messaging_product": "whatsapp",
        "recipient_type": "individual",
        "to": to_phone.replace('+', ''),
        "type": "text",
        "text": {
            "body": text
        }
    }

    headers = {
        "Authorization": f"Bearer {ACCESS_TOKEN}",
        "Content-Type": "application/json"
    }

    response = requests.post(url, json=payload, headers=headers)
    result = response.json()

    if response.status_code != 200:
        return Response({"error": result}, status=400)

    # SAVE MESSAGE IN DB
    WhatsAppMessage.objects.create(
        message_id=result['messages'][0]['id'],
        from_phone=to_phone,
        body=text,
        timestamp=timezone.now(),
        direction='outgoing'
    )

    return Response({"status": "sent"})