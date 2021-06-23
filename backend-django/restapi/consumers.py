import json
from channels.generic.websocket import AsyncWebsocketConsumer


class LightConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.device = "light"
        #Join group
        await self.channel_layer.group_add(
            self.device,
            self.channel_name
        )
        await self.accept()

    async def disconnect(self, close_code):
        #leave group
        await self.channel_layer.group_discard(
            self.device,
            self.channel_name
        )

    async def receive(self, text_data):
        received_values = json.loads(text_data)
        await self.channel_layer.group_send(
            self.device,
            {
                'type': 'light_action',
                'message': received_values
            }
        )
    
    async def light_action(self, event):
      await self.send(text_data=json.dumps({
        'message': event['message']
      }))