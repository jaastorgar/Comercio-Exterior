export interface User {
    id: number;
    email: string;
    first_name: string;
    last_name: string;
}

export interface UserProfile {
    level: string;
    points: number;
    ranking_score: number;
    user: User;
}

export interface AuthResponse {
    access: string;
    refresh: string;
    user?: User; 
}

export interface LoginCredentials {
    email: string;
    password: string;
}

export interface RegisterCredentials extends LoginCredentials {
    first_name: string;
    last_name: string;
}