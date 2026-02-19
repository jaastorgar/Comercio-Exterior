import client from '../../../api/client';
import { Post, StudentProfile, ConnectionRequest, Message } from '../types/networking.types';

export const networkingService = {
  // --- PUBLICACIONES ---
  getPosts: async (): Promise<Post[]> => {
    const response = await client.get<Post[]>('/networking/posts/');
    return response.data;
  },

  createPost: async (content: string): Promise<Post> => {
    const response = await client.post<Post>('/networking/posts/', { content });
    return response.data;
  },

  addComment: async (postId: number, content: string): Promise<any> => {
    const response = await client.post(`/networking/posts/${postId}/comment/`, { content });
    return response.data;
  },

  // --- CONEXIONES Y DIRECTORIO ---
  getAllStudents: async (search?: string): Promise<StudentProfile[]> => {
    const params = search ? { search } : {};
    const response = await client.get<StudentProfile[]>('/networking/students/', { params });
    return response.data;
  },

  sendConnectionRequest: async (toUserId: number) => {
    return await client.post('/networking/connections/', { to_user: toUserId });
  },

  getPendingRequests: async (): Promise<ConnectionRequest[]> => {
    const response = await client.get<ConnectionRequest[]>('/networking/connections/pending/');
    return response.data;
  },

  respondToRequest: async (requestId: number, status: 'accepted' | 'rejected') => {
    return await client.patch(`/networking/connections/${requestId}/update/`, { status });
  },

  // --- CHAT ---
  getChatMessages: async (userId: number): Promise<Message[]> => {
    const response = await client.get<Message[]>(`/networking/chat/${userId}/`);
    return response.data;
  },

  sendMessage: async (userId: number, content: string): Promise<Message> => {
    const response = await client.post<Message>(`/networking/chat/${userId}/`, { content });
    return response.data;
  },

  getChatWebSocketUrl: (receiverId: number): string => {
    const token = localStorage.getItem('access_token');
    // Usamos el protocolo 'ws' para desarrollo local
    return `ws://localhost:8000/ws/chat/${receiverId}/?token=${token}`;
  }
};