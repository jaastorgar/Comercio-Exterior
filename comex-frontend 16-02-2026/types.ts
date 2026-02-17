
export type ViewType = 'dashboard' | 'lessons' | 'simulator' | 'calculator' | 'map' | 'profile' | 'incoterms' | 'library';

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'Cadete' | 'Especialista' | 'Senior';
  avatar?: string;
  joinDate: string;
  preferences: {
    notifications: boolean;
    darkMode: boolean;
  };
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  timestamp: Date;
  read: boolean;
}

export interface Question {
  id: string;
  text: string;
  options: string[];
  correctIndex: number;
}

export interface Lesson {
  id: string;
  title: string;
  description: string;
  xp: number;
  completed: boolean;
  type: 'theory' | 'quiz' | 'simulation';
  level: number;
  questions?: Question[];
}

export interface Container {
  type: '20ST' | '40ST' | '40HC';
  length: number;
  width: number;
  height: number;
  maxWeight: number;
}

export interface TradeAgreement {
  id: string;
  country: string;
  type: string;
  year: number;
  description: string;
}
