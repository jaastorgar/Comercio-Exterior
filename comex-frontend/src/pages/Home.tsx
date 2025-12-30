import { useEffect, useState } from "react";
import { apiFetch } from "../api/client";
import "./Home.css";

type EstadoBackend = {
  estado: string;
  mensaje: string;
};

export default function Home() {
  const [backend, setBackend] = useState<EstadoBackend | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    apiFetch<EstadoBackend>("/health/")
      .then((data) => setBackend(data))
      .catch(() =>
        setError("No se pudo conectar con el backend")
      );
  }, []);

  return (
    <section className="home">
      <h1>Comercio Exterior</h1>

      <p className="descripcion">
        Plataforma web para aprender, calcular y entender procesos de
        importación y exportación.
      </p>

      <div className="estado-backend">
        <h3>Estado del sistema</h3>

        {backend && (
          <p className="ok">
            ✅ {backend.mensaje}
          </p>
        )}

        {error && (
          <p className="error">
            ❌ {error}
          </p>
        )}
      </div>
    </section>
  );
}