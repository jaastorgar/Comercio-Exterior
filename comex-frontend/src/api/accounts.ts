import { apiRequest } from "./client";

export interface UserProfile {
  email: string;
  level: number;
  points: number;
  ranking_score: number;
}

export async function getUserProfile(): Promise<UserProfile> {
  return apiRequest("/accounts/profile/", "GET", undefined, true);
}

export interface UserProgress {
  lesson: string; // ID de la lección
  completed: boolean;
  score: number;
}

export async function getUserProgress(): Promise<UserProgress[]> {
  return apiRequest("/accounts/progress/", "GET", undefined, true);
}

export async function saveLessonProgress(lessonId: string, xpEarned: number): Promise<any> {
  return apiRequest("/accounts/progress/", "POST", {
    lesson: lessonId,
    score: xpEarned,
    completed: true
  }, true);
}