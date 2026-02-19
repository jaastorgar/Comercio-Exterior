import client from '../../../api/client';

// --- INTERFACES INTEGRADAS (Para evitar errores de importación) ---
export interface User {
    id: number;
    email: string;
    first_name: string;
    last_name: string;
}

export interface UserProfile {
    email: string;
    first_name: string;
    last_name: string;
    level: number;
    points: number;
    ranking_score: number;
    bio?: string;
    avatar?: string | null;
}

export interface AuthResponse {
    refresh: string;
    access: string;
}

export interface LoginCredentials {
    email?: string;
    password?: string;
}

export interface RegisterCredentials {
    email: string;
    password?: string;
    first_name: string;
    last_name: string;
}

export interface Course { id: number; title: string; description: string; }
export interface Lesson { id: number; title: string; content: string; order: number; }
export interface ProgressPayload { lesson: number; score: number; completed: boolean; }

// --- SERVICIO ---
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

  logout: () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    window.location.href = '/login';
  },

  getProfile: async (): Promise<UserProfile> => {
    const response = await client.get<UserProfile>('/accounts/profile/');
    return response.data;
  },

  getCourses: async (): Promise<Course[]> => {
    const response = await client.get<Course[]>('/accounts/courses/');
    return response.data;
  },

  getLessons: async (courseId?: number): Promise<Lesson[]> => {
    const params = courseId ? { course: courseId } : {};
    const response = await client.get<Lesson[]>('/accounts/lessons/', { params });
    return response.data;
  },

  saveProgress: async (data: ProgressPayload) => {
    const response = await client.post('/accounts/progress/', data);
    return response.data;
  },
  
  getProgress: async () => {
    const response = await client.get('/accounts/progress/');
    return response.data;
  }
};