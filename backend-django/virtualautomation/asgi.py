import os, django
from channels.auth import AuthMiddlewareStack
from channels.routing import ProtocolTypeRouter, URLRouter
from django.core.asgi import get_asgi_application
import restapi.routing

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'virtualautomation.settings')

django.setup()

application = ProtocolTypeRouter({
  "http": get_asgi_application(),
  "websocket": AuthMiddlewareStack(
    URLRouter(
      restapi.routing.websocket_urlpatterns
    )
  )
})