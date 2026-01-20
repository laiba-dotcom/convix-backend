# whatsapp/views.py — FINAL CLEAN & WORKING VERSION

from django.http import HttpResponse, JsonResponse
from django.views.decorators.csrf import csrf_exempt
from .models import WhatsAppMessage
from rest_framework.decorators import api_view
from rest_framework.response import Response
import json
from datetime import datetime

# WEBHOOK — RECEIVE MESSAGES FROM META
@csrf_exempt
def webhook(request):
    VERIFY_TOKEN = "convix_secret_token_123"  # MUST MATCH EXACTLY WHAT YOU PUT IN META DASHBOARD

    if request.method == 'GET':
        # Meta verification (this is what was failing)
        mode = request.GET.get('hub.mode')
        token = request.GET.get('hub.verify_token')
        challenge = request.GET.get('hub.challenge')

        print(f"WEBHOOK GET - mode: {mode}, token: {token}, challenge: {challenge}")

        if mode == 'subscribe' and token == VERIFY_TOKEN:
            print("VERIFICATION SUCCESS - returning challenge:", challenge)
            return HttpResponse(challenge)  # THIS LINE IS CRITICAL — Meta expects raw challenge back

        print("VERIFICATION FAILED - wrong token or mode")
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
                                timestamp=datetime.fromtimestamp(int(msg['timestamp']))
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