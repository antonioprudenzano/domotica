import json
from channels.generic.websocket import WebsocketConsumer
from asgiref.sync import async_to_sync

class LightConsumer(WebsocketConsumer):
    def connect(self):
        self.device = "light"
        #Join group
        async_to_sync(self.channel_layer.group_add)(
            self.device,
            self.channel_name
        )
        self.accept()

    def disconnect(self, close_code):
        #leave group
        async_to_sync(self.channel_layer.group_discard)(
            self.device,
            self.channel_name
        )

    def receive(self, text_data):
        received_values = json.loads(text_data)
        async_to_sync(self.channel_layer.group_send)(
            self.device,
            {
                'type': 'light_action',
                'message': received_values
            }
        )
    
    def light_action(self, event):

        self.send(text_data=json.dumps({
            'message': event['message']
        }))