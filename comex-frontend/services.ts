
import { User, Notification, Lesson } from './types';
import { LESSONS } from './constants';

// --- SERVICE: AUTH & USER ---
class AuthService {
  private static getUsers(): any[] {
    return JSON.parse(localStorage.getItem('academy_users') || '[]');
  }

  static register(name: string, email: string, pass: string): { success: boolean; message: string } {
    const users = this.getUsers();
    if (users.find(u => u.email === email)) {
      return { success: false, message: 'El correo ya está registrado.' };
    }
    const newUser = { 
      id: Math.random().toString(36).substr(2, 9), 
      name, 
      email, 
      pass, 
      role: 'Cadete', 
      joinDate: new Date().toISOString(),
      preferences: { notifications: true, darkMode: true }
    };
    users.push(newUser);
    localStorage.setItem('academy_users', JSON.stringify(users));
    return { success: true, message: 'Registro exitoso.' };
  }

  static login(email: string, pass: string): { success: boolean; user?: User; message?: string } {
    const users = this.getUsers();
    const found = users.find(u => u.email === email && u.pass === pass);
    if (found) {
      const { pass: _, ...userData } = found;
      return { success: true, user: userData as User };
    }
    return { success: false, message: 'Correo o contraseña incorrectos.' };
  }
}

// --- SERVICE: NOTIFICATIONS ---
class NotificationService {
  private static listeners: ((n: Notification[]) => void)[] = [];
  private static notifications: Notification[] = [];

  static subscribe(callback: (n: Notification[]) => void) {
    this.listeners.push(callback);
    callback(this.notifications);
  }

  static notify(title: string, message: string, type: Notification['type'] = 'info') {
    const n: Notification = {
      id: Math.random().toString(36).substr(2, 9),
      title, message, type, timestamp: new Date(), read: false
    };
    this.notifications = [n, ...this.notifications].slice(0, 10);
    this.listeners.forEach(l => l(this.notifications));
  }

  static markAllAsRead() {
    this.notifications = this.notifications.map(n => ({ ...n, read: true }));
    this.listeners.forEach(l => l(this.notifications));
  }
}

// --- SERVICE: COURSE & EVALUATION ---
class AcademyService {
  static getProgress(completedIds: string[]): number {
    return Math.round((completedIds.length / LESSONS.length) * 100);
  }

  static evaluateQuiz(lesson: Lesson, answers: number[]): { score: number; passed: boolean } {
    if (!lesson.questions) return { score: 100, passed: true };
    let correct = 0;
    lesson.questions.forEach((q, i) => {
      if (q.correctIndex === answers[i]) correct++;
    });
    const score = (correct / lesson.questions.length) * 100;
    return { score, passed: score === 100 };
  }
}

// --- SERVICE: DASHBOARD STATS ---
class DashboardService {
  static getStats(xp: number, completedCount: number) {
    return [
      { label: 'Progreso Total', value: `${Math.round((completedCount / LESSONS.length) * 100)}%`, color: '#00d1ff' },
      { label: 'Experiencia', value: `${xp} XP`, color: '#ff7a00' },
      { label: 'Racha Activa', value: '5 Días', color: '#10b981' },
      { label: 'Rango', value: xp > 2000 ? 'Senior' : xp > 1000 ? 'Especialista' : 'Cadete', color: '#f59e0b' }
    ];
  }
}

export { AuthService, NotificationService, AcademyService, DashboardService };
