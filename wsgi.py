import os

from django.core.wsgi import get_wsgi_application

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'convix.settings')  # change 'convix' if your settings file is different

application = get_wsgi_application()