import { apiRequest } from "./client";

interface AuthResponse {
  access: string;
  refresh: string;
}

interface RegisterData {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
}

export async function register(data: RegisterData) {
  return apiRequest("/accounts/register/", "POST", data);
}

export async function login(email: string, password: string) {
  const response: AuthResponse = await apiRequest(
    "/accounts/login/",
    "POST",
    { email, password }
  );

  // Guardamos tokens
  localStorage.setItem("access_token", response.access);
  localStorage.setItem("refresh_token", response.refresh);

  return response;
}

export async function getProfile() {
  return apiRequest("/accounts/profile/", "GET", undefined, true);
}

export function logout() {
  localStorage.removeItem("access_token");
  localStorage.removeItem("refresh_token");
}