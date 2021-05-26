import channels
from rest_framework import viewsets
from rest_framework.views import APIView
from rest_framework.response import Response
from .models import Thermostat, Light, Room
from .serializers import ThermostatSerializer, LightSerializer, RoomSerializer
from pysensei import Sensei
import ffmpeg, json
from google.cloud import speech
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync
from rest_framework.test import APIClient


client = speech.SpeechClient()

class Analyze(APIView):
  def post(self, request, format=None):
    def getRoomIDbyName(name):
      try:
        return Room.objects.filter(name__icontains = name).values('id')[0]['id']
      except:
        return 0
    
    def getLightsID(room, name):
      lights = list()
      if room != 0 and name:
        tmp = Light.objects.filter(room__exact=room, name__icontains=name).values('id')
        for light in tmp:
          lights.append(light['id'])
        return lights
      elif room != 0 and not name:
        tmp = Light.objects.filter(room__exact=room).values('id')
        for light in tmp:
          lights.append(light['id'])
        return lights
      elif room == 0 and name:
        tmp = Light.objects.filter(name__icontains=name).values('id')
        for light in tmp:
          lights.append(light['id'])
        return lights
      else:
        return Response({"ERROR": "Non ho capito"})
      

    mysensei = Sensei("testDomotica")
    out = mysensei.analyze(request.data['phrase'])
    roomID = 0
    deviceName = ""

    if(out.extractions != None):
      category = out.extractions._extractions[0]['template'] 
      extractedFields = out.extractions._extractions[0]['fields']

      for field in extractedFields:
        if field['name'] == "ROOM":
          if field['value'].lower() !=  "room":
            roomID = getRoomIDbyName(field['value'].lower())
        elif field['name'] == "NAME":
          deviceName = field['value'].lower()


      if category == 'LIGHT':
        lightsId = getLightsID(roomID, deviceName)
        factory = APIClient()
        for light in lightsId:
          data = {'_id': light}
          for field in extractedFields:
            if field['name'] == "STATE":
              data['light_status'] = True if field['value'] == "on" else False
            elif field['name'] == "BRIGHTNESS":
              data['brightness'] = int(field['value']) if '%' not in field['value'] else int(field['value'][:-1])
          r = factory.patch('/light/' + str(light) + '/', data, format='json')
      elif category == 'THERMOSTAT':
        for field in extractedFields:
          if field['name'] == "TEMPERATURE":
            Thermostat.objects.filter(room__exact=roomID).update(temperature_set=field['value'].split()[0])
      return Response({'extracted': extractedFields, 'roomID': roomID})
    else:
      return Response({"ERROR": "Non ho capito"})

class Recognize(APIView):
  def post(self, request, format=None):

    #save client recorded audio as webm file
    with open("audio.webm", "wb") as aud:
      audio_stream = request.data["audio"].read()
      aud.write(audio_stream)
      aud.close
      
    
    #convert .webm file to .wav with ffmpeg
    stream = ffmpeg.input('audio.webm')
    stream = ffmpeg.output(stream, 'converted.wav')
    stream = ffmpeg.overwrite_output(stream)
    ffmpeg.run(stream)

    with open("converted.wav", "rb") as aud:
      content = aud.read()

    config = speech.RecognitionConfig(
      encoding=speech.RecognitionConfig.AudioEncoding.LINEAR16,
      language_code="en-US",
    )
    audio = speech.RecognitionAudio(content=content)
    response = client.recognize(config=config, audio=audio)
    for result in response.results:
      print("Transcript: {}".format(result.alternatives[0].transcript))
    
    return Response({"transcription": response.results[0].alternatives[0].transcript})


class RoomView(viewsets.ModelViewSet):
  queryset = Room.objects.all()
  serializer_class = RoomSerializer

class ThermostatView(viewsets.ModelViewSet):
  queryset = Thermostat.objects.all()
  serializer_class = ThermostatSerializer

class LightView(viewsets.ModelViewSet):
  queryset = Light.objects.all()
  serializer_class = LightSerializer
  
  def get_queryset(self):
    request = self.request
    channel_layer = get_channel_layer()
    if(request.method == "PUT" or request.method == "PATCH"):
      async_to_sync(channel_layer.group_send)('light', {
        'type': 'light_action',
        'message': request.data
      })
    return super().get_queryset()

