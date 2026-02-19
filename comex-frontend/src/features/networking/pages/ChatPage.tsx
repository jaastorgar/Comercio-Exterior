// src/features/networking/pages/ChatPage.tsx
import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { networkingService } from '../services/networking.service';
import { Message } from '../types/networking.types';
import '../styles/Networking.css';

const ChatPage: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const socketRef = useRef<WebSocket | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!userId) return;

    // 1. Cargar historial inicial vía HTTP
    networkingService.getChatMessages(Number(userId)).then(setMessages);

    // 2. Conectar al WebSocket
    const wsUrl = networkingService.getChatWebSocketUrl(Number(userId));
    const socket = new WebSocket(wsUrl);
    socketRef.current = socket;

    // Escuchar mensajes entrantes del servidor
    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.message) {
        setMessages((prev) => [...prev, data.message]);
      }
    };

    socket.onclose = () => console.warn("Conexión WebSocket cerrada.");
    socket.onerror = (error) => console.error("Error en WebSocket:", error);

    return () => {
      socket.close(); // Limpiar conexión al salir
    };
  }, [userId]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !socketRef.current) return;

    // Enviar mensaje al servidor a través del socket
    socketRef.current.send(JSON.stringify({
      'message': newMessage
    }));
    setNewMessage('');
  };

  return (
    <div className="chat-interface">
      <div className="chat-header-bar">
        <h2>Chat en Tiempo Real</h2>
      </div>
      <div className="chat-messages-container">
        {messages.map((msg) => (
          <div key={msg.id} className={`msg-row ${msg.receiver === Number(userId) ? 'sent' : 'received'}`}>
            <div className="bubble">
              <p>{msg.content}</p>
              <span className="time">
                {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          </div>
        ))}
        <div ref={scrollRef} />
      </div>
      <form className="chat-footer" onSubmit={handleSend}>
        <input 
          type="text" 
          placeholder="Escribe un mensaje instantáneo..." 
          value={newMessage} 
          onChange={e => setNewMessage(e.target.value)} 
        />
        <button type="submit">Enviar</button>
      </form>
    </div>
  );
};

export default ChatPage;