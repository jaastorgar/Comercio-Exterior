import json
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from .models import Message
from django.contrib.auth import get_user_model

User = get_user_model()

class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.my_id = self.scope['user'].id
        self.other_user_id = self.scope['url_route']['kwargs']['user_id']
        
        # Crear un nombre de sala único basado en los IDs de ambos usuarios (ordenados)
        ids = sorted([int(self.my_id), int(self.other_user_id)])
        self.room_group_name = f'chat_{ids[0]}_{ids[1]}'

        # Unirse al grupo de la sala
        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )
        await self.accept()

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )

    # Recibir mensaje desde el WebSocket del Frontend
    async def receive(self, text_data):
        data = json.loads(text_data)
        message_text = data['message']

        # Guardar en base de datos de forma asíncrona
        saved_msg = await self.save_message(message_text)

        # Enviar el mensaje al grupo (a ambos usuarios)
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'chat_message',
                'message': {
                    'id': saved_msg.id,
                    'content': saved_msg.content,
                    'sender': saved_msg.sender.id,
                    'receiver': saved_msg.receiver.id,
                    'timestamp': str(saved_msg.timestamp)
                }
            }
        )

    # Recibir mensaje del grupo de canales
    async def chat_message(self, event):
        message = event['message']
        # Enviar mensaje al WebSocket del navegador
        await self.send(text_data=json.dumps({
            'message': message
        }))

    @database_sync_to_async
    def save_message(self, content):
        receiver = User.objects.get(id=self.other_user_id)
        return Message.objects.create(
            sender=self.scope['user'],
            receiver=receiver,
            content=content
        )