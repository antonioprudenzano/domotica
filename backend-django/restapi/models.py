from django.db import models
from django.core.validators import MaxValueValidator, MinValueValidator

class Room(models.Model):
  name = models.CharField(max_length=20, unique=True)
  def __str__(self):
    return self.name

class Thermostat(models.Model):
  room = models.ForeignKey(Room, on_delete=models.CASCADE, related_name='thermostats', unique=True)
  actual_temperature = models.SmallIntegerField(default=10, blank=True)
  temperature_set = models.SmallIntegerField(default=10, blank=True)
  def __str__(self):
    return self.room.name


class Light(models.Model):
  room = models.ForeignKey(Room, on_delete=models.CASCADE, related_name='lights')
  name = models.CharField(max_length=20)
  light_status = models.BooleanField(default=False)
  brightness = models.PositiveSmallIntegerField(default=50, blank=True, validators=[MinValueValidator(0), MaxValueValidator(100)])
  def __str__(self):
    return self.room.name
