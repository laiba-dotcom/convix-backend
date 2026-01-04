# convix/convix.py — FINAL CLEAN VERSION
from django.contrib import admin
from django.urls import path, include
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth import get_user_model
import json
import pandas as pd

User = get_user_model()

# CUSTOM VIEWS
@csrf_exempt
def login(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            email = data.get('email')
            password = data.get('password')
            user = User.objects.get(email=email)
            if user.check_password(password):
                return JsonResponse({'success': True, 'message': 'Welcome, Admin'})
            else:
                return JsonResponse({'success': False, 'message': 'Wrong password'})
        except User.DoesNotExist:
            return JsonResponse({'success': False, 'message': 'No user with this email'})
        except:
            return JsonResponse({'success': False, 'message': 'Invalid data'})
    return JsonResponse({'error': 'Use POST method'})

@csrf_exempt
def upload_contacts(request):
    if request.method == 'POST':
        try:
            file = request.FILES['csv']
            df = pd.read_csv(file)
            contacts = []
            for _, row in df.iterrows():
                contacts.append({
                    'name': row.get('name', ''),
                    'phone': str(row.get('phone', '')).strip(),
                    'status': 'uploaded'
                })
            return JsonResponse({'success': True, 'contacts': contacts})
        except Exception as e:
            return JsonResponse({'success': False, 'error': str(e)})
    return JsonResponse({'error': 'POST only'})

# MAIN URLS — ONLY ONE LIST
# convix.py — FINAL URLS (COPY-PASTE THIS ONLY)
from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/login/', login),  # your login
    path('api/contacts/upload/', upload_contacts),  # your upload
    path('api/', include('api.urls')),
    path('api/', include('broadcast.urls')),
    path('whatsapp/', include('whatsapp.urls')),  # ← THIS LINE FIXES 404
]