from rest_framework import serializers
from rest_framework.validators import UniqueValidator
from .models import Thermostat, Light, Room


class ThermostatSerializer(serializers.ModelSerializer):
  class Meta:
    model = Thermostat
    fields = '__all__'


class LightSerializer(serializers.ModelSerializer):
  class Meta:
    model = Light
    fields = '__all__'

class RoomSerializer(serializers.ModelSerializer):
  thermostats = ThermostatSerializer(many=True, read_only=True)
  lights = LightSerializer(many=True, read_only=True)

  class Meta:
    model = Room
    fields = ('id', 'name', 'thermostats', 'lights')



    