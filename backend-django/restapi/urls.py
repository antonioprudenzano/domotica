from django.urls import path, include
from . import views
from rest_framework import routers

router = routers.DefaultRouter()

router.register('thermostat', views.ThermostatView)
router.register('light', views.LightView)
router.register('room', views.RoomView)

urlpatterns = [
  path('', include(router.urls)),
  path('analyze/', views.Analyze.as_view()),
  path('recognize/', views.Recognize.as_view())
]