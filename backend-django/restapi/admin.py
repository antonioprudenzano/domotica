from django.contrib import admin
from .models import Light, Thermostat, Room

admin.site.register(Room)
admin.site.register(Thermostat)
admin.site.register(Light)