import client from '../../../api/client';
import { Post, StudentProfile, ConnectionRequest } from '../types/networking.types';

export const networkingService = {
  // --- POSTS & SOCIAL ---
  getPosts: async (): Promise<Post[]> => {
    const response = await client.get<Post[]>('/networking/posts/');
    return response.data;
  },

  createPost: async (content: string): Promise<Post> => {
    const response = await client.post<Post>('/networking/posts/', { content });
    return response.data;
  },

  addComment: async (postId: number, content: string): Promise<Comment> => {
    const response = await client.post(`/networking/posts/${postId}/comment/`, { content });
    return response.data;
  },

  // --- CONEXIONES ---
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
  }
};