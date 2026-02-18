import { useState } from "react";
import { login } from "../api/auth";

interface LoginProps {
  onSuccess: () => void;
  onRegisterClick: () => void; // Propiedad añadida para solucionar ts(2322)
}

export default function Login({ onSuccess, onRegisterClick }: LoginProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(email, password);
      onSuccess();
    } catch (error: any) {
      console.error(error);
      alert("Error al iniciar sesión");
    }
  };

  return (
    <div className="auth-container">
      <h2>Iniciar Sesión</h2>
      <form onSubmit={handleSubmit} className="auth-form">
        <input
          type="email"
          placeholder="Correo"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Ingresar</button>
      </form>
      <button onClick={onRegisterClick} className="switch-auth-btn">
        ¿No tienes cuenta? Regístrate aquí
      </button>
    </div>
  );
}