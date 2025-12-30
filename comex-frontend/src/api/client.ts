const API_URL = import.meta.env.VITE_API_URL;

export async function apiFetch<T>(
  ruta: string,
  opciones?: RequestInit
): Promise<T> {
  const respuesta = await fetch(`${API_URL}${ruta}`, {
    headers: {
      "Content-Type": "application/json",
      ...(opciones?.headers || {}),
    },
    ...opciones,
  });

  if (!respuesta.ok) {
    throw new Error(`Error en la API: ${respuesta.status}`);
  }

  return respuesta.json();
}