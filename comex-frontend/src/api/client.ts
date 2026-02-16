const API_BASE_URL = import.meta.env.VITE_API_URL;

export async function apiRequest(
  endpoint: string,
  method: string = "GET",
  data?: any,
  auth: boolean = false
) {
  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };

  if (auth) {
    const token = localStorage.getItem("access_token");
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method,
    headers,
    body: data ? JSON.stringify(data) : undefined,
  });

  if (!response.ok) {
    throw new Error("Error en la petición");
  }

  return response.json();
}