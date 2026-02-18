import client from '../../../api/client';
import { LoginCredentials, RegisterCredentials, AuthResponse, UserProfile, User } from '../types/auth.types';

export const authService = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await client.post<AuthResponse>('/accounts/login/', credentials);
    if (response.data.access) {
      localStorage.setItem('access_token', response.data.access);
      localStorage.setItem('refresh_token', response.data.refresh);
    }
    return response.data;
  },

  register: async (data: RegisterCredentials): Promise<User> => {
    const response = await client.post('/accounts/register/', data);
    return response.data;
  },

  getProfile: async (): Promise<UserProfile> => {
    const response = await client.get<UserProfile>('/accounts/profile/');
    return response.data;
  },

  logout: () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    window.location.href = '/login';
  }
};